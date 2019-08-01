define(function (require, exports, moduel) {
	/* 购物车 */
	require('../js/common/common')
	var api = require('../api/common')

	//获取购物车产品
	var cartList = function (page) {
		return resource({
			api: '/cart/getUserCartItemList',
			token: api.token
		})
	}

	//修改数量
	var modifyNum = function (opts) {
		return resource({
			type: 'POST',
			api: '/cart/modify/' + opts,
			token: api.token
		})
	}

	//获取总价
	var reCalculate = function (opts) {
		return resource({
			type: 'POST',
			api: '/cart/recalculate',
			token: api.token,
			data: {
				Long: opts
			}
		})
	}

	//添加购物车
	var addCart = function (opts) {
		opts.quantity = opts.quantity || 1
		opts.inviter = opts.inviter || ''
		return resource({
			type: 'POST',
			api: '/cart/add/' + opts.skuId + '/' + opts.quantity,
			token: api.token,
			data: {
				inviter: opts.inviter
			}
		})
	}

	//购物车批量移除
	var batchRemove = function (skuIdsValue) {
		return resource({
			type: 'POST',
			api: '/cart/batch_remove/{skuIdsValue}?skuIdsValue=' + skuIdsValue,
			token: api.token
		})
	}

	//购物车推荐产品
	var recommends = function (page) {
		return resource({
			api: '/cart/getUserFavoriteProducts',
			token: api.token
		})
	}

	//获取全部图标
	var getIcon = function () {
		return resource({
			api: '/icon',
			token: api.token
		})
	}
	
	return {
		cartList: cartList,
		modifyNum: modifyNum,
		reCalculate: reCalculate,
		addCart: addCart,
		batchRemove: batchRemove,
		recommends: recommends,
		getIcon: getIcon
	}

});