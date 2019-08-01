define(function (require, exports, moduel) {
	var $ = require('jquery')
	require('../common/common')
	var api = require('../../api/notification')
	var Vue = require('vue')
	var Vant = require('vant')

	Vue.config.devtools = true
	Vue.use(Vant)

	var app = new Vue({
		data: function () {
			return {
				noticeList: [],
				loading: false,
				finished: false,
				error: false,
				page: 1,
				statusArr: ['message', 'orderNotice', 'promotion', 'share', 'mallNotice'],
				routePage: '',
				show: {},
				messageUnreadCount: 0,
				promotionMessageUnreadCount: 0,
				shareUnreadCount: 0
			}
		},
		created: function () {
			this.routePage = getParam('page') || this.statusArr[0]
		},
		mounted: function () {
			//this.$notify('');
		},
		watch: {
			routePage: function (val) {
				var exist = this.statusArr.filter(function (item) {
					return item === val
				})
				if (!exist.length) {
					this.routePage = this.statusArr[0]
					return
				}
				this.refresh()
			}
		},
		methods: {
			$url: $url,
			refresh: function () {
				//刷新列表
				var _self = this
				if (_self.msgPromise) {
					_self.msgPromise.progress(function (xhr) {
						if (_self.msgPromise.state() === 'pending') {
							xhr.abort()
						}
					})
				}
				_self.page = 1
				_self.noticeList = []
				_self.error = false
				_self.finished = false
				_self.msgPromise = _self.getMsg()

			},
			getMsg: function () {
				//获取消息
				var _self = this
				this.loading = true
				return api.getMessage({
						page: _self.page,
						category: _self.routePage
					})
					.then(function (res) {
						if (res.code == 200) {
							_self.loading = false
							if (_self.page >= (res.data.pageable.pageTotal || 1)) {
								_self.finished = true
							}
							_self.messageUnreadCount=res.data.messageUnreadCount
							_self.promotionMessageUnreadCount=res.data.promotionMessageUnreadCount
							_self.shareUnreadCount=res.data.shareUnreadCount

							return res.data.content
						}
					})
					.then(function (data) {
						_self.noticeList = _self.noticeList.concat(data)
						_self.page++
					})
					.fail(function (res, status, err) {
						if (status === 'abort') {
							return
						}
						_self.error = true
						_self.$notify('网络错误')
					})
					.always(function () {
						_self.loading = false
					})
			},
			switchRoute: function (page) {
				this.routePage = page
			},
			$linkUrl: function (appParams,id) {
				if (!appParams.linkType) {
					return
				}
				//已读
				api.msgUpdate(id)
				.then(function (res) {
					//if (res.code == 200) {
						var url = linkTypeUrl(appParams.linkType, appParams.targetId)
						url += '&inviter=' + appParams.inviter
						$url(url)
					//}
				})
				.fail(function () {
					_self.$notify('网络错误')
				})

				
			}
		}
	}).$mount('#page');

	//阻止默认事件
	// document.addEventListener('touchmove', function (e) {
	// 	e.preventDefault();
	// }, isPassive() ? {
	// 	capture: false,
	// 	passive: false
	// } : false)

});