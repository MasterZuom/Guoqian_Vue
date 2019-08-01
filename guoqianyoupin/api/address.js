define(function (require, exports, moduel) {
	require('../js/common/common')
	var api = require('../api/common')

	//获取已有地址
	var getAddressList = function (page) {
		return resource({
			api: '/receiver/query',
			token: api.token,
			data: {
				pageNumber: page
			}
		})
	}

	//获取指定地址
	var getAddress = function (id) {
		return resource({
			api: '/receiver/receiverInfo/' + id,
			token: api.token
		})
	}

	//删除地址
	var deleteAddress = function (opts) {
		return resource({
			type: 'POST',
			api: '/receiver/delete',
			token: api.token,
			data: {
				addressId: opts
			}
		})
	}

	//获取省
	var queryProList = function () {
		return resource({
			api: '/area/queryProList',
			token: api.token
		})
	}

	//获取市
	var queryCityList = function () {
		return resource({
			api: '/area/queryCityList',
			token: api.token
		})
	}

	//获取区
	var queryRegList = function (page) {
		return resource({
			api: '/area/queryRegList',
			token: api.token
		})
	}

	//保存地址
	var saveAddress = function (opts) {
		return resource({
			type: 'POST',
			api: '/receiver/saveReciver',
			token: api.token,
			params: opts
		})
	}

	//门店地址清单
	var shopAddress = function (opts) {
		return resource({
			api: '/storeAddress/getStoreAddressL',
			token: api.token
		})
	}

	return {
		getAddress: getAddress,
		deleteAddress: deleteAddress,
		saveAddress: saveAddress,
		getAddressList: getAddressList,
		queryProList: queryProList,
		queryCityList: queryCityList,
		queryRegList: queryRegList,
		shopAddress: shopAddress
	}


});