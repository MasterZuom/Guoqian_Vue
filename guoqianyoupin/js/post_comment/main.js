define(function (require, exports, moduel) {
    var $ = require('jquery')
    require('../common/common')
    var commentApi = require('../../api/comments')
    var memberApi = require('../../api/member')
    var pluginApi = require('../../api/plugin')
    var orderApi = require('../../api/order')
    var Vue = require('vue')
    var Vant = require('vant')
    Vue.use(Vant)

    var app = new Vue({
        data: function () {
            return {
                productId: [],
                //itemId: '',
                orderData: {},
                memberId: '',
                score: [],
                content: [],
                imgs: [],
                loading: false,
                finished: false,
                page: 1,
                show: {
                    pageLoading: true
                },
                state: {
                    locked: false
                },
                totalPage: '',
                comments:[],
                uploadBtnSta:[],
                indexItem:'',
            }
        },
        created: function () {
            //this.productId = Number(getParam('pId'))
            //this.itemId = Number(getParam('itemId'))
            this.getMember()
            this.getGoods()
        },

        mounted: function () {
            //this.$notify('');
        },
        computed: {
            uploadBtnSta: function () {
                if (this.imgs.length >= 3) {
                    return false
                }
                return true
            }
        },
        methods: {
            $url: $url,
            getGoods: function () {
                var _self = this
                // orderApi.orderDetail({
                //     orderSn: getParam('orderId')
                // })
                return orderApi.orderDetail({
                    orderSn: getParam('sn')
                })
                    .then(function (res) {
                        if (res.code == 200) {
                            _self.orderData = res.data;
                            for(var i=0;i<res.data.orderItemVOs.length;i++){
                                _self.score.push(5);
                                _self.content.push('');
                                _self.productId.push(res.data.orderItemVOs[i].productId);
                                _self.uploadBtnSta.push(true);
                                _self.$set(_self.imgs, i, [])
                            }
                        }
                    })
                    .always(function () {
                        _self.show.pageLoading = false
                    })
            },
            getMember: function () {
                var _self = this
                return memberApi.info()
                    .then(function (res) {
                        _self.memberId = res.data.id
                    })
            },
            setImgArr:function (index) {
                var _self = this
                _self.indexItem = index;
            },
            uploader: function (files) {
                //上传图片
                var _self = this
                var oData = new FormData();
                oData.append('file', files.file)
                oData.append('fileType', 'image')
                pluginApi.uploader(oData)
                    .then(function (res) {
                        if (res.code == 200) {
                            _self.imgs[_self.indexItem].push(res.data.url)
                        }
                    })

                    .fail(function (res) {
                        _self.$notify('网络错误');
                    })

            },
            removeImg: function (i,j) {
                //删除图片
                this.imgs[j].splice(i, 1)
            },
            commit: function () {
                var _self = this

                // if (_self.content.length > 100) {
                // 	_self.$toast({
                // 		message: '评论字数超出限制'
                // 	})
                // 	return
                // }
                if (_self.state.locked) {
                    return
                }
                _self.state.locked = true


                var params = [];
                for(var i=0;i<_self.orderData.orderItemVOs.length;i++){
                    params.push({
                        content: _self.content[i] || '此用户未填写评价。',
                        creatDate: '',
                        memberId: _self.memberId,
                        productId: _self.productId[i],
                        orderId:getParam('orderId'),
                        score: _self.score[i],
                        images: _self.imgs[i].join(','),
                        show: true
                    })
                }

                commentApi.savaReviews(params)
                	.then(function (res) {
                		_self.$toast({
                			message: res.message,
                			duration: 1000
                		})
                		setTimeout(function () {
                			window.history.back(-1)
                		}, 1100)
                	})
                	.fail(function (res) {
                		if (res.status == 422) {
                			_self.$toast({
                				message: res.responseJSON.message
                			})
                			return
                		}
                		_self.$notify('网络错误')
                	})
                	.always(function () {
                		_self.state.locked = false
                	})
            }
        }
    }).$mount('#page');




});