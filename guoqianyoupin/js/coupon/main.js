define(function (require, exports, moduel) {
	var $ = require('jquery')
	require('../common/common')
	var api = require('../../api/coupon')
	var Vue = require('vue')
	var Vant = require('vant')
	Vue.use(Vant)

	var app = new Vue({
		data: function () {
			return {
				coupon: {
					avaiableList: [],
					usedList: [],
					expiredList: []
				},
				items: ['avaiableList', 'usedList', 'expiredList'],
				index: 0,
				loading: false,
				finished: false,
				error: false,
				page: 1,
				show: {},
				totalPage: ''
			}
		},
		created: function () {
			this.getCoupon()
		},
		mounted: function () {
			//this.$notify('');
		},
		methods: {
			$url: $url,
			switchItem: function (index) {
				this.index = index
			},
			getCoupon: function () {
				var _self = this
				_self.loading = true
				return api.couponList()
					.then(function (res) {
						if (res.code == 200) {
							_self.coupon = res.data
							_self.coupon.avaiableList.forEach(function (item) {
								if (item.minimumPrice == null) {
									item.minimumPrice = 0
								}
                                if (item.beginDate==null&&item.endDate==null)
                                    item.dateStr = "长期有效"
                                else if (item.beginDate==null)
                                    item.dateStr = "至"+dateFormat(item.endDate)
                                else if (item.endDate==null)
                                    item.dateStr = "从"+dateFormat(item.beginDate)
                                else
                                    item.dateStr = '从'+dateFormat(item.beginDate)+"至"+dateFormat(item.endDate)
							})
							_self.coupon.expiredList.forEach(function (item) {
								if (item.minimumPrice == null) {
									item.minimumPrice = 0
								}
                                if (item.beginDate==null&&item.endDate==null)
                                    item.dateStr = "长期有效"
                                else if (item.beginDate==null)
                                    item.dateStr = "至"+dateFormat(item.endDate)
                                else if (item.endDate==null)
                                    item.dateStr = "从"+dateFormat(item.beginDate)
                                else
                                    item.dateStr = '从'+dateFormat(item.beginDate)+"至"+dateFormat(item.endDate)
							})
							_self.coupon.usedList.forEach(function (item) {
								if (item.minimumPrice == null) {
									item.minimumPrice = 0
								}
                                if (item.beginDate==null&&item.endDate==null)
                                    item.dateStr = "长期有效"
                                else if (item.beginDate==null)
                                    item.dateStr = "至"+dateFormat(item.endDate)
                                else if (item.endDate==null)
                                    item.dateStr = "从"+dateFormat(item.beginDate)
                                else
                                    item.dateStr = '从'+dateFormat(item.beginDate)+"至"+dateFormat(item.endDate)
							})

							_self.finished = true
						} else {
							_self.$notify('网络错误');
						}
					})
					.fail(function () {
						_self.error = true
						_self.$notify('网络错误')
					})
					.always(function () {
						_self.loading = false
						log(_self.loading)
					})
			}
		}
	}).$mount('#page');


});