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
				loading: false,
				finished: false,
				error: false,
				page: 1,
				show: {},
				rebate: {
					balance: 0,
					creditSum: 0,
					debitSum: 0
				},
				logs: [],
			}
		},
		created: function () {
			this.getRebate()
		},
		mounted: function () {
			//this.$notify('');
		},
		methods: {
			$url: $url,
			getRebate: function () {
				var _self = this
				_self.loading = true
				return api.rebate()
					.then(function (res) {
						if (res.code == 200) {
							_self.rebate = res.data
							res.data.rebateLog.forEach(function (v) {
								// v.desc = v.memo.split(',')[0]
								// v.snInfo = v.memo.split(',')[1]
								v.time = dateFormat(v.date, 1)
							})
						} else {
							_self.$notify('网络错误')
						}
					})
					.fail(function () {
						_self.$notify('网络错误')
					})
					.always(function () {
						_self.loading = false
					})
			}
		}
	}).$mount('#page');

});