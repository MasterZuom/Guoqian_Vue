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
				score: {
					point: 0,
					pointLogs: []
				},
				show: {},
			}
		},
		created: function () {
			this.getPoint()
		},
		mounted: function () {
			//this.$notify('');
		},
		methods: {
			$url: $url,
			getPoint: function () {
				var _self = this
				api.point()
					.then(function (res) {
						if (res.code == 200) {
							res.data.pointLogs.forEach(function (v) {
								v.time = dateFormat(v.createdDate, 2)
							})
							_self.score = res.data
						}
					})
					.fail(function () {
						this.$notify('网络错误')
					})
			}

		}
	}).$mount('#page');





});