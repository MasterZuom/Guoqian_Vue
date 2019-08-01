define(function (require, exports, moduel) {
	require('../js/common/common')
	var api = require('../api/common')

	//保存 发票信息
	var query = function (orderId) {
		return resource({
			api: '/orderInvoice/query/' + orderId,
			token: api.token
		})
	}

	//保存 发票信息
	var save = function (opts) {
		return resource({
			api: '/orderInvoice/save',
			type: 'POST',
			token: api.token,
			params: opts
		})
	}

	//存放临时发票信息
	var temporary = function (opts) {
		return resource({
			api: '/orderInvoice/temporaryInvoice',
			type: 'POST',
			token: api.token,
			params: opts
		})
	}

	return {
		query: query,
		save: save,
		temporary: temporary
	}

});