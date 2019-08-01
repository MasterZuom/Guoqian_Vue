define(function (require, exports, moduel) {
	var $ = require('jquery')
	require('../common/common')
	var api = require('../../api/order')
	var Vue = require('vue')
	var Vant = require('vant')
	require('../../components/clipboard')
	Vue.use(Vant)
	Vue.use(VueClipboard)

	var app = new Vue({
		data: function () {
			return {
				orderSn: '',
				orderData: {
					btnStatus: {}
				},
				btnStatus: ['remove', 'comment', 'pay', 'cancel', 'detail', 'buyAgain', 'afterSale', 'confirm', 'logistics', 'invoice', 'afterSaleView'],
				itemBtnStatus: ['comment', 'afterSale', 'logistics', 'afterSaleView'],
				logisticsUrl: '',
				show: {
					pageLoading: false
				},
				loading: false,
				finished: false,
				error: false,
				page: 1,
				show: {
					pageLoading: false,
					logistics: false
				},
				curStatus: '',
				state: {
					locked: false
				},
			}
		},
		created: function () {
			this.orderSn = getParam('sn')
			if (!this.orderSn) {
				$url('order_list.html')
				return
			}
			this.getDetail()
		},
		mounted: function () {
			//this.$notify('');
		},
		watch: {

		},
		methods: {
			$url: $url,
			getDetail: function () {
				//获取定订单信息
				var _self = this
				this.show.pageLoading = true
				return api.orderDetail({
						orderSn: this.orderSn
					})
					.then(function (res) {
						if (res.code == 200) {
							res.data.time = dateFormat(res.data.createdDate, 2)
							var btnStatus = {}
							res.data.options.forEach(function (v, i) {
								btnStatus[_self.btnStatus[i]] = v.show
							})

							res.data.orderItemVOs.forEach(function (v, i) {
								var itemBtnStatus = {}
								v.options.forEach(function (v2, i2) {
									itemBtnStatus[_self.itemBtnStatus[i2]] = v2.show
								})
								v.itemBtnStatus = itemBtnStatus
							})

							res.data.btnStatus = btnStatus
							_self.orderData = res.data
						}
					})
					.fail(function () {
						_self.$notify('网络错误')
					})
					.always(function () {
						_self.show.pageLoading = false
					})
			},
			onCopy: function (e) {
				this.$toast('复制成功')
			},
			onError: function (e) {
				this.$toast('复制失败')
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
				var itemBtnStatus = []

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
							_self.$toast(res.responseJSON.message)
							return
						}
						_self.$notify('网络错误')
					})
					.always(function () {
						_self.state.locked = false
					})
			},
			logistics: function (delivery,trackNo) {
				//查看物流
				var _self = this

                wx.miniProgram.getEnv(function(res) {
                    if(res.miniprogram){
                        // true代表在小程序里
                        _self.$toast('关注国乾优品公众号，进入商城查看物流详情')
                    }else{
                        //false代表在公众号里
                        _self.logisticsUrl = ''

                        KDNWidget.run({
                            serviceType: "A",
                            expCode: delivery,
                            expNo: trackNo,
                        })
                    }
                })

				/*
				api.logistics(item.id)
					.then(function (res) {
						if (res.code == 200) {
							_self.show.logistics = true
							_self.logisticsUrl = res.data.url.requestUrl
						}
					})
					.fail(function () {
						_self.$notify('网络错误')
					})*/
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
						_self.$toast(res.message)
						_self.refresh()
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



	//阻止默认事件
	// document.addEventListener('touchmove', function (e) {
	// 	e.preventDefault();
	// }, isPassive() ? {
	// 	capture: false,
	// 	passive: false
	// } : false)

});