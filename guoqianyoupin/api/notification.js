define(function (require, exports, moduel) {
	/* 我的收藏 */
	require('../js/common/common')
	var api = require('../api/common')

	//获取消息
	var getMessage = function (opts) {
		// @category String [mallNotice [promotion [message [orderNotice]
		return resource({
			api: '/member/message',
			token: api.token,
			data: {
				pageNumber: opts.page,
				category: opts.category
			}
		})
	}

	//获取通知商品列表
	var productList = function (page) {
		return resource({
			api: '/productNotify/basedetail',
			token: api.token
		})
	}

	//提交到货通知
	var addNotify = function (opts) {
		return resource({
			api: '/productNotify/add',
			token: api.token,
			data:opts
		})
	}

	//获得文章
	var article = function (opts) {
		return resource({
			api: '/acticle/detail/?articleSymbol='+opts,
			token: api.token
		})
	}

	//消息更新
	var msgUpdate = function (id) {
		return resource({
			api: '/member/message/update?messageId='+id,
			token: api.token
		})
	}

	return {
		getMessage: getMessage,
		productList: productList,
		addNotify: addNotify,
		article: article,
		msgUpdate:msgUpdate
	}

});