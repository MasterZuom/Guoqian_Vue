define(function (require, exports, moduel) {
	require('../js/common/common')
	var api = require('../api/common')


	//首页获取广告位, 含banner的大广 告位, 拼团、限时抢购、高端旅游、豪车汇4个小广告位，以及国乾甄选3个广告位
	var adPositions = function (opts) {
		return resource({
			api: '/index/adPositions',
			token: api.token
		})
	}

	//首页获取品牌
	var brands = function (opts) {
		return resource({
			api: '/index/brands',
			token: api.token
		})
	}

	//首页获取顶级分类
	var categories = function (opts) {
		return resource({
			api: '/index/categories',
			token: api.token
		})
	}

	//首页获取分类商品列表,每个分类含一个广告位和2个或者3个商品
	var categoryProducts = function (opts) {
		return resource({
			api: '/index/categoryProducts',
			token: api.token
		})
	}

	//首页获取推荐列表, 含限时抢购,国乾爆款top10, 品牌爆品推荐,爆款清单
	var recommendations = function (opts) {
		return resource({
			api: '/index/recommendations',
			token: api.token
		})
	}

	return {
		adPositions: adPositions,
		brands: brands,
		categories: categories,
		categoryProducts: categoryProducts,
		recommendations: recommendations
	}

});