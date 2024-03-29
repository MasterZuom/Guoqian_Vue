define(function (require, exports, moduel) {
	var $ = require('jquery')
	require('../common/common')
	var plugin = require('../../api/plugin')
	var api = require('../../api/notification')
	var Vue = require('vue')
	var Vant = require('vant')
	Vue.use(Vant)


	var app = new Vue({
		data: function () {
			return {
				title: '',
				content: '',
				time: ''
			}
		},
		created: function () {},
		mounted: function () {
			this.loadArticle();
		},
		watch: {},
		computed: {},
		methods: {
			loadArticle: function () {
				var id = '1110_1'
				var _self = this
				return api.article(id)
					.then(function (res) {
						if (res.code == 200) {
							_self.content = res.data.content
						}
					})
					.fail(function () {
						_self.$notify('网络错误')
					})
			}
		}
	}).$mount('#page');

});