//获取url参数
function GetParameter(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return decodeURIComponent(r[2]);
	return null;
}

/*flag*/
function flag_type(flag_val, msg_val) {
	var page = window.location.href;
	if(flag_val == -11) {
		window.location.href = "get_openid.jsp?page=" + page;
	} else {
		$.alert(msg_val);
	}
}

//ajax Data
var getData = function(obj) {
	var dfd = $.Deferred();
	$.ajax({
		type: 'post',
		dataType: "json",
		data: obj.Data,
		url: obj.Url,
		success: function(data) {
			dfd.resolve(data);
		},
		error: function() {
			$.alert("服务器忙碌，请稍候重试！");
		}
	});
	return dfd.promise();
}