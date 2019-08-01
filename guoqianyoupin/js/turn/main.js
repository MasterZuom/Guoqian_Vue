define(function (require, exports, moduel) {
    var $ = require('jquery')
    require('../common/common')

    var jkCardMobile = window.localStorage.getItem('jkCardMobile');
    var jkcardtoken = window.localStorage.getItem('jkcardtoken');
    resource({
        type: 'get',
        // api: '/login',
        api: '/weixin/jkcard_wxLogin?code='+getParam('code') +'&mobile='+ jkCardMobile+'&jkcardtoken='+jkcardtoken
    })
        .then(function (result) {
            if (result.code === 200) {
                result.data.uuid=uuid()
                var loginInfoParam = result.data;
                localStorage.setItem('loginInfo', JSON.stringify(loginInfoParam))

                var turnUrl = window.localStorage.getItem('turnUrl').replace("jkcardtoken","userjkcardtoken");
                window.location.href = turnUrl //'/goods_detail.html?id=2752';
            } else {
                // app.errMsg = app.error.code
                alert(result.message)
            }
        })
        .fail(function (result) {
            // alert('--1')
        })

});

