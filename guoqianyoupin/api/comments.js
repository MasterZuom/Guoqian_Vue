define(function (require, exports, moduel) {
    require('../js/common/common')
    var api = require('../api/common')

    //我的评论
    var myReviewList = function (page) {
        return resource({
            api: '/review/basedetial',
            token: api.token,
            data: {
                pageNumber: page
            }
        })
    }

    //产品评论
    var comments = function (opts) {
        return resource({
            api: '/review/basedetail/' + opts.id,
            token: api.token,
            data: {
                pageNumber: opts.page
            }
        })
    }

    //保存评论
    var save = function (opts) {
        return resource({
            type: 'POST',
            api: '/review/basedetial/savaReview',
            token: api.token,
            params: opts
        })
    }

    //批量保存评论
    var savaReviews = function (opts) {
        return resource({
            type: 'POST',
            api: '/review/basedetial/savaReviews',
            token: api.token,
            params: opts
        })
    }

    return {
        getMyReviewList: myReviewList,
        comments: comments,
        save: save,
        savaReviews:savaReviews
    }



});