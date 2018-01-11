$(function() {

	var orderdatef_s;
	var orderdatet_s;
	var myDate = new Date();
	/*json*/
	//获取ajax所需json数据
	function chart_data_param(orderdatef_s, orderdatet_s) {
		var _param = {};
		var _data = {};

		_data.orderdatef_s = orderdatef_s;
		_data.orderdatet_s = orderdatet_s;

		_param.action_sort = "9001";
		_param.data = _data;
		_param = "param_json=" + JSON.stringify(_param);
		//console.log("输出", _param)
		return _param;
	}
	/*ajax*/
	//ajax给后台，返回数据
	function chart_data_get(orderdatef_s, orderdatet_s) {
		$.ajax({
			type: 'post',
			dataType: "json",
			data: chart_data_param(orderdatef_s, orderdatet_s),
			beforeSend: function() {
				$.showLoading();
			},
			url: "get_s_saas",
			success: function(data) {
				console.log(data)
				flag_val = data.Flag;
				msg_val = data.Msg;
				if(flag_val == 1) {
					var _data = data.Data;
					//console.log("data", _data);
					var data_name = [];
					var chart_data = [];
					var chart_content;
					var price_num = 0;
					var a = 0;
					$("#peop_num").text(_data.length);
					$("#alternatecolor").html("");
					//填充表头
					$("#alternatecolor").append(
						"<tr>" +
						"<th class='altrowstable_th altrowstable_th_1'>序号</th>" +
						"<th class='altrowstable_th'>姓名</th>" +
						"<th class='altrowstable_th'>金额</th>" +
						"<th class='altrowstable_th'>占比%</th>" +
						"</tr>"
					)
					//计算总金额
					for(var a = 0; a < _data.length; a++) {
						price_num += parseFloat($.parseJSON(_data[a].employeesale));
					}
					//总金额显示
					$("#price_num").text(price_num.toFixed(2));
					for(var i = 0; i < _data.length; i++) {
						chart_content = {};
						data_name.push(_data[i].employeename);
						chart_content.value = _data[i].employeesale;
						chart_content.name = _data[i].employeename;
						chart_data.push(chart_content);

						//计算占比
						paymoney = _data[i].employeesale;
						percent = (parseFloat($.parseJSON(paymoney)) / price_num) * 100;
						percent = percent.toFixed(2);

						//价格为0.00时表格填充空
						if(paymoney == "0.00") {
							paymoney = "";
							percent = "";
						}

						//表格填充
						$("#alternatecolor").append(
							"<tr>" +
							"<td class='altrowstable_td altrowstable_th_1'>" + (i + 1) + "</td>" +
							"<td class='altrowstable_td'>" + _data[i].employeename + "</td>" +
							"<td class='altrowstable_td text_size_14' style='text-align:right;'>" + paymoney + "</td>" +
							"<td class='altrowstable_td text_size_14' style='text-align:right;'>" + percent + "</td>" +
							"</tr>"
						)
					}

					chart_content_js(data_name, chart_data);
				} else {
					flag_type(flag_val, msg_val);
				}
				$.hideLoading();
			},
			error: function() {
				$.hideLoading();
				$.alert("服务器忙碌，请稍候重试！");
			},
			complete: function() {
				altRows('alternatecolor');
			}
		});
	}

	//点击按钮
	$(".time_btn").click(function() {
		var num = Math.random();
		//移除所有按钮样式，给当前点击按钮添加样式
		$(".time_btn").removeClass('time_btn_click');
		$(this).addClass('time_btn_click');
		if($(this).hasClass('day_sale')) {
			$("#orderdatef_s_input").val(get_data());
			$("#orderdatet_s_input").val(get_data());
			$("#orderdatef_s_input").attr("name", num);
			$("#orderdatet_s_input").attr("name", num + 1);
		} else if($(this).hasClass('week_sale')) {
			$("#orderdatef_s_input").val(get_data(get_data(), -6, 5));
			$("#orderdatet_s_input").val(get_data());
			$("#orderdatef_s_input").attr("name", num);
			$("#orderdatet_s_input").attr("name", num + 1);
		} else if($(this).hasClass('month_sale')) {
			$("#orderdatef_s_input").val(get_data(myDate, 29, 1));
			$("#orderdatet_s_input").val(get_data());
			$("#orderdatef_s_input").attr("name", num);
			$("#orderdatet_s_input").attr("name", num + 1);
		}
		orderdatef_s = $("#orderdatef_s_input").val();
		orderdatet_s = $("#orderdatet_s_input").val();
		//console.log(orderdatef_s)
		//console.log(orderdatet_s)
		chart_data_get(orderdatef_s, orderdatet_s);
	});

	$(".week_sale").trigger("click");

	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById('chart'));

	function chart_content_js(data_name, chart_data) {
		var option = {
			legend: {
				orient: 'vertical',
				left: 'center',
				orient: 'horizontal',
				top: '1%',
				align: 'left',
				data: data_name
			},
			series: [{
				name: '访问来源',
				type: 'pie',
				radius: ['25%', '40%'],
				center: ['50%', '75%'],
				avoidLabelOverlap: true,

				label: {
					normal: {
						formatter: '{b}:{c}元\n{d}%',
						backgroundColor: '#f7f7f8',
						borderColor: '#aaa',
						borderWidth: 1,
						borderRadius: 4,
						padding: [1, 2],
						show: true,
						position: 'outside'
					},
					emphasis: {
						show: true,
						textStyle: {
							fontSize: '15',
							fontWeight: 'normal'
						}
					}
				},
				labelLine: {
					normal: {
						show: true,
						length: 13,
						length2: 1,
						smooth: true
					}
				},
				data: chart_data
			}]
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}

	//日期选择器
	$("#orderdatef_s_input").click(function() {
		var id_num = Math.random();
		time_f_picker(id_num);
	});

	$(".orderdatef_s_input").click(function() {
		var id_num = Math.random();
		time_f_picker(id_num);
	});

	//日期选择器
	$("#orderdatet_s_input").click(function() {
		var id_num = Math.random();
		time_t_picker(id_num);
	});

	$(".orderdatet_s_input").click(function() {
		var id_num = Math.random();
		time_t_picker(id_num);
	});

	function time_f_picker(id_num) {
		var a = $("#orderdatef_s_input").val();
		weui.datePicker({
			start: get_data(myDate, 1, 4),
			end: get_data(),
			defaultValue: a.split("-"),
			onChange: function(result) {
				result = result.join("-");
				//console.log(result);
			},
			onConfirm: function(result) {
				result = result.join("-");
				var orderdatef_s_input = result;
				var orderdatet_s_input = $("#orderdatet_s_input").val();
				orderdatef_s_input = new Date(orderdatef_s_input.replace("-", "/").replace("-", "/"));
				orderdatet_s_input = new Date(orderdatet_s_input.replace("-", "/").replace("-", "/"));
				if(orderdatef_s_input > orderdatet_s_input) {
					$.alert("请选择正确的日期范围");
					$("#orderdatef_s_input").val(a);
				} else {
					orderdatef_s_input = result;
					orderdatet_s_input = $("#orderdatet_s_input").val();
					$("#orderdatef_s_input").val(result);
					$(".time_btn").removeClass('time_btn_click');
					chart_data_get(orderdatef_s_input, orderdatet_s_input);
				}
			},
			id: id_num
		});
	}

	function time_t_picker(id_num) {
		var a = $("#orderdatet_s_input").val();
		weui.datePicker({
			start: get_data(myDate, 1, 4),
			end: get_data(),
			defaultValue: a.split("-"),
			onChange: function(result) {
				//console.log(result);
			},
			onConfirm: function(result) {
				result = result.join("-");
				var orderdatef_s_input = $("#orderdatef_s_input").val();
				var orderdatet_s_input = result;
				orderdatef_s_input = new Date(orderdatef_s_input.replace("-", "/").replace("-", "/"));
				orderdatet_s_input = new Date(orderdatet_s_input.replace("-", "/").replace("-", "/"));
				if(orderdatef_s_input > orderdatet_s_input) {
					$.alert("请选择正确的日期范围");
					$("#orderdatet_s_input").val(a);
				} else {
					orderdatef_s_input = $("#orderdatef_s_input").val();
					orderdatet_s_input = result;
					$("#orderdatet_s_input").val(result);
					$(".time_btn").removeClass('time_btn_click');
					chart_data_get(orderdatef_s_input, orderdatet_s_input);
				}
			},
			id: id_num
		});
	}
	
	//为表格行添加样式改变颜色
	function altRows(id) {
		if(document.getElementsByTagName) {
			var table = document.getElementById(id);
			var rows = table.getElementsByTagName("tr");
			for(i = 0; i < rows.length; i++) {
				if(i % 2 == 0) {
					rows[i].className = "evenrowcolor";
				}
			}
		}
	}
})