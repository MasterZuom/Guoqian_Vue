define(function (require, exports, moduel) {
	require('../js/common/common')
	var api = require('../api/common')

	//获取所有品类
	var category = function (opts) {
		return resource({
			api: '/category/basedetail',
			token: api.token

		})
	}

	//获取品类父级
	var categoryRoot = function (opts) {
		return resource({
			api: '/category/getPartentList',
			token: api.token

		})
	}

	//获取品类子级
	var categoryList = function (parentId) {
		return resource({
			api: '/category/getChildrenList/' + parentId,
			token: api.token
		})
	}


	return {
		category: category,
		categoryRoot: categoryRoot,
		categoryList: categoryList
	}



});