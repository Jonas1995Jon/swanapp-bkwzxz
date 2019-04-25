import common from '../../../utils/common.js';

// 监听页面加载的生命周期函数
var app = getApp();
var content = "";//输入内容
var askId,buttonRight='button-righted';
Page({
    data: {
        titles: "",
        subdis: true,
        buttonRight:buttonRight
    },
    formSubmitHandle: function (e) {
        console.log('form表单submit：', e.detail.value);
        content = e.detail.value.content;
    },
    //发布调用
    tapHandle:function(){
        let baidu_userInfo = swan.getStorageSync('baidu_userInfo');
        let bkw_userInfo = swan.getStorageSync('bkw_userInfo');
        if (baidu_userInfo == '' || baidu_userInfo == null) {
            common.isLogin2();
            return;
        }
        if (bkw_userInfo == '' || bkw_userInfo == null) {
            common.isLogin1();
            return;
        }
        if (buttonRight == "button-right") {

        } else {
            console.log("viewsback");
            return;
        }
        let niming = baidu_userInfo.nickName;
        let userid = bkw_userInfo.userid;
        let userimg = baidu_userInfo.avatarUrl;
        let tel = bkw_userInfo.tel;
        var mydata = {
            answer: content,//答案内容
            tosolve: 2,
            askId: askId,//问题id
            userId: userid,// 回答者id
            userImg: userimg, // 回答者头像
            username: niming,// 回答者姓名
            tel: tel,// 回答者电话
            loginUsername: niming// 登录者姓名
        };
        swan.request({
            url: app.globalData.host +  "/answerManage/addAnswer", //开发者服务器接口地址
            method: 'POST',
            dataType: 'json',
            data: mydata,
            header: {
                'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8"
            },
            success: function (res) {
                console.log(res.data);
                if (res.data.errcode == "0") {
                    swan.showToast({
                        title: "回答成功",
                        icon: 'success',
                        duration: 1000
                    });
                    content="";//清除页面缓存
                    setTimeout(function () {
                        swan.navigateBack({
                            delta: 1
                        });
                    }, 1500);
                } else {
                    swan.showToast({
                        title: res.data.errmsg,
                        icon: 'none',
                        duration: 1000,
                    });
                }
            },
            fail: function (err) {
                console.log("错误码：" + err.errCode);
                console.log("错误信息：" + err.errMsg);
            }
        });
    },
    blurcheck1: function (e) {
        console.log('光标离开', e.detail.value);
        content = e.detail.value;
        if (content != "") {
            buttonRight = "button-right";
            this.setData({ 'subdis': false, 'buttonRight': buttonRight });
        } else {
            buttonRight = "button-righted";
            this.setData({ 'subdis': true, 'buttonRight': buttonRight });
        }
    },
    bindinput1: function (e) {
        content = e.detail.value;
        if (content != "") {
            buttonRight = "button-right";
            this.setData({ 'subdis': false, 'buttonRight': buttonRight });
        } else {
            buttonRight = "button-righted";
            this.setData({ 'subdis': true, 'buttonRight': buttonRight });
        }
    },
    onLoad: function (options) {
        // 监听页面加载的生命周期函数
        console.log(options);
        askId = options.askId;
        this.setData({ 'titles': options.askt });
    },
    onReady: function () {
        // 监听页面初次渲染完成的生命周期函数
    },
    onShow: function () {
        
    },
    onHide: function () {
        // 监听页面隐藏的生命周期函数
    },
    onUnload: function () {
        // 监听页面卸载的生命周期函数
        content="";//清除页面缓存
    },
    onPullDownRefresh: function () {
        // 监听用户下拉动作
    },
    onReachBottom: function () {
        // 页面上拉触底事件的处理函数
    },
    onShareAppMessage: function () {
        // 用户点击右上角转发
    }
});