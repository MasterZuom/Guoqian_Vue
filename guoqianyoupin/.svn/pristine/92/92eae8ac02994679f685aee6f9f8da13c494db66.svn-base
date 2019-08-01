define(function (require, exports, moduel) {
	var $ = require('jquery')
	require('../common/common')
	var api = require('../../api/comments')
	var Vue = require('vue')
	var Vant = require('vant')
	Vue.use(Vant)

	var app = new Vue({
		data: function () {
			return {
				comments: [],
				loading: false,
				finished: false,
				error: false,
				page: 1,
				show: {},
				totalPage: ''
			}
		},
		created: function () {
			//getMyReviewList(1)
		},
		mounted: function () {
			//this.$notify('');
		},
		methods: {
			$url: $url,
			getMyReviewList: getMyReviewList
		}
	}).$mount('#page');

	function getMyReviewList() {

		setTimeout(function () {
			app.loading = true;
			//this.finished = true;
			return api.getMyReviewList(app.page)
				.then(function (res) {
					if (res.code == 200) {
						if (app.page >= res.data.totalPage) {
							app.finished = true
						}
						res.data.content.forEach(function (v, i) {
							v.time = dateFormat(v.creatDate, 2)
						})
						return res.data.content
					} else {
						app.$notify('网络错误');
					}
				})
				.then(function (data) {
					app.comments = app.comments.concat(data)
					app.page++
				})
				.fail(function () {
					app.error = true
					app.$notify('网络错误');
				})
				.always(function () {
					app.loading = false;
				})
		}, 1000);

	}

	//阻止默认事件
	// document.addEventListener('touchmove', function (e) {
	// 	e.preventDefault();
	// }, isPassive() ? {
	// 	capture: false,
	// 	passive: false
	// } : false)

});