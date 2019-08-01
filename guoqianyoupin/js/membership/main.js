define(function (require, exports, moduel) {
	var $ = require('jquery')
	require('../common/common')
	var api = require('../../api/member')
	var Vue = require('vue')
	var Vant = require('vant')

	Vue.config.devtools = true
	Vue.use(Vant)

	var app = new Vue({
		data: function () {
			return {
				memberInfo: {},
				benefit: {},
				show: {},
				currentRank: 1
			}
		},
		created: function () {
			this.getMemberInfo()
				.then(this.benefitRank)
		},
		mounted: function () {
			//this.$notify('');
		},
		methods: {
			$url: $url,
			getMemberInfo: function () {
				//会员权益信息
				var _self = this
				return api.benefit()
					.then(function (res) {
						if (res.code == 200) {
							_self.memberInfo = res.data
							_self.currentRank = res.data.memberRankId
							return res.data.memberRankId
						}
					})
					.fail(function () {
						_self.$notify('网络错误')
					})
			},
			benefitRank: function (id) {
				//查看等级权益
				var _self = this
				api.benefitRank(id)
					.then(function (res) {
						if (res.code == 200) {
							_self.currentRank = id
							_self.benefit = res.data
						}
					})
					.fail(function () {
						_self.$notify('网络错误')
					})
			}
		}
	}).$mount('#page');


	//获取用户细信息



});