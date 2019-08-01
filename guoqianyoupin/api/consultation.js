define(function (require, exports, moduel) {
	require('../js/common/common')
	var api = require('../api/common')

	//商品咨询
	var product = function (opts) {
		return resource({
			api: '/consultation/detail/' + opts.id,
			token: api.token,
			data: {
				pageNumber: opts.page
			}
		})
	}

	//保存提问
	var save = function (opts) {
		return resource({
			type: 'POST',
			api: '/consultation/save/' + opts.id + '/' + opts.content,
			token: api.token
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

	return {
		myConsultation: myConsultation,
		product: product,
		save: save
	}



});