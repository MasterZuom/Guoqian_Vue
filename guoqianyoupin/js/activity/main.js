define(function (require, exports, moduel) {
	var $ = require('jquery')
	require('../common/common')
	var api = require('../../api/activity')
	var Vue = require('vue')
	var Vant = require('vant')
	var Lazyload = Vant.Lazyload
	Vue.use(Vant)
	Vue.use(Lazyload)

	var app = new Vue({
		data: function () {
			return {
				type: '',
				activityAds: [],
				activityItems: [],
				page: 1,
				show: {},
				loading: false,
				finished: false,
				error: false,
				logs: [],
			}
		},
		created: function () {
			this.type = getParam('type') || 'groupBuy'
			this.getActivity()
		},
		mounted: function () {
			//this.$notify('');
			if(this.type=='groupBuy'){
                document.title = '拼团';
			}
			if(this.type=='flashSale'){
                document.title = '秒杀';
			}

		},
		methods: {
			$url: $url,
			getActivity: function () {
				var _self = this
				_self.loading = true
				return api.list({
						type: this.type
					})
					.then(function (res) {
						if (res.code == 200) {
							log(jsonParse(res.data))
							_self.activityAds = res.data.activityAds
							_self.activityItems = res.data.activityItems
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
			},
			$linkUrl: function (item) {
				var url = linkTypeUrl(item.linkType, item.target)
				$url(url)
			},
		}
	}).$mount('#page');

});