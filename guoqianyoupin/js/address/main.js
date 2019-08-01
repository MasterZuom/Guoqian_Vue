define(function (require, exports, moduel) {
	var $ = require('jquery')
	require('../common/common')
	var api = require('../../api/address')
	var Vue = require('vue')
	// var Vant = require('vant')
	// Vue.config.devtools = true
	// Vue.use(Vant)

	var app = new Vue({
		data: function () {
			return {
				address: [],
				page: 1,
				loading: false,
				finished: false,
				error: false,
				show: {},
			}
		},
		created: function () {
			this.getAddressList()
		},
		mounted: function () {
			//this.$notify('');
		},
		methods: {
			$url: $url,
			getAddressList: function () {
				var _self = this
				this.loading = true
				api.getAddressList(this.page)
					.then(function (res) {
						log(res)
						if (res.code == 200) {
							_self.address = _self.address.concat(res.data)
							// if (_self.page >= res.data.totalPage) {
							// 	_self.finished = true
							// }
							_self.finished = true
							_self.page++
						}
					})
					.fail(function () {
						_self.error = true
						_self.$notify('网络错误')
					})
					.always(function () {
						_self.loading = false;
					})
			}
		}
	}).$mount('#page');






});