import api from '../../../api/api.js';
const app = getApp();
var first = 1;//工程类
var second = 3;//会计类
var third = 2;//金融类
Page({
    data: {
        channelList:[],
    },
    onLoad: function () {
        // 监听页面加载的生命周期函数
        this.setData({
            myChannelList: app.globalData.myChannelList
        })
        this.classifyCategory();
    },
    onReady: function() {
        // 监听页面初次渲染完成的生命周期函数
    },
    onShow: function() {
        // 监听页面显示的生命周期函数
    },
    onHide: function() {
        // 监听页面隐藏的生命周期函数
    },
    onUnload: function() {
        // 监听页面卸载的生命周期函数
    },
    onPullDownRefresh: function() {
        // 监听用户下拉动作
    },
    onReachBottom: function() {
        // 页面上拉触底事件的处理函数
    },
    onShareAppMessage: function () {
        // 用户点击右上角转发
    },
    myChannelTap: function(e){
        var id = e.currentTarget.dataset.id;
        swan.setStorage({
            key: 'selectedChannelId',
            data: id
        });
        swan.switchTab({
            url:"../index"
        })
    },
    closeTap: function(e){
        var index = e.currentTarget.dataset.index;
        var myChannelList = this.data.myChannelList;
        var channel = {
            id: myChannelList[index].level_id,
            realname: myChannelList[index].level_name
        } 
        this.data.channelList.push(channel);
        myChannelList.splice(index, 1);
        this.setData({
            myChannelList: myChannelList,
            channelList: this.data.channelList
        })
    },
    addchannel: function(e){
        var index = e.currentTarget.dataset.index;
        var myChannelList = this.data.myChannelList;
        var channelList = this.data.channelList;
        for(var i = 0; i < myChannelList.length; i++){
            //判断是否存在，不存在则添加到我的频道列表
            if(channelList[index].id == myChannelList[i].id){
                return;
            }
        }
        var channel = {
            level_id: channelList[index].id,
            level_name: channelList[index].realname
        }
        myChannelList.push(channel);
        channelList.splice(index,1);
        this.setData({
            myChannelList: myChannelList,
            channelList: channelList
        })
    },
    classifyCategory: function(){
        var that = this;
        swan.showLoading({
            title: '加载中',
            mask: true
        });
        api.classifyCategory({
            method: 'POST',
            data: {
                level: 2
            },
            success: res => {
                var data = res.data;
                if(data.errcode == 0){
                    var categoryList = data.category;
                    var myChannelList = that.data.myChannelList;
                    var secondChannel = [];
                    var thirdEndIndex = -1;
                    //排序，按大类fid从小到大排序，工程类第一，会计类第二，金融第三
                    categoryList.sort(function(a,b){
                        return a.fid - b.fid
                    })
                    //在此操作之前先排序
                    for(var i = 0; i < categoryList.length; i++){
                        if(categoryList[i].fid == third){
                            //抽取金融类，并从原列表移除
                            secondChannel.push(categoryList[i])
                            categoryList.splice(i,1);
                            i--;//移除元素，小标要变化
                            continue;
                        }
                        if(categoryList[i].fid == second){
                            //记住会计类最后元素在列表中的位置
                            thirdEndIndex = i;
                        }
                    }
                    //把移除的金融类，追加到第三的位置
                    for(var j = 0; j < secondChannel.length; j++){
                        categoryList.splice(thirdEndIndex + 1 + j, 0, secondChannel[j]);
                    }
                    //在频道推荐中，排除我的频道已有部分
                    for(var i = 0; i < categoryList.length; i++){
                        for(var j = 0; j < myChannelList.length; j++){
                            if(categoryList[i].id == myChannelList[j].id){
                                categoryList.splice(i,1);
                                i--;
                                break;
                            }
                        }
                    }
                    that.setData({
                        channelList: categoryList
                    })
                    swan.hideLoading();
                }
            },
            fail: err => {
                swan.hideLoading();
                console.log(err);
            }
        })
    }
});