define(function (require, exports, moduel) {
	var $ = require('jquery')
	require('../common/common')
	var api = require('../../api/order')
	var Vue = require('vue')
	var Vant = require('vant')
	Vue.use(Vant)

	var app = new Vue({
		data: function () {
			return {
				goods: {},
				detail: {},
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
                ImagePreview:false
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
			this.getDetail()
		},
		watch: {},
		methods: {
			$url: $url,
			getDetail: function (item) {
				//售后详情
				var _self = this
				api.aftersaleQuery({
						orderSn: _self.sn,
						orderItemId: _self.itemId
					})
					.then(function (res) {
						log(res)
						if (res.code == 200) {
							_self.detail = res.data
						}
						_self.goods = res.data.orderItemVOS[0]
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