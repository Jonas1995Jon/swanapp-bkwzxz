import common from '../../../utils/common.js';
import api from '../../../api/api.js';

Page({
    data: {
        loginWay: true, // 登录方式，true为快捷登录，false为账号登录
        mobile: '', // 手机号
        pwd: '', // 密码
        second: 60,
        secondMsg: '发送验证码',
        sendCodeBtnDisabled: false, // 是否允许发送验证码
        loginBtn: true // 登录按钮是否激活
    },
    onLoad: function () {

    },
    onReady: function () {
        // 监听页面初次渲染完成的生命周期函数
    },
    onShow: function () {
        // 监听页面显示的生命周期函数
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
    loginWay(e) {
        let way = e.currentTarget.dataset.way;
        if (way == 'fast') {
            this.setData('loginWay', true);
        } else if (way == 'account') {
            this.setData('loginWay', false);
        }
    },
    // 检测手机号输入
    mobileInput(e) {
        let mobile = e.detail.value;
        this.setData('mobile', mobile);
    },
    // 检测密码输入
    pwdInput (e) {
        let pwd = e.detail.value;
        this.setData('pwd', pwd);
    },
    sendYZM() {
        let mobile = this.data.mobile;
        let bool = common.validatemobile(mobile);
        if (bool) {
            if (!this.data.sendCodeBtnDisabled) {
                this.setData('loginBtn', false);
                api.sendYZM({
                    methods: 'POST',
                    data: {
                        phone: mobile
                    },
                    success: res => {
                        let data = res.data;
                        swan.showToast({
                            title: data.errmsg,
                            icon: 'success',
                            duration: 1500
                        });
                    },
                    fail: err => {
                        console.log(err)
                    }
                });
                this.countdown();
            }
        }
    },
    // 从60到到0倒计时  
    countdown() {
        var second = this.data.second;
        if (second == 0) {
            this.setData({
                second: 60,
                secondMsg: "重新获取",
                sendCodeBtnDisabled: false
            });
            return;
        }
        var time = setTimeout(() => {
            this.setData({
                second: second - 1,
                secondMsg: '重新发送(' + this.data.second + 's)',
                sendCodeBtnDisabled: true
            });
            clearTimeout(time);
            this.countdown();
        }, 1000);
    },
    formSubmitHandle(e) {
        let mobile = e.detail.value.mobile;
        let yzm = e.detail.value.yzm;
        if (this.data.loginWay) {
            if (yzm == '' || yzm == null || yzm.length != 6) {
                swan.showToast({
                    title: '验证码有误'
                });
                return;
            }
            this.fastLogin(mobile, yzm);
        } else {            
            if (mobile == '' || mobile == null) {
                swan.showToast({
                    title: '请输入用户名'
                });
                return;
            }
            if (yzm == '' || yzm == null) {
                swan.showToast({
                    title: '密码不能为空'
                });
                return;
            }
            this.accountLogin(mobile, yzm);
        }
    },
    // 快捷登录
    fastLogin(mobile, yzm) {
        let baidu_userInfo = swan.getStorageSync('baidu_userInfo');
        api.fastLogin({
            methods: 'POST',
            data: {
                phone: mobile,
                yzm: yzm,
                username: baidu_userInfo.nickName || ''
            },
            success: res => {
                let data = res.data;
                if (data.errcode == '0') {
                    swan.setStorageSync('bkw_userInfo', data);
                    swan.navigateBack();
                } else {
                    swan.showToast({
                        title: data.errmsg
                    });
                }
            },
            fail: err => {
                console.log(err);
            }
        });
    },
    // 账户登录
    accountLogin(mobile, pwd) {
        api.accountLogin({
            methods: 'POST',
            data: {
                username: mobile,
                password: pwd
            },
            success: res => {
                let data = res.data;
                if (data.errcode == '0') {
                    swan.setStorageSync('bkw_userInfo', data);
                    swan.navigateBack();
                } else {
                    swan.showToast({
                        title: data.errmsg
                    });
                }
            },
            fail: err => {
                console.log(err);
            }
        });
    }
});