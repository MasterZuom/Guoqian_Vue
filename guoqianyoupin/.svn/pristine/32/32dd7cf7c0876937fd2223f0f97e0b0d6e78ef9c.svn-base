define(function (require, exports, moduel) {
	require('../js/common/common')
	var api = require('../api/common')
	/*
	 * 优惠券
	 * 礼品卡
	 * 返利
	 */

	//绑定礼品卡
	var cardBind = function (opts) {
		return resource({
			api: '/giftCard/bind',
			type: 'POST',
			token: api.token,
			params: opts
		})
	}

	//验证礼品卡
	var cardVerify = function (opts) {
		return resource({
			type: 'POST',
			api: '/giftCard/verify',
			token: api.token,
			params: opts
		})
	}

	//获取我的礼品卡
	var cards = function (opts) {
		return resource({
			api: '/giftCard/cards',
			token: api.token
		})
	}

	//礼品卡明细
	var cardDetail = function (id) {
		return resource({
			api: '/giftCard/operationDetail/' + id,
			token: api.token
		})
	}


	//我的返利
	var rebate = function (opts) {
		return resource({
			api: '/rebates/myRebate',
			token: api.token,
			params: opts
		})
	}

	//我的优惠券
	var couponList = function (opts) {
		return resource({
			api: '/coupon/queryList',
			token: api.token
		})
	}

	//我的积分
	var point = function (opts) {
		return resource({
			api: '/member/point',
			token: api.token
		})
	}

	//图片验证码
	function captchaImg(id) {
		return resource({
			api: '/captcha/image?captchaId=' + id,
			token: api.token,
			dataType: 'getUrl'
		})
	}

	//添加优惠券
	function exchangeCoupon(str) {
		return resource({
			api: '/coupon/exchange/coupon?couponCode=' + str,
			token: api.token
		})
	}


	return {
		cards: cards,
		cardBind: cardBind,
		cardDetail: cardDetail,
		cardVerify: cardVerify,
		rebate: rebate,
		couponList: couponList,
		point: point,
		captchaImg: captchaImg,
		exchangeCoupon: exchangeCoupon
	}

});