//获取时间
//data_time 传入时间格式"2017-01-01"; data_val 偏移值;data_type 类型
//type 1是天; 2是周; 3是月; 4是年; 5是自定义传入日期;
//没有传入值是当前时间
function get_data(data_time, data_val, data_type) {
	var myDate = new Date();

	if(data_type == 1) {
		myDate.setDate(myDate.getDate() - data_val);
	} else if(data_type == 3) {
		myDate.setDate(myDate.getMonth() - data_val);
	} else if(data_type == 4) {
		myDate.setFullYear(myDate.getFullYear() - data_val);
	} else if(data_type == 5) {
		var myDate = new Date(data_time.replace("-", "/").replace("-", "/"));
		myDate.setDate(myDate.getDate() + data_val);
	}

	//获取年
	var year = myDate.getFullYear();
	//获取月
	var month = myDate.getMonth() + 1;
	//获取日
	var date = myDate.getDate();
	/*当前时间*/
	var now = year + '-' + day_zero(month) + "-" + day_zero(date);
	return now;
};

//为单数加个0
function day_zero(s) {
	return s < 10 ? '' + s : s;
}

//返回
$(".back_btn").click(function() {
	window.history.back(-1);
})

/*flag*/
function flag_type(flag_val, msg_val) {
	var page = window.location.href;
	if(flag_val == -11) {
		window.location.href = "get_openid.jsp?page=" + page;
	} else {
		$.alert(msg_val);
	}
}

//获取url参数
function GetParameter(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return decodeURIComponent(r[2]);
	return null;
}

/*输入小数和数字*/
function clearNoNum(obj) {
	//修复第一个字符是小数点 的情况.  
	if(obj.value != '' && obj.value.substr(0, 1) == '.') {
		obj.value = "";
	}
	obj.value = obj.value.replace(/^0*(0\.|[1-9])/, '$1'); //解决 粘贴不生效  
	obj.value = obj.value.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符  
	obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的       
	obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
	obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数       
	if(obj.value.indexOf(".") < 0 && obj.value != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
		if(obj.value.substr(0, 1) == '0' && obj.value.length == 2) {
			obj.value = obj.value.substr(1, obj.value.length);
		}
	}
}

/*输入小数和数字和负数*/
function clearNoNum_2(obj) {
	//修复第一个字符是小数点 的情况.  
	if(obj.value != '' && obj.value.substr(0, 1) == '.') {
		obj.value = "";
	}
	obj.value = obj.value.replace(/^0*(0\.|[1-9])/, '$1'); //解决 粘贴不生效  
	obj.value = obj.value.replace(/[^-\d+\.?\d{0,2}$]/g, ""); //清除“数字”和“.”，“-”以外的字符 
	obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
	obj.value = obj.value.replace(/\-{2,}/g, "-"); //只保留第一个- 清除多余的
	obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
	obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数       
	if(obj.value.indexOf(".") < 0 && obj.value != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
		if(obj.value.substr(0, 1) == '0' && obj.value.length == 2) {
			obj.value = obj.value.substr(1, obj.value.length);
		}
	}
}

$(".back_home").click(function() {
	window.location.href = "s_homepage.jsp";
})