define(function (require, exports, moduel) {
	var $ = require('jquery')
	require('../common/common')
	var pluginApi = require('../../api/plugin')
	var orderApi = require('../../api/order')
	var Vue = require('vue')
	var Vant = require('vant')
	Vue.use(Vant)

	var app = new Vue({
		data: function () {
			return {
				goods: {},
				sn: '',
				itemId: '',
				reason: 0,
				reasonArr: ['质量问题', '多拍、错拍', '缺货', '不想要了'],
				typeIndex: 0,
				types: [{
						name: '退款',
						val: 'REFUND'
					},
					{
						name: '退货',
						val: 'RETURN'
					}
				],
				aftersale: {},
				content: '',
				price: '',
				imgs: [],
				loading: false,
				finished: false,
				error: false,
				page: 1,
				state: {
					locked: false
				},
				show: {
					pageLoading: true
				},
				requestType: ''
			}
		},
		created: function () {
			this.sn = getParam('sn')
			this.itemId = Number(getParam('itemId'))
			if (!this.sn) {
				window.history.back(-1)
				return
			}
			if (!this.itemId) {
				window.history.back(-1)
				return
			}
			this.getInfo().then(this.getGoods())
		},
		watch: {},
		computed: {
			uploadBtnSta: function () {
				if (this.imgs.length >= 3) {
					return false
				}
				return true
			}
		},
		methods: {
			$url: $url,
			getInfo: function () {
				var _self = this
				return orderApi.aftersaleInfo({
						orderSn: _self.sn,
						orderItemId: _self.itemId
					}).then(function (res) {
						if (res.code == 200) {
							_self.price = res.data.refundAmount
							_self.aftersale = res.data
							_self.goods = res.data.orderItemVOS[0]
							_self.requestType = res.data.requestType
						}
					})
					.always(function () {
						_self.show.pageLoading = false
					})
					.fail(function () {
						_self.$notify('网络错误');
					})
			},
			uploader: function (files) {
				//上传头像
				var _self = this
				var oData = new FormData()
				oData.append('file', files.file)
				oData.append('fileType', 'image')
				pluginApi.uploader(oData)
					.then(function (res) {
						if (res.code == 200) {
							_self.imgs.push(res.data.url)
						}
					})
					.fail(function () {
						_self.$notify('网络错误');
					})
			},
			removeImg: function (i) {
				//删除图片
				this.imgs.splice(i, 1)
			},
			apply: function (item) {
				//申请售后
				var _self = this
				var imgs = _self.imgs.join(',')
				if (_self.price > _self.aftersale.refundAmount || _self.price < 0) {
					_self.$toast('最多可退款' + _self.aftersale.refundAmount + '元')
					return
				}

				_self.types.forEach(function (v, i) {
					if (v.name == _self.aftersale.requestType) {
						_self.typeIndex = i
					}
				})


//						requestType: _self.types[_self.typeIndex].name
				orderApi.aftersaleApply({
						images: imgs,
						orderItemId: _self.itemId,
						orderSn: _self.sn,
						reason: _self.reasonArr[_self.reason],
						refundAmount: _self.price,
						requestContent: _self.content,
						requestType: _self.requestType
					})
					.then(function (res) {
						if (res.code == 200) {
							_self.$toast({
								message: '您的申请已提交',
								duration: 1000
							})
							setTimeout(function () {
								location.href="order_list.html"
							}, 1100)
							return
						}
						if (res.code == 9999) {
							_self.$toast({
								message: res.message
							})
							return
						}
					})
					.fail(function (res) {
						if (res.status == 422) {
							_self.$toast({
								message: res.responseJSON.message
							})
							return
						}
						_self.$notify('网络错误')
					})
					.always(function () {

					})
			}
		}
	}).$mount('#page');


	//获取订单数据


	//阻止默认事件
	// document.addEventListener('touchmove', function (e) {
	// 	e.preventDefault();
	// }, isPassive() ? {
	// 	capture: false,
	// 	passive: false
	// } : false)

});