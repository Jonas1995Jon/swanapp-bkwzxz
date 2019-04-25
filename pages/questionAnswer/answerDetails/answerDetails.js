import api from '../../../api/api.js';
const test = 'https://test.manageapi.bkw.cn';
const manage = 'https://pe.manageapi.bkw.cn';
// 监听页面加载的生命周期函数
var app = getApp();
var isloading = 0;
var askId = 2179, askt = "2014年英语专4考试查询什么时候公布?";
Page({
    data: {
        ask: "",
        askcontent: "",
        userimg: "/images/logo.png",
        username: "",
        beforeint: 4,
        visitnum: 99,
        bestuserimg: "/images/logo.png",
        bestusername: "",
        answertime: "2019-04-04 06:30",
        bestanswer: "",
        sifbest: false,
        othernum: 0,
        listask: [{ username: '', userimg: '', answer: '', insertdate: '', type: "" }]
    },
    // js只能转换yyyy/MM/dd HH:mm:ss
    // var str1 = "2014-12-31 00:55:55" // yyyy-mm-dd这种格式的字符串转化成日期对象可以用new Date(Date.parse(str.replace(/-/g,"/")));
    // alert("格式化字符串\n" + str1 + " 为日期格式 \n" + new Date(Date.parse(str1.replace(/-/g, "/"))).format('yyyy-MM-dd hh:mm:ss')) 
    answerIng: function (e) {
        console.log('我要回答');
        swan.navigateTo({
            url: '../answerPage/answer?askId=' + askId + '&askt=' + askt
        });
    },
    onLoad: function (options) {
        // 监听页面加载的生命周期函数
        askId = options.id;
        //添加访问数量
        addvisit({ id: askId }, this);
        console.log("details加载....");
    },
    onShow: function (options) {
        // 监听页面显示的生命周期函数
        console.log("显示页面");
        requesbyid({ askId: askId }, this);
        requestAnswerList({ askId: askId }, this);
    },
    //下拉刷新回调
    onPullDownRefresh: function () {
        swan.showNavigationBarLoading(); // 加载动画
        requesbyid({ askId: askId }, this);
        requestAnswerList({ askId: askId }, this);
        setTimeout(function () {
            swan.hideNavigationBarLoading() //完成停止加载
            swan.stopPullDownRefresh() //停止下拉刷新
        }, 700);
    },
});
function requesbyid(datas, sthis) {
    //获取问题数据
    swan.request({
        url: app.globalData.host + "/questionManage/smallProgramFindQuestionById", //开发者服务器接口地址
        method: 'POST',
        dataType: 'json',
        data: datas,
        header: {
            'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8"
        },
        success: function (res) {
            console.log(res.data);
            var data = res.data;
            var ifbests = false;
            if (data.bestanswerstate == "1" || data.bestanswer != "") {
                ifbests = true;
                data.bestanswer = data.bestanswer.replace(/<br>/g, "");
            }
            data.askcontent = data.askcontent.replace(/<br>/g, "");

            askt = data.ask;
            sthis.setData({
                'ask': data.ask,
                'askcontent': data.askcontent,
                'userimg': data.userimg,
                'username': data.username,
                'beforeint': data.questioninsertdate,
                'visitnum': data.visitnum,
                'bestuserimg': data.bestuserimg,
                'bestusername': data.bestusername,
                'answertime': data.answerinsertdate,
                'bestanswer': data.bestanswer,
                'sifbest': ifbests
            });
        },
        fail: function (err) {
            console.log("错误码：" + err.errCode);
            console.log("错误信息：" + err.errMsg);
        }
    });
}
function requestAnswerList(datas, sthis) {
    //获取列表数据
    swan.request({
        url: app.globalData.host + "/answerManage/findAnswerByAskId", //开发者服务器接口地址
        method: 'GET',
        dataType: 'json',
        data: datas,
        header: {
            'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8"
        },
        success: function (res) {
            console.log(res.data);
            var data = res.data;
            var arry = data.answers;
            for (var index in arry) {
                if (arry[index].answer == undefined) {

                } else {
                    arry[index].answer = arry[index].answer.replace(/<br>/g, "");
                }
            }
            sthis.setData({
                'listask': data.answers,
                'othernum': data.totalAnswer
            });

        },
        fail: function (err) {
            console.log("错误码：" + err.errCode);
            console.log("错误信息：" + err.errMsg);
        }
    });
}
function addvisit(datas, sthis) {
    //添加访问量
    swan.request({
        url: app.globalData.host + "/questionManage/updateQuestionVisitNum",
        method: 'GET',
        dataType: 'json',
        data: datas,
        header: {
            'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8"
        },
        success: function (res) {
            // console.log(res.data);
        },
        fail: function (err) {
            console.log("错误码：" + err.errCode);
            console.log("错误信息：" + err.errMsg);
        }
    });
}