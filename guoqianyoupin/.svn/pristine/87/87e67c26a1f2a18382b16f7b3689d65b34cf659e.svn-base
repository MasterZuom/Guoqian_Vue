define(function (require, exports, moduel) {
	require('../js/common/common')
	var api = require('../api/common')

	//获取订单列表
	var getList = function (opts) {
		// @status String [,pendingPayment [,shipped [,afterSale [,invoice]
		return resource({
			api: '/order/list',
			token: api.token,
			data: {
				pageNumber: opts.page,
				status: opts.status
			}
		})
	}

	//获取订单商品详情
	var orderGoods = function (itemId) {
		return resource({
			api: '/order/goReview/' + itemId,
			token: api.token
		})
	}

	//获取订单详情
	var orderDetail = function (opts) {
		return resource({
			api: '/order/detail',
			token: api.token,
			data: opts
		})
	}

	//订单保存申请售后
	var aftersaleApply = function (opts) {
		return resource({
			type: 'POST',
			api: '/aftersale/apply',
			token: api.token,
			params: opts
		})
	}

	//申请售后查询
	var aftersaleInfo = function (opts) {
		return resource({
			api: '/aftersale/addInfo',
			token: api.token,
			data: opts
		})
	}

	//订单售后详情
	var aftersaleQuery = function (opts) {
		return resource({
			type: 'POST',
			api: '/aftersale/query',
			token: api.token,
			data: opts
		})
	}

	//下单查询
	var queryBill = function (opts) {
		return resource({
			api: '/order/queryByNowList',
			token: api.token,
			data: opts
		})
	}

	//计算金额
	var calculate = function (opts) {
		return resource({
			api: '/order/calculate',
			token: api.token,
			data: opts
		})
	}

	//创建订单
	var createdOrder = function (opts) {
		return resource({
			api: '/order/buyNowAccount',
			token: api.token,
			data: opts
		})
	}

	//删除订单
	var remove = function (orderId) {
		return resource({
			api: '/order/deleteOrder/' + orderId,
			token: api.token
		})
	}


	//查看物流
	var logistics = function (orderId) {
		return resource({
			api: '/order/checkTheLogistics/' + orderId,
			token: api.token
		})
	}

	//再次购买
	var buyAgain = function (opts) {
		return resource({
			type: 'POST',
			api: '/cart/buyAgain',
			token: api.token,
			data: opts
		})
	}

	//取消订单
	var cancel = function (opts) {
		return resource({
			api: '/order/cancelOrder',
			token: api.token,
			data: opts
		})
	}

	//确认收货
	var confirm = function (orderId) {
		return resource({
			type: 'POST',
			api: '/order/receiveOrder/' + orderId,
			token: api.token
		})
	}


	return {
		getList: getList,
		orderDetail: orderDetail,
		aftersaleInfo: aftersaleInfo,
		aftersaleApply: aftersaleApply,
		aftersaleQuery: aftersaleQuery,
		queryBill: queryBill,
		calculate: calculate,
		createdOrder: createdOrder,
		remove: remove,
		buyAgain: buyAgain,
		logistics: logistics,
		cancel: cancel,
		confirm: confirm,
		orderGoods: orderGoods
	}

});