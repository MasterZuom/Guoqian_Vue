define(function (require, exports, moduel) {
	var $ = require('jquery')
	require('../common/common')
	var api = require('../../api/consultation')
	var cartApi = require('../../api/cart')
	var goodsApi = require('../../api/goods')
	var Vue = require('vue')
	var Vant = require('vant')
	Vue.use(Vant)

	if (!loginInfo.token) {
		$url('login.html')
		return
	}

	var app = new Vue({
		data: function () {
			return {
				goodsId: '',
				goodsData: {},
				skuId: '',
				content: '',
				loading: false,
				finished: false,
				page: 1,
				show: {},
				state: {
					locked: false
				},
				totalPage: ''
			}
		},
		created: function () {
			this.goodsId = getParam('id') || ''
			this.getGoodsDetail()
		},
		mounted: function () {
			//this.$notify('');
		},
		methods: {
			$url: $url,
			getGoodsDetail: function () {
				var _self = this
				return goodsApi.productDetail({
						productId: _self.goodsId,
					})
					.then(function (res) {
						log(jsonParse(res.data))
						var data;
						if (res.code == 200) {
							data = res.data
							_self.skuId = data.skuId
							_self.goodsData = data
						}
					})
			},
			addCart: function () {
				//添加购物车
				if (!loginInfo.token) {
					$url('login.html')
					return
				}
				var _self = this;
				cartApi.addCart({
						skuId: _self.skuId,
						quantity: 1
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
			},
			commit: function () {
				var _self = this
				if (_self.state.locked) {
					return
				}
				_self.state.locked = true
				api.save({
						id: _self.goodsId,
						content: _self.content
					})
					.then(function (res) {
						_self.$toast({
							message: res.message,
							duration: 1000
						})
						setTimeout(function () {
							window.history.back(-1)
						}, 1100)
					})
					.fail(function () {
						_self.$notify('网络错误')
					})
					.always(function () {
						_self.state.locked = false
					})
			}
		}
	}).$mount('#page');




});