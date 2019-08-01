define(function (require, exports, moduel) {
	var $ = require('jquery')
	require('../common/common')
	var api = require('../../api/consultation')
	var goodsApi = require('../../api/goods')
	var Vue = require('vue')
	var Vant = require('vant')

	var IScroll = require('iscrollProbe');
	Vue.config.devtools = true
	Vue.use(Vant)

	var app = new Vue({
		data: function () {
			return {
				listData: [],
				loading: false,
				finished: false,
				page: 1,
				show: {},
				totalPage: '',
				itemId:'',
				goodsData:[]
			}
		},
		created: function () {
			this.itemId = getParam('id')
			this.getGoodsDetail()
		},
		mounted: function () {
			//this.$notify('');
		},
		methods: {
			$url: $url,
			getGoodsDetail: function () {
				var _self = this
				return goodsApi.productDetail({
						productId: _self.itemId,
					})
					.then(function (res) {
						log(jsonParse(res.data))
						var data;
						if (res.code == 200) {
							data = res.data
							_self.goodsData = data
						}
					})
			},
			getList: getList
		}
	}).$mount('#page');

	function getList() {

		setTimeout(function () {
			app.loading = true;
			//this.finished = true;
			return api.product({
					id:app.itemId,
					page: app.page
				})
				.then(function (res) {
					if (res.code == 200) {
						app.loading = false
						// log(res)
						if (app.page >= res.data.totalPage) {
							app.finished = 1
						}
						return res.data.content
					} else {
						app.$notify('网络错误');
					}
				})
				.then(function (data) {
					app.listData = app.listData.concat(data)
					app.page++
				})
				.fail(function () {
					app.$notify('网络错误');
				})
		}, 1000);

	}

	//var myScroll;
	// getMyReviewList().then(function () {
	// 		app.$nextTick(function () {
	// 			var isLoad = false;
	// 			myScroll = new IScroll('.scrollable', {
	// 				probeType: 2,
	// 				mouseWheel: false,
	// 				fadeScrollbars: true,
	// 				scrollbars: true
	// 			});

	// 			//上拉加载
	// 			myScroll.on('scroll', function () {
	// 				if (this.y < (this.maxScrollY )) {
	// 					app.loading = true
	// 					isLoad = true;
	// 				}
	// 			});

	// 			// 滚动完毕
	// 			myScroll.on('scrollEnd', function () {
	// 				if (isLoad) {
	// 					app.loading = false
	// 					pullUpAction();
	// 					isLoad = false;
	// 				}
	// 			});

	// 		})
	// 	});

	//上拉处理
	function pullUpAction() {
		setTimeout(function () { // <-- Simulate network congestion, remove setTimeout from production!
			getMyReviewList().then(refresh)
		}, 500);
	}
	//更新数据
	function refresh() {
		app.$nextTick(function () {
			myScroll.refresh(); //数据加载完成后，调用界面更新方法
		})
	}

	//阻止默认事件
	// document.addEventListener('touchmove', function (e) {
	// 	e.preventDefault();
	// }, isPassive() ? {
	// 	capture: false,
	// 	passive: false
	// } : false)

});