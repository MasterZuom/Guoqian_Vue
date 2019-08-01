define(function (require, exports, moduel) {
	var $ = require('jquery')
	require('../common/common')
	var api = require('../../api/category')
	var goodsApi = require('../../api/goods')
	var notifyApi = require('../../api/notification')
	var Vue = require('vue')
	var Vant = require('vant')
	var nav = require('../../components/nav')
	var Lazyload = Vant.Lazyload

	Vue.use(nav)
	Vue.use(Vant)
	Vue.use(Lazyload)

	var app = new Vue({
		data: function () {
			return {
				category: [],
				categoryItems: [],
				hotList: [],
				searchHistroy: [],
				curCategoryId: 0,
				curIndex: 0,
				keyword: '',
				show: {
					loading: false,
					searchPage: 0
				},
				state: {
					init: true
				},
				showMsgTip: 0
			}
		},
		created: function () {
			var _self = this
			_self.show.loading = true
			this.getCategory().then(this.getCategoryItems)
				.always(function () {
					_self.show.loading = false
					_self.state.init = false
				})
			this.searchHistroy = JSON.parse(window.localStorage.getItem('searchHistroy')) || []
			this.hotSearch()
			this.getMsg()
		},
		watch: {
			curCategoryId: function () {
				this.getCategoryItems()
			}
		},
		mounted: function () {
			//this.$notify('');
		},
		methods: {
			$url: $url,
			getMsg: function () {
				//获取未读消息
				if (!loginInfo.token) {
					//未登录
					return
				}
				notifyApi.getMessage({
						page: 1,
						category: 'share'
					})
					.then(function (res) {
						if (res.code == 200) {
							if (res.data.messageUnreadCount>0||res.data.promotionMessageUnreadCount>0||res.data.shareUnreadCount>0)
								app.showMsgTip=1
						}
					})
			},
			hotSearch: function () {
				//热搜
				var _self = this
				return goodsApi.hotSearch()
					.then(function (res) {
						if (res.code == 200) {
							_self.hotList = res.data
						}
					})
					.fail(function () {

					})
			},
			removeHistroy: function () {
				//删除搜索历史
				this.searchHistroy = []
				window.localStorage.setItem('searchHistroy', JSON.stringify(this.searchHistroy))
			},
			showSearch: function () {
				this.show.searchPage = 1
				this.$nextTick(function () {
					this.$refs.searchInput.focus()
				})
			},
			subSearch: function () {
				if (!this.keyword) {
					return false
				}
				this.$url('goods_list.html?keyword=' + this.keyword)
			},
			getCategory: function () {
				//获取父级
				var _self = this
				_self.show.loading = true;
				return api.categoryRoot()
					.then(function (data) {
						if (data.length) {
							_self.curCategoryId = data[0].id
						}
						_self.category = data
						//localStorage.setItem('cateData', JSON.stringify(data))
					})
					.fail(function () {
						_self.$notify('网络错误')
					})
					.always(function () {
						_self.show.loading = 0
					})
			},
			getCategoryItems: function () {
				var _self = this
				_self.show.loading = true
				return api.categoryList(_self.curCategoryId)
					.then(function (data) {
						_self.categoryItems = data
					})
					.fail(function () {
						_self.$notify('网络错误')
					})
					.always(function () {
						_self.show.loading = false
					})
			},
			choiceCate: function (item, index) {
				//
				if (this.curIndex == index) {
					return
				}
				this.curIndex = index
				this.curCategoryId = item.id
			}

		}
	}).$mount('#page');

});