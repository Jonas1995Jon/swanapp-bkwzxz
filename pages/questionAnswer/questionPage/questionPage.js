import common from '../../../utils/common.js';

var title = "";//问题
var content = "";//描述
var level2id, buttonRight = "button-righted";//频道id
// 监听页面加载的生命周期函数
var app = getApp();
var classarry1, classarry2;
Page({
    data: {
        selectclass1: [{ level_id: 0, level_name: "" }],
        selectclass2: [{ level_id: 0, level_name: "" }],
        sindex1: 0,
        sindex2: 0,
        subdis: true,
        contentfocus: false,
        buttonRight: buttonRight
    },
    //选择事件
    bcPicker1: function (e) {
        this.setData({ 'sindex1': e.detail.value });
        //
        var fid = classarry1[e.detail.value].level_id;
        //
        classload({ fid: fid, level: 2 }, this);
    },
    bcPicker2: function (e) {
        this.setData({ 'sindex2': e.detail.value });
        //
        level2id = classarry2[e.detail.value].level_id;
    },
    //提交事件
    formSubmitHandle: function (e) {
        title = e.detail.value.title;
        content = e.detail.value.content;
        let baidu_userInfo = swan.getStorageSync('baidu_userInfo');
        let bkw_userInfo = swan.getStorageSync('bkw_userInfo');
        if (baidu_userInfo == '' || baidu_userInfo == null) {
            common.isLogin2();
        }
        if (bkw_userInfo == '' || bkw_userInfo == null) {
            common.isLogin1();
        } else {
            let niming = baidu_userInfo.nickName;
            let userid = bkw_userInfo.userid;
            let userimg = baidu_userInfo.avatarUrl;
            submitform({ ask: title, askcontent: content, columnid2: level2id, userid: userid, userimg: userimg, username: niming }, this);
        }
    },
    //光标离开时间
    blurcheck1: function (e) {
        console.log('光标离开', e.detail.value);
        title = e.detail.value;
        if (title != "" && content != "") {
            buttonRight = "button-right";
            this.setData({ 'subdis': false, 'buttonRight': buttonRight });
        } else {
            buttonRight = "button-righted";
            this.setData({ 'subdis': true, 'buttonRight': buttonRight });
        }
    },
    blurcheck2: function (e) {
        console.log('光标离开', e.detail.value);
        content = e.detail.value;
        if (title != "" && content != "") {
            buttonRight = "button-right";
            this.setData({ 'subdis': false, 'buttonRight': buttonRight });
        } else {
            buttonRight = "button-righted";
            this.setData({ 'subdis': true, 'buttonRight': buttonRight });
        }
        this.setData({ 'contentfocus': false });
    },
    //键盘输入
    bindinput1: function (e) {
        title = e.detail.value;
        if (title != "" && content != "") {
            buttonRight = "button-right";
            this.setData({ 'subdis': false, 'buttonRight': buttonRight });
        } else {
            buttonRight = "button-righted";
            this.setData({ 'subdis': true, 'buttonRight': buttonRight });
        }
    },
    bindinput2: function (e) {
        content = e.detail.value;
        if (title != "" && content != "") {
            buttonRight = "button-right";
            this.setData({ 'subdis': false, 'buttonRight': buttonRight });
        } else {
            buttonRight = "button-righted";
            this.setData({ 'subdis': true, 'buttonRight': buttonRight });
        }
    },
    //点击完成按钮时
    bindconfirm: function (e) {
        console.log('完成按钮', e.detail.value);
        this.setData({ 'contentfocus': true });
    },
    //发布调用
    tapHandle: function () {
        let baidu_userInfo = swan.getStorageSync('baidu_userInfo');
        let bkw_userInfo = swan.getStorageSync('bkw_userInfo');
        if (baidu_userInfo == '' || baidu_userInfo == null) {
            common.isLogin2();
        }
        if (bkw_userInfo == '' || bkw_userInfo == null) {
            common.isLogin1();
        } else if (buttonRight == "button-right") {
            let niming = baidu_userInfo.nickName;
            let userid = bkw_userInfo.userid;
            let userimg = baidu_userInfo.avatarUrl;
            submitform({ ask: title, askcontent: content, columnid2: level2id, userid: userid, userimg: userimg, username: niming }, this);
        } else {
            console.log("viewsback");
        }
    },
    onLoad: function (opt) {
        // 监听页面加载的生命周期函数
        //加载频道选项
        classload({ level: 1 }, this);
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
        console.log("卸载..");
        title = "";
        content = "";
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

function classload(datas, sthis) {
    swan.request({
        url: app.globalData.host + '/typeLevel/getAllSortLevel',
        method: 'POST',
        data: datas,
        header: {
            'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8"
        },
        success: res => {
            console.log(res.data);
            if (datas.level == 1) {
                sthis.setData({ 'selectclass1': res.data.list });
                classarry1 = res.data.list;
                classload({ fid: classarry1[0].level_id, level: 2 }, sthis);
            } else {
                sthis.setData({ 'selectclass2': res.data.list, 'sindex2': 0 });
                level2id = res.data.list[0].level_id;
                classarry2 = res.data.list;
            }
        },
        fail: err => {
            console.log(err);
        }
    });
}
//提交
function submitform(datas, sthis) {
    swan.request({
        url: app.globalData.host +  '/questionManage/addQuestion', //开发者服务器接口地址
        method: 'POST',
        dataType: 'json',
        data: datas,
        header: {
            'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8"
        },
        success: function (res) {
            console.log(res.data);
            if (res.data.errcode == "0") {
                swan.showToast({
                    title: "发布成功",
                    icon: 'success',
                    duration: 1000
                });
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
}