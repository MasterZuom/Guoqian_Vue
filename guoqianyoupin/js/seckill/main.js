define(function (require, exports, moduel) {
	var $ = require('jquery')
	require('../common/common')
	var api = require('../../api/activity')
	var Vue = require('vue')
	var Vant = require('vant')
	var countDown = require('../../components/countdown')
	var Lazyload = Vant.Lazyload

	Vue.use(Vant)
	Vue.use(Lazyload)

	var app = new Vue({
		data: function () {
			return {
				id: '',
				type: '',
				loading: false,
				finished: false,
				error: false,
				activity: {
					endDate: 0,
					startDate: 0,
					currentDate: 0,
					title: 0,
				},
				goodsList: [],
				page: 1,
				show: {},
				msTime: { //倒计时数值
					show: false, //倒计时状态
					day: '', //天
					hour: '', //小时
					minutes: '', //分钟
					seconds: '' //秒
				}
			}
		},
		created: function () {
			this.id = getParam('id')
			this.type = getParam('type') || 'groupBuy'
			if(!this.id){
				window.history.back(-1)
				return
			}
			this.getList()
		},
		mounted: function () {
			//this.$notify('');
		},
		watch: {

		},
		components: {
			countDown: countDown
		},
		methods: {
			$url: $url,
			countDownS_cb: function (x) {},
			countDownE_cb: function (x) {},
			getMsTime: function (res) {
				this.msTime = res
			},
			getList: function () {
				var _self = this
				_self.loading = true
				return api.skuList({
						activityId: this.id,
						activityType: this.type
					})
					.then(function (res) {
						var data
						if (res.code == 200) {
							data = res.data
							var sDate = (new Date(data.startDate))
							_self.goodsList = data.activityListSkuItems
							_self.activity.startDate = data.startDate
							_self.activity.startTime = sDate.getHours() + ':' + sDate.getMinutes()
							_self.activity.currentDate = (new Date()).getTime()
							_self.activity.endDate = data.endDate
							_self.activity.title = data.title
							_self.finished = true
						} else {
							_self.$notify('网络错误')
						}
					})
					.fail(function () {
						_self.error = true
						_self.$notify('网络错误')
					})
					.always(function () {
						_self.loading = false
					})
			}
		}
	}).$mount('#page');

});