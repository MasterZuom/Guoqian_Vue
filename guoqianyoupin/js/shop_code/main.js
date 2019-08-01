define(function (require, exports, moduel) {
	var $ = require('jquery')
	require('../common/common')
	var Vue = require('vue')
	var Vant = require('vant')
	Vue.use(Vant)
	require('qrcode')

	var app = new Vue({
		data: function () {
			return {
				name: '',
				show: {},
			}
		},
		mounted: function () {
			var codeMsg = getParam('info') || ''
			this.name = getParam('name') || ''
			$('.img-wrapper').qrcode(codeMsg)
			log(codeMsg)
		},
		methods: {
			$url: $url
		}
	}).$mount('#page');

});