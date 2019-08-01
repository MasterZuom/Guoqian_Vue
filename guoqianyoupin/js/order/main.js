define(function (require, exports, moduel) {
	var $ = require('jquery')
	require('../common/common')
	var api = require('../../api/order')
	var Vue = require('vue')
	var Vant = require('vant')
	var nav = require('../../components/nav')
	var Lazyload = Vant.Lazyload

	Vue.use(nav)
	Vue.use(Vant)
	Vue.use(Lazyload)
	if (!loginInfo.token) {
		$url('login.html')
		return
	}
	var app = new Vue({
		data: function () {
			return {
				orderList: [],
				btnStatus: ['remove', 'comment', 'pay', 'cancel', 'detail', 'buyAgain', 'afterSale', 'confirm', 'logistics', 'invoice', ],
				loading: false,
				finished: false,
				error: false,
				page: 1,
				statusArr: ['', 'pendingPayment', 'shipped', 'afterSale', 'invoice'],
				show: {},
				curStatus: '',
				state: {
					locked: false
				}
			}
		},
		created: function () {
			this.curStatus = location.hash ? location.hash.split('#')[1] : ''
		},
		mounted: function () {
			//this.$notify('');
		},
		watch: {
			curStatus: function (val) {
				var exist = this.statusArr.filter(function (item) {
					return item === val
				})
				if (!exist.length) {
					this.curStatus = ''
					return
				}
				this.refresh()
			}
		},
		methods: {
			$url: $url,
			getOrderList: function (delay, out) {
				var _self = this
				delay = delay || 0
				_self.loading = true
				setTimeout(function () {
					return api.getList({
							page: _self.page,
							status: _self.curStatus
						})
						.then(function (res) {
							if (res.code == 200) {
								if (_self.page >= res.data.totalPage) {
									_self.finished = true
								}
								return res.data.content
							} else {
								_self.$notify('网络错误')
							}
						})
						.then(function (data) {
							var btnStatus = {}
							data.forEach(function (item) {
								btnStatus = {}
								item.options.forEach(function (v, i) {
									btnStatus[_self.btnStatus[i]] = v.show
								})
								item.btnStatus = btnStatus
							})
							log(jsonParse(data))
							_self.orderList = _self.orderList.concat(data)
							_self.page++
						})
						.fail(function () {
							_self.error = true
							_self.$notify('网络错误')
						})
						.always(function () {
							_self.loading = false
						})
				}, delay)
			},
			refresh: function () {
				//刷新订单列表
				this.page = 1
				this.orderList = []
				this.error = false
				this.finished = false
				this.getOrderList()
			},
			buyAgain: function (item) {
				//再次购买
				var _self = this
				if (_self.state.locked) {
					return
				}
				_self.state.locked = true
				var products = item.orderItemVOs
				var skuArr = []
				var quantityArr = []

				products.forEach(function (v) {
					skuArr.push(v.skuId)
					quantityArr.push(v.quantity)
				})

				if (!skuArr.length) {
					console.warn('SKU 不存在')
					return
				}

				api.buyAgain({
						inviter: '',
						quantity: quantityArr.join(','),
						skuId: skuArr.join(','),
					})
					.then(function (res) {
						$url('cart.html')
					})
					.fail(function (res) {
						if (res.status == 422) {
							this.$toast(res.responseJSON.message)
							return
						}
						_self.$notify('网络错误')
					})
					.always(function () {
						_self.state.locked = false
					})
			},
			confirmOrder: function (item) {
				//确认收货
				var _self = this
				if (_self.state.locked) {
					return
				}
				_self.state.locked = true
				api.confirm(item.id)
					.then(function (res) {
						log(res)
					})
					.fail(function (res) {
						if (res.status == 422) {
							_self.$toast(res.responseJSON.message)
							return
						}
						_self.$notify('网络错误')
					})
					.always(function () {
						_self.state.locked = false
					})
			},
			cancelOrder: function (item) {
				//取消订单
				var _self = this
				if (_self.state.locked) {
					return
				}
				_self.state.locked = true
				api.cancel({
						orderSn: item.sn
					})
					.then(function (res) {
						_self.refresh()
					})
					.fail(function (res) {
						if (res.status == 422) {
							log(res)
							_self.$toast(res.responseJSON.message)
							return
						}
						_self.$notify('网络错误')
					})
					.always(function () {
						_self.state.locked = false
					})
			},
			removeOrder: function (item) {
				//删除订单
				var _self = this
				if (_self.state.locked) {
					return
				}
				_self.state.locked = true
				api.remove(item.id)
					.then(function (res) {
						_self.refresh()
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

	window.addEventListener('hashchange', function (e) {
		app.curStatus = location.hash ? location.hash.split('#')[1] : ''
	})

	//获取订单数据


	//阻止默认事件
	// document.addEventListener('touchmove', function (e) {
	// 	e.preventDefault();
	// }, isPassive() ? {
	// 	capture: false,
	// 	passive: false
	// } : false)

});