define(function (require, exports, moduel) {
	var $ = require('libs/jquery-1.11.2.min.js')
	var api = require('../api/cart')
	var getArea = require('../js/address/area')
	getArea()

	//底部导航组件
	var navData = [{
			label: '首页',
			icon: 'home',
			url: 'index.html',
			img: {
				description: ''
			}
		},
		{
			label: '品类',
			icon: 'classification',
			url: 'category.html',
			img: {}
		},
		{
			label: '订单',
			icon: 'order',
			url: 'order_list.html',
			img: {}
		},
		{
			label: '购物车',
			icon: 'cart',
			url: 'cart.html',
			num: true,
			img: {}
		},
		{
			label: '我的',
			icon: 'user',
			url: 'user.html',
			img: {}
		}
	]

	function template() {
		var navTemplate = '';
		navTemplate = '<div class="tab" v-for="v in navData" :class="{active: curPage(v.url), \'cart-tab\':v.className}" @click="$url(v.url)">' +
			'<div class="icon-wrapper" v-if="!v.img.defineUrl">' +
			'<span class="number"  v-if="v.num && cartNum">{{cartNum}}</span>' +
			'<i class="icon iconfont" :class="\'icon-\'+ v.icon"></i>' +
			'</div>' +
			'<div class="img-wrapper" v-if="v.img.defineUrl">' +
			'<span class="number"  v-show="v.num && cartNum">{{cartNum}}</span>' +
			'<img v-if="!curPage(v.url)" :src="v.img.defineUrl"></img>' +
			'<img v-if="curPage(v.url)" :src="v.img.activeUrl"></img>' +
			'</div>' +
			'<span class="label">{{v.label}}</span>' +
			'</div>'
		navTemplate = '<div class="fixed-bar nav-toolbar">' + navTemplate + '</div>'
		return navTemplate
	}

	var init = true
	return function (Vue, options) {
		var _nav = Vue.extend({
			template: template(),
			data: function () {
				return {
					navData: navData,
					iconData: {},
					updateDate: '',
				}
			},
			props: {
				cartNum: {
					type: Number,
					default: 0
				}
			},
			created: function () {
				var _self = this
				var iconData = window.localStorage.getItem('iconData')
				iconData = JSON.parse(iconData) || {}
				this.updateDate = iconData.updateDate

				if (this.updateDate) {
					navData.forEach(function (v, i) {
						v.img = iconData.icons[i] || {}
					})
				}

				var cartNum = Number(window.localStorage.getItem('cartNum'))
				var path = window.location.pathname
				if (loginInfo.token && !path.match('cart.html')) {
					api.cartList()
						.then(function (res) {
							if (res.code == 200) {
								cartNum = 0
								res.data.forEach(function (v) {
									cartNum += Number(v.skuQuantity)
								})
								_self.cartNum = cartNum
								window.localStorage.setItem('cartNum', cartNum)
							}
						})
				}
				this.refreshIcon()
			},
			methods: {
				$url: function (url) {
					location.href = url
				},
				curPage: function (url) {
					var path = window.location.pathname
					return path.match(url)
				},
				refreshIcon: function () {
					var _self = this
					
					api.getIcon()
						.then(function (res) {
							if (res.code == 200) {
								var data = res.data
								//Hjj
								if (data.updateDate != _self.updateDate) {
									window.localStorage.setItem('iconData', JSON.stringify(data))
									_self.imgLoad(data)
										.then(function () {
											navData.forEach(function (v, i) {
												v.img = data.icons[i] || {}
											})
										})
								}
							}
						})
				},
				imgLoad: function (data) {
					//图片加载
					return iPromise(function (resolve, reject) {
						var len = data.length * 2;
						var i = 0;
						var oImg;
						data.icons.forEach(function (v) {
							var j = 0
							do {
								oImg = new Image()
								if (oImg.complete) {
									i++
								} else {
									img.onload = function () {
										i++
									}
									img.onerror = function () {
										i++
									}
									if (j == 0) {
										oImg.src = v.defineUrl
									} else {
										oImg.src = v.activeUrl
									}
								}
								j++
							} while (j < 2)
						})
						if (i >= len) {
							resolve()
						}
					})
				},
			}
		})
		Vue.component('navigation', _nav)
	}

});