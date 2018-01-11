$(function() {
	var flag = window.sessionStorage.getItem("flag");
	if(!flag) {
		window.sessionStorage.setItem("flag", "true");
		setTimeout(reload_page(), 1000);
	} else {
		sessionStorage.removeItem('flag');
		question_list_param();
	}
})

var reload_page = function() {
	var page_url = window.location.href;
	var num = Math.random();

	window.location.href = page_url.split('?')[0] + "?num=" + num;
}

//点击赞
function resolve_problem(id) {
	var _param = {};
	var _data2 = {};

	_data2.id = id;
	_param.action_sort = "8003";
	_param.data = _data2;
	_param = "param_json=" + JSON.stringify(_param);

	var obj = {
		Data: _param,
		Url: "cust_service"
	}

	getData(obj);
}

//列表详情
function question_list_param() {
	var _param = {};
	var _data2 = {};
	_data2.param_s = $("#searchInput").val();
	_param.action_sort = "8001";
	_param.data = _data2;
	_param = "param_json=" + JSON.stringify(_param);

	var obj = {
		Data: _param,
		Url: "cust_service"
	}

	var dfd = getData(obj);

	$.when(dfd)
		.done(function(data) {
			flag_val = data.Flag;
			msg_val = data.Msg;
			if(flag_val == 1) {
				//console.log("列表", data);
				$(".circle-list").html("");
				var _data = data.Data.data_lists;
				var listcontent = $(".circle-list");
				//alert(_data.length)
				for(var i = 0; i < _data.length; i++) {
					listcontent.append(
						"<div class='li_border'>" +
						"<div class='weui-flex question'><label>Q</label>：<div class='weui-flex__item'>" + _data[i].question + "</div><span class='add_btn'></span></div>" +
						"<div class='answer_list hide_list'>" +
						"<a class='ask_color' href='q_questiondetail.html?id=" + _data[i].id + "'>" + _data[i].answer + "</a>" +
						"<div class='share_link'><a class='weui-btn weui-btn_mini weui-btn_default zan_click' href='javascript:resolve_problem(" + _data[i].id + ");'><img src='img/zan.png' class='img_zan'/>已解决</a><a class='weui-btn weui-btn_mini weui-btn_default' href='q_questiondetail.html?id=" + _data[i].id + "&type=1'>分享</a></div>" +
						"</div>" +
						"</div>"
					);
				}
				listcontent.append("<div style='height: 26px;border-top:1px solid #e5e5e5;'></div>")
				$(".weui-tab").show();
				list_click();
			} else {
				flag_type(flag_val, msg_val);
			}
		});
}

//提问
function feedback_param() {
	var _param = {};
	var _data2 = {};
	var user_tel = $.trim($("#user_tel").val());
	var feedback_content = $.trim($("#feedback_content").val());
	if(feedback_content == "" || user_tel == "") {
		$.toast("您有内容尚未输入哦", "cancel");
	} else {
		_data2.user_tel = user_tel;
		_data2.feedback_content = feedback_content;

		_param.action_sort = "8004";
		_param.data = _data2;
		_param = "param_json=" + JSON.stringify(_param);

		var obj = {
			Data: _param,
			Url: "cust_service"
		}

		var dfd = getData(obj);

		$.when(dfd)
			.done(function(data) {
				flag_val = data.Flag;
				msg_val = data.Msg;
				if(flag_val == 1) {
					$.alert("递交成功！", function() {
						$.closePopup();
					})
				} else {
					flag_type(flag_val, msg_val);
				}
			});
	}
}

//问题点击事件
function list_click() {
	$('.question').unbind('click').bind('click', function() {
		$(".question").find("label").removeClass("answer_list_focus");
		$(".question").find(".rem_btn").addClass("add_btn");
		$(".question").find(".rem_btn").removeClass("rem_btn");
		$(".question").parent(".li_border").removeClass("border_hight");
		$(this).find("label").addClass("answer_list_focus");
		$(this).find(".add_btn").addClass("rem_btn");
		$(this).parent(".li_border").addClass("border_hight");
		$(this).find(".add_btn").removeClass("add_btn");
		var content = $(this).siblings(".answer_list");
		//清楚样式再添加
		if(content.hasClass("hide_list")) {
			$(".answer_list").hide(300);
			$(".answer_list").addClass("hide_list");
			content.show(300);
			content.removeClass("hide_list");
		} else {
			$('.question').find("label").removeClass("answer_list_focus");
			$('.question').find(".rem_btn").addClass("add_btn");
			$('.question').parent(".li_border").removeClass("border_hight");
			$('.question').find(".rem_btn").removeClass("rem_btn");
			content.hide(300);
			content.addClass("hide_list");
		}
	})

	//赞点击事件
	$(".zan_click").click(function() {
		$(this).css("background-color", "rgba(102, 203, 251, 0.88)");
		$(this).css("color", "white");
		$(this).find("img").attr("src", "img/zan2.png")
	})
}

//输入框搜索事件
$("#searchInput").bind('input porpertychange', function() {
	if($.trim($("#searchInput").val()) == "") {
		$(".often_FQA").show();
		$(".weui-tab__bd-item").css("margin-top", "-13px")
	} else {
		$(".often_FQA").hide();
		$(".weui-tab__bd-item").css("margin-top", "-7px")
	}
	question_list_param();
})

$("#searchInput").blur(function() {
	if($.trim($("#searchInput").val()) == "") {
		$(".weui-search-bar").removeClass("weui-search-bar_focusing");
	}
})

$("#ask_btn").click(function() {
	$("#user_tel").val("");
	$("#feedback_content").val("");
	$("#ask_page").popup();
})

/*文本字数统计*/
var text2 = $(".weui-textarea").val();
var counter2 = text2.length;
$(".textarea_num").text(counter2);
$(".weui-textarea").on('blur keyup input', function() {
	var text2 = $(".weui-textarea").val();
	var counter = text2.length;
	$(".textarea_num").text(counter);
});