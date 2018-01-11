$(function() {

	var paydatef_s;
	var paydatet_s;
	var myDate = new Date();
	/*json*/
	function chart_data_param(paydatef_s, paydatet_s) {
		var _param = {};
		var _data = {};
		
		_data.paydatef_s = paydatef_s;
		_data.paydatet_s = paydatet_s;

		_param.action_sort = "9003";
		_param.data = _data;
		_param = "param_json=" + JSON.stringify(_param);
		//console.log("输出", _param)
		return _param;
	}
	/*ajax*/
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
					var chart_content;
					var price_num = 0;
					var a = 0;
					$("#peop_num").text(_data.length);
					for(var i = 0; i < _data.length; i++) {
						chart_content = {};
						data_name.push(_data[i].paysort);
						chart_content.value = _data[i].spaymoney;
						chart_content.name = _data[i].paysort;
						chart_data.push(chart_content);

						price_num += parseFloat($.parseJSON(_data[i].spaymoney));
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
		$(".time_btn").removeClass('time_btn_click');
		$(this).addClass('time_btn_click');
		if($(this).hasClass('day_sale')) {
			$("#paydatef_s_input").val(get_data());
			$("#paydatet_s_input").val(get_data());
			$("#paydatef_s_input").attr("name", num);
			$("#paydatet_s_input").attr("name", num + 1);
		} else if($(this).hasClass('week_sale')) {
			$("#paydatef_s_input").val(get_data(get_data(), -6, 5));
			$("#paydatet_s_input").val(get_data());
			$("#paydatef_s_input").attr("name", num);
			$("#paydatet_s_input").attr("name", num + 1);
		} else if($(this).hasClass('month_sale')) {
			$("#paydatef_s_input").val(get_data(myDate,29,1));
			$("#paydatet_s_input").val(get_data());
			$("#paydatef_s_input").attr("name", num);
			$("#paydatet_s_input").attr("name", num + 1);
		}
		paydatef_s = $("#paydatef_s_input").val();
		paydatet_s = $("#paydatet_s_input").val();
		console.log(paydatef_s)
		console.log(paydatet_s)
		chart_data_get(paydatef_s, paydatet_s);
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
				center: ['50%', '50%'],
				avoidLabelOverlap: true,
				
				label: {
					normal: {
						formatter: '{c}元\n{d}%',
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

	function time_f_picker(id_num) {
		var a = $("#paydatef_s_input").val();
		weui.datePicker({
			start: get_data(myDate,1, 4),
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

	function time_t_picker(id_num) {
		var a = $("#paydatet_s_input").val();
		weui.datePicker({
			start: get_data(myDate,1, 4),
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
})