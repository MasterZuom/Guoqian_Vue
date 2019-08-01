define(function (require, exports, moduel) {
	var $ = require('jquery')
	require('../common/common')
	var api = require('../../api/cart')
	var notifyApi = require('../../api/notification')
	var favorApi = require('../../api/goods_favor')
	var Vue = require('vue')
	var nav = require('../../components/nav')
	var Vant = require('vant')
	var Lazyload = Vant.Lazyload

	Vue.use(nav)
	Vue.use(Vant)
	Vue.use(Lazyload)

	var filters = {
		all: function (items) {
			return items
		},
		active: function (items) {
			return items.filter(function (item) {
				return item.active
			})
		},
		cancelled: function (items) {
			return items.filter(function (item) {
				return !item.active
			})
		}
	};
	if (!loginInfo.token) {
		$url('login.html')
		return
	}
	var handelDefer;
	var app = new Vue({
		data: function () {
			return {
				cartList: [],
				page: 1,
				maxSkuQuantity: 999999,
				subtotal: '0.00',
				subNum: '0',
				cartNum: 0,
				price: {
					promotionDiscount: 0,
					promotions: []
				},
				recommends: [],
				show: {
					canBack: false,
					loading: 0,
					editBtn: 1, //编辑按钮
					doneBtn: 0, //完成按钮
					editBar: 0, //编辑模块
					handleBar: 1, //结算模块
					tipsBar: 0, //提示层
					confirm: 0 //删除确认
				},
				removeLength: 0,
				finished: false,
				loading: false,
				error: false,
				showMsgTip: 0
			}
		},
		created: function () {
			var canBack = getParam('back')
			if (canBack === 'true') {
				this.show.canBack = true
			}
			this.cartNum = Number(window.localStorage.getItem('cartNum')) || 0
			this.getCartList()
				.always(this.getRecommends)
			this.getMsg()
		},
		mounted: function () {
			//this.$notify('');
		},
		computed: {
			checkedAll: {
				get: function () {
					if (!this.cartList.length) {
						return false
					}
					return filters.cancelled(this.cartList).length === 0
				},
				set: function (value) {
					this.cartList.forEach(function (item) {
						item.active = value
					})
				}
			},
			skuArr: function () {
				var selectedItems = filters.active(this.cartList)
				var skuArr = []
				selectedItems.forEach(function (v, i) {
					skuArr.push(v.skuID)
				})
				return skuArr
			},
			totalNum: function () {
				var selectedItems = filters.active(this.cartList)
				var num = 0
				selectedItems.forEach(function (v, i) {
					num += Number(v.skuQuantity)
				})
				return num
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
			getCartList: function () {
				//获取购物车列表
				var _self = this
				_self.loading = true
				return api.cartList()
					.then(function (res) {
						if (res.code == 200) {
							return res.data
						} else {
							//_self.$notify('网络错误');
						}
					})
					.then(function (data) {
						_self.finished = true
						data.forEach(function (v) {
							v.active = 0
						})
						_self.cartList = data

						var cartNum = 0
						data.forEach(function (v) {
							cartNum += Number(v.skuQuantity)
						})
						_self.cartNum = cartNum
						window.localStorage.setItem('cartNum', cartNum)
					})
					.fail(function () {
						//_self.error = true
						//_self.$notify('网络错误');
					})
					.always(function () {
						_self.loading = false
					})
			},
			showEditBar: function () {
				this.show.editBtn = 0
				this.show.editBar = 1
			},
			editDone: function () {
				this.show.editBtn = 1
			},
			inputFocus: function (item) {
				item.currentNum = item.skuQuantity
			},
			changeNum: function (item) {
				//修改数量
				var newVal = item.skuQuantity
				var oldVal = item.currentNum
				if (!regModel.test('int', newVal)) {
					this.quantity = oldVal
					return
				}
				modifyNum(item)
					.then(function () {
						if (item.active) {
							getTotalPrice(app.skuArr)
						}
					})
			},
			minus: function (item) {
				if (item.skuQuantity <= 1) {
					return
				}
				item.skuQuantity--
				clearTimeout(handelDefer)
				modifyNum(item)
					.then(function () {
						if (item.active) {
							getTotalPrice(app.skuArr)
						}
					})
			},
			plus: function (item) {
				if (item.skuQuantity >= this.maxSkuQuantity) {
					return
				}
				item.skuQuantity++
				clearTimeout(handelDefer)
				modifyNum(item)
					.then(function () {
						if (item.active) {
							getTotalPrice(app.skuArr)
						}
					})
			},
			selectItem: function (item) {
				item.active = !item.active
				getTotalPrice(this.skuArr)
			},
			selectAll: function () {
				this.checkedAll = !this.checkedAll
				getTotalPrice(this.skuArr)
			},
			showRemoveConfirm: function () {
				//删除确定
				var skuData = []
				this.cartList.forEach(function (v) {
					if (v.active) {
						skuData.push(v.skuID)
					}
				})
				this.removeLength = skuData.length
				if (!skuData.length) {
					return
				}
				this.show.confirm = 1
			},
			removeItems: function () {
				//执行删除
				var _self = this
				var skuData = []
				this.cartList.forEach(function (v) {
					if (v.active) {
						skuData.push(v.skuID)
					}
				})
				if (!skuData.length) {
					return
				}
				_self.show.loading = true
				var skuIds = skuData.join(',')
				this.show.confirm = 0
				api.batchRemove(skuIds)
					.then(function (res) {
						_self.getCartList()
					})
					.fail(function () {
						_self.$notify('网络错误');
					})
					.always(function () {
						_self.show.loading = false
					})
			},
			addFavorite: function () {
				//添加收藏
				var _self = this
				var skuIdArr = []
				_self.cartList.forEach(function (v) {
					if (v.active) {
						skuIdArr.push(v.skuID)
					}
				})
				if (!skuIdArr.length) {
					_self.$toast('请选择要收藏的商品')
					return
				}
				favorApi.batchAdd({
						skuIdsValue: skuIdArr.join()
					})
					.then(function (res) {
						_self.$toast(res.message)
					})
					.fail(function () {
						_self.$notify('网络错误');
					})
			},
			checkBill: function () {
				//结算
				var skuData = []
				this.cartList.forEach(function (v) {
					if (v.active) {
						skuData.push({
							skuId: v.skuID,
							quantity: v.skuQuantity
						})
					}
				})
				if (!skuData.length) {
					this.$toast('请选择要购买的商品')
					return
				}
				var val = JSON.stringify(skuData)
				// $url('confirmorder.html?sku=' + val + '&buyItNow=false')
                window.localStorage.setItem('cartGoods', val)
                $url('confirmorder.html?buyItNow=false')
			},
			getRecommends: function () {
				//底部推荐
				var _self = this
				api.recommends()
					.then(function (res) {
						if (res.code == 200) {
							_self.recommends = res.data
						}
					})
			}
		}
	}).$mount('#page');



	//修改数量
	function modifyNum(item) {
		return iPromise(function (resolve, reject) {
			handelDefer = setTimeout(function () {
				api.modifyNum(item.skuID + '/' + item.skuQuantity)
					.then(function (res) {
						var cartNum = 0
						app.cartList.forEach(function (v) {
							cartNum += Number(v.skuQuantity)
						})
						app.cartNum = cartNum
						window.localStorage.setItem('cartNum', cartNum)
						item.skuSubtotal = res.subtotal
						resolve()
					})
					.fail(function (res) {
						if (res.status == 422) {
							app.$toast(res.responseJSON.message)
							item.skuQuantity = 1
							modifyNum(item)
							return
						}
						//app.$notify('网络错误');
					})
			}, 300)
		})
	}

	//获取总价
	function getTotalPrice(skuArr) {
		if (!skuArr.length) {
			app.price.promotions = []
			app.subtotal = '0.00'
			return
		}
		api.reCalculate(skuArr)
			.then(function (res) {
				if (res.code == 200) {
					if (!app.skuArr.length) {
						return
					}
					app.price = {
						promotionDiscount: res.data.promotionDiscount,
						promotions: res.data.promotions
					}
					app.subtotal = res.data.subtotal
				}
			})
			.fail(function () {
				//app.$notify('网络错误');
			})
	}




});
