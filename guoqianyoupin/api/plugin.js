define(function (require, exports, moduel) {
	require('../js/common/common')
	var api = require('../api/common')

	//上传
	var uploader = function (opts) {
		return resource({
			type: 'POST',
			api: '/upload/uploadImg',
			token: api.token,
			contentType : false,
			processData : false,
			data: opts
		})
	}

	return {
		uploader: uploader
	}

});