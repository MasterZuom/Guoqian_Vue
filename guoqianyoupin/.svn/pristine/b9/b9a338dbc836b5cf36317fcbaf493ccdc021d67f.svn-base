define(function (require, exports, moduel) {
	var $ = require('jquery')
	require('../common/common')
	var api = require('../../api/member')
	var Vue = require('vue')
	var Vant = require('vant')
	Vue.config.devtools = true
	Vue.use(Vant)

	var app = new Vue({
		data: function () {
			return {
				inviteList: [],
				loading: false,
				finished: false,
				error: false,
				page: 1,
				show: {},
			}
		},
		created: function () {},
		mounted: function () {},
		methods: {
			$url: $url,
			getInvite: function () {
				var _self = this
				_self.loading = true
				api.popularization(_self.page)
					.then(function (res) {
						if (res.code == 200) {
							_self.finished = true
							_self.inviteList = _self.inviteList.concat(res.data)
							_self.page++
						}
					})
					.fail(function () {
						_self.error = true
						_self.$notify('网络错误')
					})
					.always(function () {
						_self.loading = false
					})
			},
			refresh: function () {
				this.page = 1
				this.inviteList = []
				this.error = false
				this.finished = false
				this.getInvite()
			}
		}
	}).$mount('#page');
});