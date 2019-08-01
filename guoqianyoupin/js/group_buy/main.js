define(function (require, exports, moduel) {
	var $ = require('jquery')
	require('../common/common')
	var api = require('../../api/activity')
	var Vue = require('vue')
	var Vant = require('vant')

	Vue.config.devtools = true
	Vue.use(Vant)

	var app = new Vue({
		data: function () {
			return {
				list: [],
				loading: false,
				finished: false,
				page: 1,
				show: {},
				totalPage: ''
			}
		},
		created: function () {
			//getMyReviewList(1)
		},
		mounted: function () {
			//this.$notify('');
		},
		methods: {
			$url: $url,
			getGroupList: function () {
				var _self = this
				api.groupList()
					.then(function (res) {
						if (res.code == 200) {
							_self.loading = false
							if (_self.page >= res.data.totalPage) {
								_self.finished = true
							}
							return res.data.content
						} else {
							_self.$notify('网络错误');
						}

					})
					.then(function (data) {
						_self.list = _self.list.concat(data)
						_self.page++
					})
					.fail(function () {
						_self.$notify('网络错误');
					})
					.always(function () {
						_self.loading = false;
					})
			}
		}
	}).$mount('#page');


});