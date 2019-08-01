define(function (require, exports, moduel) {
	var $ = require('jquery')
	require('../common/common')
	var Vue = require('vue')
	var Vant = require('vant')
	Vue.use(Vant)

	var app = new Vue({
		data: function () {
			return {
				comments: [],
			}
		},
		created: function () {
			this.getMyReviewDetail()
		},
		mounted: function () {
			//this.$notify('');
		},
		methods: {
			$url: $url,
            getMyReviewDetail: function () {
				_self = this
                resource({
                    type: 'get',
                    api: '/review/baseDetailByOrder/'+getParam('orderId'),
                    token: loginInfo.token
                })
                    .then(function (res) {
                        if(res.code==200){
                            _self.comments = res.data.content
                        }
                    })
                    .fail(function (result) {
                        _self.$notify('网络错误');
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