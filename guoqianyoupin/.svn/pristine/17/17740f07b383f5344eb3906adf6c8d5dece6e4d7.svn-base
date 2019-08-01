define(function (require, exports, moduel) {
	var $ = require('jquery')
	require('../common/common')
	var favorApi = require('../../api/goods_favor')
	var cartApi = require('../../api/cart')
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
		created: function () {

		},
		mounted: function () {},
		methods: {
			$url: $url,
			getProductList: function () {
				var _self = this
				_self.finished = false
				_self.loading = true
				favorApi.getList(_self.page)
					.then(function (res) {
						if (res.code == 200) {
							if (_self.page >= res.data.totalPage) {
								_self.finished = true
							}
							return res.data.content
						}
					})
					.then(function (data) {
						_self.productList = _self.productList.concat(data)
						_self.page++
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
				this.productList = []
				this.error = false
				this.finished = false
				this.getProductList()
			},
			cancelFavor: function (item) {
				//取消收藏
				var _self = this
				favorApi.remove(item.productId)
					.then(function (res) {
						_self.$toast({
							message: res.message,
							duration: 1000
						})
						_self.refresh()
					})
					.fail(function () {
						_self.$notify('网络错误');
					})
			},
			addtoCart: function (item) {
				var _self = this;
				cartApi.addCart({
						skuId: item.skuId
					})
					.then(function (res) {
						_self.$toast({
							message: res.message,
							duration: 1000
						})
					})
					.fail(function () {
						_self.$notify('网络错误');
					})
			}
		}
	}).$mount('#page');
});