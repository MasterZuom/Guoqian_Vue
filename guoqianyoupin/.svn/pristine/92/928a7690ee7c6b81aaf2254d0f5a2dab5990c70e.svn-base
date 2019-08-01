define(function (require, exports, moduel) {
	require('../js/common/common')
	var api = require('../api/common')

	//会员权益
	var benefit = function (opts) {
		return resource({
			api: '/member/benefit',
			token: api.token
		})
	}

	//会员等级权益
	var benefitRank = function (rankId) {
		return resource({
			api: '/member/benefit/' + rankId,
			token: api.token
		})
	}

	//会员信息
	var introduce = function (opts) {
		return resource({
			api: '/member/introduce',
			token: api.token
		})
	}

	//会员信息
	var info = function (opts) {
		return resource({
			api: '/member/info',
			token: api.token
		})
	}
	//更新会员信息
	var update = function (opts, member) {
		return resource({
			type: 'POST',
			api: '/member/update',
			token: api.token,
			params: opts
		})
	}

	//我的推广
	var popularization = function (opts) {
		return resource({
			api: '/member/popularization',
			token: api.token
		})
	}

	//安全退出
	var logout = function (opts) {
		return resource({
			api: '/member/cancletoken',
			token: api.token
		})
	}

	//扫码登录
	var qrcodeLogin = function (text) {
		return resource({
			type: 'POST',
			api: '/login/verifyScanLogin/?sessionId='+text,
			token: api.token
		})
	}


	return {
		info: info,
		introduce: introduce,
		benefit: benefit,
		update: update,
		benefitRank: benefitRank,
		popularization: popularization,
		logout: logout,
		qrcodeLogin: qrcodeLogin
	}


});