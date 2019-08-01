define(function (require, exports, moduel) {
	require('../js/common/common')
	var api = require('../api/common')

	//拼团
	var groupList = function (page) {
		return resource({
			api: '/group/basedetail',
			token: api.token,
			data: {
				pageNumber: page
			}
		})
	}

	return {
		groupList: groupList
	}

});