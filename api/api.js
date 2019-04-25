import common from '../utils/common.js';

const app = getApp();
const host = app.globalData.host;

const swanRequest = (params, url) => {
  getNetworkType(); //获取网络状态
  const header = 'application/x-www-form-urlencoded; charset=UTF-8';
  swan.request({
    url: url,
    method: params.methods || 'POST',
    data: params.data || {},
    header: {
      'Content-Type': header
    },
    success: res => {
      params.success && params.success(res);
    },
    fail: res => {
      params.fail && params.fail(res);
    },
    complete: res => {
      params.complete && params.complete(res);
    }
  });
};
function getNetworkType() {
  swan.getNetworkType({
    complete: function (res) {
      if (res.isConnected == false || res.networkType == "none") {
        swan.showToast({
          title: '当前网络不可用',
          icon: 'none',
          showCancel: false,
          duration: 1500
        });
        return;
      }
    }
  });
  swan.onNetworkStatusChange(function (res) {
    if (res.isConnected == false || res.networkType == "none") {
      swan.showToast({
          title: '当前网络不可用',
          icon: 'none',
          showCancel: false,
          duration: 1500
        });
        return;
    }
  });
}

/**
 * desc：获取频道
 * api：资讯站_管理系统_获取分类类目
 */
const classifyCategory = params => swanRequest(params, host + '/categoryManage/classifyCategory');

/**
 * desc：获取文章列表
 * api：资讯站_管理系统获取文章列表
 */
const getRecommendArticle = params => swanRequest(params, host + '/article/getExamMaterials');

/**
 * desc：根据文章id获取文章详情
 * api：资讯站_管理系统根据id获取文章信息
 */
const selectExamMaterialsById = params => swanRequest(params, host + '/article/selectExamMaterialsById');

/**
 * desc：根据文章id修改文章访问量
 * api：资讯站_小程序_添加文章访问量
 */
const updateArticleVisitedNum = params => swanRequest(params, host + '/article/updateArticleVisitNum');

/**
 * 资讯站_管理系统_获取分类类目(顶栏)
 */
const getLevel = params => swanRequest(params, host + '/typeLevel/getTwoSortLevel');

/**
 * 资讯站_管理系统_获取问题列表
 */
const getQuestionList = params => swanRequest(params, host + '/questionManage/questionList');

/**
 * desc：发送验证码
 * api：资讯站_小程序_发送验证码
 */
const sendYZM = params => swanRequest(params, host + '/user/sendYZM');

/**
 * desc：快捷登录
 * api：资讯站_小程序_验证码登录
 */
const fastLogin = params => swanRequest(params, host + '/user/loginBySendSMS');

/**
 * desc：账户登录
 * api：资讯站_小程序_用户密码登录
 */
const accountLogin = params => swanRequest(params, host + '/user/loginByUserNameAndpwd');

/**
 * desc：我的提问
 * api：资讯站_小程序_根据userid获取问题
 */
const myQuestions = params => swanRequest(params, host + '/questionManage/smallProgramFindQuestionByUserId');

/**
 * desc：我的回答
 * api：资讯站_小程序_根据userid获取回答
 */
const myAnswers = params => swanRequest(params, host + '/answerManage/findAnswerByUserId');

module.exports = {
  classifyCategory,
  getRecommendArticle,
  selectExamMaterialsById,
  updateArticleVisitedNum,
  getLevel,
  getQuestionList,
  sendYZM,
  fastLogin,
  accountLogin,
  myQuestions,
  myAnswers
};