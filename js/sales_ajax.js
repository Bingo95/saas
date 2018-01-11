$(function() {
	/*点击加减按钮*/
	$("#remove").click(function() {
		var num = $("#sale_number").val();
		console.log(num)
		if(num <= 0) {
			$("#remove").css("opacity", "0.5");
		} else {
			if((num - 1) <= 0) {
				$("#remove").css("opacity", "0.5");
			}
			$("#sale_number").val(num - 1);
		}
		total_price();
	})

	$("#addOne").click(function() {
		var num = $("#sale_number");
		$("#remove").css("opacity", "1");
		num.val(parseInt(num.val()) + 1);
		total_price();
	})

	/*计算总价*/
	function total_price() {
		var price = $("#price").val();
		var discount = $("#discount").val();
		var num = $("#sale_number").val();

		total_price2 = price * (discount / 100) * num;
		$("#detail_price").html((total_price2).toFixed(2));
	}

	/*下拉菜单*/
	$(function() {
		$("#overlay").hide();
		var v_width = $(document.body).width();
		$(".select_textul").width(v_width);

		$(".select_textdiv").click(function() {
			$(this).parent().parent().siblings().find(".select_textul").hide();
			$(".select_textdiv").removeClass("divfocus");
			$(this).addClass("divfocus");
			$(this).siblings(".select_textul").fadeToggle(500);
			$("#overlay").show();
		})
		$(".select_first_ul>li").click(function() {
			$(this).parent("li").addClass("focus").siblings("li").removeClass("focus");
			event.stopPropagation();
			$("#overlay").hide();
			chooseclick();

		});
		$("#overlay").click(function() {
			$(".select_textdiv").removeClass("divfocus");
			$(".select_textul").fadeOut(300);
			$("#overlay").hide();
		});
		chooseclick();

		function chooseclick() {
			$(".select_first_ul>li").click(function() {
				var choose = $(this).text();
				$(this).addClass("focusli").siblings("li").removeClass("focusli");
				$(this).parents(".select_textul").siblings(".select_textdiv").find(".s_text").text(choose);
				$(this).parents(".select_textul").siblings("input").val(choose);
				$(this).parents(".select_textul").fadeOut(300);

				event.stopPropagation();
			});
		}

	})

	/*获取产品列表*/
	$(".sales_list_content").ready(
		function() {
			$.ajax({
				type: 'post',
				dataType: "json",
				data: {
					param_json: '{"action_sort":"30101","Data":{}}'
				},
				url: "http://192.168.1.70:8080/perp/sale",
				success: function(data) {
					var _data = data.Data;
					var listcontent = $(".sales_list_content");
					for(var i = 0; i < _data.length; i++) {
						listcontent.append(
							"<div class='sales_list_box float_lt'>" +
							"<ul class='ul_style_list'>" +
							"<li class='li_drop_hide text_li_hd'>" + _data[i].prodcode + "</li>" +
							"<li class='li_drop_hide text_li'>品牌 <label class ='lable_text_li' >" + _data[i].prodbrand + "</label></li>" +
							"<li class='li_drop_hide text_li'>规格 <label class ='lable_text_li' >" + _data[i].length + "*" + _data[i].width + "</label></li>" +
							"<li class='li_drop_hide text_li'>系列 <label class ='lable_text_li'>" + _data[i].series + "</label></li>" +
							"</ul>" +
							"</div>"
						);
					}
				},
				error: function() {
					$.alert("服务器错误，请稍候重试！");
				},
				complete: function() {
					sales_list_boxon();
				}
			});
		});

	/*获取开单信息*/
	function sales_list_boxon() {
		$(".sales_list_box").click(function() {
			/*点击弹出详情*/
			$("#detail_from").popup();

			$.ajax({
				type: 'post',
				dataType: "json",
				data: {
					param_json: '{"action_sort":"30102","Data":{prodcode:"A0001"}}'
				},
				url: "http://192.168.1.70:8080/perp/sale",
				success: function(data) {
					var _data = data.Data;
					$("#prodcode").text(_data.prodcode)
				},
				error: function() {
					$.alert("服务器错误，请稍候重试！");
				},
				complete: function() {

				}
			});
		});
	}
})