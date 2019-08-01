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
				curCategoryId: '',
				curIndex: 0,
				keyword: '',
				show: {
					loading: false,
					searchPage: 0
				},
				state: {
					init: true
				},
				showMsgTip: 0,
                activeFlag:false,
                scrollHeight:667
			}
		},
		created: function () {
			var _self = this
			_self.show.loading = true
			this.getCategory()
				.always(function () {
					_self.show.loading = false
					_self.state.init = false
				})
			this.searchHistroy = JSON.parse(window.localStorage.getItem('searchHistroy')) || []
			this.hotSearch()

            this.scrollHeight = window.innerHeight - $('.category-header').height() - $('.nav-toolbar').height;
		},
		watch: {
			// curCategoryId: function () {
			// 	this.getCategoryItems()
			// }
		},
		mounted: function () {
			//this.$notify('');
		},
		methods: {
			$url: $url,
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
						// if (data.length) {
						// 	_self.curCategoryId = data[0].id
						// }
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
						_self.categoryItems = data;
					})
					.fail(function () {
						_self.$notify('网络错误')
					})
					.always(function () {
						_self.show.loading = false
					})
			},
			choiceCate: function (e,item, index) {
				var _self = this;

				if (_self.curIndex == index) {
                    _self.activeFlag = !_self.activeFlag
					// 	return
				}else {
                    _self.activeFlag = true;
                }

                if(_self.activeFlag){
                       var scoll_height = $(".child-list"+index).find('.wrap').css('height');
                       $('.child-list').css({height:0})
                       $(".child-list"+index).css({height:scoll_height})

						if(index>=_self.curIndex){
                            var scoll_top = e.currentTarget.offsetTop-$('.category-header').height()-$(".child-list"+_self.curIndex).height();
                        }else {
                            var scoll_top = e.currentTarget.offsetTop-$('.category-header').height();
                        }
                       $(".scrollable").animate({scrollTop:scoll_top+'px'},500)

					// _self.categoryItems = [];
                    _self.curIndex = index
                    _self.curCategoryId = item.id

                }else {
                    $(".child-list").css({height:0})
				}
			}

		}
	}).$mount('#page');

});
