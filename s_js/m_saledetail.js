$(function() {

	var ordercode = GetParameter("ordercode");
	$(document).ready(function() {
		if(ordercode == null) {
			$.alert("订单未生成！", function() {
				window.location.href = "p_saleprodsearch.html";
			});
		} else {
			detail_content(ordercode);
		}
	})

	//订单详情
	function detail_content_param(ordercode) {
		var _param = {};
		var _data = {};
		_data.ordercode = ordercode;
		_param.action_sort = "30106";
		_param.data = _data;
		_param = "param_json=" + JSON.stringify(_param);
		console.log("输出", _param)
		return _param;
	}

	function detail_content(ordercode) {
		$.ajax({
			type: 'post',
			dataType: "json",
			data: detail_content_param(ordercode),
			beforeSend: function() {
				$.showLoading();
			},
			url: "get_s_saas",
			success: function(data) {
				flag_val = data.Flag;
				msg_val = data.Msg;
				if(flag_val == 1) {
					console.log("订单列表", data)
					var _data = data.Data;
					//用户信息
					$("#ordercode").text(_data.ordercode);
					$("#costmoney").text(_data.costmoney);
					$("#reducemoney").text(_data.reducemoney);
					$("#totalmoney").text(_data.totalmoney);
					$("#custname").text(_data.custname);
					$("#custaddress").text(_data.custaddress);
					$("#custtel").text(_data.custtel);
					$("#moneyleft").text(_data.moneyleft);
					$("#senddate").text(_data.senddate);
					$("#sendtime").text(_data.sendtime);
					$("#ordertype").text(_data.ordertype);
					$("#shop").text(_data.shop);
					$("#orderbrand").text(_data.orderbrand);
					$("#designer").text(_data.designer);
					$("#employeename").text(_data.employeename);
					$("#repairname").text(_data.repairname);
					$("#n1").text(_data.n1);
					$("#n2").text(_data.n2);
					$("#orderothers").text(_data.orderothers);
					//列表填充
					var _shop_data = _data.product_lists;
					var listcontent = $("#detail_list_content");
					for(var i = 0; i < _shop_data.length; i++) {
						listcontent.append(
							"<div class='detail_list_page'>" +
							"<div class='weui-flex'>" +
							"<label>" + _shop_data[i].prodcode + "</label>#" +
							"<label>" + _shop_data[i].color + "</label>" +
							"</div><div class='weui-flex'><div class='width_all'><div class='float_rt'>" +
							"<label>" + _shop_data[i].amount + "</label>片x" +
							"<label>" + _shop_data[i].prodpriceout + "</label>元/片x" +
							"<label>" + _shop_data[i].degree + "</label>%=" +
							"<label style='color: #FF6600;'>" + _shop_data[i].cost + "</label>元" +
							"</div></div></div>" +
							"<div class='weui-flex'><div class='weui-flex__item'><span>品牌:</span><div class='detail_list_shop'>" +
							"<label>" + _shop_data[i].prodbrand + "</label>" +
							"</div></div>" +
							"<div class='weui-flex__item'>" +
							"<span>系列:</span>" +
							"<div class='detail_list_shop'>" +
							"<label>" + _shop_data[i].series + "</label>" +
							"</div></div>" +
							"<div class='weui-flex__item'>" +
							"<span>等级:</span>" +
							"<div class='detail_list_shop'>" +
							"<label>" + _shop_data[i].prodlevel + "</label>" +
							"</div></div></div>" +
							"<div class='weui-flex'>" +
							"<div class='' style='width:33.3%'>" +
							"<span>尺寸:</span>" +
							"<div class='detail_list_shop'>" +
							"<label>" + _shop_data[i].length + "</label>x<label>" + _shop_data[i].width + "</label>" +
							"</div></div>" +
							"<div class='weui-flex__item'>" +
							"<span>仓库:</span>" +
							"<div class='detail_list_shop'>" +
							"<label>" + _shop_data[i].storename + "</label>" +
							"</div></div></div>" +
							"<div class='weui-flex'>" +
							"<div class='weui-flex__item'>" +
							"<span>备注:</span>" +
							"<div class='detail_list_shop'>" +
							"<label>" + _shop_data[i].orderdetailothers + "</label>" +
							"</div></div>" +
							"<div class='weui-flex__item'>" +
							"<span>出库:</span>" +
							"<div class='detail_list_shop'>" +
							"<label>" + _shop_data[i].amountout + "</label>" +
							"</div></div>" +
							"<div class='weui-flex__item'>" +
							"<span>退货:</span>" +
							"<div class='detail_list_shop'>" +
							"<label>" + _shop_data[i].amountback + "</label>" +
							"</div></div></div></div>"
						);
					}
					$(".weui-tab").show();
				} else {
					flag_type(flag_val, msg_val);
				}
			},
			error: function() {
				$.alert("服务器忙碌，请稍候重试！");
			},
			complete: function() {
				$.hideLoading();
			}
		});
	}

	$("#back_sale").click(function() {
		window.location.href = "p_saleprodsearch.html";
	})
})