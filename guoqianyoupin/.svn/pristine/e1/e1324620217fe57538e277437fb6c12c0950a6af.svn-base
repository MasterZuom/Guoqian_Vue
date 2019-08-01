//引入配置
require.config({
	baseUrl: "libs/",
	paths: {
		"vueDev": "vue.dev",
		"vue": "vue.min",
		"jquery": "jquery-1.11.2.min",
		"commonFn": "../js/common/common",
		"pagination": "../js/jquery.pagination.min",
	},
	shim: {
		"bootstrap": ["jquery"],
		"pagination": ["jquery"]
	},
	urlArgs: "bust=" + (new Date()).getTime()
});
define(function(require, exports, moduel) {
	var $ = require('jquery');
	var Vue = require('vueDev');
	require('commonFn');
	require('../js/common/city.min');
	var app;
	//添加新地址
	app = new Vue({
		data: function() {
			return {
				addressList: [],
				currentData: {
					address: '',
					province: '',
					city: '',
					truename: '',
					mobile: '',
					id: ''
				},
				currentType: 1,
				type: {
					add: 0,
					del: 9,
					edit: 1
				},
				show: {
					addressModal: false,
					addressList: true
				}
			}
		},
		methods: {
			addNew: addNewAddress,
			edit: editAddress,
			remove: removeAddress,
			submit: submitAddress
		}
	}).$mount('.page');

	var oCity = new ui_area_loader();
	oCity.bind_elements({
		province: '#province',
		city: '#city'
	});
	var ajaxFlag = false;
	//添加
	function addNewAddress() {
		app.currentData = {};
		oCity.bind_elements({
			province: '#province',
			city: '#city'
		});
		app.show.addressModal = 1;
	}

	//获取地址
	function getAddress() {
		var defer = $.Deferred();
		//获取地址
		$.ajax({
				type: 'POST',
				async: true,
				url: '/yourteeapi/interface_user.php',
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
	//删除
	function removeAddress(item) {
		var data = {
			act: 'setAddress',
			id: item.id,
			type: app.type.del,
		};
		$.when(commit(data))
			.fail(function(data) {
				if (data === 'failed') {
					alert('删除失败');
				}
				ajaxFlag = false;
			})
			.then(getAddress)
			.done(function(data) {
				ajaxFlag = false;
				app.addressList = data.returnValue;
				app.show.addressModal = 0;
			});
	}
	//编辑
	function editAddress(item) {
		addNewAddress();
		app.currentData = item;
		app.currentType = app.type.edit;
		oCity.bind_elements({
			province: '#province',
			city: '#city'
		}, {
			province: item.province,
			city: item.city
		});
	}

	//提交处理
	function submitAddress() {
		var addressData = app.currentData,
			truename = addressData.truename,
			mobile = addressData.mobile,
			province = $('#province').val(),
			city = $('#city').val(),
			address = addressData.address,
			id = addressData.id || '';

		//var type = app.currentType;

		var data = {
			id: id,
			truename: truename,
			province: province,
			city: city,
			address: address,
			mobile: mobile,
			act: 'setAddress'
		};
		if (ajaxFlag) {
			return;
		}
		$.when(validate(data))
			.then(commit)
			.fail(function(data) {
				if (data === 'failed') {
					alert('提交失败');
				}
				ajaxFlag = false;
			})
			.then(getAddress)
			.done(function(data) {
				ajaxFlag = false;
				app.addressList = data.returnValue;
				app.show.addressModal = 0;
			});
	}
	//验证
	function validate(data) {
		var defer = $.Deferred();
		if (!data.truename) {
			alert("请输入姓名！");
			defer.reject()
			return defer;
		}
		if (!data.mobile || data.mobile.length != 11) {
			alert("请输入手机号码");
			defer.reject()
			return defer;
		}
		if (!data.address) {
			alert("请输入详细地址");
			defer.reject()
			return defer;
		}
		defer.resolve(data);
		return defer;
	};

	//提交数据
	function commit(data) {
		var defer = $.Deferred();
		ajaxFlag = true;
		$.ajax({
				type: 'POST',
				async: true,
				url: '/yourteeapi/interface_user.php',
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


});