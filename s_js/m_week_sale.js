$(function() {

	var orderdatef_s;
	var orderdatet_s;
	var myDate = new Date();
	/*json*/
	function chart_data_param(orderdatef_s, orderdatet_s) {
		var _param = {};
		var _data = {};

		_data.orderdatef_s = orderdatef_s;
		_data.orderdatet_s = orderdatet_s;

		_param.action_sort = "9002";
		_param.data = _data;
		_param = "param_json=" + JSON.stringify(_param);
		//console.log("输出", _param)
		return _param;
	}
	/*ajax*/
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
				//console.log(data)
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
					for(var i = 0; i < _data.length; i++) {
						chart_content = {};
						var datesale = _data[i].datesale;
						if(_data[i].datesale == 0.00) {
							datesale = "";
						}
						data_name.push(_data[i].orderdate.substring(5));
						chart_content.value = datesale;
						chart_content.name = _data[i].orderdate.substring(5);
						chart_data.push(chart_content);

						price_num += parseFloat($.parseJSON(_data[i].datesale));
					}
					$("#price_num").text(price_num.toFixed(2));

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

			}
		});
	}

	//点击按钮
	$(".time_btn").click(function() {
		var num = Math.random();
		//移除所有按钮样式，给当前点击按钮添加样式
		$(".time_btn").removeClass('time_btn_click');
		$(this).addClass('time_btn_click');
		if($(this).hasClass('lastweek_sale')) {
			var year = new Date().getFullYear();
			var month = new Date().getMonth() + 1;
			var day = new Date().getDate();
			var data_time = year + '-' + day_zero(month) + "-" + day_zero(day);
			console.log(data_time)
			if(new Date().getDay() == 0) { //周天的情况;
				$("#orderdatef_s_input").val(get_data(data_time, -13, 5));
				$("#orderdatet_s_input").val(get_data(data_time, -7, 5));
			} else {
				$("#orderdatef_s_input").val(get_data(data_time, (-(6 + new Date().getDay())), 5));
				$("#orderdatet_s_input").val(get_data(data_time, (-(new Date().getDay())), 5));
			}

			$("#orderdatef_s_input").attr("name", num);
			$("#orderdatet_s_input").attr("name", num + 1);
		} else if($(this).hasClass('nowweek_sale')) {
			$("#orderdatet_s_input").val(get_data());
			$("#orderdatef_s_input").val(get_data(get_data(), -6, 5));
			$("#orderdatef_s_input").attr("name", num);
			$("#orderdatet_s_input").attr("name", num + 1);
		}
		orderdatef_s = $("#orderdatef_s_input").val();
		orderdatet_s = $("#orderdatet_s_input").val();
		chart_data_get(orderdatef_s, orderdatet_s);
	});

	$(".nowweek_sale").trigger("click");

	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById('chart'));

	function chart_content_js(data_name, chart_data) {
		var option = {
			color: ['#38b31e'],
			tooltip: {
				trigger: 'axis',
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			label: {
				normal: {
					show: true,
					position: 'top'
				}
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: [{
				type: 'category',
				data: data_name,
				axisLine: {
					onZero: false,
					lineStyle: {
						color: "#979ca1"
					}
				},
				axisTick: {
					alignWithLabel: true
				}
			}],
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
				}
			}],
			series: [{
				type: 'bar',
				barWidth: '60%',
				data: chart_data
			}],
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
				var orderdatet_s_input = get_data();
				var addtime = get_data(result, 6, 5);
				var selecttime;
				//将字符串时间转换时间格式比较大小
				selecttime = new Date(addtime.replace("-", "/").replace("-", "/"));
				orderdatet_s_input = new Date(orderdatet_s_input.replace("-", "/").replace("-", "/"));
				if(selecttime < orderdatet_s_input) {
					$("#orderdatet_s_input").val(addtime);
				} else {
					$("#orderdatet_s_input").val(get_data());
				}

				orderdatet_s_input = $("#orderdatet_s_input").val();
				$("#orderdatef_s_input").val(result);
				$(".time_btn").removeClass('time_btn_click');
				chart_data_get(orderdatef_s_input, orderdatet_s_input);
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

				$("#orderdatef_s_input").val(get_data(result, -6, 5))
				orderdatef_s_input = $("#orderdatef_s_input").val();

				$("#orderdatet_s_input").val(result);
				$(".time_btn").removeClass('time_btn_click');
				chart_data_get(orderdatef_s_input, orderdatet_s_input);
			},
			id: id_num
		});
	}
})