//获取地址
define(function(require, exports, moduel) {
	var $ = require('jquery');
	require('commonFn');
	var url = '/yourteeapi/interface_user.php';
	//获取地址
	function getAddress() {
		var defer = $.Deferred();
		//获取地址
		$.ajax({
				type: 'POST',
				async: true,
				url: url,
				dataType: "json",
				data: {
					act: 'getAddress'
				}
			})
			.done(function(data) {
				if (data.returnTag == 'success') {
					defer.resolve(data)
				} else {
					defer.reject(data)
				};
			})
			.fail(function(xhr, status, err) {
				defer.reject(err);
				alert('网络错误')
			});
		return defer;
	}
	//保存
	function setAddress(data) {
		var defer = $.Deferred();
		$.ajax({
				type: 'POST',
				async: true,
				url: url,
				dataType: "json",
				data: data
			})
			.done(function(data) {
				if (data.returnTag == 'success') {
					defer.resolve()
				} else {
					defer.reject('failed')
				}
			})
			.fail(function(xhr, status, err) {
				alert('网络错误')
				defer.reject()
			});
		return defer;
	}

	return {
		get: getAddress,
		set: setAddress
	}

});