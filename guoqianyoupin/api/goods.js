define(function (require, exports, moduel) {
	require('../js/common/common')
	var api = require('../api/common')

	//商品咨询
	var productConsultation = function (opts) {
		return resource({
			api: '/consultation/detail/' + opts.id,
			token: api.token,
			data: {
				pageNumber: opts.page
			}
		})
	}

	//我的咨询
	var myConsultation = function (opts) {
		return resource({
			api: '/consultation/myBasedetail',
			token: api.token,
			data: {
				pageNumber: opts.page
			}
		})
	}

	//产品详情测试
	var productDetailA = function (opts) {
		return resource({
			api: '/product/detail/' + opts,
			token: api.token
		})
	}

	//产品详情
	var productDetail = function (opts) {
		return resource({
			api: '/product/detail',
			token: api.token,
			data: opts
		})
	}

	//产品搜索
	var productSearch = function (opts) {
		//orderType : topDesc, priceAsc, priceDesc, salesDesc, scoreDesc, dateDesc
		return resource({
			api: '/product/search',
			token: api.token,
			data: opts
		})
	}

	//筛选搜索
	var list = function (opts) {
		//orderType : topDesc, priceAsc, priceDesc, salesDesc, scoreDesc, dateDesc
		return resource({
			api: '/product/list',
			token: api.token,
			data: opts
		})
	}

	//产品更多规格查询
	var skuDetail = function (opts) {
		return resource({
			api: '/product/skuSpecificationDetail',
			token: api.token,
			data: {
				productId: opts.id,
				entityValues: opts.val
			}
		})
	}

	//热搜关键字
	var hotSearch = function () {
		return resource({
			api: '/product/hotSearch',
			token: api.token
		})
	}

	//产品更多推荐
	var recommends = function (opts) {
		return resource({
			api: '/product/recommends',
			token: api.token,
			data: {
				productId: opts.id
			}
		})
	}

	return {
		productSearch: productSearch,
		productDetail: productDetail,
		myConsultation: myConsultation,
		productConsultation: productConsultation,
		skuDetail: skuDetail,
		list: list,
		hotSearch: hotSearch,
		recommends: recommends
	}



});