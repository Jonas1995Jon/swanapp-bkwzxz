import api from '../../../api/api.js';

Page({
    data: {
        baidu_userInfo: '',
        bkw_userInfo: '',
        questions: [], // 问题列表        
        currentPage: 1, // 当前页
        loadMore: false, // 加载更多
    },
    onLoad: function () {
        swan.showLoading({
            title: '加载中...',
            mask: true
        });
        this.myQuestions('up');
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
        swan.showNavigationBarLoading(); // 加载动画
        this.myQuestions('down');
    },
    onReachBottom: function () {
        this.setData({
            loadMore: true,
            currentPage: this.data.currentPage + 1
        });
        this.myQuestions('up');
    },
    onShareAppMessage: function () {
        // 用户点击右上角转发
    },
    // 获取我的问题
    myQuestions(way) {
        let bkw_userInfo = swan.getStorageSync('bkw_userInfo');
        api.myQuestions({
            methods: 'POST',
            data: {
                userId: bkw_userInfo.userid,
                currentPage: this.data.currentPage,
                pageSize: '12'
            },
            success: res => {
                let data = res.data;
                if (data.errcode == '0') {
                    let questions = this.data.questions;
                    if (way == 'down') {
                        for (let i = 0; i < data.questions.length; i++) {
                            questions[i] = data.questions[i];
                        }
                        this.setData('questions', questions);
                        swan.showToast({
                            title: '刷新成功',
                            icon: 'success',
                            duration: 1500
                        });
                    } else if (way == 'up') {
                        if (data.questions.length > 0) {
                            this.setData('questions', questions.concat(data.questions));
                        } else {
                            swan.showToast({
                                title: '已没有更多数据',
                                icon: 'success',
                                duration: 1500
                            });
                        }
                    }
                } else {
                    swan.showToast({
                        title: '暂无数据'
                    });
                }
                swan.hideLoading();
                this.setData('loadMore', false);
                swan.hideNavigationBarLoading() //完成停止加载
                swan.stopPullDownRefresh() //停止下拉刷新
            },
            fail: err => {
                console.log(err);
                this.setData('loadMore', false);
            }
        });
    },
    // 跳转到回答详情页
    toAnswerDetails: function (e) {
        var id = e.currentTarget.id;
        swan.navigateTo({
            url: '../../questionAnswer/answerDetails/answerDetails?id=' + id
        });
    }
});