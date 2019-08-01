define(function (require, exports, moduel) {
	require('../js/common/common')
	var api = require('../api/common')

	//拼团
	var groupList = function (page) {
		return resource({
			api: '/activity/basedetail',
			token: api.token,
			data: {
				pageNumber: page
			}
		})
	}




	//活动团购/秒杀列表
	var list = function (opts) {
		//type: [groupBuy, flashSale]
		return resource({
			api: '/activity/list',
			token: api.token,
			data: opts
		})
	}


	//拼团
	var skuList = function (opts) {
		/* 
		 * @params
		 * activityId
		 * activityType: [groupBuy, flashSale]
		 */
		return resource({
			api: '/activity/sku/list',
			token: api.token,
			data: opts
		})
	}

	return {
		groupList: groupList,
		skuList: skuList,
		list: list
	}

});