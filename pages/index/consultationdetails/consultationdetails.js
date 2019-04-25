import api from '../../../api/api.js';
var articleId = '';
Page({
    data: {

    },
    onLoad: function (params) {
        // 监听页面加载的生命周期函数
        articleId = params.articleId;
        this.selectExamMaterialsById(articleId);
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
    shareTap: function(){
        swan.openShare({
            title: '咨询详情',
            content: this.data.article.title,
            path: '/pages/index/consultationdetails/consultationdetails?articleId=' + articleId
        });
    },
    selectExamMaterialsById: function(articleId){
        api.selectExamMaterialsById({
            method: 'POST',
            data: {
                id: articleId
            },
            success: res => {
                var data = res.data;
                if(data.errcode == 0){
                    data.list[0].insertdate = data.list[0].insertdate.slice(0,10); 
                    //去掉<o:p></o:p>此类代码
                    data.list[0].articlecontent = data.list[0].articlecontent.replace(/<o:.+?><\/o:\w+?>/ig, "");
                    this.setData({
                        article: data.list[0]
                    })
                }
            },
            fail: err => {

            }
        })
    }
});