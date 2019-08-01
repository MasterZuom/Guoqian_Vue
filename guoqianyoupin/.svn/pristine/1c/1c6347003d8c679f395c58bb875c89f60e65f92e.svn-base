define(function (require, exports, moduel) {
	var $ = require('jquery')
	require('../common/common')
	var api = require('../../api/order')
	var Vue = require('vueDev')
	var Vant = require('vant')
	Vue.use(Vant)

	var app = new Vue({
		data: function () {
			return {
				payType: 1, //1 支付宝, 2 微信, 3 银联
				page: 1,
				orderSn: '',
				orderPrice: 0,
				orderData: {},
				show: {
					pageLoading: false
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
							_self.orderData = res.data
							_self.orderPrice = res.data.salePrice
						}
					})
					.fail(function () {
						_self.$notify('网络错误')
					})
					.always(function () {
						_self.show.pageLoading = false
					})

			},
			choicePay: function (type) {
				//选择支付方式
				this.payType = type
			},
			goPay: function () {
				//跳转支付
				log('支付方式' + this.payType)
			}
		}
	}).$mount('#page');


});