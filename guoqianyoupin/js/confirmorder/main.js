define(function (require, exports, moduel) {
	'use strict'
	require('jquery')
	require('../common/common')
	var orderApi = require('../../api/order')
	var addressApi = require('../../api/address')
	var couponApi = require('../../api/coupon')
    var api = require('../../api/common')
	var getArea = require('../address/area')
	var Vue = require('vue')
	var Vant = require('vant')
	var Lazyload = Vant.Lazyload

	Vue.use(Vant)
	Vue.use(Lazyload)

	if (!loginInfo.token) {
		$url('login.html')
		return
	}

	var app = new Vue({
		data: function () {
			return {
				sku: [],
				skuIds: '',
				quantities: '',
				orderType: 'general',
				groupSn: '',
				inviter: '',
				bill: {},
				memo: '',
				coupons: {
					usable: [],
					unusable: []
				},
				couponTemporary: {},
				cardTemporary: {},
				selectedCoupon: {},
				selectedCard: {},
				cards: [],
				rebate: '',
				statements: {},
				shops: [],
				shopTemporary: {},
				selectedShop: {},
				addrPage: 1,
				address: [],
				selectedAddr: {},
				shippingMethodId: 1,
				shippings: {
					normal: {},
					shop: {}
				},
				areaCode: {},
				areaIdData: {},
				areaList: {
					province_list: {},
					city_list: {},
					county_list: {}
				},
				addrEdit: {
					areaId: '',
					seletArea: [],
					member: '',
					address: {
						consignee: '',
						areaId: '',
						areaName: '',
						default: true,
						id: 0,
						memberId: '',
						phone: '',
						zipCode: '0',
						address: ''
					},
					dftArea: '110100'
				},
				invoiceTemporary: {
					needInvoice: 'false',
					bankAcount: '',
					bankName: '',
					company: '',
					invoiceTitle: '',
					payerType: 'PERSONAL', //PERSONAL/ COMPANY
					receiverAddress: '',
					receiverName: '',
					receiverPhone: '',
                    receiverEmail: '',
					receiverProvince: '',
					registerAddress: '',
					registerPhone: '',
					taxpayer: '',
					invoiceContent: '商品明细',
					invoiceType: 'COMMON' //COMMON(普票)/SPECIAL(专票)
				},
				invoiceData: {},
				show: {
					invoice: false,
					coupon: false,
					cards: false,
					addressList: false,
					addressEdit: false,
					shops: false,
					pageLoading: true,
					loading: true,
					area: false,
					couponTab: 1,
					payType:false
				},
				state: {
					init: true,
					addrLoading: false,
					addrFinished: false,
					addrError: false,
					areaLoading: false,
					invoice: {
						request: false, //是否开票
						type: 1, //发票类型
						payerType: 1 //发票抬头
					},
					shopFinished: false,
					shopError: false,
					shopLoading: false,
					lockOrder: false, //订单锁定
					payType:0 // online在线支付  jkcardPay一卡通支付
				},
				newCouponSn: '',
                jkCardMember: -1, //非一卡通用户
                jkCardBalance:0 //一卡通余额
			}
		},
		created: function () {
			var _self = this
			// this.sku = JSON.parse(getParam('sku')) || []
			this.sku = JSON.parse(window.localStorage.getItem('cartGoods')) || []
			if (!this.sku.length) {
				this.$toast('操作有误')
				window.history.back(-1)
				return
			}

			this.orderType = getParam('type') || 'general'
			this.buyItNow = getParam('buyItNow') || 'true'
			this.groupSn = getParam('groupSn') || ''
			this.inviter = getParam('inviter') || ''

			var skuIdArr = []
			var quantities = []
			this.sku.forEach(function (v) {
				skuIdArr.push(v.skuId)
				quantities.push(v.quantity)
			})
			this.skuIds = skuIdArr.join(',')
			this.quantities = quantities.join(',')
			this.queryByNowList()
				.done(function () {
					//初始化地址
					_self.getAddressList()
				})
				.then(function () {
					return _self.calculate()
				})
				.always(function () {
					_self.state.init = false
					_self.show.pageLoading = false
				})


			this.state.areaLoading = true
			this.addrEditNormal = jsonParse(this.addrEdit)
			this.areaPromiss = getArea()
				.done(function (data) {
					_self.areaList.province_list = data.proList
					_self.areaList.city_list = data.cityList
					_self.areaList.county_list = data.countyList
					_self.areaIdData = data.areaIdData
					_self.areaCode = data.areaCode
					_self.state.areaLoading = false
				})

			this.invoiceData = jsonParse(this.invoiceTemporary)

			this.getJkcardInfo();
		},
		mounted: function () {
			//this.$notify('');
		},
		watch: {
			'show.coupon': function (v) {
				var _self = this
				if (!v) {
					return
				}
				this.coupons.usable.forEach(function (item) {
					item.active = false
					if (item.id === _self.selectedCoupon.id) {
						item.active = true
						_self.couponTemporary = item
					}
				})
			},
			'show.cards': function (v) {
				var _self = this
				if (!v) {
					return
				}
				this.cards.forEach(function (item) {
					item.active = false
					if (item.id === _self.selectedCard.id) {
						item.active = true
						log(item.id)
						_self.cardTemporary = item
					}
				})
			},
			'show.shops': function (v) {
				var _self = this
				if (!v) {
					return
				}
				this.shops.forEach(function (item) {
					item.active = false
					if (item.name === _self.selectedShop.name) {
						item.active = true
						_self.shopTemporary = item
					}
				})
			},
			'show.invoice': function (v) {
				if (v) {
					this.invoiceTemporary = jsonParse(this.invoiceData)
				}
			},
			rebate: function (v) {
				if (v < 0 || v > this.bill.rebateBalance || !regModel.test('float', v)) {
					this.rebate = this.bill.rebateBalance
					return
				}
				if (!this.state.init) {
					this.calculate(true)
				}
			},
			shippingMethodId: function () {
				if (!this.state.init) {
					this.calculate(true)
				}
			},
			selectedAddr: function () {
				if (!this.state.init) {
					this.calculate(true)
				}
			},
			selectedCoupon: function () {
				if (!this.state.init) {
					this.calculate(true)
				}
			},
			selectedCard: function () {
				if (!this.state.init) {
					this.calculate(true)
				}
			}

		},
		computed: {
			invoiceType1: function () {
				var _state = this.state.invoice
				var result = false
				if (_state.request) {
					if (_state.type == 1 && _state.payerType == 2) {
						result = true
					}
					if (_state.type == 2) {
						result = true
					}
				}
				return result
			},
			invoiceType2: function () {
				var _state = this.state.invoice
				var result = false
				if (_state.request && _state.type == 2) {
					result = true
				}
				return result
			}
		},
		methods: {
			$url: $url,
            scrollTop:function () {
                window.scrollTo(0,0);
            },
			switchTab: function () {},
            getJkcardInfo:function () {//获取一卡通信息
                var _self = this;
                resource({
                    type: 'POST',
                    api: '/jkcardPay/getUserInfo',
                    token: api.token,
                    params: {
                        mobile:api.userName,
                        token:api.token
                    }
                })
                    .then(function (res) {
                        if (res.code=='200')
                        {	//一卡通用户 code：0    非一卡通用户 code：-1
                            _self.jkCardMember = res.data.code;
                            if(res.data.code == 0){
                                _self.getJkcardBalance(res.data.cardCode);
							}
                        }

                        if(res.code=='-2'){
                            window.localStorage.removeItem('loginInfo')
                            window.localStorage.removeItem('cartNum')
                            window.location.href = 'login.html'
                        }
                    })
            },
            getJkcardBalance:function (cardCode) {
                //获取一卡通余额
                var _self = this;
                resource({
                    type: 'POST',
                    api: '/jkcardPay/getUserBalance',
                    token: api.token,
                    params: {
                        cardCode:cardCode,
                        channelCode:'GUOQIAN',
                        token:api.token
                    }
                })
                    .then(function (res) {
                        if (res.code=='200')
                        {
                            // overdraftAmount 可透支余额
                            _self.jkCardBalance = res.data.availableAmount
                        }

                    })
            },
			queryByNowList: function () {
				//获取订单数据
				var _self = this
				var opts = {
					skuIds: _self.skuIds,
					buyItNow: _self.buyItNow,
					type: _self.orderType,
					groupSn: _self.groupSn,
					inviterId: _self.inviter
				}
				if (this.buyItNow == 'true') {
					opts.quantities = this.quantities
				}

				return orderApi.queryBill(opts)
					.then(function (res) {
						var data;
						if (res.code == 200) {
							data = res.data[0]

							//优惠券
							_self.coupons.usable = [];
							_self.coupons.unusable = [];
							data.couponCodeVos = data.couponCodeVos || []
							data.couponCodeVos.forEach(function (v) {
								v.active = false
								v.beginTime = dateFormat(v.beginDate)
								v.endTime = dateFormat(v.endDate)

								if (v.beginDate==null&&v.endDate==null)
									v.timeStr = "长期有效"
								else if (v.beginDate==null)
									v.timeStr = "至"+v.endTime
								else if (v.endDate==null)
									v.timeStr = "从"+v.beginTime
								else
									v.timeStr = v.beginTime+"至"+v.endTime

								if (v.valid) {
									_self.coupons.usable.push(v)
								} else {
									_self.coupons.unusable.push(v)
								}
							})

							//礼品卡
							data.giftCardCodeVos = data.giftCardCodeVos || []
							data.giftCardCodeVos.forEach(function (v) {
								v.active = false
								v.beginTime = dateFormat(v.giftCardVo.beginDate)
								v.endTime = dateFormat(v.giftCardVo.endDate)

								if (v.giftCardVo.beginDate==null&&v.giftCardVo.endDate==null)
									v.timeStr = "长期有效"
								else if (v.giftCardVo.beginDate==null)
									v.timeStr = "至"+v.endTime
								else if (v.giftCardVo.endDate==null)
									v.timeStr = "从"+v.beginTime
								else
									v.timeStr = v.beginTime+"至"+v.endTime

							})
							_self.cards = data.giftCardCodeVos

							//初始化配送方式
							data.shippingMethodVos.forEach(function (v) {
								if (v.id == 1) {
									_self.shippings.normal = v
								}
								if (v.id == 2) {
									_self.shippings.shop = v
								}
							})
							_self.selectedAddr = jsonParse(data.receiverVo) || {}
							_self.bill = data
						} else if (res.code == 403) {
							$url('login.html')
						} else {
							_self.$notify('网络错误')
						}
					})
					.fail(function (xhr) {
						_self.$notify('网络错误')
					})
					.always(function () {})
			},
			getAddressList: function () {
				//获取所有地址
				var _self = this
				this.state.addrLoading = true
				return addressApi.getAddressList(this.addrPage)
					.then(function (res) {
						if (res.code == 200) {
							// if (_self.addrPage >= res.data.totalPage) {
							// 	_self.state.addrFinished = true
							// }
							// _self.addrPage++
							_self.state.addrFinished = true
							return res.data
						}
					})
					.then(function (data) {
						data.forEach(function (v) {
							v.active = false
							if (v.id == _self.selectedAddr.id) {
								v.active = true
								_self.selectedAddr = v
							}
						})
						_self.address = _self.address.concat(data)
					})
					.fail(function () {
						_self.state.addrError = true
						_self.$notify('网络错误')
					})
					.always(function () {
						_self.state.addrLoading = false;
					})
			},
			showAddrEdit: function (item) {
				//打开地址编辑
				var _self = this
				this.addrEdit = jsonParse(this.addrEditNormal)
				if (item) {
					var curId = item.areaId
					_self.addrEdit.address = jsonParse(item)
					_self.addrEdit.areaId = item.areaId
					this.areaPromiss.then(function () {
						_self.addrEdit.dftArea = _self.areaCode[curId].code
					})
				}
				this.show.addressEdit = true
			},
			showArea: function () {
				//地区选择器
				if (this.state.areaLoading) {
					return
				}
				this.show.area = true
			},
			hideArea: function (data) {
				//地区选择器
				if (data) {
					this.addrEdit.seletArea = data
				}
				this.show.area = false
			},
			saveAddress: function () {
				//保存地址
				if (this.state.lockOrder) {
					return
				}
				var _self = this
				var areaCode = ''
				var areaName = ''
				this.addrEdit.seletArea.forEach(function (v) {
					if (v) {
						areaCode = v.code
						areaName = v.name
					}
				})
				if (areaCode) {
					this.addrEdit.areaId = this.areaIdData[areaCode]
				}
				var dto = jsonParse(this.addrEdit.address)
				dto.areaId = this.addrEdit.areaId
				dto.areaName = areaName || dto.areaName

				if (!dto.consignee) {
					_self.$toast('请输入收货人信息')
					return
				}
				if (!regModel.test('tel', dto.phone)) {
					_self.$toast('请输入联系方式')
					return
				}
				if (!dto.areaId) {
					_self.$toast('请选择所在地区')
					return
				}
				if (!dto.address) {
					_self.$toast('请输入详细地址')
					return
				}
				this.state.lockOrder = true
				// regModel
				addressApi.saveAddress(dto)
					.then(function (res) {
						var timer = 600
						_self.$toast({
							message: '保存成功',
							duration: timer
						})
						setTimeout(function () {
							_self.address = []
							_self.getAddressList()

							_self.show.addressEdit = false
							_self.show.addressList = true
						}, timer)
					})
					.fail(function () {
						_self.$notify('网络错误')
					})
					.always(function () {
						_self.state.lockOrder = false
					})
			},
			getShops: function () {
				//获取门店
				var _self = this
				this.state.shopLoading = true
				addressApi.shopAddress()
					.then(function (res) {
						if (res.code == 200) {
							_self.state.shopFinished = true
							return res.data
						} else {
							_self.$notify('网络错误')
						}
					})
					.then(function (data) {
						data.forEach(function (v) {
							v.active = false
						})
						_self.shops = data
					})
					.fail(function () {
						_self.state.shopError = true
						_self.$notify('网络错误')
					})
					.always(function () {
						_self.state.shopLoading = false;
					})
			},
			choiceShop: function (item) {
				//选取门店地址
				this.shopTemporary.active = false
				item.active = true
				this.shopTemporary = item
			},
			shopDone: function () {
				//门店确定
				if (!this.shopTemporary.active) {
					this.$toast('请选择自提门店')
					return
				}
				this.selectedShop = jsonParse(this.shopTemporary)
				this.shippingMethodId = this.shippings.shop.id
				this.show.shops = false
			},
			choiceAddr: function (item) {
				//选取下单地址
				this.selectedAddr.active = false
				item.active = true
				this.selectedAddr = item
				this.show.addressList = false
			},
			choiceCoupon: function (item) {
				// 选择优惠券
				if (this.couponTemporary.id != item.id) {
					this.couponTemporary.active = false
				}
				item.active = !item.active
				this.couponTemporary = item
			},
			couponDone: function () {
				//确认优惠券
                var _self = this
				if (this.couponTemporary.active) {
					this.selectedCoupon = jsonParse(this.couponTemporary);
				} else {
					this.selectedCoupon = {}
				}
				this.show.coupon = false;
			},
			choiceCard: function (item) {
				// 选择优礼品卡
				if (this.cardTemporary.id != item.id) {
					this.cardTemporary.active = false
				}
				item.active = !item.active
				this.cardTemporary = item
			},
			cardDone: function () {
				//确认礼品卡
				if (this.cardTemporary.active) {
					this.selectedCard = jsonParse(this.cardTemporary)
				} else {
					this.selectedCard = {}
				}
				this.show.cards = false;
			},
            savePayType:function () {
                this.show.payType = false
            },
			saveInvoice: function () {
				//保存发票
				var _state = this.state.invoice
				var data = this.invoiceTemporary
				if (this.invoiceType1) {
					if (!data.company) {
						this.$toast('请填写单位名称')
						return
					}
					if (!data.taxpayer) {
						this.$toast('请填写纳税人识别号')
						return
					}
					this.invoiceTemporary.payerType = 'COMPANY'
				} else {
					this.invoiceTemporary.payerType = 'PERSONAL'
				}

				if (this.invoiceType2) {
					if (!data.registerAddress) {
						this.$toast('请填写注册地址')
						return
					}
					if (!data.registerPhone) {
						this.$toast('请填写注册电话')
						return
					}
					if (!data.bankName) {
						this.$toast('请填写开户银行')
						return
					}
					if (!data.bankAcount) {
						this.$toast('请填写开户账号')
						return
					}
					this.invoiceTemporary.invoiceType = 'SPECIAL'
				} else {
					this.invoiceTemporary.invoiceType = 'COMMON'
				}

				if (_state.request) {
					this.invoiceTemporary.needInvoice = 'true'
				} else {
					this.invoiceTemporary.needInvoice = 'false'
				}

                if (_state.request) {
                    if (_state.type==1)
                    {
                        if (!this.invoiceTemporary.receiverEmail) {
                            this.$toast('请填写收票邮箱')
                            return
                        }

                        var reg1 =  /^[\w\-\.]+@[\w\-\.]+(\.\w+)+$/
                        if(reg1.test(this.invoiceTemporary.receiverEmail) == false ) {
                            this.$toast('邮箱格式不正确')
                            return;
                        }

                    }
                    if (_state.type==2)
                    {
                        if (!this.invoiceTemporary.receiverName) {
                            this.$toast('请填写收件人')
                            return
                        }
                        if (!this.invoiceTemporary.receiverPhone) {
                            this.$toast('请填写联系方式')
                            return
                        }
                        if (!this.invoiceTemporary.receiverAddress) {
                            this.$toast('请填写收票地址')
                            return
                        }
                    }
                }

				this.invoiceData = jsonParse(this.invoiceTemporary)
				this.show.invoice = false
			},
			calculate: function (isLoading) {
				isLoading && (this.show.loading = true)
				//计算金额
				/* 
				 * reloadMax 重载最大次数
				 * reloadCount 当前重载数
				 */
				var _self = this
				var reloadMax = 2
				var reloadCount = 0
				var opts = {
					balance: 0,
					buyItNow: this.buyItNow,
					code: this.selectedCoupon.code || '',
					giftCardCodeId: this.selectedCard.id || '',
					memo: this.memo,
					paymentMethodId: 1,
					rebateBalance: this.rebate,
					receiverId: this.selectedAddr.id,
					shippingMethodId: this.shippingMethodId,
					skuIds: this.skuIds,
					type: this.orderType,
					groupSn: _self.groupSn
				}
				if (this.buyItNow == 'true') {
					opts.quantities = this.quantities
				}
				return orderApi.calculate(opts)
					.then(function (res) {
						if (res.code == 200) {
							_self.statements = res.data
							//返利核对
							if (res.data.rebatePaidAmount<app.bill.rebateBalance&&res.data.rebatePaidAmount>0)
							{
								app.bill.rebateBalance = res.data.rebatePaidAmount
								_self.$notify("该订单最多能使用返利"+app.bill.rebateBalance)
								app.rebate = app.bill.rebateBalance
							}
						}
						else
						{
							_self.$notify(res.message)
						}
					})
					.fail(function () {
						_self.$notify('网络错误')
					})
					.always(function () {
						_self.show.loading = false
					})
			},
			subOrder: function () {
				//提交订单
				var _self = this
				if (this.state.lockOrder) {
					return
				}
                if (!this.skuIds) {
					this.$toast('操作有误')
					return
				}
				if (!this.selectedAddr.id) {
					this.$toast('请选择下单地址')
					return
				}
                if (this.state.payType==0 && this.jkCardMember==0) {
                    this.$toast('请选择支付方式')
                    return
                }


				//提交订单
				var opts = {
					balance: 0,
					buyItNow: this.buyItNow,
					code: this.selectedCoupon.code || '',
					giftCardCodeId: this.selectedCard.id || '',
					memo: this.memo,
					paymentMethodId: 1,
					rebateBalance: this.rebate,
					receiverId: this.selectedAddr.id,
					shippingMethodId: this.shippingMethodId,
					skuIds: this.skuIds,
					cartTag: '',
					pickUpInStoreAddress: this.selectedShop.id || '',
					type: this.orderType,
					groupSn: _self.groupSn,
					inviterId: _self.inviter,
                    payMode: _self.state.payType
				}
				if (this.buyItNow == 'true') {
					opts.quantities = this.quantities
				}

				var invoiceData = jsonParse(this.invoiceData)
				opts = _extends(opts, invoiceData)

				this.state.lockOrder = true

				return orderApi.createdOrder(opts)
					.then(function (res) {
						if (res.code == 200) {
							if (res.data.amount <= 0) {
								$url('pay_success.html?sn=' + res.data.sn)
								return
							}
							$url('pay.html?sn=' + res.data.sn)
						} else {
                            _self.$notify(res.message)
						}
					})
					.fail(function (res) {
						_self.$notify(res.responseJSON.message)
					})
					.always(function () {
						_self.state.lockOrder = false;
                        window.localStorage.removeItem('cartGoods');
					})

			},
			addCoupon: function (){
				var _self = this
				if (app.newCouponSn=="")
					_self.$notify('请输入券码')
				else
				{
					return couponApi.exchangeCoupon(app.newCouponSn)
					.then(function (res) {
						
						if (res.code == 200) {
                            _self.newCouponSn ='';
							//刷新
							app.queryByNowList()
						} else {
							_self.$notify('券码错误')
						}
					})
					.fail(function () {
						_self.$notify('网络错误')
					})
					.always(function () {
						_self.state.lockOrder = false
					}) 
				}
				           
			}
		}
	}).$mount('#page');

});