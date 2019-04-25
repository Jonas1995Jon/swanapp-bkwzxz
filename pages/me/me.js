import common from '../../utils/common.js';

Page({
    data: {
        baidu_userInfo: '',
        bkw_userInfo: ''
    },
    onLoad: function () {        
        common.isLogin1();
    },
    onReady: function () {
        // 监听页面初次渲染完成的生命周期函数
    },
    onShow: function () {
        let baidu_userInfo = swan.getStorageSync('baidu_userInfo');
        let bkw_userInfo = swan.getStorageSync('bkw_userInfo');
        this.setData({
            baidu_userInfo: baidu_userInfo,
            bkw_userInfo: bkw_userInfo
        });
    },
    onHide: function () {
        // 监听页面隐藏的生命周期函数
    },
    onUnload: function () {
        // 监听页面卸载的生命周期函数
    },
    onPullDownRefresh: function () {
        // 监听用户下拉动作
    },
    onReachBottom: function () {
        // 页面上拉触底事件的处理函数
    },
    onShareAppMessage: function () {
        // 用户点击右上角转发
    },
    // 登录注册按钮
    logReg() {
        common.isLogin1();
        let baidu_userInfo = swan.getStorageSync('baidu_userInfo');
        let bkw_userInfo = swan.getStorageSync('bkw_userInfo');
        this.setData({
            baidu_userInfo: baidu_userInfo,
            bkw_userInfo: bkw_userInfo
        });
    },
    // 跳转到我的提问
    toMyQuestions() {
        let bkw_userInfo = this.data.bkw_userInfo;
        if (bkw_userInfo == '' || bkw_userInfo == null) {
            swan.navigateTo({
                url: 'myQuestions/myQuestions'
            });
        }
        swan.navigateTo({
            url: 'myQuestions/myQuestions'
        });
    },
    // 调转到我的回答
    toMyAnswer: function () {
        swan.navigateTo({
            url: 'myAnswer/myAnswer'
        });
    }
});