define(function (require, exports, moduel) {
	/* 支付 */
	require('../js/common/common')
	var api = require('../api/common')

	//获取列表
	var goPay = function (opts) {
		var apiMethod = ''
        var jkcardtoken = ''
		var useropenid = loginInfo.uniqueId || '';
        wx.miniProgram.getEnv(function(res) {
            if(res.miniprogram){
               jkcardtoken = window.localStorage.getItem('jkcardtoken')
               useropenid = window.localStorage.getItem('jkcardopenid')
			}
		})

		if (!opts.type) {
			throw ('pay type error')
			return
		}
		//支付宝支付
		if (opts.type == 'aliAppPay') {
			apiMethod = '/payment/aliAppPay'
		}
		//微信支付
		if (opts.type == 'wechatAppPay') {
            apiMethod = '/payment/wechatAppPay'
		}

		return resource({
			type: 'POST',
			api: apiMethod,
			token: api.token,
			data: {
				orderSn: opts.sn,
                openid: useropenid,
				jkcardtoken:jkcardtoken
                // openid: 'oZRDG0-vdFcg0BEhrXl1GYMlAiMk'
			}
		})
	}

	//一卡通支付
	var jkcardPay = function(paramsData){
		return resource({
			type: 'POST',
			api: '/payment/jkcardAppPay',
			token: api.token,
			data: paramsData
		})
	}

	return {
		goPay: goPay,
		jkcardPay:jkcardPay
	}

});