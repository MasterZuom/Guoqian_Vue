define(function (require, exports, moduel) {
	/* 我的收藏 */
	require('../js/common/common')
	var api = require('../api/common')

	//获取列表
	var getList = function (page) {
		return resource({
			api: '/productFavorite/basedetial',
			token: api.token,
			data: {
				pageNumber: page
			}
		})
	}

	//批量添加收藏
	var batchAdd = function (opts) {
		return resource({
			type: 'POST',
			api: '/productFavorite/batchAdd',
			token: api.token,
			data: opts
		})
	}

	//删除
	var remove = function (id) {
		return resource({
			type: 'POST',
			api: '/productFavorite/delete/' + id,
			token: api.token
		})
	}

	return {
		getList: getList,
		batchAdd: batchAdd,
		remove: remove
	}

});