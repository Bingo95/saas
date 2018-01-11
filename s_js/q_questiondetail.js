$(function() {
	var id = GetParameter("id");
	var type = GetParameter("type");
	if(id == null) {
		$.alert("未获取到问题。", function() {
			var num = Math.random();
			window.location.href = "q_questionlist.html?num=" + num;
		})
	} else {
		var flag = window.sessionStorage.getItem("flag");
		if(!flag) {
			window.sessionStorage.setItem("flag", "true");
			setTimeout(reload_page(), 1000);
		} else {
			sessionStorage.removeItem('flag');
			question_detail_param(id);
		}
	}
})

var reload_page = function() {
	var page_url = window.location.href;
	var num = Math.random();

	window.location.href = page_url.split('&')[0] + "&num=" + num;
}

//详情
function question_detail_param(id) {
	var _param = {};
	var _data2 = {};

	_data2.id = id;
	_param.action_sort = "8002";
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
				console.log("问题", data)
				var _data = data.Data;
				document.title = _data.question;
				$(".questin_title").html("Q：" + _data.question);
				$(".questin_content").html(_data.answer);
				$(".weui-tab").show();
			} else {
				flag_type(flag_val, msg_val);
			}
		});
}

$("#back_prev").click(function() {
	var num = Math.random();
	window.location.href = "q_questionlist.html?num=" + num;
})

//分享显示隐藏遮罩层
$("#share").click(function() {
	$(".over_liny").show();
});

$(".over_liny").click(function() {
	$(".over_liny").hide();
});