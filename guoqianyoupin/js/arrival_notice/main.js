define(function (require, exports, moduel) {
	var $ = require('jquery')
	require('../common/common')
	var api = require('../../api/arrival_notice')
	var Vue = require('vue')
	var Vant = require('vant')
	Vue.config.devtools = true
	Vue.use(Vant)


	var app = new Vue({
		data: function () {
			return {
				productList: [],
				loading: false,
				finished: false,
				error: false,
				page: 1,
				show: {},
			}
		},
		created: function () {},
		mounted: function () {
			//this.$notify('');
		},
		methods: {
			$url: $url,
			delItem: function (id) {
				var _self = this
				api.del(id)
				.then(function (res) {
					if (res.code == 200) {
						_self.$toast({
							message: res.message,
							duration: 1000
						})
						_self.refresh()
					} else {
						_self.error = true
						app.$notify('网络错误');
					}
				})
				.fail(function () {
					app.$notify('网络错误');
				})
			},
			refresh: function () {
				this.page = 1
				this.productList = []
				this.error = false
				this.finished = false
				this.getProductList()
			},
			getProductList: function () {
				var _self = this
				_self.finished = false
				_self.loading = true
				api.getList(app.page)
					.then(function (res) {
						if (res.code == 200) {
							if (_self.page >= res.data.totalPage) {
								_self.finished = true
							}
							return res.data.content
						} 
					})
					.then(function (data) {
						app.productList = app.productList.concat(data)
						app.$nextTick(function () {
							app.page++
							app.loading = false
						})
					})
					.fail(function () {
						app.$notify('网络错误');
					})
					.always(function () {
						_self.loading = false
					})
			}
		}
	}).$mount('#page');





});