$(function() {
	var page_url;
	var title_val;
	var desc_val;
	var appid_ajax;
	var imgUrl_val;
	var timestamp_ajax;
	var nonceStr_ajax;
	var signature_ajax;

	page_url = window.location.href;

	function question_share_param(page_url) {
		var _param = {};
		var _data = {};

		_data.url = encodeURIComponent(page_url);

		_param.action_sort = "8100";
		_param.data = _data;
		_param = "param_json=" + JSON.stringify(_param);
		//console.log("输出", _param)
		return _param;
	}

	/*ajax获取配置参数*/
	$.ajax({
		type: 'post',
		dataType: "json",
		//contentType: "application/json",
		data: question_share_param(page_url),
		url: "cust_service",
		success: function(data) {
			/*微信分享参数*/
			//console.log("分享", data)
			data = data.Data;
			title_val = $.trim($(".questin_title").html());
			desc_val = "" /*$.trim($(".questin_content").html())*/ ;
			imgUrl_val = "http://www.jidisoft.com/image/question_share_logo.png";
			appid_ajax = data.appid;
			timestamp_ajax = data.timestamp;
			nonceStr_ajax = data.nonceStr;
			signature_ajax = data.signature;
			var obj = {
				title_val: title_val,
				desc_val: desc_val,
				imgUrl_val: imgUrl_val,
				appid_ajax: appid_ajax,
				timestamp_ajax: timestamp_ajax,
				nonceStr_ajax: nonceStr_ajax,
				signature_ajax: signature_ajax
			};
			wechat_share(obj);
		},
		error: function() {
			$.alert("服务器忙碌。");
		},
	});

	//微信分享
	function wechat_share(obj) {
		//通过config接口注入权限验证配置
		wx.config({
			debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			appId: obj.appid_ajax, // 必填，公众号的唯一标识
			timestamp: obj.timestamp_ajax, // 必填，生成签名的时间戳
			nonceStr: obj.nonceStr_ajax, // 必填，生成签名的随机串
			signature: obj.signature_ajax, // 必填，签名，见附录1
			jsApiList: // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				[
					'onMenuShareTimeline',
					'onMenuShareAppMessage',
					'hideMenuItems'
				]
		});

		wx.ready(function() {
			wx.hideMenuItems({ // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
				menuList: [
					"menuItem:share:qq",
					"menuItem:share:weiboApp",
					"menuItem:share:facebook",
					"menuItem:share:QZone",
					"menuItem:copyUrl",
					"menuItem:openWithQQBrowser",
					"menuItem:openWithSafari",
					"menuItem:favorite",
					"menuItem:share:brand",
					"menuItem:share:email",
					"menuItem:readMode",
					"menuItem:editTag",
					"menuItem:delete",
					"menuItem:originPage",
				]
			});

			/*获取“分享到朋友圈”按钮点击状态及自定义分享内容接口*/
			wx.onMenuShareTimeline({

				title: obj.title_val, // 分享标题

				link: page_url,

				imgUrl: obj.imgUrl_val, // 分享图标

			});

			// 获取“分享给朋友”按钮点击状态及自定义分享内容接口

			wx.onMenuShareAppMessage({

				title: obj.title_val, // 分享标题

				desc: obj.desc_val, // 分享描述

				link: page_url,

				imgUrl: obj.imgUrl_val, // 分享图标

				type: 'link', // 分享类型,music、video或link，不填默认为link

			});
		});
	}
})