define(function (require, exports, moduel) {
	/* 到货通知 */
	require('../js/common/common')
	var api = require('../api/common')

	//获取列表
	var getList = function (page) {
		return resource({
			api: '/productNotify/basedetail',
			token: api.token
		})
	}

	//提交到货通知
	var add = function (page) {
		return resource({
			api: '/productNotify/add',
			token: api.token
		})
	}

	//提交到货通知
	var del = function (id) {
		return resource({
			api: '/productNotify/delete',
			token: api.token,
			data: {
				id: id
			}
		})
	}

	return {
		getList: getList,
		add: add,
		del: del
	}

});