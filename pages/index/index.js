
import api from '../../api/api.js'
const app = getApp();

Page({
    data: {
        // 导航栏
        nav: {
            section: [
                { name: '推荐', level_id: '0' },
                { name: '一建考试', level_id: '9' },
                { name: '二建考试', level_id: '10' },
                { name: '注册会计', level_id: '66' },
                { name: '初级会计', level_id: '63' },
                { name: '中级会计', level_id: '64' },
                { name: '证券从业', level_id: '55' },
                { name: '基金从业', level_id: '56' },
                { name: '消防考试', level_id: '11' },
                { name: '中级经济师', level_id: '68' },
                { name: '期货从业', level_id: '57' },
                { name: '银行从业', level_id: '58' }
            ]
        },
        articles: [],
        currentPage: 1, // 当前页
        loadMore: false, // 加载更多
    },
    onLoad: function () {
        // 选中的导航id，默认是0
        swan.setStorageSync('selectedChannelId', '0');
        swan.showLoading({
            title: '加载中...',
            mask: true
        });
        // 获取导航内容
        this.getChannel();
        // 获取文章列表，默认进来是推荐
        this.getRecommendArticle();
        swan.login({
            success: res => {
                swan.getUserInfo({
                    success: res => {
                        let userInfo = res.userInfo;
                        swan.setStorageSync('baidu_userInfo', {'nickName': userInfo.nickName, 'avatarUrl': userInfo.avatarUrl});
                    }
                });
            }
        });
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
        swan.showNavigationBarLoading(); // 加载动画
        this.loadBestNewArticle();
    },
    onReachBottom: function () {
        this.setData({
            loadMore: true,
            currentPage: this.data.currentPage + 1
        });
        this.loadMoreArticle();
    },
    onShareAppMessage: function () {
        // 用户点击右上角转发
    },
    // 单击nav事件
    handleTap(e) {
        this.setData('nav.currentId', e.currentTarget.id);
        swan.setStorageSync('selectedChannelId', e.currentTarget.id);
        this.getRecommendArticle();
    },
    // 跳转频道页
    toChannel() {
        swan.navigateTo({
            url: 'channel/channel'
        });
    },
    getChannel() {
        let myChannel = app.globalData.myChannelList;
        let navs = [];
        myChannel.forEach(channel => {
            navs.push({ 'level_id': channel.level_id, 'level_name': channel.level_name });
        });
        this.setData('nav.section', navs);
        this.setData('nav.currentId', 0);
    },
    // 获取文章列表
    getRecommendArticle() {
        let categoryId = swan.getStorageSync('selectedChannelId');
        let columnid2 = '';
        if (categoryId != 0) {
            columnid2 = categoryId;
        }
        api.getRecommendArticle({
            methods: 'POST',
            data: {
                type: '1',
                pageindex: '1',
                pagesize: '12',
                columnid2: columnid2
            },
            success: res => {
                var data = res.data;
                if (data.errcode == 0) {
                    let articleList = data.list;
                    let aritcleArr = [];
                    articleList.forEach(article => {
                        aritcleArr.push({
                            "id": article.id,
                            "title": article.title,
                            "imgs": article.imgs || [],
                            "name": app.globalData.originName,
                            "insertdate": article.insertdate,
                            "viewNum": article.visitnum || 0
                        });
                    });
                    this.setData('articles', aritcleArr);
                } else {
                    console.log(data.errmsg);
                }
                swan.hideLoading();
            },
            fail: err => {
                console.log(err);
                swan.hideLoading();
            }
        });
    },
    // 上拉刷新，加载更多文章
    loadMoreArticle() {
        let categoryId = swan.getStorageSync('selectedChannelId');
        let columnid2 = '';
        if (categoryId != 0) {
            columnid2 = categoryId;
        }
        api.getRecommendArticle({
            methods: 'POST',
            data: {
                type: '1',
                pageindex: this.data.currentPage,
                pagesize: '12',
                columnid2: columnid2
            },
            success: res => {
                var data = res.data;
                if (data.errcode == 0) {
                    let articleList = data.list;
                    if (articleList.length > 0) {
                        let aritcleArr = this.data.articles;
                        articleList.forEach(article => {
                            aritcleArr.push({
                                "id": article.id,
                                "title": article.title,
                                "imgs": article.imgs || [],
                                "name": app.globalData.originName,
                                "insertdate": article.insertdate,
                                "viewNum": article.visitnum || 0
                            });
                        });
                        this.setData('articles', aritcleArr);
                    } else {
                        swan.showToast({
                            title: '已没有更多数据',
                            icon: 'success',
                            duration: 1500
                        });
                    }
                } else {
                    console.log(data.errmsg);
                }
                this.setData('loadMore', false);
            },
            fail: err => {
                console.log(err);
                this.setData('loadMore', false);
            }
        });
    },
    // 跳转频道页
    toChannel() {
        swan.navigateTo({
            url: 'channel/channel'
        });
    },
    getChannel() {
        let myChannel = app.globalData.myChannelList;
        let navs = [];
        myChannel.forEach(channel => {
            navs.push({ 'level_id': channel.level_id, 'level_name': channel.level_name });
        });
        this.setData('nav.section', navs);
        this.setData('nav.currentId', 0);
    },
    // 下拉刷新，加载最新文章
    loadBestNewArticle() {
        let categoryId = swan.getStorageSync('selectedChannelId');
        let columnid2 = '';
        if (categoryId != 0) {
            columnid2 = categoryId;
        }
        api.getRecommendArticle({
            methods: 'POST',
            data: {
                type: '1',
                pageindex: '1',
                pagesize: '12',
                columnid2: columnid2
            },
            success: res => {
                var data = res.data;
                if (data.errcode == 0) {
                    let articleList = data.list;
                    let articles = this.data.articles;
                    let obj = {};
                    for (let i = 0; i < articleList.length; i++) {
                        obj = {
                            "id": articleList[i].id,
                            "title": articleList[i].title,
                            "imgs": articleList[i].imgs || [],
                            "name": app.globalData.originName,
                            "insertdate": articleList[i].insertdate,
                            "viewNum": articleList[i].visitnum  || 0
                        };
                        articles[i] = obj;
                    }
                    this.setData('articles', articles);
                    swan.showToast({
                        title: '刷新成功',
                        icon: 'success',
                        duration: 1500
                    });
                } else {
                    console.log(data.errmsg);
                }
                swan.hideNavigationBarLoading() //完成停止加载
                swan.stopPullDownRefresh() //停止下拉刷新
            },
            fail: err => {
                console.log(err);
                swan.hideNavigationBarLoading() //完成停止加载
                swan.stopPullDownRefresh() //停止下拉刷新
            }
        });
    },
    // 跳转文章详情页
    getArticleDetailById(e) {
        api.updateArticleVisitedNum({
            methods: 'POST',
            data: {
                id: e.currentTarget.id
            },
            success: res => {
                console.log(res.data);
            },
            fail: err => {
                console.log(err);
            }
        });
        swan.navigateTo({
            url: 'consultationdetails/consultationdetails?articleId=' + e.currentTarget.id
        });
    }
});