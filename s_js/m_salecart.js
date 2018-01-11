$(function() {
	var total_price2 = 0;
	$.toast.prototype.defaults.duration = 800;

	function all_other_js() {
		//填充仓位，备注下拉菜单
		function select_content_param() {
			var _param = {};
			var _data = {};
			var configtype = [];
			configtype.push("dbstorename");
			configtype.push("dborderdetailothers");
			configtype.push("dbordertype");
			configtype.push("dborderbrand");
			configtype.push("dbshop");
			configtype.push("dbemployeename");
			configtype.push("dbrepairname");
			_data.configtype = configtype;
			_param.action_sort = "9010201";
			_param.data = _data;
			//console.log("输出", _param);
			_param = "param_json=" + JSON.stringify(_param);
			return _param;
		}
		select_content();

		function select_content() {
			$.ajax({
				type: 'post',
				dataType: "json",
				data: select_content_param(),
				url: "get_s_saas",
				success: function(data) {
					flag_val = data.Flag;
					msg_val = data.Msg;
					if(flag_val == 1) {
						console.log("返回", data);
						var _data = data.Data.data_lists[0];
						//仓位
						var _dbstorename = _data.dbstorename;
						$(".dbstorename_cart").ready(function() {
							var licontent = $(".dbstorename_cart");
							for(var i = 0; i < _dbstorename.length; i++) {
								licontent.append(
									"<option>" + _dbstorename[i].sysname + "</option>"
								)
							}
						})
						//备注
						var _dborderdetailothers = _data.dborderdetailothers;
						$(".prodothers_cart").ready(function() {
							var licontent = $(".prodothers_cart");
							for(var i = 0; i < _dborderdetailothers.length; i++) {
								licontent.append(
									"<option>" + _dborderdetailothers[i].sysname + "</option>"
								)
							}
						})
						//销售类型
						var _dbordertype = _data.dbordertype;
						$("#dbordertype").ready(function() {
							var licontent = $("#dbordertype");
							for(var i = 0; i < _dbordertype.length; i++) {
								licontent.append(
									"<option>" + _dbordertype[i].sysname + "</option>"
								)
							}
						})
						//销单品牌
						var _dborderbrand = _data.dborderbrand;
						$("#dborderbrand").ready(function() {
							var licontent = $("#dborderbrand");
							for(var i = 0; i < _dborderbrand.length; i++) {
								licontent.append(
									"<option>" + _dborderbrand[i].sysname + "</option>"
								)
							}
						})
						//门店
						var _dbshop = _data.dbshop;
						$("#dbshop").ready(function() {
							var licontent = $("#dbshop");
							for(var i = 0; i < _dbshop.length; i++) {
								licontent.append(
									"<option>" + _dbshop[i].sysname + "</option>"
								)
							}
						})
						//营销
						var _dbemployeename = _data.dbemployeename;
						$("#dbemployeename").ready(function() {
							var licontent = $("#dbemployeename");
							for(var i = 0; i < _dbemployeename.length; i++) {
								licontent.append(
									"<option>" + _dbemployeename[i].sysname + "</option>"
								)
							}
						})
						//经办
						var _dbrepairname = _data.dbrepairname;
						$("#dbrepairname").ready(function() {
							var licontent = $("#dbrepairname");
							for(var i = 0; i < _dbrepairname.length; i++) {
								licontent.append(
									"<option>" + _dbrepairname[i].sysname + "</option>"
								)
							}
						})
					} else {
						flag_type(flag_val, msg_val);
					}
				},
				error: function() {
					$.alert("服务器忙碌，请稍候重试！");
				},
				complete: function() {
					/*alldbseries();*/
				}
			});
		}

		/*计算总价*/
		function total_price() {
			$('.num').each(function() {
				var price = $(this).closest('.shop_margin').find('.price').val();
				var discount = $(this).closest('.shop_margin').find(".discount").val();
				var num = $(this).closest('.shop_margin').find(".num").val();
				total_price2 = price * (discount / 100) * num;
				$(this).closest('.shop_margin').find(".all_price").html((total_price2).toFixed(2));
			})
			account();
		};

		total_price();
		account_list();

		/*计算总金额*/
		function account() {
			var inputs = $(".all_price");
			var sum = 0;
			for(var i = 0; i < inputs.length; i++) {
				var a = inputs[i].textContent;
				sum += Number(a);
			}
			$("#totalmoney_sum").text(sum.toFixed(2));
			$("#totalmoney").text(sum);
			account_end();
		};

		/*结算金额*/
		function account_end() {
			var price_end;
			var all_price = $("#totalmoney").text();
			var low_price = $("#reducemoney").val();

			price_end = all_price - low_price;

			$("#lastmoney").text(price_end.toFixed(2));
			stop_add();
		};

		/*计算条目总数*/
		function account_list() {
			var inputs = $(".shop_conte_top");
			var sum_list = inputs.length;
			$("#sum_list").text(sum_list);
		};

		/*值变化时执行计算方法*/
		$(".num").change(function() {
			if($(this).val() == "" || $(this).val() == 0) {
				$.toast("最小数量为1！", "cancel");
				$(this).val(1);
			}
			total_price();
		});
		$(".price").blur(function() {
			if($(this).val() == "") {
				$.toast("请填写单价！", "cancel");
				this.select();
			} else {
				total_price();
			}
		});

		$(".color").blur(function() {
			if($(this).val() == "") {
				$.toast("请填写色号！", "cancel");
				this.select();
			} else {
				total_price();
			}
		});

		$(".discount").blur(function() {
			if($(this).val() == "") {
				$.toast("请填写折扣！", "cancel");
				this.select();
			} else {
				total_price();
			}
		});
		$("#reducemoney").change(account_end);

		//填充下拉选择后显示
		$(".select_a_option").change(function() {
			var select_data = $(this).find("option:selected").val();
			var type_data = $(this).parent().find(".select_data_show");
			if(type_data.hasClass("other_input_select")) {
				type_data.val(select_data);
			} else {
				if(select_data == "") {
					$.toast("仓位不能为空！", "cancel");
				} else {
					type_data.text(select_data);
				}
			}
		})

		//日期选择器
		$("#senddate").click(function() {
			var id_num = Math.random();
			senddate_picker(id_num);
		});

		function senddate_picker(id_num) {
			var a;
			if($(".senddate").text() == "") {
				a = get_data();
			} else {
				a = $(".senddate").text();
			}
			weui.datePicker({
				start: get_data(),
				defaultValue: a.split("-"),
				onChange: function(result) {
					result = result.join("-");
					console.log(result);
				},
				onConfirm: function(result) {
					var time;
					result = result.join("-");
					$(".senddate").text(result);
					$("#senddate").text(result);
				},
				id: id_num
			});
		}

		/*点击减按钮*/
		$(".lower").click(function() {
			var num = $(this).siblings('.num').val();
			//console.log(num)
			/*if(num <= 1) {
				$(".lower").css("opacity", "0.5");
			} else {
				if((num - 1) <= 1) {
					$(".lower").css("opacity", "0.5");
				}*/
			num--;
			$(this).siblings('.num').val(num);
			/*}*/
			total_price();
		});

		/*点击加按钮*/
		$(".add").click(function() {
			var num = $(this).siblings('.num').val();
			$(".lower").css("opacity", "1");
			num++;
			$(this).siblings('.num').val(num);
			total_price();
		});

		/*点击删除*/
		$('.delete').click(function() {
			var div_list = $(this).parents("div");
			console.log(div_list)
			var title = div_list.eq(3).find("#prodcode").text();
			var num;
			$.confirm("确认删除产品" + title + "吗？", function() {
					div_list.eq(3).fadeOut(600, function() {
						div_list.eq(3).remove();
						account();
						account_list();
						num = $("#sum_list").text();
						//console.log(num)
						if(num == 0) {
							sale_clear(0);
						} else {
							stop_add(json_data);
						}
					});
				},
				function() {
					//点击取消后的回调函数
				});
		});

		/*点击清空*/
		$("#shop_empty").click(function() {
			$.confirm("确认清空？", function() {
				sale_clear(0);
			}, function() {
				//点击取消后的回调函数
			});
		});

		/*点击弹出下一步内容隐藏原内容*/
		$("#shop_next_from").click(function() {
			var input_all = $(".shop_conte_top");
			if(input_all.length == 0) {
				$.toast("请添加产品！", "cancel");
			} else {
				$("#shop_next_page").popup();
				$(".weui-tab").hide();
			}
		});

		/*点击弹出搜索内容*/
		$("#perp_cut").click(function() {
			$.closePopup();
			$("#cust_man").popup();
		});

		/*关闭搜索内容显示原开单*/
		$(".close_sou").click(function() {
			$.closePopup();
			$("#shop_next_page").popup();
		});

		/*关闭下一步内容显示原页面*/
		$(".close_next").click(function() {
			$(".weui-tab").show();
		});

		/*返回商品列表按钮*/
		$("#return_up").click(function() {
			window.location.href = "p_saleprodsearch.html";
		})
	}

	/*返回*/
	$("#exit").click(function() {
		stop_add();
	})

	$("#back_shop").click(function() {
		stop_add(1);
	})

	/*ajax*/
	/*列表*/
	/*获取信息*/
	function shop_list_param() {
		var _param = {};
		var _data = {};

		_data.draft_sort = 300;

		_param.action_sort = "9018002";
		_param.data = _data;
		//console.log("输出", JSON.stringify(_param));
		_param = "param_json=" + JSON.stringify(_param);
		return _param;
	}
	shop_list();

	function shop_list() {
		$.ajax({
			type: 'post',
			dataType: "json",
			data: shop_list_param(),
			url: "get_s_saas",
			success: function(data) {
				flag_val = data.Flag;
				msg_val = data.Msg;
				//console.log("列表", data)
				if(flag_val == 1) {
					var _data = data.Data.draft_json.sale_List;
					/*判断对象是否存在*/
					if(_data.length > 0) {
						/*列表填充*/
						var listcontent = $(".shop_list_content");
						for(var i = 0; i < _data.length; i++) {
							listcontent.append(
								"<div class='weui-panel shop_conte_top'>" +
								"<div class='weui-media-box__desc shop_margin'>" +
								"<div class='weui-flex'>" +
								"<div id='del' class='mag_auto' style='width: 25px;'>" +
								"<label class='delete shop_list_del'>X</label>" +
								"</div>" +
								"<div class='weui-flex__item'>" +
								"<div class='weui-flex'>" +
								"<span class='text_color_gray'>产品编码： </span>" +
								"<label class='text_color_black prodcode'>" + _data[i].prodcode + "</label>" +
								"</div>" +
								"<div class='weui-flex text_size_14 mag_top_5'>" +
								"<div class='weui-flex__item'>" +
								"<span>规格: </span>" +
								"<label class='prodspecs detail_text_rt text_color_black'>" + _data[i].prodspecs + "</label>" +
								"</div>" +
								"<div class='weui-flex__item'>" +
								"<span>品牌: </span>" +
								"<label class='prodbrand detail_text_rt text_color_black'>" + _data[i].prodbrand + "</label>" +
								"</div>" +
								"<div class='weui-flex__item'>" +
								"<span>系列: </span>" +
								"<label class='prodseries detail_text_rt text_color_black'>" + _data[i].prodseries + "</label>" +
								"</div>" +
								"</div>" +
								"<div class='weui-flex text_size_13 mag_top_5'>" +
								"<div class='weui-flex__item'>色号：<input id='' type='text' class='popup_input color' value='" + _data[i].color + "' maxlength='15'/></div>" +
								"<div class='weui-flex__item'>" +
								"<div class='dbstor_mag'>仓位：</div>" +
								"<label class='popup_input select_lable select_data_show dbstorename'>" + _data[i].dbstorename + "</label>" +
								"<select class='select_own select_a_option dbstorename_cart'>" +
								"<option></option>" +
								"</select>" +
								"</div>" +
								"</div>" +
								"<div class='weui-flex mag_top_5'>" +
								"<div class='weui-flex__item '>单价：<input type='text' pattern='[0-9]*' class='price popup_input prodprice' value='" + _data[i].prodprice + "' onkeyup='clearNoNum(this)'/>" +
								"</div>" +
								"<div class='weui-flex__item'>折扣：<input type='text' pattern='[0-9]*' value='" + _data[i].proddiscount + "' class='proddiscount discount popup_input width_55' onkeyup='clearNoNum(this)'/>%" +
								"</div>" +
								"</div>" +
								"<div class='weui-flex mag_top_5'>" +
								"<div class='weui-flex weui-flex__item '>" +
								"<div class='mag_top_2p'>数量：</div>" +
								"<i class='detail_remove lower'></i>" +
								"<input  type='tel' pattern='[0-9]*' class='num detail_input detail_width_30 text_size_15 prodnum' value='" + _data[i].prodnum + "' onkeyup='clearNoNum_2(this)'/>" +
								"<i class='detail_add add detail_magrin_right'></i>" +
								"<div class='mag_top_2p'>片</div>" +
								"</div>" +
								"<div class='weui-flex__item mag_top_2p'>金额：<label type='text' class='cost detail_price all_price text_color_black mag_rt_5p'>" + _data[i].detail_price + "</label>元 </div>" +
								"</div>" +
								"<div class='weui-flex mag_top_5'>" +
								"<div class='weui-flex__item '>" +
								"<label class='float_lt mag_top_5'>备注： </label>" +
								"<div class='select_other_box'>" +
								"<input type='text' class='prodothers popup_input select_data_show other_input_select' value='" + _data[i].prodothers + "' maxlength='30'/>" +
								"<img src='img/arrow_dow.png' class='select_other_img' />" +
								"<select class='other_box_select select_a_option prodothers_cart'>" +
								"<option></option>" +
								"</select>" +
								"</div>" +
								"</div>" +
								"</div>" +
								"</div>" +
								"</div>" +
								"</div>" +
								"</div>"
							);
						}
					} else {
						$.alert("订货车为空，请先添加商品", function() {
							window.location.href = "p_saleprodsearch.html";
						});
					}

					//用户信息部分填充
					var _data2 = data.Data.draft_json.sale_user;
					console.log(_data2);
					/*判断对象是否存在*/
					/*结算信息部分*/
					console.log("优惠金额", _data2.reducemoney)
					if(_data2.reducemoney == null || _data2.reducemoney == undefined) {
						_data2.reducemoney = 0;
					}

					$("#totalmoney").text(_data2.costmoney); //合计金额
					$("#reducemoney").val(_data2.reducemoney); //优惠金额
					$("#lastmoney").text(_data2.totalmoney); //结算金额
					$("#custname").val(_data2.custname); //客户名
					$("#custaddress").val(_data2.custaddress); //客户地址
					$("#custtel").val(_data2.custtel); //客户电话
					$("#ordertype_text").text(_data2.ordertype); //销售类型
					$("#dborderbrand_text").text(_data2.orderbrand); //销单品牌	
					$("#dbshop_text").text(_data2.shop); //门店
					$("#dbemployeename_text").text(_data2.employeename); //营销
					$("#dbrepairname_text").text(_data2.repairname); //经办
					$("#designer").val(_data2.designer); //设计
					$("#n1").val(_data2.n1); //项目经理
					$("#n2").val(_data2.n2); //现场联系
					$("#senddate").text(_data2.senddate); //送货日期
					$(".senddate").text(_data2.senddate); //送货日期
					$("#sendtime").text(_data2.sendtime); //送货时间
					$("#orderothers_cust").val(_data2.orderothers); //销售备注	

				} else {
					flag_type(flag_val, msg_val);
				}
			},
			error: function() {
				$.alert("服务器错误，请稍候重试！");
			},
			complete: function() {
				all_other_js();
			}
		});
	};
	//暂存数据获取
	function shop_data_all(stat, _data, _data2) {
		/*销售结算数组定义*/
		var input_all = $(".shop_conte_top");

		if(input_all.length == 0) {
			$.toast("请添加产品", "cancel");
		} else {
			var prodcode;
			var prodspecs;
			var prodbrand;
			var prodseries;
			var color;
			var dbstorename;
			var prodprice;
			var proddiscount;
			var prodnum;
			var prodothers;
			var shop_array;
			var cost;
			for(var i = 0; i < input_all.length; i++) {
				shop_array = {};
				if(stat == 0) {
					prodspecs = $(".prodspecs").eq(i).text(); //规格1
					prodbrand = $(".prodbrand").eq(i).text(); //品牌2
					prodseries = $(".prodseries").eq(i).text(); //系列3
					shop_array.prodspecs = prodspecs;
					shop_array.prodbrand = prodbrand;
					shop_array.prodseries = prodseries;
				}
				prodcode = $(".prodcode").eq(i).text(); //编码0·1
				color = $(".color").eq(i).val(); //色号·1
				dbstorename = $(".dbstorename").eq(i).text(); //仓位·1storename                
				prodprice = $(".prodprice").eq(i).val(); //单价4·1prodpriceout             
				proddiscount = $(".proddiscount").eq(i).val(); //折扣·1degree                    
				prodnum = $(".prodnum").eq(i).val(); //数量·1amount
				prodothers = $(".prodothers").eq(i).val(); //备注·1orderdetailothers       
				cost = $(".cost").eq(i).text(); //金额cost
				/*json对象获取*/
				shop_array.prodcode = prodcode;
				shop_array.color = color;
				if(stat == 1) {
					shop_array.storename = dbstorename;
					shop_array.prodpriceout = prodprice;
					shop_array.degree = proddiscount;
					shop_array.amount = prodnum;
					shop_array.orderdetailothers = prodothers;
					shop_array.cost = cost;
				} else {
					shop_array.dbstorename = dbstorename;
					shop_array.prodprice = prodprice;
					shop_array.proddiscount = proddiscount;
					shop_array.prodnum = prodnum;
					shop_array.prodothers = prodothers;
					shop_array.detail_price = cost;
				}
				/*数组填充*/
				_data.push(shop_array);
			}

			/*客户信息数组部分*/
			var costmoney = $("#totalmoney").text(); //合计金额1
			var reducemoney = $("#reducemoney").val(); //优惠金额1
			var totalmoney = $("#lastmoney").text(); //结算金额1
			var custname = $("#custname").val(); //客户名1
			var custaddress = $("#custaddress").val(); //客户地址1
			var custtel = $("#custtel").val(); //客户电话1
			var ordertype = $("#ordertype_text").text(); //销售类型1
			var orderbrand = $("#dborderbrand_text").text(); //销单品牌1	
			var shop = $("#dbshop_text").text(); //门店1
			var employeename = $("#dbemployeename_text").text(); //营销1
			var repairname = $("#dbrepairname_text").text(); //经办1
			var designer = $("#designer").val(); //设计1
			var n1 = $("#n1").val(); //项目经理1
			var n2 = $("#n2").val(); //现场联系1
			var senddate = $(".senddate").text(); //送货日期1
			var sendtime = $("#sendtime").text(); //送货时间1
			var orderothers = $("#orderothers_cust").val(); //销售备注1

			_data2.costmoney = costmoney;
			_data2.reducemoney = reducemoney;
			_data2.totalmoney = totalmoney;
			_data2.custname = custname;
			_data2.custaddress = custaddress;
			_data2.custtel = custtel;
			_data2.ordertype = ordertype;
			_data2.orderbrand = orderbrand;
			_data2.shop = shop;
			_data2.employeename = employeename;
			_data2.repairname = repairname;
			_data2.designer = designer;
			_data2.n1 = n1;
			_data2.n2 = n2;
			_data2.senddate = senddate;
			_data2.sendtime = sendtime;
			_data2.orderothers = orderothers;
		}
	}
	/*暂存方法*/
	function stop_add_param(json_data, json_userdata) {
		var _param = {};
		var _data = {};
		var draft_json = {};

		draft_json.sale_List = json_data;
		draft_json.sale_user = json_userdata;

		_data.draft_json = draft_json;
		_data.draft_sort = 300;
		_param.action_sort = "9018001";
		_param.data = _data;
		console.log("输出商店暂存内容", JSON.stringify(_param));
		_param = "param_json=" + encodeURIComponent(JSON.stringify(_param));

		return _param;
	}

	function stop_add(stat) {
		var _data = [];
		var _data2 = {};
		shop_data_all(0, _data, _data2);
		/*json转义*/
		var json_data = _data;
		var json_userdata = _data2;

		$.ajax({
			type: "post",
			dataType: "json",
			data: stop_add_param(json_data, json_userdata),
			url: "get_s_saas",
			success: function(data) {
				flag_val = data.Flag;
				msg_val = data.Msg;
				if(data.Flag == 1) {
					if(stat == 1) {
						window.location.href = "p_saleprodsearch.html";
					}
				} else {
					flag_type(flag_val, msg_val);
				}
				//$.toast("保存成功");
			},
			error: function() {
				$.alert("服务器错误，添加失败，请稍候重试！");
			},
			complete: function() {}
		});
	}
	//保存
	function save_all_param(json_userdata) {
		var _param = {};

		_param.action_sort = "30105";
		_param.data = json_userdata;
		console.log("输出保存", JSON.stringify(_param))
		_param = "param_json=" + encodeURIComponent(JSON.stringify(_param));
		return _param;
	}

	$("#save_all").click(function() {
		var reducemoney = $("#reducemoney").val();
		var custname = $("#custname").val();
		var custaddress = $("#custaddress").val();
		var custtel = $("#custtel").val();
		var ordertype = $("#ordertype_text").text();
		var dborderbrand = $("#dborderbrand_text").text();
		var dbshop = $("#dbshop_text").text();
		var dbemployeename = $("#dbemployeename_text").text();
		var dbrepairname = $("#dbrepairname_text").text();
		if(reducemoney == "") {
			$.toast("请输入优惠金额", "cancel", function() {
				$("#reducemoney").focus();
			});
		} else if(custname == "") {
			$.toast("请选择或输入客户", "cancel", function() {
				$("#custname").focus();
			});
		} else if(custaddress == "") {
			$.toast("请输入客户地址", "cancel", function() {
				$("#custaddress").focus();
			});
		} else if(custtel == "") {
			$.toast("请输入正确手机号", "cancel", function() {
				$("#custtel").focus();
			});
		} else if(ordertype == "") {
			$.toast("请选择销售类型", "cancel");
		} else if(dborderbrand == "") {
			$.toast("请选择销单品牌", "cancel");
		} else if(dbshop == "") {
			$.toast("请选择门店", "cancel");
		} else {
			var input_all = $(".shop_conte_top");
			if(input_all.length == 0) {
				$.toast("请添加产品", "cancel");
			} else {
				//保存
				save_all_js();
			}
		}
	})

	//保存
	function save_all_js() {
		var _data = [];
		var _data2 = {};
		/*销售结算数组定义*/
		shop_data_all(1, _data, _data2);
		_data2.prod_list = _data;
		var json_userdata = _data2;
		$.showLoading();
		$.ajax({
			type: "post",
			dataType: "json",
			data: save_all_param(json_userdata),
			url: "get_s_saas",
			success: function(data) {
				flag_val = data.Flag;
				msg_val = data.Msg;
				var ordercode = data.Data.ordercode;
				console.log("保存返回信息", data);
				$.hideLoading();
				if(flag_val == 1) {
					sale_clear(1, ordercode)
				} else {
					flag_type(flag_val, msg_val);
				}
			},
			error: function() {
				$.hideLoading();
				$.alert("服务器忙碌，请稍候重试！");
			},
			complete: function() {}
		});
	}

	/*暂存清空*/
	function shop_clear_param() {
		var _param = {};
		var _data = {};

		_data.draft_sort = 300;
		_param.action_sort = "9018003";

		_param.data = _data;
		//console.log("输出", _param);
		_param = "param_json=" + JSON.stringify(_param);
		return _param;
	}

	function sale_clear(stat, ordercode) {
		$.ajax({
			type: "post",
			dataType: "json",
			data: shop_clear_param(),
			url: "get_s_saas",
			success: function(data) {
				flag_val = data.Flag;
				msg_val = data.Msg;
				if(flag_val == 1) {
					$.toast("清空成功", 1000);
				} else {
					flag_type(flag_val, msg_val);
				}
			},
			error: function() {
				$.alert("服务器忙碌，请稍候重试！");
			},
			complete: function() {
				if(stat == 0) {
					window.location.href = "p_saleprodsearch.html";
				} else if(stat == 1) {
					window.location.href = "p_saledetail.html?ordercode=" + ordercode;
				}
			}
		});
	}

	//搜索
	//输入框事件
	$("#searchInput").bind('input porpertychange', function() {
		search_list();
	})

	function search_list_param() {
		var _param = {};
		var _data = {};
		var user_data;

		user_data = $("#searchInput").val();

		_data.param_s = user_data;
		_param.action_sort = "30180";
		_param.data = _data;
		//console.log("输出", _param);
		_param = "param_json=" + JSON.stringify(_param);
		return _param;
	}

	function search_list() {
		$("#search_list_content").html("");
		$.ajax({
			type: "post",
			dataType: "json",
			data: search_list_param(),
			url: "get_s_saas",
			success: function(data) {
				console.log(data)
				flag_val = data.Flag;
				msg_val = data.Msg;
				var custaddress;
				var custtel;
				var custname;
				if(flag_val == 1) {
					var _data = data.Data.data_lists;
					var listcontent = $("#search_list_content");
					for(var i = 0; i < _data.length; i++) {

						custaddress = _data[i].custaddress;
						custtel = _data[i].custtel;
						custname = _data[i].custname;

						listcontent.append(
							"<li onclick='getuserData(this)'>" +
							"<h2>" + custaddress + "</h2>" +
							"<p><span class='cust_tel'>" + custtel + "</span>" + " " + "<span class='cust_name'>" + custname + "</span></p>" +
							"</li>"
						)
					}
				} else {
					flag_type(flag_val, msg_val);
				}
			},
			error: function() {
				$.alert("服务器忙碌，请稍候重试！");
			},
			complete: function() {

			}
		});
	}
});

function getuserData(data) {
	var custname = $(data).find(".cust_name").text();
	var custtel = $(data).find(".cust_tel").text();
	var custaddress = $(data).find("h2").text();

	$("#custname").val(custname);
	$("#custaddress").val(custaddress);
	$("#custtel").val(custtel);
	$.closePopup();
	$("#shop_next_page").popup();
}