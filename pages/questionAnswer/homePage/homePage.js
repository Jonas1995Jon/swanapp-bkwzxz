import api from '../../../api/api.js';

// 监听页面加载的生命周期函数
var app = getApp()

Page({
    data: {
        nav: {
            section: [],
            currentIndx: 0
        },
        listData: [],
        isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组  
        searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
        callbackcount: 12,      //返回数据的个数  
        searchLoading: true, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
        smallClassId: ""
    },
    onLoad: function () {
        // var that = this;
        // 监听页面显示的生命周期函数
        this.setData('nav.currentId', '0');
        this.getLevel();
        //获取列表数据
        this.getQutionData("");
    },
    onReady: function () {
        // 监听页面初次渲染完成的生命周期函数
    },
    onShow: function () {
        // 监听页面显示的生命周期函数
        /* this.setData('nav.currentId', '0');
         this.getLevel();
         //获取列表数据
         this.getQutionData("");*/
    },
    onHide: function () {
        // 监听页面隐藏的生命周期函数
    },
    onUnload: function () {
        // 监听页面卸载的生命周期函数
    },
    onPullDownRefresh: function () {
        var that = this;
        // 监听用户下拉动作
        swan.showNavigationBarLoading(); // 加载动画
        //获取问题列表
        api.getQuestionList({
            method: 'POST',
            data: {
                pageSize: that.data.callbackcount,
                pageIndex: 1,
                smallClassId: that.data.smallClassId
            },
            success: res => {
                if (res.data.errcode == 0) {
                    var data = res.data.questions;
                    that.data.listData = data;
                    that.setData('listData', that.data.listData);
                    swan.showToast({
                        title: '刷新成功',
                        icon: 'success',
                        duration: 1500
                    });
                }
                swan.hideNavigationBarLoading() //完成停止加载
                swan.stopPullDownRefresh() //停止下拉刷新
            },
            fail: err => {
                console.log(err);
                swan.hideNavigationBarLoading() //完成停止加载
                swan.stopPullDownRefresh() //停止下拉刷新
            }
        })

    },

    onShareAppMessage: function () {
        // 用户点击右上角转发
    },
    tiaozhuan: function () {
        swan.navigateTo({
            url: '../questionPage/questionPage'
        });
    },
    toChannel() {
        swan.navigateTo({
            url: '../../index/channel/channel'
        });
    },
    toAnswer: function (e) {
        var id = e.currentTarget.id;
        swan.navigateTo({
            url: '../answerDetails/answerDetails?id=' + id
        });
    },
    // 单机nav事件
    handleTap(e) {
        var that = this;
        var smallClassId = e.currentTarget.id;
        that.setData({
            'nav.currentId': smallClassId,
            smallClassId: smallClassId,
            searchPageNum: 1
        });
        if (smallClassId == "0") {
            that.setData({
            smallClassId: ""
        });
            that.getQutionData("");
        } else {
            that.getQutionData(smallClassId);
        }
    },
    getLevel: function () {
        //获取分类
        var that = this;
        api.getLevel({
            method: 'POST',
            data: {
                pagesize: 5,
                pageindex: 1

            },
            success: res => {
                var data = res.data;
                var list = res.data.list;
                console.log(data);
                if (data.errcode == 0) {
                    var arr = [];
                    arr[0] = { level_name: '推荐', level_id: '0' };
                    list.unshift(arr[0]);
                    that.data.nav.section = list;
                    that.setData('nav', that.data.nav);
                }
            },
            fail: err => {
                console.log(err);
            }
        })
    },
    getQutionData: function (smallClassId) {
        var that = this;
        //获取问题列表
        api.getQuestionList({
            method: 'POST',
            data: {
                pageSize: that.data.callbackcount,
                pageIndex: 1,
                smallClassId: smallClassId
            },
            success: res => {
                if (res.data.errcode == 0) {
                    var data = res.data.questions;
                    that.data.listData = data;
                    that.setData('listData', that.data.listData);
                }

            },
            fail: err => {
                console.log(err);

            }
        })
    },
    onReachBottom: function () {
        // 页面上拉触底事件的处理函数
        var that = this;
        if (that.data.searchLoading && !that.data.searchLoadingComplete) {
            that.setData({
                searchPageNum: that.data.searchPageNum + 1,  //每次触发上拉事件，把searchPageNum+1  
                isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false  
            });
            that.fetchSearchList();
        }
    },
    fetchSearchList: function () {
        var that = this;
        var searchPageNum = that.data.searchPageNum;//把第几次加载次数作为参数  
        //获取问题列表
        api.getQuestionList({
            method: 'POST',
            data: {
                pageSize: that.data.callbackcount,
                pageIndex: searchPageNum,
                smallClassId: that.data.smallClassId

            },
            success: res => {
                var data = res.data.questions;
                //console.log(that.data.listData.concat(data));

                //判断是否有数据，有则取数据  
                if (data.length != 0) {
                    var listData = [];
                    //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
                    that.data.isFromSearch ? listData = data : listData = that.data.listData.concat(data)
                    that.setData({
                        listData: listData, //获取数据数组  
                        searchLoading: true   //把"上拉加载"的变量设为false，显示  
                    });
                    //没有数据了，把“没有数据”显示，把“上拉加载”隐藏  
                } else {
                    that.setData({
                        searchLoadingComplete: true, //把“没有数据”设为true，显示  
                        searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
                    });
                }
            },
            fail: err => {
                console.log(err);
            }
        })

    },

});