define(function (require, exports, moduel) {
	var $ = require('jquery')
	require('../common/common')
	var api = require('../../api/member')
	var Vue = require('vue')
	var Vant = require('vant')
	Vue.use(Vant)


	var app = new Vue({
		data: function () {
			return {
				name: '',
				show: {
					share: false,
					rules: false
				},
				light:0,
				frontCamera:0,
				qrcodeVal:''
			}
		},
		mounted: function () {

			var _self = this
			if (typeof (QRScanner) != 'undefined') {
		        QRScanner.prepare(onDone);
		    } else {
		    	_self.$notify('摄像启用失败请检查权限')
		        history.back(-1)
		    }


		    function onDone(err, status) {
		        if (err) {
		            console.error(err);
		            QRScanner.cancelScan();
		            QRScanner.hide();
	            	QRScanner.destroy();
	            	history.back(-1)
		        }
		        if (status.authorized) {
		            QRScanner.scan(displayContents);
		            function displayContents(err, text) {
		                if (err) {
		                	QRScanner.cancelScan();
				            QRScanner.hide();
			            	QRScanner.destroy();
		                    history.back(-1)
		                } else {
		                	var qrStr = text;
		                	if (qrStr.indexOf("flashSale") == -1&&qrStr.indexOf("groupBuy") == -1&&qrStr.indexOf("general") == -1&&qrStr.indexOf("login") == -1&&qrStr.indexOf("flag") == -1)
		                	{
		                		//登录扫码
		                		api.qrcodeLogin(qrStr)
								.then(function (res) {
									if (res.code == 200) {
										_self.$notify(res.data)
										QRScanner.cancelScan();
							            QRScanner.hide();
						            	QRScanner.destroy();
										history.back(-1)
									} else {
										QRScanner.cancelScan();
							            QRScanner.hide();
						            	QRScanner.destroy();
										history.back(-1)
									}
								})
								.fail(function () {
									_self.$notify('请扫描国乾官网二维码')
									QRScanner.cancelScan();
						            QRScanner.hide();
					            	QRScanner.destroy();
					            	history.back(-1)
								})
		                	}
		                	else 
		                	{
		                		var flag = getParam("flag",qrStr)
		                		if (flag=="login")
		                		{

		                			var session = getParam("sessionId",qrStr)
		                			api.qrcodeLogin(session)
									.then(function (res) {
										if (res.code == 200) {
											_self.$toast({
												message: res.data,
												duration: 1000
											});
											QRScanner.cancelScan();
								            QRScanner.hide();
							            	QRScanner.destroy();
											history.back(-1)
										} else {
											QRScanner.cancelScan();
								            QRScanner.hide();
							            	QRScanner.destroy();
											history.back(-1)
										}
									})
									.fail(function () {
										_self.$toast({
											message: '请扫描国乾官网二维码',
											duration: 1000
										});
										QRScanner.cancelScan();
							            QRScanner.hide();
						            	QRScanner.destroy();
						            	history.back(-1)
									})
		                		}
		                		else if (flag)
		                		{
		                			var id = getParam("productId",qrStr)
		                			var activity = getParam("activitySkuId",qrStr)
		                			var type = getParam("productType",qrStr)
		                			var sn = getParam("groupSn",qrStr)
		                			//团购跳转
			                		var redirectUrl = "goods_detail.html?id="+id
			                		if (type=="flashSale"||type=="groupBuy")
			                			redirectUrl = redirectUrl + "&type="+type
			                		if (activity)
			                			redirectUrl = redirectUrl + "&activitySkuId="+activity
			                		if (sn)
			                			redirectUrl = redirectUrl + "&groupSn="+sn
			                		QRScanner.cancelScan();
						            QRScanner.hide();
					            	QRScanner.destroy();
			                		location.href=redirectUrl
		                		}
		                		else
		                		{
		                			QRScanner.cancelScan();
						            QRScanner.hide();
					            	QRScanner.destroy();
		                			history.back(-1)
		                		}
		                	}
		                }
		            }
		            QRScanner.show();
		 
		        } else if (status.denied) {
		            location.href='index.html'
		        } else {
		        	QRScanner.cancelScan();
					QRScanner.hide();
					QRScanner.destroy();
		            location.href='index.html'
		        }
		    }
		},
		methods: {
			clickLight: function() {
				if (!app.light) {
			        QRScanner.enableLight();
			        app.light=1
			    } else {
			        QRScanner.disableLight();
			        app.light=0
			    }
			},
			changeCamera: function (){
				if (!app.frontCamera) {
			        QRScanner.useFrontCamera();
			        app.frontCamera=1
			    } else {
			        QRScanner.useBackCamera();
			        app.frontCamera=0
			    }
			},
			goBack: function() {
	            QRScanner.cancelScan();
	            QRScanner.hide();
	            QRScanner.destroy();
				location.href='index.html'
			}
			
		}
	}).$mount('#page');

	function getParam(paramName,href) {
		var reg = new RegExp('(^|&)' + paramName + '=([^&]*)(&|$)', 'i');
		var r = href.match(reg);
		if (r != null) {
			return unescape(r[2]);
		}
		return null;
	}

});