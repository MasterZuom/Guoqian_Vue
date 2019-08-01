//common js ：通用方法
var log = console.log;



//Object.assign
var _extends = Object.assign || function (target) {
	for (var i = 1; i < arguments.length; i++) {
		var source = arguments[i];
		//遍历一个对象的自身和继承来的属性，
		//常常配合hasOwnProperty筛选出对象自身的属性
		for (var key in source) {
			//使用call方法,避免原型对象扩展带来的干扰
			if (Object.prototype.hasOwnProperty.call(source, key)) {
				target[key] = source[key];
			}
		}
	}
	return target;
};

function isPassive() {
	var supportsPassiveOption = false;
	try {
		addEventListener("test", null, Object.defineProperty({}, 'passive', {
			get: function () {
				supportsPassiveOption = true;
			}
		}));
	} catch (e) {}
	return supportsPassiveOption;
}

//是否微信中
function isWeiXin() {
	var ua = window.navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == 'micromessenger') {
		return true;
	} else {
		return false;
	}
}
var regModel = {
	float: /^\d+(\.\d+)?$/g, //只能匹配数字和小数
	int: /^\d+$/, //整数
	tel: /^1[0-9]{10}$/, //简化验证手机
	userPass: /^([0-9a-zA-Z]{6,16})$/,
	test: function (reg, val) {
		var result = this[reg].test(val);
		this.float.lastIndex = 0;
		return result;
	}
};
regModel.float.lastIndex = 0;

//Deferred
var iPromise = function (fn) {
	var defer = $.Deferred();
	fn && fn(defer.resolve, defer.reject)
	return defer.promise();
};

//跳转
var $url = function (url, opts) {
	/* opts [{key, val}] */
	iPromise(function (resolve, reject) {
		var count = 0
		if (opts && opts.length) {
			opts.forEach(function (v, i) {
				count++
				for (var attr in v) {
					localStorage.setItem(attr, JSON.stringify(v[attr]))
				}
				if (count == opts.length) {
					resolve()
				}
			})
		} else {
			resolve()
		}
	}).then(function () {
		location.href = url
	})
}


//Json
function jsonParse(obj) {
	return JSON.parse(JSON.stringify(obj));
}
//ajax
function getAjax(config) {
	//默认配置
	config.type = config.type || 'POST';
	if (config.async === false) {
		config.async = false
	} else {
		config.async = true;
	};
	// config.url = config.url || 'http://192.168.212.47:8180/mobile/api' + config.api;
	config.url = config.url || 'https://gquat.crmservices.cn/h5shop/api' + config.api;
	$.ajax({
			type: config.type,
			async: config.async, //获得数据再执行
			url: config.url,
			data: config.data,
			contentType: "",
			dataType: 'json'
		})
		.done(function (data) {
			config.done && config.done(data)
		})
		.fail(function (xhr, status, err) {
			config.fail && config.fail(xhr, status, err)
		});
};

var _ERR_STATUS = {
	networkError: 'networkError',
	dataFaild: 'failed'
}
//返回 promise 对象 ajax
function resource(config) {
	config = config || {}
	// config.apiBaseUrl = 'http://192.168.212.47:8180/mobile/api'
	config.apiBaseUrl = 'https://gquat.crmservices.cn/h5shop/api'
	config.type = config.type || 'GET'
	config.dataType = "json"
	config.url = config.url || config.apiBaseUrl + config.api;
	config.params ? config.contentType = 'application/json' : ''

	if (config.token) {
		config.headers = {
			Accept: "application/json; charset=utf-8",
			Authorization: 'GcToken:' + config.token
		}
	}
	config.data = config.data || JSON.stringify(config.params)

	return iPromise(function (resolve, reject) {
		$.ajax(config)
			.done(function (response) {
				resolve(response)
			})
			.fail(function (xhr, status, err) {
				reject(_ERR_STATUS.networkError, xhr, status, err)
			})
	})
}



//订单状态
function orderSta(sta) {
	var status = "";
	if (sta == 0) {
		status = "待付款";
	};
	if (sta == 1) {
		status = "待收货";
	};
	if (sta == 'pendingShipment') {
		status = "待发货";
	};
	if (sta == 'canceled') {
		status = "已取消";
	};
	if (sta == 'completed') {
		status = "已完成";
	};
	return status;
}



//url 参数
function getParam(name, urlString) {
	var url = urlString || location.href;
	var pattern = new RegExp("[?&]" + name + "\=([^&]+)", "g");
	var matcher = pattern.exec(url);
	var items = null;
	if (null != matcher) {
		try {
			items = decodeURIComponent(decodeURIComponent(matcher[1]));
		} catch (e) {
			try {
				items = decodeURIComponent(matcher[1]);
			} catch (e) {
				items = matcher[1];
			}
		}
	}
	return items;
};

//时间戳转换
function dateFormat(timestamp, type, fn) {
	var oDate = new Date(timestamp)
	var Y = oDate.getFullYear();
	var M = (oDate.getMonth() + 1 < 10 ? '0' + (oDate.getMonth() + 1) : oDate.getMonth() + 1);
	var D = oDate.getDate();
	var h = oDate.getHours();
	var m = oDate.getMinutes();
	var s = oDate.getSeconds();

	var result = Y + '-' + M + '-' + D
	if (type == 1) {
		result = Y + '-' + M + '-' + D
	}
	if (type == 2) {
		result = Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s
	}
	if (type == 3) {
		result = M + '-' + D + ' ' + h + ':' + m
	}
	return result
}



//分享
var shareMoudle = {
	init: function (options) {
		if (options.close === undefined) {
			options.close = true;
		}
		if (options.el === undefined) {
			options.el = 'body';
		}
		var _html;
		if (isWeiXin()) {
			wx.config({
				debug: false,
				appId: options.appId,
				timestamp: options.timestamp,
				nonceStr: options.nonceStr,
				signature: options.signature,
				jsApiList: [
					'checkJsApi',
					'onMenuShareTimeline',
					'onMenuShareAppMessage',
					'onMenuShareQQ',
					'onMenuShareWeibo'
				]
			});
			_html = '<div class="share-box">' +
				'<div class="mask-block close-method"></div>' +
				'<div class="share-img-box wx-box">' +
				'<span class="close-method close-btn">X</span>' +
				'<div class="img-wrap"><img src="images/0.png"></div>' +
				'</div>' +
				'</div>';
		} else {
			_html = '<div class="share-box">' +
				'<div class="mask-block close-method"></div>' +
				'<div class="share-img-box code-box">' +
				'<span class="share-title">' + options.title + '</span>' +
				'<span class="close-method close-btn">X</span>' +
				'<div class="img-wrap"></div>' +
				'<div class="input-wrap"><input class="share-txt"  readonly><span class="share-copy-btn" data-clipboard-target=".share-txt">复制</span></div>' +
				'</div>' +
				'</div>';
		}
		$(options.el).append(_html);
		if (options.close) {
			$('.close-method').on('click', function () {
				$('.share-box').hide();
			});
		};
	},
	baseUrl: location.origin +
		'/yourteeapi/interface.php?act=shareUrlQrcode&url=',
	renderCode: function (options) {
		options.src = this.baseUrl + options.src;
		var img;
		if (isWeiXin()) {
			wx.ready(function () {
				wx.checkJsApi({
					jsApiList: [
						'onMenuShareTimeline',
						'onMenuShareAppMessage',
						'onMenuShareQQ',
						'onMenuShareWeibo'
					]
				});
				var shareData = {
					title: options.title,
					desc: options.desc,
					link: options.link,
					imgUrl: 'http://www.yourtee.cn/yourtee2017/share.jpg',
					trigger: function (res) {
						//alert('用户点击发送给朋友');
						;
					},
					success: function (res) {
						//alert('已分享');
					},
					cancel: function (res) {
						//alert('已取消');
						;
					},
					fail: function (res) {
						//alert(JSON.stringify(res));
						;
					}
				};
				wx.onMenuShareAppMessage(shareData);
				wx.onMenuShareTimeline(shareData);
				wx.onMenuShareQQ(shareData);
				wx.onMenuShareWeibo(shareData);
			});
			wx.error(function (res) {
				alert('wx.error: ' + JSON.stringify(res));
			});
		} else {
			$('.img-wrap').html('');
			img = new Image();
			img.src = options.src;
			img.onload = function () {
				$('.img-wrap').html('<img src="' + img.src + '">')
			};
			$('.share-txt').val(options.link);
		};
		$('.share-box').show();
	}
};