$(function() {
	$.showLoading();
	$(".weui-panel").hide();

	function form_detail() {

		$.ajax({
			type: 'post',
			dataType: "json",
			data: {
				param_json: '{"action_sort":"801","Data":{}}'
			},
			url: "get_s_saas",
			success: function(data) {
				console.log(data);
				flag_val = data.Flag;
				msg_val = data.Msg;
				if(flag_val == 1) {
					var _data = data.Data;
					var todaysale = (_data.today_ordermoney); //.toFixed(2);
					var today_profit = (_data.today_profit); //.toFixed(2);
					var allsale = (_data.all_ordermoney); //.toFixed(2);
					var todaygetmoney = (_data.today_orderpay); //.toFixed(2);
					var allgetmoney = (_data.all_orderpay); //.toFixed(2);
					var outstat_none = _data.outstat_none_cnt;
					var outstat_some = _data.outstat_some_cnt;
					var outstat_all = _data.outstat_all_cnt;

					$("#today_sale").html(todaysale);
					$("#today_profit").html(today_profit);
					$("#all_sale").html(allsale);

					$("#today_money").html(todaygetmoney);
					$("#all_money").html(allgetmoney);

					$("#no_out").html(outstat_none);
					$("#exist_out").html(outstat_some);
					$("#all_out").html(outstat_all);
				} else {
					flag_type(flag_val, msg_val);
				}
			},
			error: function() {
				$.alert("服务器忙碌，请稍后再试！");
			},
			complete: function() {
				$(".weui-panel").show();
				$.hideLoading();
			}
		});
	}
	form_detail();


	/*点击跳转*/
	$("#from_url_btn").click(function() {
		window.location.href = "http://wx.jidisoft.com/oauth_redirect.jsp?new_url=login";
	})

})