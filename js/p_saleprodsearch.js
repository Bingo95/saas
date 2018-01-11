$(function() {

	/*点击加减按钮*/
	$("#remove").click(function() {
		var num = $("#sale_number").val();
		//console.log(num)
		/*if(num <= 1) {
			$("#remove").css("opacity", "0.5");
		} else {
			if((num - 1) <= 2) {
				$("#remove").css("opacity", "0.5");
			}*/
		$("#sale_number").val(num - 1);
		/*}*/
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
		var price = $("#prodpriceout").val(); //单价
		var discount = $("#discount").val(); //折扣
		var num = $("#sale_number").val(); //数量
		total_price2 = price * (discount / 100) * num;
		$("#detail_price").html((total_price2).toFixed(2));
	}

	/*值变化时执行计算方法*/
	$("#sale_number").change(function() {
		if($(this).val() == "" || $(this).val() == 0) {
			$(this).val(1);
		}
		total_price();
	});
	$("#prodpriceout").change(total_price);
	$("#discount").change(total_price);

	//选择菜单值填充
	$("#dbstorename").change(function() {
		var a = $("#dbstorename").find("option:selected").val();
		$("#dbstorename_text").text(a);
	})

	$("#other_select_list").change(function() {
		var a = $("#other_select_list").find("option:selected").val();
		$("#other").val(a);
	})
	//清空详情信息
	function clear_from_detail() {
		$("#color_num").val("");
		$("#dbstorename_text").text("");
		$("#other").val("");
		$("#dbstorename option:first").prop("selected", 'selected');
		$("#other_select_list option:first").prop("selected", 'selected');
	}

	$(".close-popup").click(function() {
		clear_from_detail();
	})
	/*下拉菜单*/
	$(function() {
		var stat = 0;

		function li_click_a() {
			$("#overlay").hide();
			var v_width = $(document.body).width();
			$(".select_textul").width(v_width);

			$(".select_textdiv").click(function() {
				$(this).parent().parent().siblings().find(".select_textul").hide();
				stat = 0;
				$(".select_textdiv").removeClass("disabled");
				$(this).addClass("disabled");
				$(".select_textdiv").removeClass("divfocus");
				$(this).addClass("divfocus");
				$(this).siblings(".select_textul").fadeToggle("fast");

				if(stat == 0) {
					$("#overlay").show();
					stat = 1;
				} else {
					$("#overlay").hide();
					stat = 0;
				}
				chooseclick();
			})

			$("#overlay").click(function() {
				$(".select_textdiv").removeClass("disabled");
				$(".select_textul").fadeOut("fast");
				$("#overlay").hide();
				stat = 0;
			});
		}

		function chooseclick() {
			$(".select_first_ul > li").unbind("click").bind("click", function() {
				$(".select_textdiv").removeClass("disabled");
				var choose = $(this).text();
				var brand = $(".copy_brand").val();
				var series = $(".copy_series").val();
				$(this).parents(".select_textul").siblings(".select_textdiv").find(".valtext").val(choose);
				if(choose.length >= 6) {
					choose = choose.substring(0, 6);
				}
				$(this).addClass("focusli").siblings("li").removeClass("focusli");
				$(this).parents(".select_textul").siblings(".select_textdiv").find(".s_text").text(choose);
				$(this).parents(".select_textul").fadeOut("fast");
				$(".select_textdiv").removeClass("over_div");
				$("#overlay").hide();
				stat = 0;
				event.stopPropagation();
				$("#sales_list_content").html("");
				search_list_js();
			});
		}

		/*ajax*/

		/*获取搜索菜单信息*/
		function configtype_param() {
			var _param = {};
			var _data = {};
			var configtype = [];
			configtype.push("dbbrand");
			configtype.push("dbseries");
			configtype.push("dbstorename");
			configtype.push("dborderdetailothers");
			_data.configtype = configtype;
			_param.action_sort = "9010201";
			_param.data = _data;
			//console.log("输出", _param);
			_param = "param_json=" + JSON.stringify(_param);
			return _param;
		}

		/*品牌*/
		$(".menudown_list").ready(function() {
			$.ajax({
				type: 'post',
				dataType: "json",
				data: configtype_param(),
				url: "get_s_saas",
				success: function(data) {
					flag_val = data.Flag;
					msg_val = data.Msg;
					if(data.Flag == 1) {
						//console.log("品牌", data.Data.data_lists[0]);
						var _data = data.Data.data_lists[0];
						//品牌
						var _dbbrand = _data.dbbrand;
						$(".alldbbrand").ready(function() {
							var licontent = $(".alldbbrand");
							for(var i = 0; i < _dbbrand.length; i++) {
								licontent.append(
									"<li class='nav_drop_hide'>" + _dbbrand[i].sysname + "</li>"
								)
							}
						})
						//系列
						var _dbseries = _data.dbseries;
						$(".alldbseries").ready(function() {
							var licontent = $(".alldbseries");
							for(var i = 0; i < _dbseries.length; i++) {
								licontent.append(
									"<li class='nav_drop_hide'>" + _dbseries[i].sysname + "</li>"
								)
							}
						})
						//仓位
						var _dbstorename = _data.dbstorename;
						$("#dbstorename_text").ready(function() {
							var licontent = $("#dbstorename");
							for(var i = 0; i < _dbstorename.length; i++) {
								licontent.append(
									"<option>" + _dbstorename[i].sysname + "</option>"
								)
							}
						})
						//备注
						var _dborderdetailothers = _data.dborderdetailothers;
						$("#other").ready(function() {
							var licontent = $("#other_select_list");
							for(var i = 0; i < _dborderdetailothers.length; i++) {
								licontent.append(
									"<option>" + _dborderdetailothers[i].sysname + "</option>"
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
					li_click_a();
				}
			});
		})
	})

	/*搜索功能*/
	/*输入框*/
	/*回车搜索*/
	$("#searchInput").keydown(function() {
		if(event.keyCode == 13) { //回车键的键值为13
			search_list_js();
		}
	});

	/*点击搜索*/
	$("#search_shop").click(function() {
		search_list_js();
	});

	//搜索
	function search_list_js() {
		$("#sales_list_content").html("");
		page = 1;
		prodcode = $("#searchInput").val();
		series = $(".copy_series").val();
		prodbrand = $(".copy_brand").val();
		if(series == "全部系列") {
			series = "";
		}
		if(prodbrand == "全部品牌") {
			prodbrand = "";
		}
		listcontent(page, prodcode, series, prodbrand);
	}

	/*获取产品列表*/
	function sales_list_param(page, prodcode, series, prodbrand) {
		var _param = {};
		var _data = {};

		_data.page_no = page;
		_data.page_size = 10;
		_data.prodcode_s = prodcode;
		_data.series_s = series;
		_data.prodbrand_s = prodbrand;

		_param.action_sort = "30101";
		_param.data = _data;
		//console.log("输出", JSON.stringify(_param));
		_param = "param_json=" + JSON.stringify(_param);
		return _param;
	}

	listcontent(1, "", "", "");

	/*列表加载*/
	function listcontent(page, prodcode, series, prodbrand) {
		var has_next;
		$.ajax({
			type: 'post',
			dataType: "json",

			data: sales_list_param(page, prodcode, series, prodbrand),
			url: "get_s_saas",
			success: function(data) {
				flag_val = data.Flag;
				msg_val = data.Msg;
				console.log("列表", data)
				if(data.Flag == 1) {
					var _data = data.Data.data_lists;
					var listcot = $(".sales_list_content");
					if(_data.length == 0) {
						$(".sales_list_content").html("");
						$("#login_up").hide();
						listcot.append(
							"<div id='shop_none' class='text_align_center mag_top_dow10'>" +
							"<img src='img/119.png' style='width: 68px;height: 65px;' />" +
							"<div class='weui-flex'>" +
							"<label class='text_size_15 mag_auto'>SORRY,没有找到商品数据！</label>" +
							"</div>" +
							"</div>"
						);
						//console.log("listcontent", _data.length)
					} else {
						for(var i = 0; i < _data.length; i++) {
							listcot.append(
								"<a class='open-popup' data-target='#detail_from'  href='javascript:;'>" +
								"<div class='sales_list_box float_lt'>" +
								"<ul class='ul_style_list'>" +
								"<li class='li_drop_hide text_li_hd code'>" + _data[i].prodcode + "</li>" +
								"<li class='li_drop_hide text_li'>品牌 <label class ='lable_text_li' >" + _data[i].prodbrand + "</label></li>" +
								"<li class='li_drop_hide text_li'>规格 <label class ='lable_text_li' >" + _data[i].length + "x" + _data[i].width + "</label></li>" +
								"<li class='li_drop_hide text_li'>系列 <label class ='lable_text_li'>" + _data[i].series + "</label></li>" +
								"</ul>" +
								"</div>" +
								"</a>"
							);
						}
					}
					has_next = data.Data.has_next;
				} else {
					flag_type(flag_val, msg_val);
				}
			},
			error: function() {
				$.alert("服务器忙碌，请稍候重试！");
			},
			complete: function() {
				sales_list_boxon();
				loadmore(page, has_next, prodcode, series, prodbrand);
			}
		});
	}

	/*滚动加载*/
	function loadmore(page, has_next, prodcode, series, prodbrand) {
		if(has_next > 0) {
			++page;
			var loading = false; //状态标记
			$(".login_tip").infinite().unbind("infinite").bind("infinite", function() {
				if(loading) return;
				loading = true;
				setTimeout(function() {
					listcontent(page, prodcode, series, prodbrand);
				}, 500);
			});
		} else if(has_next == 0) {
			$("#login_up").hide();
		}
	}
	/*获取开单信息*/
	function sales_click_param(prodcode) {
		var _param = {};
		var _data = {};

		_data.prodcode_s = prodcode;

		_param.action_sort = "30102";
		_param.data = _data;
		//console.log("输出", JSON.stringify(_param));
		_param = "param_json=" + JSON.stringify(_param);
		return _param;
	}

	function sales_list_boxon() {
		$(".sales_list_box").click(function() {
			/*点击弹出详情*/
			$("#sale_number").val(1);
			$("#discount").val(100);
			//$("#detail_from").popup();
			var prodcode = $(this).find(".code").text();
			$.ajax({
				type: 'post',
				dataType: "json",
				data: sales_click_param(prodcode),
				url: "get_s_saas",
				success: function(data) {
					flag_val = data.Flag;
					msg_val = data.Msg;
					//console.log(data)
					if(data.Flag == 1) {
						var _data = data.Data;
						var specs = _data.length + "x" + _data.width;
						$("#prodcode").text(_data.prodcode); //编码
						$("#prodspecs").text(specs); //规格
						$("#prodseries").text(_data.series); //系列
						$("#prodbrand").text(_data.prodbrand); //品牌
						$("#prodpriceout").val(_data.prodpriceout); //单价
					} else {
						flag_type(flag_val, msg_val);
					}
				},
				error: function() {
					$.alert("服务器忙碌，请稍候重试！");
				},
				complete: function() {
					total_price();
				}
			});
		});
	}

	/*售货车点击事件*/
	$("#shop_sale").click(function() {
		var num = $("#shop_list_num").text().length;
		if(num > 2) {
			window.location.href = "p_salecart.html";
		} else {
			$.alert("销售车为空，请先添加产品!");
		}
	})

	/*点击完成加入开单点击事件*/
	$("#shop_one_add").click(function() {
		check_data(1);

	});
	$("#shop_end").click(function() {
		check_data(2);
	});

	function check_data(stat) {
		$.toast.prototype.defaults.duration = 800;
		var color = $("#color_num").val();
		var dbstorename = $("#dbstorename_text").text();
		var prodpriceout = $("#prodpriceout").val();
		var discount = $("#discount").val();
		if(color == "") {
			$.toast("请输入色号", "cancel", function() {
				$("#color_num").focus();
			});
		} else if(dbstorename == "" || dbstorename == "选择") {
			$.toast("请选择仓位", "cancel");
		} else if(prodpriceout == "") {
			$.toast("请输入单价", "cancel", function() {
				$("#prodpriceout").focus();
			});
		} else if(discount == "") {
			$.toast("请输入折扣", "cancel", function() {
				$("#discount").focus();
			});
		} else {
			shop_add(stat);
		}
	}

	/*加入销售车事件、暂存起步*/
	//读取暂存数据
	function shop_temporary_param(prodcode) {
		var _param = {};
		var _data = {};

		_data.draft_sort = 300;

		_param.action_sort = "9018002";
		_param.data = _data;
		//console.log("输出", JSON.stringify(_param));
		_param = "param_json=" + JSON.stringify(_param);
		//console.log("输出", _param);
		//_param = encodeURIComponent(_param);
		return _param;
	}
	//暂存方法执行stat"" 获取暂存信息,1加入销售车,2完成开单.
	shop_add();

	function shop_add(stat) {
		var prodcode = $("#prodcode").text(); //编码0
		/*取数据*/
		$.ajax({
			type: "post",
			dataType: "json",
			data: shop_temporary_param(prodcode),
			url: "get_s_saas",
			success: function(data) {
				flag_val = data.Flag;
				msg_val = data.Msg;
				console.log("暂存", data)
				if(data.Flag == 1) {
					var _data_shop = data;
					var _data_user = data;
					var _data_type = 0;
					var _list_num;
					/*购物车列表数组部分*/
					/*判断是否存在*/
					if("Data" in _data_shop) {
						_data_shop = data.Data;
						if("draft_json" in _data_shop) {
							_data_shop = data.Data.draft_json;
							try {
								if("sale_List" in _data_shop == true) {
									_data_shop = data.Data.draft_json.sale_List;
									//console.log("data1",  _data_shop.length);
									//销售车数量显示
									if(_data_shop == "[]" || _data_shop.length == 0) {
										$("#shop_list_num").text("");
										_data_shop = [];
									} else {
										$("#shop_list_num").text("( " + _data_shop.length + " )");
									}
									//获取已存在的商品下标
									for(var i = 0; i < _data_shop.length; i++) {
										if(_data_shop[i].prodcode == prodcode) {
											//获取数组下
											_data_type = 1;
											_list_num = i;
										}
									}
								}
							} catch(error) {
								_data_shop = [];
							}
						} else {
							_data_shop = [];
						}
					} else {
						_data_shop = [];
					}
					/*用户信息数组部分*/
					if("Data" in _data_user) {
						_data_user = data.Data;
						if("draft_json" in _data_user) {
							_data_user = data.Data.draft_json;
							try {
								if("sale_user" in _data_user) {
									_data_user = data.Data.draft_json.sale_user;
								}
							} catch(error) {
								_data_user = {};
							}
						} else {
							_data_user = {};
						}
					} else {
						_data_user = {};
					}

					/*整合传递所需值*/
					var obj1 = {
						_data_shop: _data_shop,
						_data_user: _data_user,
						_data_type: _data_type,
						_list_num: _list_num,
					};
					/*执行暂存方法*/
					if(prodcode != "") {
						temporary_add(obj1);
					}
				} else {
					flag_type(flag_val, msg_val);
				}
			},
			error: function() {
				$.alert("服务器忙碌，添加失败，请稍候重试！");
			},
			complete: function() {
				if(stat == 2) {
					window.location.href = "p_salecart.html";
				}
			}
		});
	}

	/*暂存*/
	function save_data_param(json_data, json_userdata) {
		var _param = {};
		var _data = {};
		var draft_json = {};
		_data.draft_sort = 300;

		draft_json.sale_List = json_data;
		draft_json.sale_user = json_userdata;

		_data.draft_json = draft_json;
		_param.action_sort = "9018001";
		_param.data = _data;
		_param = "param_json=" + encodeURIComponent(JSON.stringify(_param));
		console.log("输出商店暂存内容", _param);
		return _param;
	}

	function temporary_add(obj1) {
		var _data_shop = obj1._data_shop;
		var _data_user = obj1._data_user;
		/*销售车数组定义*/
		var prodcode = $("#prodcode").text(); //编码0
		var prodspecs = $("#prodspecs").text(); //规格1
		var prodbrand = $("#prodbrand").text(); //品牌2
		var prodseries = $("#prodseries").text(); //系列3
		var color = $("#color_num").val(); //色号
		var dbstorename = $("#dbstorename_text").text(); //仓位
		var prodpriceout = $("#prodpriceout").val(); //单价4
		var discount = $("#discount").val(); //折扣5
		var sale_number = $("#sale_number").val(); //数量6
		var detail_price = $("#detail_price").text(); //金额7
		var other = $("#other").val(); //备注8
		var shop_array = {};

		/*json对象获取*/
		shop_array.prodcode = prodcode;
		shop_array.prodspecs = prodspecs;
		shop_array.prodbrand = prodbrand;
		shop_array.prodseries = prodseries;
		shop_array.color = color;
		shop_array.dbstorename = dbstorename;
		shop_array.prodprice = prodpriceout;
		shop_array.proddiscount = discount;
		shop_array.prodnum = sale_number;
		shop_array.detail_price = detail_price;
		shop_array.prodothers = other;

		if(obj1._data_type == 0) {
			/*不重复，数组填充*/
			_data_shop.push(shop_array);
		} else if(obj1._data_type == 1) {
			/*重复，数组赋值*/
			_data_shop[obj1._list_num] = shop_array;
		}
		/*json转义*/
		var json_data = _data_shop;
		var json_userdata = _data_user;
		/*var save_data_param = '{"action_sort":"9018001","Data":{"draft_json":{"sale_List":' + json_data + ',"sale_user":' + json_userdata + '},"draft_sort":300}}';
		save_data_param = encodeURIComponent(save_data_param);*/
		$.ajax({
			type: "post",
			dataType: "json",
			data: save_data_param(json_data, json_userdata),
			url: "get_s_saas",
			success: function(data) {
				flag_val = data.Flag;
				msg_val = data.Msg;
				console.log(data);
				if(data.Flag == 1) {
					//销售车数量
					/*$("#shop_list_num").text("（" + _data_shop.length + "）");*/
					//关闭弹出框
					$.closePopup();
					//清空详情
					clear_from_detail();
					$.toast("添加成功", 1000);
				} else {
					flag_type(flag_val, msg_val);
				}
			},
			error: function() {
				/*$.alert("服务器忙碌，添加失败，请稍候重试！");*/
				//关闭弹出框
				$.closePopup();
				//清空详情
				clear_from_detail();
			},
			complete: function() {
				$("#prodcode").text("");
				shop_add();
			}
		});
	}

	$("#back_home").click(function() {
		window.location.href = "s_homepage.jsp";
	})
})