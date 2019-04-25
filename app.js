/**
 * @file app.js
 * @author swan
 */
App({
    onLaunch(options) {
        if (swan.canIUse('getUpdateManager')) {
            const updateManager = swan.getUpdateManager()
            updateManager.onCheckForUpdate(function (res) {
                // 请求完新版本信息的回调
                if (res.hasUpdate) {
                    updateManager.onUpdateReady(function () {
                        swan.showModal({
                            title: '更新提示',
                            content: '新版本已经准备好，是否重启应用？',
                            success: function (res) {
                                console.log(res)
                                if (res.confirm) {
                                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                    updateManager.applyUpdate()
                                }
                            }
                        })
                    })
                    updateManager.onUpdateFailed(function () {
                        // 新的版本下载失败
                        swan.showModal({
                            title: '已经有新版本了哟~',
                            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
                        })
                    })
                }
            })
        } else {
            // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
            // swan.showModal({
            //   title: '提示',
            //   content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            // })
        }
    },
    onShow(options) {
        // do something when show
    },
    onHide() {
        // do something when hide
    },
    globalData: {
        'appID': '15991946',
        'appKey': 'FO20IZBhI6WKGumP3z4n7rSrHlwt6XN5',
        'appSecret': 'TnQXLcVbAhr90DFzY821t2Vl4GGIHw8z',
        'originName': '帮考网校',
        /**
         * 测试：https://test.manageapi.bkw.cn
         * 线上：https://pe.manageapi.bkw.cn
         */
        'host': 'https://pe.manageapi.bkw.cn',
        'myChannelList':[
            {
                level_id: 0,
                level_name: "推荐"
            },
            {
                level_id: 9,
                level_name: "一建考试"
            },
            {
                level_id: 10,
                level_name: "二建考试"
            },
            {
                level_id: 66,
                level_name: "注册会计"
            },
            {
                level_id: 63,
                level_name: "初级会计"
            },
            {
                level_id: 64,
                level_name: "中级会计"
            },
            {
                level_id: 55,
                level_name: "证券从业"
            },
            {
                level_id: 56,
                level_name: "基金从业"
            },
            {
                level_id: 11,
                level_name: "消防考试"
            },
            {
                level_id: 68,
                level_name: "中级经济师"
            },
            {
                level_id: 57,
                level_name: "期货从业"
            },
            {
                level_id: 58,
                level_name: "银行从业"
            },
        ]
    }
});