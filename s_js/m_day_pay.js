$(function() {

	var paydatef_s;
	var paydatet_s;
	var myDate = new Date();
	/*json*/
	//获取ajax所需json数据
	function chart_data_param(paydatef_s, paydatet_s) {
		var _param = {};
		var _data = {};

		_data.paydatef_s = paydatef_s;
		_data.paydatet_s = paydatet_s;

		_param.action_sort = "9004";
		_param.data = _data;
		_param = "param_json=" + JSON.stringify(_param);
		//console.log("输出", _param)
		return _param;
	}
	/*ajax*/
	//ajax给后台，返回数据
	function chart_data_get(paydatef_s, paydatet_s) {
		$.ajax({
			type: 'post',
			dataType: "json",
			data: chart_data_param(paydatef_s, paydatet_s),
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
					console.log("data", _data);
					var data_name = [];
					var chart_data = [];
					var dataZoom = [];
					var dataZoom_conte = {};
					var paymoney;
					var chart_content;
					var price_num = 0;
					var percent = 0;
					$("#peop_num").text(_data.length);
					$("#alternatecolor").html("");
					//填充表头
					$("#alternatecolor").append(
						"<tr>" +
						"<th class='altrowstable_th altrowstable_th_1'>序号</th>" +
						"<th class='altrowstable_th'>日期</th>" +
						"<th class='altrowstable_th'>金额</th>" +
						"<th class='altrowstable_th'>占比%</th>" +
						"</tr>"
					)
					//计算总金额
					for(var a = 0; a < _data.length; a++) {
						price_num += parseFloat($.parseJSON(_data[a].paymoney));
					}
					//总金额显示
					$("#price_num").text(price_num.toFixed(2));

					//获取返回数据
					for(var i = 0; i < _data.length; i++) {
						chart_content = {};
						//x轴参数
						data_name.push(_data[i].paydate.substring(5));
						//chart参数
						chart_content.value = _data[i].paymoney;
						chart_content.name = _data[i].paydate;
						chart_data.push(chart_content);

						//计算占比
						paymoney = _data[i].paymoney;
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
							"<td class='altrowstable_td'>" + _data[i].paydate + "</td>" +
							"<td class='altrowstable_td text_size_14' style='text-align:right;'>" + paymoney + "</td>" +
							"<td class='altrowstable_td text_size_14' style='text-align:right;'>" + percent + "</td>" +
							"</tr>"
						)
					}

					//chart缩放区间参数，对象名不可修改，由插件定义，数组名可修改
					dataZoom_conte.type = 'inside';
					dataZoom_conte.start = 0;
					if(_data.length <= 30) {
						dataZoom_conte.end = 100;
					} else {
						dataZoom_conte.end = 50;
					}
					dataZoom.push(dataZoom_conte);
					//图标参数传递data_name：x轴，chart_data：图表数据，dataZoom：缩放区间
					chart_content_js(data_name, chart_data, dataZoom);
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
				//表格行颜色
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
			//当天
			$("#paydatef_s_input").val(get_data());
			$("#paydatet_s_input").val(get_data());
			$("#paydatef_s_input").attr("name", num);
			$("#paydatet_s_input").attr("name", num + 1);
		} else if($(this).hasClass('week_sale')) {
			//近7天
			$("#paydatef_s_input").val(get_data(get_data(), -6, 5));
			$("#paydatet_s_input").val(get_data());
			$("#paydatef_s_input").attr("name", num);
			$("#paydatet_s_input").attr("name", num + 1);
		} else if($(this).hasClass('month_sale')) {
			//近30天
			$("#paydatef_s_input").val(get_data(myDate, 29, 1));
			$("#paydatet_s_input").val(get_data());
			$("#paydatef_s_input").attr("name", num);
			$("#paydatet_s_input").attr("name", num + 1);
		}
		//获取时间参数
		paydatef_s = $("#paydatef_s_input").val();
		paydatet_s = $("#paydatet_s_input").val();
		//取返回具体值
		chart_data_get(paydatef_s, paydatet_s);
	});

	//页面加载成功默认点击7天按钮
	$(".week_sale").trigger("click");

	//chart插件，基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById('chart'));

	function chart_content_js(data_name, chart_data, dataZoom) {
		var option = {
			title: {
				padding: [
					20, // 上
					0, // 右
					0, // 下
					0, // 左
				],
				text: '日收款分析',
				x: 'center'
			},
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data: data_name
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			dataZoom: dataZoom,
			xAxis: [{
				type: 'category',
				boundaryGap: true,
				axisLine: {
					onZero: false,
					lineStyle: {
						color: "#979ca1"
					}
				},
				axisTick: [{
					show: false
				}],
				data: data_name
			}],
			axisTick: {
				show: false
			},
			yAxis: [{
				type: 'value',
				splitLine: {
					lineStyle: {
						type: 'dashed'
					}
				},
				axisLine: {
					onZero: false,
					lineStyle: {
						color: "#979ca1"
					}
				},
			}],
			series: [{
				name: '金额',
				type: 'line',
				stack: '总量',
				itemStyle: {
					normal: {
						color: 'rgba(0,205,0,0.8)'
					}
				},
				lineStyle: {
					normal: {
						width: 1
					}
				},
				areaStyle: {
					normal: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
							offset: 0,
							color: 'rgba(0,205,0,0.1)'
						}])
					}
				},
				data: chart_data,
				label: {
					normal: {
						show: false,
						position: 'top'
					}
				},
			}]
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}

	//日期选择器，一个是箭头图形
	$("#paydatef_s_input").click(function() {
		var id_num = Math.random();
		time_f_picker(id_num);
	});

	$(".paydatef_s_input").click(function() {
		var id_num = Math.random();
		time_f_picker(id_num);
	});

	//日期选择器
	$("#paydatet_s_input").click(function() {
		var id_num = Math.random();
		time_t_picker(id_num);
	});

	$(".paydatet_s_input").click(function() {
		var id_num = Math.random();
		time_t_picker(id_num);
	});

	//初始时间日期选择器初始化
	function time_f_picker(id_num) {
		var a = $("#paydatef_s_input").val();
		weui.datePicker({
			start: get_data(myDate, 1, 4),
			end: get_data(),
			defaultValue: a.split("-"),
			onChange: function(result) {
				result = result.join("-");
				console.log(result);
			},
			onConfirm: function(result) {
				result = result.join("-");
				var paydatef_s_input = result;
				var paydatet_s_input = $("#paydatet_s_input").val();
				//将字符串时间转换时间格式比较大小
				paydatef_s_input = new Date(paydatef_s_input.replace("-", "/").replace("-", "/"));
				paydatet_s_input = new Date(paydatet_s_input.replace("-", "/").replace("-", "/"));
				if(paydatef_s_input > paydatet_s_input) {
					$.alert("请选择正确的日期范围");
					$("#paydatef_s_input").val(a);
				} else {
					paydatef_s_input = result;
					paydatet_s_input = $("#paydatet_s_input").val();
					$("#paydatef_s_input").val(result);
					$(".time_btn").removeClass('time_btn_click');
					chart_data_get(paydatef_s_input, paydatet_s_input);
				}
			},
			id: id_num
		});
	}
	
	//结束时间日期选择器初始化
	function time_t_picker(id_num) {
		var a = $("#paydatet_s_input").val();
		weui.datePicker({
			start: get_data(myDate, 1, 4),
			end: get_data(),
			defaultValue: a.split("-"),
			onChange: function(result) {
				//console.log(result);
			},
			onConfirm: function(result) {
				result = result.join("-");
				var paydatef_s_input = $("#paydatef_s_input").val();
				var paydatet_s_input = result;
				paydatef_s_input = new Date(paydatef_s_input.replace("-", "/").replace("-", "/"));
				paydatet_s_input = new Date(paydatet_s_input.replace("-", "/").replace("-", "/"));
				if(paydatef_s_input > paydatet_s_input) {
					$.alert("请选择正确的日期范围");
					$("#paydatet_s_input").val(a);
				} else {
					paydatef_s_input = $("#paydatef_s_input").val();
					paydatet_s_input = result;
					$("#paydatet_s_input").val(result);
					$(".time_btn").removeClass('time_btn_click');
					chart_data_get(paydatef_s_input, paydatet_s_input);
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