define(function (require, exports, moduel) {
	var $ = require('jquery')
	require('../common/common')
	var api = require('../../api/order')
	var notifyApi = require('../../api/notification')
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
				btnStatus: ['remove', 'comment', 'pay', 'cancel', 'detail', 'buyAgain', 'afterSale', 'confirm', 'logistics', 'invoice', 'afterSaleView'],
				itemBtnStatus: ['comment', 'afterSale', 'logistics', 'afterSaleView'],
				logisticsUrl: '',
				loading: false,
				finished: false,
				error: false,
				page: 1,
				statusArr: ['', 'pendingPayment', 'shipped', 'afterSale', 'invoice'],
				show: {
					logistics: false
				},
				curStatus: '',
				state: {
					locked: false
				},
				showMsgTip: 0,
			}
		},
		created: function () {
			this.curStatus = location.hash ? location.hash.split('#')[1] : ''
			this.getMsg()
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
			getMsg: function () {
				//获取未读消息
				if (!loginInfo.token) {
					//未登录
					return
				}
				notifyApi.getMessage({
						page: 1,
						category: 'share'
					})
					.then(function (res) {
						if (res.code == 200) {
							if (res.data.messageUnreadCount>0||res.data.promotionMessageUnreadCount>0||res.data.shareUnreadCount>0)
								app.showMsgTip=1
						}
					})
			},
			getOrderList: function (delay, out) {
				var _self = this
				delay = delay || 0
				_self.loading = true
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

							item.orderItemVOs.forEach(function (v, i) {
								var itemBtnStatus = {}
								v.options.forEach(function (v2, i2) {
									itemBtnStatus[_self.itemBtnStatus[i2]] = v2.show
								})
								v.itemBtnStatus=itemBtnStatus
							})


						})
						_self.orderList = _self.orderList.concat(data)
						_self.page++
					})
					.fail(function (res, status, err) {
						if (status === 'abort') {
							return
						}
						_self.error = true
						_self.$notify('网络错误')
					})
					.always(function () {
						_self.loading = false
					})
			},
			refresh: function () {
				//刷新订单列表
				var _self = this
				if (_self.listPromise) {
					_self.listPromise.progress(function (xhr) {
						if (_self.listPromise.state() === 'pending') {
							xhr.abort()
						}
					})
				}

				_self.page = 1
				_self.orderList = []
				_self.error = false
				_self.finished = false
				_self.listPromise = _self.getOrderList()
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
                        _self.$toast('已取消')
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
                        _self.$toast('已删除')
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
