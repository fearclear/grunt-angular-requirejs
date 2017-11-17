/**
 * 与服务器ajax交互的service模块
 */
'use strict';

define(['app', 'md5', 'storage'], function (app, md5, storage) {
  return app.factory('serverService', ['$http', '$q', '$cookies', function ($http, $q, $cookies) {
    //基础url配置
    var url = storage.KEY.API.url;
    var winUrl = storage.KEY.API.winUrl;
    var nbfUrl = storage.KEY.API.nbfUrl;
    var wordUrl = storage.KEY.API.wordUrl;
    var stateUrl = storage.KEY.API.stateUrl;
    /**************************更改token**********************************************/
      //获取token
    var token = ''
    if (storage.local.getItem(storage.KEY.USERINFO)) {
      token = storage.local.getItem(storage.KEY.USERINFO).userId
    }

    function changeToken(newT) {
      $http.defaults.headers.common['x-basin-token'] = newT;
    }

    /**************************用户信息模块**********************************************/
    /*
         登录及密码修改
         */

    //登录
    function login(user) {
      var defer = $q.defer();
      var hash3 = md5.hex_md5(user.password);
      var hash2 = md5.hex_md5(hash3);
      var hash = md5.hex_md5(hash2);
      delete $http.defaults.headers.common['x-basin-token']
      $http({
        url: url + '/login',
        method: 'POST',
        headers: {
          "x-basin-terminal": "PC",
          "x-basin-version": "1",
        },
        data: 'loginName=' + user.name + '&password=' + hash
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //修改密码
    function changePassword(oldPassword, newPassword, confirmPassword) {
      var defer = $q.defer();
      var old_hash3 = md5.hex_md5(oldPassword);
      var old_hash2 = md5.hex_md5(old_hash3);
      var old_hash = md5.hex_md5(old_hash2);
      var new_hash3 = md5.hex_md5(newPassword);
      var new_hash2 = md5.hex_md5(new_hash3);
      var new_hash = md5.hex_md5(new_hash2);
      var con_hash3 = md5.hex_md5(confirmPassword);
      var con_hash2 = md5.hex_md5(con_hash3);
      var con_hash = md5.hex_md5(con_hash2);
      $http({
        url: url + '/changePassword',
        method: 'PUT',
        data: 'oldPassword=' + old_hash + '&newPassword1=' + new_hash + '&newPassword2=' + con_hash
      })./*data: {
             oldPassword: old_hash,
             newPassword1: new_hash,
             newPassword2: con_hash
             }*/
      success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    /**************************统计报表模块**********************************************/
    // 获取持仓报表列表
    function getClaireHoldingReport(params) {
      var defer = $q.defer();
      $http({
        url: url + '/claire/holdingReport',
        method: 'GET',
        params: params,
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    // 获取持仓报表变化
    function getClaireHoldingChange(params) {
      var defer = $q.defer();
      $http({
        url: url + '/claire/holdingChange',
        method: 'GET',
        params: params
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    // 获取持仓报表变化
    function getFindata(params) {
      var defer = $q.defer();
      $http({
        url: url + '/position/findata',
        method: 'GET',
        params: params
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    // 获取持仓指标
    function getFindataStats(startDate, endDate) {
      var defer = $q.defer();
      $http({
        url: url + '/position/findataStats',
        method: 'GET',
        params: {
          startDate: startDate,
          endDate: endDate,
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    // 获取净值走势对比图
    function getFindataTotalNetValue(startDate, endDate, fundId, period) {
      var defer = $q.defer();
      $http({
        url: url + '/position/findata/totalNetValue',
        method: 'GET',
        params: {
          startDate: startDate,
          endDate: endDate,
          fundId: fundId,
          period: period
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    // 获取附加基准
    function getFindataNetValueQuote(startDate, endDate, iwindCode, period) {
      var defer = $q.defer();
      $http({
        url: url + '/position/findata/quote',
        method: 'GET',
        params: {
          startDate: startDate,
          endDate: endDate,
          iwindCode: iwindCode,
          period: period
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    // 获取附加基准
    function getRepoSummary() {
      var defer = $q.defer();
      $http({
        url: url + '/position/biz/repo/summary',
        method: 'GET',
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    // 获取附加基准
    function getBizUserSummary(startDate, endDate) {
      var defer = $q.defer();
      $http({
        url: url + '/position/biz/user/summary',
        method: 'GET',
        params: {
          startDate: startDate,
          endDate: endDate,
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    /**************************持仓管理模块**********************************************/
    // 获取持仓全景
    function getHoldingAll(date) {
      var defer = $q.defer();
      $http({
        url: url + '/holdingAll',
        method: 'GET',
        params: {
          date: date,
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    // 根据公司ID查询债券
    function getHoldingProductByCompanyEID(valueDate, companyEID) {
      var defer = $q.defer();
      $http({
        url: url + '/claire/holdingProductByCompanyEID',
        method: 'GET',
        params: {
          valueDate: valueDate,
          companyEID: companyEID,
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    // 根据债券到期日查询债券
    function getHoldingProductByDueDate(valueDate, dueDate) {
      var defer = $q.defer();
      $http({
        url: url + '/claire/holdingProductByDueDate',
        method: 'GET',
        params: {
          valueDate: valueDate,
          dueDate: dueDate,
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    // 获取产品纵览
    function getFundAll(params) {
      var defer = $q.defer();
      $http({
        url: url + '/fundAll',
        method: 'GET',
        params: params
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //获取风控指标
    function getMainSummary(workday) {
      var defer = $q.defer();
      $http({
        url: url + '/risk/summary',
        method: 'GET',
        params: {
          workday: workday
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //获取利率盘
    function getFuture(workday) {
      var defer = $q.defer();
      $http({
        url: url + '/risk/future',
        method: 'GET',
        params: {
          workday: workday
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //新增利率盘
    function addFuture(data) {
      var defer = $q.defer();
      $http({
        url: url + '/risk/future',
        method: 'POST',
        data: 'workday=' + data.workday + '&fundId=' + data.fundId + '&startInterest=' + data.startInterest + '&endInterest=' + data.endInterest
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //获取利率盘持仓
    function getFuturePosition(workday, fundId) {
      var defer = $q.defer();
      $http({
        url: url + '/risk/future/position',
        method: 'GET',
        params: {
          workday: workday,
          fundId: fundId
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //获取funding
    function getFunding(workday) {
      var defer = $q.defer();
      $http({
        url: url + '/risk/fund',
        method: 'GET',
        params: {
          workday: workday
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //添加funding
    function addFunding(data) {
      var defer = $q.defer();
      $http({
        url: url + '/risk/fund',
        method: 'POST',
        data: 'fundId=' + data.fundId + '&capital=' + data.capital + '&costPercent=' + data.costPercent + '&daily=' + data.daily
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    // 获取回购成本比例
    function getRepoCostPercent() {
      var defer = $q.defer();
      $http({
        url: url + '/risk/repoCostPercent',
        method: 'GET',
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    // 修改回购成本比例
    function updateRepoCostPercent(value) {
      var defer = $q.defer();
      $http({
        url: url + '/risk/data',
        method: 'POST',
        data: 'value=' + value + '&name=repoCostPercent'
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    // 获取产品纵览
    function getRiskBond(workday) {
      var defer = $q.defer();
      $http({
        url: url + '/risk/bond',
        method: 'GET',
        params: {
          workday: workday
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    // 修改产品纵览
    function updateRiskBond(data) {
      var defer = $q.defer();
      $http({
        url: url + '/risk/bond',
        method: 'POST',
        data: 'iWindCode=' + data.iWindCode + '&isConvertible=' + data.isConvertible + '&isRateBond=' + data.isRateBond
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    /**************************信用评级模块**********************************************/

    /*
         获取行业信息
         */
    function getClaireIndustryOne() {
      var defer = $q.defer();
      $http({
        url: url + '/claire/industryOne',
        method: 'GET',
        params: {}
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function getClaireIndustryTwo(code) {
      var defer = $q.defer();
      $http({
        url: url + '/claire/industryTwo',
        method: 'GET',
        params: {
          code: code
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function getClaireIndustryThree(code) {
      var defer = $q.defer();
      $http({
        url: url + '/claire/industryThree',
        method: 'GET',
        params: {
          code: code
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    /*
         获取行业信息（东财）
         */
    function getClaireEmIndustryOne() {
      var defer = $q.defer();
      $http({
        url: url + '/claire/em/industryOne',
        method: 'GET',
        params: {}
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function getClaireEmIndustryTwo(code) {
      var defer = $q.defer();
      $http({
        url: url + '/claire/em/industryTwo',
        method: 'GET',
        params: {
          code: code
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function getClaireEmIndustryThree(code) {
      var defer = $q.defer();
      $http({
        url: url + '/claire/em/industryThree',
        method: 'GET',
        params: {
          code: code
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //省份信息
    function getProvinces() {
      var defer = $q.defer();
      $http({
        url: url + '/claire/em/province',
        method: 'GET',
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    /*
         评级评分参数
         */

    //评级参数
    function getClaireGrade() {
      var defer = $q.defer();
      $http({
        url: url + '/claire/parameters/grade',
        method: 'GET',
        params: {}
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //评分参数
    function getClaireScore() {
      var defer = $q.defer();
      $http({
        url: url + '/claire/parameters/score',
        method: 'GET',
        params: {}
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    /*
         主体
         */

    //入口查询主体或债项列表
    function openDoor(key, type) {
      var defer = $q.defer();
      $http({
        url: url + '/claire/door',
        method: 'GET',
        params: {
          key: key,
          type: type
        }
      }).success(function (result, status, fun, request) {
        defer.resolve({result: result, key: request.params.key});
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //获取主体列表
    function getCompanies(pageIndex, pageSize, keyWord, industry, companyOutGrade, companyLanShiScore, isHolding) {
      var defer = $q.defer();
      $http({
        url: url + '/claire/companys',
        method: 'GET',
        params: {
          pageIndex: pageIndex,
          pageSize: pageSize,
          keyWord: keyWord,
          industry: industry,
          companyOutGrade: companyOutGrade,
          companyLanShiScore: companyLanShiScore,
          isHolding: isHolding
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //模糊查询主体名称
    function getCompanyName(companyName) {
      var defer = $q.defer();
      $http({
        url: url + '/claire/companyName',
        method: 'GET',
        params: {
          companyName: companyName
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //创建主体
    function createMain(data) {
      var defer = $q.defer();
      $http({
        url: url + '/claire/company',
        method: 'POST',
        data: 'companyEID=' + data.companyEID + '&companyLanShiScore=' + data.companyLanShiScore + '&companyScoreNote=' + data.companyScoreNote + '&companyNote=' + data.companyNote
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //修改主体
    function updateMain(data) {
      var defer = $q.defer();
      $http({
        url: url + '/claire/company',
        method: 'PUT',
        data: 'companyId=' + data.companyId + '&companyLanShiScore=' + data.companyLanShiScore + '&companyScoreNote=' + data.companyScoreNote + '&companyNote=' + data.companyNote
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //删除主体
    function deleteMain(companyId) {
      var defer = $q.defer();
      $http({
        url: url + '/claire/company',
        method: 'DELETE',
        params: {companyId: companyId}
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //关注主体
    function addConcernCompany(data) {
      var defer = $q.defer();
      $http({
        url: url + '/claire/concernCompany',
        method: 'POST',
        data: 'code=' + data.code
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //查询关注主体
    function getConcernCompany(pageIndex, pageSize, keyWord) {
      var defer = $q.defer();
      $http({
        url: url + '/claire/concernCompany',
        method: 'GET',
        params: {
          pageIndex: pageIndex,
          pageSize: pageSize,
          keyWord: keyWord,
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //查询主体详情
    function getoCmpanyInfo(EID) {
      var defer = $q.defer();
      $http({
        url: url + '/claire/companyInfo',
        method: 'GET',
        params: {
          EID: EID
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //查询主体机构资格列表
    function getCompanyQualifyInfo(EID) {
      var defer = $q.defer();
      $http({
        url: url + '/claire/companyQualifyInfo',
        method: 'GET',
        params: {
          EID: EID
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //查询主体授信额度列表
    function getCompanyCredit(EID) {
      var defer = $q.defer();
      $http({
        url: url + '/claire/companyCredit',
        method: 'GET',
        params: {
          EID: EID
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //查询主体募集资金投向变更
    function getCompanyCmRfinvestchg(EID) {
      var defer = $q.defer();
      $http({
        url: url + '/claire/companyCmRfinvestchg',
        method: 'GET',
        params: {
          EID: EID
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //查询主体募集资金投资项目
    function getCompanyMJZJTXB(EID) {
      var defer = $q.defer();
      $http({
        url: url + '/claire/companyMJZJTXB',
        method: 'GET',
        params: {
          EID: EID
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    /*
         债项
         */

    //查询债项
    function getProducts(pageIndex, pageSize, keyWord, companyEID, industry) {
      var defer = $q.defer();
      $http({
        url: url + '/claire/products',
        method: 'GET',
        params: {
          pageIndex: pageIndex,
          pageSize: pageSize,
          keyWord: keyWord,
          companyEID: companyEID,
          industry: industry
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //关注债项
    function addConcernProduct(data) {
      var defer = $q.defer();
      $http({
        url: url + '/claire/concernProduct',
        method: 'POST',
        data: 'code=' + data.code
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //取消关注
    function cancelConcern(concernId) {
      var defer = $q.defer();
      $http({
        url: url + '/claire/concern',
        method: 'DELETE',
        params: {concernId: concernId}
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //查询关注债项列表
    function getConcernProduct(pageIndex, pageSize, keyWord) {
      var defer = $q.defer();
      $http({
        url: url + '/claire/concernProduct',
        method: 'GET',
        params: {
          pageIndex: pageIndex,
          pageSize: pageSize,
          keyWord: keyWord
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //查询主体评级历史列表
    function getRecordCompanyIcrate(EID) {
      var defer = $q.defer();
      $http({
        url: url + '/claire/companyIcrate',
        method: 'GET',
        params: {
          EID: EID
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }
    //查询主体评级历史列表
    function getRecordCompanyWarning(EID) {
      var defer = $q.defer();
      $http({
        url: url + '/claire/companyLanshi',
        method: 'GET',
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //查询债项详情
    function getProductInfo(EID) {
      var defer = $q.defer();
      $http({
        url: url + '/claire/productInfo',
        method: 'GET',
        params: {
          EID: EID
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //查询债项评级历史列表
    function getRecordProductIcrate(EID) {
      var defer = $q.defer();
      $http({
        url: url + '/claire/productIcrate',
        method: 'GET',
        params: {
          EID: EID
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //查询资产负债表
    function getFinBalance(EID, years, reportTimeTypeCode) {
      var defer = $q.defer();
      $http({
        url: url + '/claire/fin/balance',
        method: 'GET',
        params: {
          companyEID: EID,
          years: years,
          reportTimeTypeCode: reportTimeTypeCode
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //查询现金流量表
    function getFinCashflow(EID, years, reportTimeTypeCode) {
      var defer = $q.defer();
      $http({
        url: url + '/claire/fin/cashflow',
        method: 'GET',
        params: {
          companyEID: EID,
          years: years,
          reportTimeTypeCode: reportTimeTypeCode
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //查询现金流量补充表
    function getFinCashflowadd(EID, years, reportTimeTypeCode) {
      var defer = $q.defer();
      $http({
        url: url + '/claire/fin/cashflowadd',
        method: 'GET',
        params: {
          companyEID: EID,
          years: years,
          reportTimeTypeCode: reportTimeTypeCode
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //查询利润表
    function getFinincome(EID, years, reportTimeTypeCode) {
      var defer = $q.defer();
      $http({
        url: url + '/claire/fin/income',
        method: 'GET',
        params: {
          companyEID: EID,
          years: years,
          reportTimeTypeCode: reportTimeTypeCode
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    /**************************基金模块**********************************************/
    //查询基金
    function getFund(pageIndex, pageSize) {
      var defer = $q.defer();
      $http({
        url: url + '/fund',
        method: 'GET',
        params: {
          pageIndex: pageIndex,
          pageSize: pageSize
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }
    //添加基金
    function createFund(data) {
      var defer = $q.defer();
      $http({
        url: url + '/fund',
        method: 'POST',
        data: 'fundCode=' + data.fundCode + '&fundName=' + data.fundName + '&fundType=' + data.fundType + '&administration=' + data.administration + '&startTime=' + data.startTime + '&profit=' + data.profit + '&fundChannel=' + data.fundChannel + '&amount=' + data.amount + '&note=' + data.note + '&productName=' + data.productName + '&nextOpenDate=' + data.nextOpenDate + '&endDate=' + data.endDate + '&nextBonusDate=' + data.nextBonusDate + '&baseAchievement=' + data.baseAchievement + '&fixedFee=' + data.fixedFee + '&moreInto=' + data.moreInto + '&managerFee=' + data.managerFee + '&custodianFee=' + data.custodianFee + '&sellFee=' + data.sellFee + '&warning=' + data.warning + '&stopLoss=' + data.stopLoss + '&changeBond=' + data.changeBond + '&ppn=' + data.ppn + '&levelA=' + data.levelA + '&bondFutures=' + data.bondFutures + '&leverage=' + data.leverage + '&valuationType=' + data.valuationType + '&groupUserId=' + data.userId + '&fundLongName=' + data.fundLongName + '&investmentAdviser=' + data.investmentAdviser + '&trusteeAgency=' + data.trusteeAgency + '&investmentStrategy=' + data.investmentStrategy + '&productMix=' + data.productMix + '&commissionBroker=' + data.commissionBroker + '&futuresTrader=' + data.futuresTrader + '&recordCode=' + data.recordCode + '&association=' + data.association + '&specialAccount=' + data.specialAccount + '&isShare=' + data.isShare + '&open=' + data.open + '&openDate=' + data.openDate + '&record=' + data.record + '&haveTrade=' + data.haveTrade
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //基金开始运作
    function pushFundStart(fundId) {
      var defer = $q.defer();
      $http({
        url: url + '/fundNormal',
        method: 'POST',
        data: 'fundId=' + fundId
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //修改基金
    function updateFund(data) {
      var defer = $q.defer();
      $http({
        url: url + '/fund',
        method: 'PUT',
        data: 'fundId=' + data.fundId + '&fundCode=' + data.fundCode + '&fundName=' + data.fundName + '&fundType=' + data.fundType + '&administration=' + data.administration + '&startTime=' + data.startTime + '&profit=' + data.profit + '&fundChannel=' + data.fundChannel + '&amount=' + data.amount + '&note=' + data.note + '&productName=' + data.productName + '&nextOpenDate=' + data.nextOpenDate + '&endDate=' + data.endDate + '&nextBonusDate=' + data.nextBonusDate + '&baseAchievement=' + data.baseAchievement + '&fixedFee=' + data.fixedFee + '&moreInto=' + data.moreInto + '&managerFee=' + data.managerFee + '&custodianFee=' + data.custodianFee + '&sellFee=' + data.sellFee + '&warning=' + data.warning + '&stopLoss=' + data.stopLoss + '&changeBond=' + data.changeBond + '&ppn=' + data.ppn + '&levelA=' + data.levelA + '&bondFutures=' + data.bondFutures + '&leverage=' + data.leverage + '&valuationType=' + data.valuationType + '&groupUserId=' + data.userId + '&fundLongName=' + data.fundLongName + '&investmentAdviser=' + data.investmentAdviser + '&trusteeAgency=' + data.trusteeAgency + '&investmentStrategy=' + data.investmentStrategy + '&productMix=' + data.productMix + '&commissionBroker=' + data.commissionBroker + '&futuresTrader=' + data.futuresTrader + '&recordCode=' + data.recordCode + '&association=' + data.association + '&specialAccount=' + data.specialAccount + '&isShare=' + data.isShare + '&open=' + data.open + '&openDate=' + data.openDate + '&haveTrade=' + data.haveTrade + '&record=' + data.record
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //基金停止运作
    function deleteFund(fundId) {
      var defer = $q.defer();
      $http({
        url: url + '/fund',
        method: 'DELETE',
        params: {fundId: fundId}
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //查询估值报表参数
    function getFundTemplates(pageIndex, pageSize) {
      var defer = $q.defer();
      $http({
        url: url + '/fundTemplates',
        method: 'GET',
        params: {
          pageIndex: pageIndex,
          pageSize: pageSize
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //修改估值报表参数
    function updateFundTemplates(data) {
      var defer = $q.defer();
      $http({
        url: url + '/fundTemplate',
        method: 'PUT',
        data: 'FundId=' + data.fundId + '&OriginName=' + data.originName + '&ShowinResult=' + data.showinResult + '&TemplateClassify=' + data.templateClassify + '&DisplayOrder=' + data.displayOrder + '&BackOneDate=' + data.backOneDate
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //获取估值修正
    function getFixRate(fundId) {
      var defer = $q.defer();
      $http({
        url: url + '/findata/fixrate',
        method: 'GET',
        params: {
          fundId: fundId,
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //修改估值修正
    function updateFixRate(data) {
      var defer = $q.defer();
      $http({
        url: url + '/findata/fixrate',
        method: 'POST',
        data: 'fundId=' + data.fundId + '&startDate=' + data.startDate + '&delta=' + data.delta + '&note=' + data.note
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //改变估值状态
    function changeFixrateState(data) {
      var defer = $q.defer();
      $http({
        url: url + '/findata/fixrate/state',
        method: 'POST',
        data: 'fundId=' + data.fundId + '&startDate=' + data.startDate + '&state=' + data.state + '&note1=' + data.note1
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //获取操作记录
    function getFixratehistory(fundId, workday) {
      var defer = $q.defer();
      $http({
        url: url + '/findata/fixratehistory',
        method: 'GET',
        params: {
          fundId: fundId,
          workday: workday
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //查询基金类型
    function getFundType() {
      var defer = $q.defer();
      $http({
        url: url + '/parameters/fundType',
        method: 'GET',
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //查询基金托管渠道
    function getFundChannel() {
      var defer = $q.defer();
      $http({
        url: url + '/parameters/fundChannel',
        method: 'GET',
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //录入缴款流水
    function addPayment(data) {
      var defer = $q.defer();
      $http({
        url: url + '/payment',
        method: 'POST',
        data: 'fundId=' + data.fundId + '&waterNumber=' + data.waterNumber + '&productSize=' + data.productSize + '&recoveryTime=' + data.recoveryTime + '&extractionTime=' + data.extractionTime + '&term=' + data.term + '&expectedRateOfReturn=' + data.expectedRateOfReturn + '&daysRemaining=' + data.daysRemaining + '&earlyWarning=' + data.earlyWarning + '&netCostUnit=' + data.netCostUnit + '&accumulatedInterest=' + data.accumulatedInterest + '&maturityOrNot=' + data.maturityOrNot + '&nonAccrualCost=' + data.nonAccrualCost + '&retainedProfit=' + data.retainedProfit + '&retainedInterest=' + data.retainedInterest + '&marginRatio=' + data.marginRatio + '&marginAmount=' + data.marginAmount
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //查询基金托管渠道
    function getPayment(pageIndex, pageSize, fundId, maturityOrNot, startTime, endTime) {
      var defer = $q.defer();
      $http({
        url: url + '/payment',
        method: 'GET',
        params: {
          pageIndex: pageIndex,
          pageSize: pageSize,
          fundId: fundId,
          maturityOrNot: maturityOrNot,
          startTime: startTime,
          endTime: endTime
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //查询基金托管渠道
    function updatePayment() {
      var defer = $q.defer();
      $http({
        url: url + '/payment',
        method: 'PUT',
        data: 'paymentId=' + data.paymentId + 'fundId=' + data.fundId + '&waterNumber=' + data.waterNumber + '&productSize=' + data.productSize + '&recoveryTime=' + data.recoveryTime + '&extractionTime=' + data.extractionTime + '&term=' + data.term + '&expectedRateOfReturn=' + data.expectedRateOfReturn + '&daysRemaining=' + data.daysRemaining + '&earlyWarning=' + data.earlyWarning + '&netCostUnit=' + data.netCostUnit + '&accumulatedInterest=' + data.accumulatedInterest + '&maturityOrNot=' + data.maturityOrNot + '&nonAccrualCost=' + data.nonAccrualCost + '&retainedProfit=' + data.retainedProfit + '&retainedInterest=' + data.retainedInterest + '&marginRatio=' + data.marginRatio + '&marginAmount=' + data.marginAmount
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    /**************************交易管理模块**********************************************/
    /*
         交易管理
         */

    //现券下单
    function ticketPlace(data) {
      var defer = $q.defer();
      $http({
        url: url + '/business/bond',
        method: 'POST',
        data: 'traderId=' + data.traderId + '&businessDirection=' + data.businessDirection + '&amount=' + data.amount + '&fundId=' + data.fundId + '&bondName=' + data.bondName + '&market=' + data.market + '&counterpartyId=' + data.counterpartyId + '&counterpartyShortName=' + data.counterpartyShortName + '&buyOrganization=' + data.buyOrganization + '&sellOrganization=' + data.sellOrganization + '&fullAmount=' + data.fullAmount + '&bondHeadId=' + data.bondHeadId + '&bondProportion=' + data.bondProportion + '&transPrice=' + data.transPrice + '&payOrganization=' + data.payOrganization + '&fullPrice=' + data.fullPrice + '&denomination=' + data.denomination + '&liquidationSpeed=' + data.liquidationSpeed + '&bondNumber=' + data.bondNumber + '&note=' + data.note + '&tradeCounterpartyId=' + data.tradeCounterpartyId + '&transferAgentId=' + data.transferAgentId + '&protocolNumber=' + data.protocolNumber
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //现券下单修改
    function updateTicket(data) {
      var defer = $q.defer();
      $http({
        url: url + '/business/bond',
        method: 'PUT',
        data: 'businessId=' + data.businessId + '&traderId=' + data.traderId + '&businessDirection=' + data.businessDirection + '&amount=' + data.amount + '&fundId=' + data.fundId + '&bondName=' + data.bondName + '&market=' + data.market + '&counterpartyId=' + data.counterpartyId + '&counterpartyShortName=' + data.counterpartyShortName + '&buyOrganization=' + data.buyOrganization + '&sellOrganization=' + data.sellOrganization + '&bondProportion=' + data.bondProportion + '&transPrice=' + data.transPrice + '&payOrganization=' + data.payOrganization + '&fullPrice=' + data.fullPrice + '&denomination=' + data.denomination + '&liquidationSpeed=' + data.liquidationSpeed + '&bondNumber=' + data.bondNumber + '&note=' + data.note + '&tradeCounterpartyId=' + data.tradeCounterpartyId + '&transferAgentId=' + data.transferAgentId + '&protocolNumber=' + data.protocolNumber
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //质押式回购下单
    function buyBackZY(data) {
      var defer = $q.defer();
      $http({
        url: url + '/business/buyBackZY',
        method: 'POST',
        data: 'traderId=' + data.traderId + '&capitalUserId=' + data.capitalUserId + '&transPrice=' + data.transPrice + '&businessDirection=' + data.businessDirection + '&amount=' + data.amount + '&fundId=' + data.fundId + '&bondName=' + data.bondName + '&counterpartyId=' + data.counterpartyId + '&counterpartyShortName=' + data.counterpartyShortName + '&counterpartyUserName=' + data.counterpartyUserName + '&buyBackClosingDate=' + data.buyBackClosingDate + '&buyBackDay=' + data.buyBackDay + '&startTime=' + data.startTime + '&interestRate=' + data.interestRate + '&serviceType=' + data.serviceType + '&market=' + data.market + '&liquidationSpeed=' + data.liquidationSpeed + '&note=' + data.note
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //买断式回购下单
    function buyBackMD(data) {
      var defer = $q.defer();
      $http({
        url: url + '/business/buyBackMD',
        method: 'POST',
        data: 'traderId=' + data.traderId + '&capitalUserId=' + data.capitalUserId + '&transPrice=' + data.transPrice + '&businessDirection=' + data.businessDirection + '&amount=' + data.amount + '&fundId=' + data.fundId + '&bondName=' + data.bondName + '&counterpartyId=' + data.counterpartyId + '&counterpartyShortName=' + data.counterpartyShortName + '&counterpartyUserName=' + data.counterpartyUserName + '&buyBackClosingDate=' + data.buyBackClosingDate + '&buyBackDay=' + data.buyBackDay + '&startTime=' + data.startTime + '&interestRate=' + data.interestRate + '&serviceType=' + data.serviceType + '&market=' + data.market + '&liquidationSpeed=' + data.liquidationSpeed + '&note=' + data.note
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }
    //更新到期时间
    function updateBuybackdate(data) {
      var defer = $q.defer();
      $http({
        url: url + '/business/buybackdate',
        method: 'PUT',
        data: $.param(data),
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //参数对比、工作日调整
    function getWorkDay(fromDate, interval) {
      var defer = $q.defer();
      $http({
        url: url + '/workday/compute',
        method: 'GET',
        params: {
          fromDate: fromDate,
          interval: interval
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //回购下单修改
    function updateBuyBack(data) {
      var defer = $q.defer();
      $http({
        url: url + '/business/buyBack',
        method: 'PUT',
        data: 'businessId=' + data.businessId + '&capitalUserId=' + data.capitalUserId + '&transPrice=' + data.transPrice + '&businessDirection=' + data.businessDirection + '&amount=' + data.amount + '&fundId=' + data.fundId + '&bondName=' + data.bondName + '&counterpartyId=' + data.counterpartyId + '&counterpartyUserName=' + data.counterpartyUserName + '&buyBackClosingDate=' + data.buyBackClosingDate + '&buyBackDay=' + data.buyBackDay + '&startTime=' + data.startTime + '&interestRate=' + data.interestRate + '&serviceType=' + data.serviceType + '&market=' + data.market + '&liquidationSpeed=' + data.liquidationSpeed + '&note=' + data.note
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //一级交易下单
    function tradingOrders(data) {
      var defer = $q.defer();
      $http({
        url: url + '/business/newBond',
        method: 'POST',
        data: 'traderId=' + data.traderId + '&amount=' + data.amount + '&fundId=' + data.fundId + '&bondName=' + data.bondName + '&market=' + data.market + '&transPrice=' + data.transPrice + '&fullPrice=' + data.fullPrice + '&payType=' + data.payType + '&denomination=' + data.denomination + '&bondNumber=' + data.bondNumber + '&listingTime=' + data.listingTime + '&note=' + data.note
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //一级交易下单修改
    function updateTradingOrders(data) {
      var defer = $q.defer();
      $http({
        url: url + '/business/newBond',
        method: 'PUT',
        data: 'businessId=' + data.businessId + '&amount=' + data.amount + '&fundId=' + data.fundId + '&bondName=' + data.bondName + '&market=' + data.market + '&transPrice=' + data.transPrice + '&fullPrice=' + data.fullPrice + '&payType=' + data.payType + '&denomination=' + data.denomination + '&bondNumber=' + data.bondNumber + '&listingTime=' + data.listingTime + '&note=' + data.note
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //基金申购赎回下单
    function fundBuySell(data) {
      var defer = $q.defer();
      $http({
        url: url + '/business/fundBuySell',
        method: 'POST',
        data: 'traderId=' + data.traderId + '&businessDirection=' + data.businessDirection + '&amount=' + data.amount + '&fundId=' + data.fundId + '&entryIntoForceTime=' + data.entryIntoForceTime + '&note=' + data.note
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //基金申购赎回下单修改
    function updateFundBuySell(data) {
      var defer = $q.defer();
      $http({
        url: url + '/business/fundBuySell',
        method: 'PUT',
        data: 'businessId=' + data.businessId + '&businessDirection=' + data.businessDirection + '&amount=' + data.amount + '&fundId=' + data.fundId + '&entryIntoForceTime=' + data.entryIntoForceTime + '&note=' + data.note
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //交易通过
    function transactionComplete(businessId) {
      var defer = $q.defer();
      $http({
        url: url + '/business',
        method: 'PUT',
        data: 'businessId=' + businessId
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }
    //取消确认交易
    function replyBusiness(data) {
      var defer = $q.defer();
      $http({
        url: url + '/business/cancel',
        method: 'PUT',
        data: $.param(data),
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //交易批量通过
    function transactionCompleteAll(businessList) {
      var defer = $q.defer();
      $http({
        url: url + '/businessList',
        method: 'PUT',
        data: 'businessIds=' + businessList
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //交易撤销
    function cancelTransaction(businessId) {
      var defer = $q.defer();
      $http({
        url: url + '/business',
        method: 'DELETE',
        params: {businessId: businessId}
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //查询交易列表
    function getTransaction(pageIndex, pageSize, keyWord, businessType, startTime, endTime, traderId, businessDirection, state, fundId, entryIntoForceTime, liquidationSpeed) {
      var defer = $q.defer();
      $http({
        url: url + '/business',
        method: 'GET',
        params: {
          pageIndex: pageIndex,
          pageSize: pageSize,
          keyWord: keyWord,
          businessType: businessType,
          startTime: startTime,
          endTime: endTime,
          traderId: traderId,
          businessDirection: businessDirection,
          state: state,
          fundId: fundId,
          entryIntoForceTime: entryIntoForceTime,
          liquidationSpeed: liquidationSpeed
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }
    //查询交易详情
    function getTransactionInfo(buySellId) {
      var defer = $q.defer();
      $http({
        url: url + '/business/' + buySellId,
        method: 'GET',
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //查询自己的交易列表
    function getOwnTransaction(params) {
      var defer = $q.defer();
      $http({
        url: url + '/businessOwn',
        method: 'GET',
        params: params,
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //交易对手录入
    function createCounterparty(data) {
      var defer = $q.defer();
      $http({
        url: url + '/counterparty',
        method: 'POST',
        data: 'counterpartyCode=' + data.counterpartyCode + '&counterpartyShortName=' + data.counterpartyShortName + '&counterpartyFullName=' + data.counterpartyFullName + '&counterpartyType=' + data.counterpartyType + '&serviceType=' + data.serviceType + '&linkman=' + data.linkman + '&mobilePhone=' + data.mobilePhone + '&qq=' + data.qq + '&note=' + data.note
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //交易对手修改
    function updateCounterparty(data) {
      var defer = $q.defer();
      $http({
        url: url + '/counterparty',
        method: 'PUT',
        data: 'counterpartyId=' + data.counterpartyId + '&counterpartyCode=' + data.counterpartyCode + '&counterpartyShortName=' + data.counterpartyShortName + '&counterpartyFullName=' + data.counterpartyFullName + '&counterpartyType=' + data.counterpartyType + '&serviceType=' + data.serviceType + '&linkman=' + data.linkman + '&mobilePhone=' + data.mobilePhone + '&qq=' + data.qq + '&note=' + data.note
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //交易对手删除
    function deleteCounterparty(counterpartyId) {
      var defer = $q.defer();
      $http({
        url: url + '/counterparty',
        method: 'DELETE',
        params: {counterpartyId: counterpartyId}
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //查询交易对手
    function getCounterparty(pageIndex, pageSize, keyWord) {
      var defer = $q.defer();
      $http({
        url: url + '/counterparty',
        method: 'GET',
        params: {
          pageIndex: pageIndex,
          pageSize: pageSize,
          keyWord: keyWord
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //查询交易对手
    function getTradeCounterparty(pageIndex, pageSize, type, keyWord) {
      var defer = $q.defer();
      $http({
        url: url + '/tradeCounterparty',
        method: 'GET',
        params: {
          pageIndex: pageIndex,
          pageSize: pageSize,
          type: type,
          keyWord: keyWord
        }
      }).success(function (result, status, fun, request) {
        defer.resolve({result: result, key: request.params.keyWord});
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //新增交易对手
    function addTradeCounterparty(data) {
      var defer = $q.defer();
      $http({
        url: url + '/tradeCounterparty',
        method: 'POST',
        data: 'type=' + data.type + '&title=' + data.title + '&phone=' + data.phone + '&qq=' + data.qq + '&contact=' + data.contact
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //删除交易对手
    function deletetradeCounterparty(id) {
      var defer = $q.defer();
      $http({
        url: url + '/tradeCounterparty',
        method: 'DELETE',
        params: {
          id: id
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //修改交易对手
    function updatetradeCounterparty(data) {
      var defer = $q.defer();
      $http({
        url: url + '/tradeCounterparty',
        method: 'PUT',
        data: 'id=' + data.id + '&title=' + data.title + '&phone=' + data.phone + '&qq=' + data.qq + '&contact=' + data.contact
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //查询日终交易说明
    function getManual(workday) {
      var defer = $q.defer();
      $http({
        url: url + '/position/manual',
        method: 'GET',
        params: {
          workday: workday,
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //创建日终交易说明
    function postManual(data) {
      var defer = $q.defer();
      $http({
        url: url + '/position/manual',
        method: 'POST',
        data: 'id=' + data.id + '&fundId=' + data.fundId + '&workday=' + data.workdayShow + '&t0=' + data.t0 + '&t1=' + data.t1 + '&t2=' + data.t2 + '&cash=' + data.cash + '&note=' + data.noteShow
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //修改日终交易说明
    function putManual(data) {
      var defer = $q.defer();
      $http({
        url: url + '/position/manual',
        method: 'PUT',
        data: 'id=' + data.id + '&fundId=' + data.fundId + '&workday=' + data.workdayShow + '&t0=' + data.t0 + '&t1=' + data.t1 + '&t2=' + data.t2 + '&cash=' + data.cash + '&note=' + data.noteShow
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    /*
         参数查询
         */

    // warningType
    function getWarningType() {
      var defer = $q.defer();
      $http({
        url: url + '/parameters/warningType',
        method: 'GET',
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //基金
    function getFundParameters(normal) {
      var defer = $q.defer();
      $http({
        url: url + '/fundParameters',
        method: 'GET',
        params: {
          normal: normal
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }
    function getFundTKFund() {
      var defer = $q.defer();
      $http({
        url: url + '/fund/list',
        method: 'GET',
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //交易对手
    function getCounterpartyGroup(counterpartyType, keyWord) {
      var counterpartyType = counterpartyType || '';
      var defer = $q.defer();
      $http({
        url: url + '/counterpartyGroup',
        method: 'GET',
        params: {
          counterpartyType: counterpartyType,
          keyWord: keyWord
        }
      }).success(function (result, status, fun, request) {
        defer.resolve({result: result, key: request.params.keyWord});
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //交易类型
    function getBusinessType() {
      var defer = $q.defer();
      $http({
        url: url + '/parameters/businessType',
        method: 'GET',
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //交易方向
    function getBusinessDirection() {
      var defer = $q.defer();
      $http({
        url: url + '/parameters/businessDirection',
        method: 'GET',
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //交易市场
    function getMarket() {
      var defer = $q.defer();
      $http({
        url: url + '/parameters/market',
        method: 'GET',
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //付费机构
    function getPayOrganization() {
      var defer = $q.defer();
      $http({
        url: url + '/parameters/payOrganization',
        method: 'GET',
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //是否全价
    function getFullPrice() {
      var defer = $q.defer();
      $http({
        url: url + '/parameters/fullPrice',
        method: 'GET',
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //清算速度
    function getLiquidationSpeed() {
      var defer = $q.defer();
      $http({
        url: url + '/parameters/liquidationSpeed',
        method: 'GET',
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //缴费方式
    function getPayType() {
      var defer = $q.defer();
      $http({
        url: url + '/parameters/payType',
        method: 'GET',
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //交易状态
    function getBusinessState() {
      var defer = $q.defer();
      $http({
        url: url + '/parameters/businessState',
        method: 'GET',
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //对手类型
    function getCounterpartyType() {
      var defer = $q.defer();
      $http({
        url: url + '/parameters/counterpartyType',
        method: 'GET',
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //业务分类
    function getServiceType() {
      var defer = $q.defer();
      $http({
        url: url + '/parameters/serviceType',
        method: 'GET',
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    /**************************业务提醒模块**********************************************/
    //查询交易员用户
    function getTraders() {
      var defer = $q.defer();
      $http({
        url: url + '/users/credittrader',
        method: 'GET',
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //查询业务提醒列表
    function getWarningList(keyWord, warningType, fundId, startTime, endTime) {
      var defer = $q.defer();
      $http({
        url: url + '/warnings',
        method: 'GET',
        params: {
          keyWord: keyWord,
          warningType: warningType,
          fundId: fundId,
          startTime: startTime,
          endTime: endTime
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //查询缴款流水业务提醒列表
    function getPaymentWarningList() {
      var defer = $q.defer();
      $http({
        url: url + '/warning/payment',
        method: 'GET',
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //查询业务提醒明细
    function getWarnings(dueDate, fundId, keyWord) {
      var defer = $q.defer();
      $http({
        url: url + '/warning',
        method: 'GET',
        params: {
          dueDate: dueDate,
          fundId: fundId,
          keyWord: keyWord
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //查询业务提醒明细
    function getWarningBondName(fundId, bondName) {
      var defer = $q.defer();
      $http({
        url: url + '/warningBondName',
        method: 'GET',
        params: {
          fundId: fundId,
          bondName: bondName
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //getdays
    function getdays(fundId) {
      var defer = $q.defer();
      $http({
        url: url + '/position/30days',
        method: 'GET',
        params: {
          fundId: fundId
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    /**************************头寸查询**********************************************/
    //查询资金持仓
    function getMoneyAvailable(fundId, pageIndex, pageSize) {
      var defer = $q.defer();
      $http({
        url: url + '/position/money',
        method: 'GET',
        params: {
          fundId: fundId,
          pageIndex: pageIndex,
          pageSize: pageSize
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //查询证券持仓
    function getBondAvailable(fundId, pageIndex, pageSize, securityId) {
      var defer = $q.defer();
      $http({
        url: url + '/position/bond',
        method: 'GET',
        params: {
          fundId: fundId,
          pageIndex: pageIndex,
          pageSize: pageSize,
          securityId: securityId
        }

      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //查询所有持仓
    function getAllBond() {
      var defer = $q.defer();
      $http({
        url: url + '/position/allBond',
        method: 'GET',

      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //设置初始资金
    function setAdjustCash(data) {
      var defer = $q.defer();
      $http({
        url: url + '/position/adjustCash',
        method: 'POST',
        data: 'fundId=' + data.fundId + '&amount=' + data.amount + '&effectDate=' + data.effectDate + '&note=' + data.note
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //债券模糊查询
    function fuzzySearch(fundId, keyWord) {
      var defer = $q.defer();
      $http({
        url: url + '/position/bond/search',
        method: 'GET',
        params: {
          fundId: fundId,
          keyWord: keyWord
        }

      }).success(function (result, status, fun, request) {
        defer.resolve({result: result, key: request.params.keyWord});
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //估值解析
    function getHoldingStatus(date) {
      var defer = $q.defer();
      $http({
        url: url + '/position/holdingStatus',
        method: 'GET',
        params: {
          workday: date
        }

      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    /**************************用户管理模块**********************************************/
    //查询所有用户
    function getAllUsers() {
      var defer = $q.defer();
      $http({
        url: url + '/allUsers',
        method: 'GET',
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //查询所有职能角色
    function getAllFunctionGroups() {
      var defer = $q.defer();
      $http({
        url: url + '/allFunctionGroups',
        method: 'GET',

      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //用户到角色分配
    function addUserIntoGroup(data) {
      var defer = $q.defer();
      $http({
        url: url + '/addUserIntoGroup',
        method: 'POST',
        data: 'groupId=' + data.groupId + '&groupUserId=' + data.userId

      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //用户从角色删除
    function delUserIntoGroup(groupId, userId) {
      var defer = $q.defer();
      $http({
        url: url + '/delUserIntoGroup',
        method: 'DELETE',
        params: {
          groupId: groupId,
          groupUserId: userId
        }

      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //用户到产品分配
    function addUserIntoGroupFund(data) {
      var defer = $q.defer();
      $http({
        url: url + '/addUserIntoFundGroup',
        method: 'POST',
        data: 'groupUserId=' + data.userId + '&fundId=' + data.fundId + '&fundName=' + data.fundName

      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //用户从产品删除
    function delUserIntoGroupFund(userId, fundId) {
      var defer = $q.defer();
      $http({
        url: url + '/delUserIntoFundGroup',
        method: 'DELETE',
        params: {
          groupUserId: userId,
          fundId: fundId
        }

      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //清除缓存
    function cleanUser() {
      var defer = $q.defer();
      $http({
        url: url + '/cleanUser',
        method: 'GET',

      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //添加用户
    function addUser(data) {
      var defer = $q.defer();
      $http({
        url: url + '/addUser',
        method: 'POST',
        data: $.param(data)
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //修改用户
    function updateUser(data) {
      var defer = $q.defer();
      $http({
        url: url + '/updateUser',
        method: 'POST',
        data: $.param(data)
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //删除用户
    function delUser(userId) {
      var defer = $q.defer();
      $http({
        url: url + '/delUser',
        method: 'DELETE',
        params: {
          delUserId: userId
        }

      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //添加角色
    function addGroup(data) {
      var defer = $q.defer();
      $http({
        url: url + '/addGroup',
        method: 'POST',
        data: 'groupName=' + data.groupName

      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //根据用户名查询信息
    function getUserByName(key) {
      var defer = $q.defer();
      $http({
        url: url + '/user',
        method: 'GET',
        params: {
          key: key
        }
      }).success(function (result, status, fun, request) {
        defer.resolve({result: result, key: request.params.key});
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //查询职能及组织用户
    function getFunctionGroup(str) {
      var defer = $q.defer();
      $http({
        url: url + '/users/' + str,
        method: 'GET',
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //查询所有组织划分
    function getAllOrganizGroups() {
      var defer = $q.defer();
      $http({
        url: url + '/allOrganizGroups',
        method: 'GET',
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    /**************************风控模块**********************************************/
    //获取风控规则
    function getRcRule(state, fundId, ruleType) {
      var defer = $q.defer();
      $http({
        url: url + '/rc/rule',
        method: 'GET',
        params: {
          state: state,
          fundId: fundId,
          ruleType: ruleType
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //提交风控规则
    function addRcRule(data) {
      var defer = $q.defer();
      $http({
        url: url + '/rc/rule',
        method: 'POST',
        data: 'fundIds=' + data.fundIds + '&ruleType=' + data.ruleType + '&compareType=' + data.compareType + '&compareDirection=' + data.compareDirection + '&compareThreshold=' + data.compareThreshold + '&securityTypes=' + data.securityTypes + '&markets=' + data.markets + '&ratings=' + data.ratings + '&dividend=' + data.dividend + '&divisor=' + data.divisor + '&state=' + data.state + '&desc=' + data.desc

      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //修改风控规则
    function updateRcRule(data) {
      var defer = $q.defer();
      $http({
        url: url + '/rc/rule',
        method: 'PUT',
        data: 'fundIds=' + data.fundIds + '&ruleType=' + data.ruleType + '&compareType=' + data.compareType + '&compareDirection=' + data.compareDirection + '&compareThreshold=' + data.compareThreshold + '&securityTypes=' + data.securityTypes + '&markets=' + data.markets + '&ratings=' + data.ratings + '&dividend=' + data.dividend + '&divisor=' + data.divisor + '&state=' + data.state + '&desc=' + data.desc + '&id=' + data.id

      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //获取指令下单
    function getOrder(pageIndex, pageSize, buyFundId, sellFundId, tradeUser, startDate, endDate) {
      var defer = $q.defer();
      $http({
        url: url + '/rc/order',
        method: 'GET',
        params: {
          pageIndex: pageIndex,
          pageSize: pageSize,
          buyFundId: buyFundId,
          sellFundId: sellFundId,
          tradeUser: tradeUser,
          startDate: startDate,
          endDate: endDate
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }
    //获取指令下单
    function getOrderInfo(orderId) {
      var defer = $q.defer();
      $http({
        url: url + '/rc/order/'+orderId,
        method: 'GET',
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }
    //获取指令下单
    function createBizOrder(id) {
      var defer = $q.defer();
      $http({
        url: url + '/rc/order/biz',
        method: 'POST',
        data: 'id=' + id,
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //获取黑名单
    function getBlack(securityId, fundId, direction) {
      var defer = $q.defer();
      $http({
        url: url + '/business/counterparty/black',
        method: 'GET',
        params: {
          securityId: securityId,
          fundId: fundId,
          direction: direction,
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //获取万德code
    function getWindCode(shortName) {
      var defer = $q.defer();
      $http({
        url: winUrl + '/windcode',
        method: 'GET',
        params: {
          shortName: shortName,
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //获取aside详情
    function getSecurityInfo(shortName, iWindCode, workday, cnbdDate, actualProfitRate, actual_calc_price, priceType, fullPrice) {
      var defer = $q.defer();
      $http({
        url: winUrl + '/securityinfo',
        method: 'GET',
        params: {
          shortName: shortName,
          iWindCode: iWindCode,
          workday: workday,
          cnbdDate: cnbdDate,
          actualProfitRate: actualProfitRate,
          actual_calc_price: actual_calc_price,
          priceType: priceType,
          fullPrice: fullPrice,
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //获取触发规则详情
    function getRcHistory(rcVersion) {
      var defer = $q.defer();
      $http({
        url: url + '/rc/history',
        method: 'GET',
        params: {
          rcVersion: rcVersion
        }
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //重算规则
    function refreshCalculate(rcVersion) {
      var defer = $q.defer();
      $http({
        url: url + '/rc/order/calculate',
        method: 'POST',
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //提交指令下单
    function addOrder(data) {
      var defer = $q.defer();
      $http({
        url: url + '/rc/order',
        method: 'POST',
        data: 'workdayStr=' + data.workday + '&securityId=' + data.securityId + '&buyFundId=' + data.buyFundId + '&sellFundId=' + data.sellFundId + '&market=' + data.market + '&securityType=' + data.securityType + '&volume=' + data.volume + '&transPrice=' + data.transPrice + '&amount=' + data.amount + '&isFullPrice=' + data.isFullPrice + '&denomination=' + data.denomination + '&counterParty=' + data.counterParty + '&state=' + data.state + '&desc=' + data.desc + '&fullPrice=' + data.fullPrice + '&transferFee=' + data.transferFee + '&transferUser=' + data.transferUser + '&clearSpeed=' + data.clearSpeed + '&tradeUser=' + data.tradeUser + '&tradeType=' + data.tradeType + '&payOrganization=' + data.payOrganization + '&counterpartyId=' + data.counterpartyId + '&transferAgentId=' + data.transferAgentId + '&protocolNumber=' + data.protocolNumber + '&iwindcode=' + data.iwindcode + '&cnbdDate=' + data.cnbdDate + '&yieldRate=' + data.yieldRate + '&extra=' + data.extra
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //指令下单修改
    function updateOrder(data) {
      var defer = $q.defer();
      $http({
        url: url + '/rc/order',
        method: 'PUT',
        data: 'workdayStr=' + data.workday + '&securityId=' + data.securityId + '&buyFundId=' + data.buyFundId + '&sellFundId=' + data.sellFundId + '&market=' + data.market + '&securityType=' + data.securityType + '&volume=' + data.volume + '&transPrice=' + data.transPrice + '&amount=' + data.amount + '&isFullPrice=' + data.isFullPrice + '&denomination=' + data.denomination + '&counterParty=' + data.counterParty + '&state=' + data.state + '&desc=' + data.desc + '&id=' + data.id + '&fullPrice=' + data.fullPrice + '&transferFee=' + data.transferFee + '&transferUser=' + data.transferUser + '&clearSpeed=' + data.clearSpeed + '&tradeUser=' + data.tradeUser + '&tradeType=' + data.tradeType + '&payOrganization=' + data.payOrganization + '&counterpartyId=' + data.counterpartyId + '&transferAgentId=' + data.transferAgentId + '&protocolNumber=' + data.protocolNumber + '&iwindcode=' + data.iwindcode + '&cnbdDate=' + data.cnbdDate + '&yieldRate=' + data.yieldRate + '&extra=' + data.extra
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //指令下单状态修改
    function updateOrderState(data) {
      var defer = $q.defer();
      $http({
        url: url + '/rc/order/state',
        method: 'PUT',
        data: 'id=' + data.id + '&sellFundId=' + data.sellFundId + '&buyFundId=' + data.buyFundId + '&state=' + data.state
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    /**************************国债**********************************************/
    //国债交易
    function addNbOrder(data) {
      var defer = $q.defer();
      $http({
        url: url + '/nb/order',
        method: 'POST',
        data: 'workdayStr=' + data.workday + '&securityId=' + data.securityId + '&buyFundId=' + data.buyFundId + '&sellFundId=' + data.sellFundId + '&market=' + data.market + '&securityType=' + data.securityType + '&volume=' + data.volume + '&transPrice=' + data.transPrice + '&amount=' + data.amount + '&isFullPrice=' + data.isFullPrice + '&denomination=' + data.denomination + '&counterParty=' + data.counterParty + '&state=' + data.state + '&desc=' + data.desc + '&fullPrice=' + data.fullPrice + '&transferFee=' + data.transferFee + '&transferUser=' + data.transferUser + '&clearSpeed=' + data.clearSpeed + '&tradeUser=' + data.tradeUser + '&tradeType=' + data.tradeType + '&payOrganization=' + data.payOrganization + '&counterpartyId=' + data.counterpartyId + '&transferAgentId=' + data.transferAgentId + '&protocolNumber=' + data.protocolNumber + '&iwindcode=' + data.iwindcode + '&cnbdDate=' + data.cnbdDate + '&yieldRate=' + data.yieldRate + '&extra=' + data.extra + '&direction=' + data.direction
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //模糊查询iwindcode
    function fuzzyIwindcode(keyWord) {
      var defer = $q.defer();
      $http({
        url: url + '/nb/iwindcode/search',
        method: 'GET',
        params: {
          keyWord: keyWord,
        }
      }).success(function (result, status, fun, request) {
        defer.resolve({result: result, key: request.params.keyWord});
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //获取国债交易列表
    function getNbOrder(pageIndex, pageSize, iwindcode, startDate, endDate, direction) {
      var defer = $q.defer();
      $http({
        url: url + '/nb/order',
        method: 'GET',
        params: {
          pageIndex: pageIndex,
          pageSize: pageSize,
          iwindcode: iwindcode,
          startDate: startDate,
          endDate: endDate,
          direction: direction,
        }
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //获取国债现货
    function getNbSummary() {
      var defer = $q.defer();
      $http({
        url: url + '/nb/summary',
        method: 'GET',
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }
    //获取国债现货图
    function getNbSummaries(params) {
      var defer = $q.defer();
      $http({
        url: url + '/nb/summaries',
        method: 'GET',
        params: params,
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //获取国债现货初始值
    function getNbInfo() {
      var defer = $q.defer();
      $http({
        url: url + '/nb/info',
        method: 'GET',
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //修改估值
    function updateNbInfo(data) {
      var defer = $q.defer();
      $http({
        url: url + '/nb/info',
        method: 'PUT',
        data: 'amount=' + data.amount + '&profit=' + data.profit,
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //修改估值
    function updateNbModiPrice(data) {
      var defer = $q.defer();
      $http({
        url: url + '/nb/modiPrice',
        method: 'PUT',
        data: 'id=' + data.id + '&modiPrice=' + data.modiPrice,
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //获取比对记录
    function getNbComparison(valueDate) {
      var defer = $q.defer();
      $http({
        url: nbfUrl + '/nbf/nbaholding',
        method: 'GET',
        params: {
          valueDate: valueDate,
        }
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    //获取期货菜单
    function getNbAccount() {
      var defer = $q.defer();
      $http({
        url: nbfUrl + '/nbf/account',
        method: 'GET',
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }
    //获取期货详情
    function getNbfSummary(accountId) {
      var defer = $q.defer();
      $http({
        url: nbfUrl + '/nbf/summary',
        method: 'GET',
        params: {
          accountId: accountId
        }
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }
    //获取期货详情图
    function getNbfSummaries(params) {
      var defer = $q.defer();
      $http({
        url: nbfUrl + '/nbf/summaries',
        method: 'GET',
        params: params
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }
    //获取期货详情
    function getNbfValuedate() {
      var defer = $q.defer();
      $http({
        url: nbfUrl + '/nbf/valuedate',
        method: 'GET',
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }
    //获取期货详情
    function updateNbfValuedate(valuedate) {
      var defer = $q.defer();
      $http({
        url: nbfUrl + '/nbf/valuedate',
        method: 'POST',
        data: 'Valuedate=' + valuedate
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }
    //获取投资合约池
    function getTradeTargetPool(pageIndex, pageSize) {
      var defer = $q.defer();
      $http({
        url: nbfUrl + '/nbf/tradeTarget',
        method: 'GET',
        params: {
          pageIndex: pageIndex,
          pageSize: pageSize,
        }
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }
    //新增投资合约池
    function addTradeTargetPool(data) {
      var defer = $q.defer();
      $http({
        url: nbfUrl + '/nbf/tradeTarget',
        method: 'POST',
        data: 'tradeTarget=' + data.tradeTarget + '&iwindcode=' + data.iwindcode + '&note=' + data.note
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }
    //删除投资合约
    function deleteTradeTargetPool(TargetId) {
      var defer = $q.defer();
      $http({
        url: nbfUrl + '/nbf/tradeTarget',
        method: 'DELETE',
        params: {
          TargetId: TargetId,
        }
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }
    //查看行情
    function getQuote(pageIndex, pageSize, id) {
      var defer = $q.defer();
      $http({
        url: nbfUrl + '/nbf/quote',
        method: 'GET',
        params: {
          pageIndex: pageIndex,
          pageSize: 40,
          id: id,
        }
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }
    //获取清算列表
    function getClear(pageIndex, pageSize, type) {
      var defer = $q.defer();
      $http({
        url: nbfUrl + '/nbf/clear',
        method: 'GET',
        params: {
          type: type,
        }
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }
    //开始清算
    function startClear(accountIdList, valueDate) {
      var defer = $q.defer();
      $http({
        url: nbfUrl + '/nbf/clear',
        method: 'POST',
        data: 'accountIdList=' + accountIdList + '&valueDate=' + valueDate
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }
    //查询期货账户
    function getNbfAccount() {
      var defer = $q.defer();
      $http({
        url: nbfUrl + '/nbf/account',
        method: 'GET',
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }
    //修改期货账户
    function updateNbfAccount(data) {
      var defer = $q.defer();
      $http({
        url: nbfUrl + '/nbf/account',
        method: 'PUT',
        data: 'AccountName=' + data.AccountName + '&CreateDate=' + data.CreateDate + '&State=' + data.State + '&TemplateId=' + data.TemplateId + '&AccountNo=' + data.AccountNo + '&Cash=' + data.Cash + '&AccountId=' + data.AccountId
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }
    //创建期货账户
    function createNBfAccount(data) {
      var defer = $q.defer();
      $http({
        url: nbfUrl + '/nbf/account',
        method: 'POST',
        data: 'AccountName=' + data.AccountName + '&CreateDate=' + data.CreateDate + '&State=' + data.State + '&TemplateId=' + data.TemplateId + '&AccountNo=' + data.AccountNo + '&Cash=' + data.Cash
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }
    //删除期货账户
    function deleteNbfAccount(AccountId) {
      var defer = $q.defer();
      $http({
        url: nbfUrl + '/nbf/account',
        method: 'DELETE',
        params: {
          AccountId: AccountId
        }
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    /**************************智能分析报告**********************************************/

    //智能分析报告行业
    function getTradeList() {
      var defer = $q.defer();
      $http({
        url: wordUrl + '/word/tradeList',
        method: 'GET',
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }
    //智能分析报告配置列表
    function getWordMatch(params) {
      var defer = $q.defer();
      $http({
        url: wordUrl + '/word/TradeRelate',
        method: 'GET',
        params: params
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }
    //新增智能分析报告配置
    function addWordMatch(data) {
      var defer = $q.defer();
      $http({
        url: wordUrl + '/word/match',
        method: 'POST',
        data: $.param(data),
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }
    //新增行业关联
    function addTradeRelate(data) {
      var defer = $q.defer();
      $http({
        url: wordUrl + '/word/TradeRelate',
        method: 'POST',
        data: $.param(data),
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }
    //删除行业关联
    function deleteTradeRelate(params) {
      var defer = $q.defer();
      $http({
        url: wordUrl + '/word/TradeRelate',
        method: 'DELETE',
        params: params
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }
    //修改智能分析报告配置
    function updateWordMatch(data) {
      var defer = $q.defer();
      $http({
        url: wordUrl + '/word/match',
        method: 'PUT',
        data: $.param(data),
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }
    //删除智能分析报告配置
    function deleteWordMatch(params) {
      var defer = $q.defer();
      $http({
        url: wordUrl + '/word/match',
        method: 'DELETE',
        params: params,
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }
    //智能分析报告配置列表
    function getWordTarget() {
      var defer = $q.defer();
      $http({
        url: wordUrl + '/word/target',
        method: 'GET',
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }
    //智能分析报告配置列表
    function getFileInfo(params) {
      var defer = $q.defer();
      $http({
        url: wordUrl + '/word/fileInfo',
        method: 'GET',
        params: params,
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }
    /**************************服务**********************************************/
    function getServerList() {
      var defer = $q.defer();
      $http({
        url: stateUrl + '/state/stateInfo',
        method: 'GET',
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }
    function restartServer(data) {
      var defer = $q.defer();
      $http({
        url: stateUrl + '/state/stateInfo',
        method: 'POST',
        data: $.param(data)
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    }
    /**************************函数导出模块**********************************************/
    return {
      changeToken: changeToken,//更改token
      login: login,//登录
      changePassword: changePassword,//修改密码
      getClaireHoldingReport: getClaireHoldingReport,//持仓报表
      getClaireHoldingChange: getClaireHoldingChange,//持仓变化
      getFindata: getFindata,//基金资产统计表
      getFindataStats: getFindataStats,//持仓指标
      getFindataTotalNetValue: getFindataTotalNetValue,//净值走势对比图
      getFindataNetValueQuote: getFindataNetValueQuote,//附加基准
      getHoldingAll: getHoldingAll,//持仓全景
      getHoldingProductByCompanyEID: getHoldingProductByCompanyEID,//根据公司ID查询债券
      getHoldingProductByDueDate: getHoldingProductByDueDate,//根据债券到期日查询债券
      getFundAll: getFundAll,//获取产品纵览
      getMainSummary: getMainSummary,//获取风控指标
      getFuture: getFuture,//获取利率盘
      addFuture: addFuture,//新增利率盘
      getFuturePosition: getFuturePosition,//获取利率盘持仓
      getFunding: getFunding,//获取funding
      addFunding: addFunding,//添加funding
      getRepoCostPercent: getRepoCostPercent,//获取回购成本比例
      updateRepoCostPercent: updateRepoCostPercent,//修改回购成本比例
      getRiskBond: getRiskBond,//获取现货
      updateRiskBond: updateRiskBond,//修改现货
      getClaireIndustryOne: getClaireIndustryOne,//一级行业
      getClaireIndustryTwo: getClaireIndustryTwo,//二级行业
      getClaireIndustryThree: getClaireIndustryThree,//三级行业
      getClaireEmIndustryOne: getClaireEmIndustryOne,//一级行业（东财）
      getClaireEmIndustryTwo: getClaireEmIndustryTwo,//二级行业（东财）
      getClaireEmIndustryThree: getClaireEmIndustryThree,//三级行业（东财）
      getProvinces: getProvinces,//三级行业（东财）
      getClaireGrade: getClaireGrade,//评级参数
      getClaireScore: getClaireScore,//评分参数
      openDoor: openDoor,//入口查询主体或债项列表
      getCompanies: getCompanies,//查询主体列表
      getCompanyName: getCompanyName,//模糊查询主体名称
      addConcernCompany: addConcernCompany,//关注主体
      getConcernCompany: getConcernCompany,//查询关注主体列表
      getoCmpanyInfo: getoCmpanyInfo,//查询主体详情
      getCompanyQualifyInfo: getCompanyQualifyInfo,//查询主体机构资格列表
      getCompanyCredit: getCompanyCredit,//查询主体授信额度列表
      getCompanyCmRfinvestchg: getCompanyCmRfinvestchg,//查询主体募集资金投向变更
      getCompanyMJZJTXB: getCompanyMJZJTXB,//查询主体募集资金投资项目
      getProducts: getProducts,//查询债项列表
      createMain: createMain,//创建主体
      updateMain: updateMain,//修改主体
      deleteMain: deleteMain,//删除主体
      addConcernProduct: addConcernProduct,//关注债项
      cancelConcern: cancelConcern,//取消关注
      getConcernProduct: getConcernProduct,//查询关注债项列表
      getRecordCompanyIcrate: getRecordCompanyIcrate,//查询主体评级历史列表
      getRecordCompanyWarning: getRecordCompanyWarning,//查询评级预警
      getProductInfo: getProductInfo,//查询债项详情
      getRecordProductIcrate: getRecordProductIcrate,//查询债项评级历史列表
      getFinBalance: getFinBalance,//查询资产负债表
      getFinCashflow: getFinCashflow,//查询现金流量表
      getFinCashflowadd: getFinCashflowadd,//查询现金流量补充表
      getFinincome: getFinincome,//查询利润表
      getFund: getFund,
      createFund: createFund,//新增产品
      pushFundStart: pushFundStart,
      updateFund: updateFund,//修改产品
      deleteFund: deleteFund,
      getFundType: getFundType,
      getFundChannel: getFundChannel,
      addPayment: addPayment,//录入缴款流水
      getPayment: getPayment,//查询缴款流水列表
      updatePayment: updatePayment,//修改缴款流水
      getCounterpartyGroup: getCounterpartyGroup,
      ticketPlace: ticketPlace,
      updateTicket: updateTicket,
      buyBackZY: buyBackZY,
      buyBackMD: buyBackMD,
      updateBuybackdate: updateBuybackdate,//更改到期时间
      updateBuyBack: updateBuyBack,
      tradingOrders: tradingOrders,
      updateTradingOrders: updateTradingOrders,
      fundBuySell: fundBuySell,
      updateFundBuySell: updateFundBuySell,
      transactionComplete: transactionComplete,
      replyBusiness: replyBusiness,//取消确认交易
      cancelTransaction: cancelTransaction,
      getTransaction: getTransaction,//获取交易列表
      getTransactionInfo: getTransactionInfo,//获取交易详情
      getOwnTransaction: getOwnTransaction,//获取我的交易
      createCounterparty: createCounterparty,//创建交易对手
      updateCounterparty: updateCounterparty,//更新交易对手
      deleteCounterparty: deleteCounterparty,//删除交易对手
      getCounterparty: getCounterparty,//获取交易对手
      getTradeCounterparty: getTradeCounterparty,//获取过券机构或交易对手
      addTradeCounterparty: addTradeCounterparty,//新增过券机构或交易对手
      updateTradeCounterparty: updatetradeCounterparty,//新增过券机构或交易对手
      deleteTradeCounterparty: deletetradeCounterparty,//新增过券机构或交易对手
      getBusinessType: getBusinessType,
      getBusinessDirection: getBusinessDirection,
      getMarket: getMarket,
      getPayOrganization: getPayOrganization,
      getFullPrice: getFullPrice,
      getLiquidationSpeed: getLiquidationSpeed,
      getPayType: getPayType,
      getBusinessState: getBusinessState,
      getCounterpartyType: getCounterpartyType,
      getServiceType: getServiceType,
      getTraders: getTraders,
      getFundParameters: getFundParameters,
      getFundTKFund: getFundTKFund,
      getMoneyAvailable: getMoneyAvailable,
      getBondAvailable: getBondAvailable,
      getAllBond: getAllBond,//查询所有持仓
      getHoldingStatus: getHoldingStatus,
      fuzzySearch: fuzzySearch,//持仓模糊搜索
      getFundTemplates: getFundTemplates,//查询估值报表参数
      updateFundTemplates: updateFundTemplates,//估值报表参数修改
      getFixRate: getFixRate,//获取估值修正
      updateFixRate: updateFixRate,//更新估值修正
      changeFixrateState: changeFixrateState,//改变估值状态
      getFixratehistory: getFixratehistory,//获取操作记录
      setAdjustCash: setAdjustCash,//设置初始资金
      getWorkDay: getWorkDay,//查询工作日
      getWarningList: getWarningList,//业务提醒列表查询
      getPaymentWarningList: getPaymentWarningList,//业务提醒缴款流水列表查询
      getWarnings: getWarnings,//业务提醒明细查询
      getWarningBondName: getWarningBondName,//业务提醒明细查询
      getdays: getdays,//业务提醒列表查询
      getWarningType: getWarningType,//业务分类查询
      getAllUsers: getAllUsers,//查询所有用户
      addUserIntoGroup: addUserIntoGroup,//用户到角色分配
      delUserIntoGroup: delUserIntoGroup,//用户从角色删除
      addUserIntoGroupFund: addUserIntoGroupFund,//用户到产品分配
      delUserIntoGroupFund: delUserIntoGroupFund,//用户从产品删除
      cleanUser: cleanUser,//清除缓存
      addUser: addUser,//添加用户
      updateUser: updateUser,//修改用户
      delUser: delUser,//删除用户
      addGroup: addGroup,//添加角色
      getUserByName: getUserByName,//根据用户名查询
      getAllFunctionGroups: getAllFunctionGroups,//查询所有职能角色
      getFunctionGroup: getFunctionGroup,//查询职能及组织用户
      getAllOrganizGroups: getAllOrganizGroups,//查询所有组织划分
      transactionCompleteAll: transactionCompleteAll,//交易批量通过
      getRcRule: getRcRule,//获取风控规则
      addRcRule: addRcRule,//添加风控规则
      updateRcRule: updateRcRule,//修改风控规则
      addOrder: addOrder,//指令下单
      updateOrder: updateOrder,//指令下单修改
      updateOrderState: updateOrderState,//指令下单状态修改
      getNbOrder: getNbOrder,//获取国债交易
      addNbOrder: addNbOrder,//国债交易
      getNbSummary: getNbSummary,//国债现货
      getNbSummaries: getNbSummaries,//国债现货图
      getNbInfo: getNbInfo,//国债现货
      updateNbInfo: updateNbInfo,//国债现货初始化
      updateNbModiPrice: updateNbModiPrice,//修正估值
      getNbComparison: getNbComparison,//获取比对记录
      getNbAccount: getNbAccount,//获取国债账户记录
      getNbfSummary: getNbfSummary,//获取账户合计信息
      getNbfSummaries: getNbfSummaries,//获取账户合计信息图
      getNbfValuedate: getNbfValuedate,//获取最新行情日
      updateNbfValuedate: updateNbfValuedate,//获取最新行情日
      getTradeTargetPool: getTradeTargetPool,//获取投资合约池
      addTradeTargetPool: addTradeTargetPool,//新增投资合约
      deleteTradeTargetPool: deleteTradeTargetPool,//删除投资合约
      fuzzyIwindcode: fuzzyIwindcode,//模糊查询
      getOrder: getOrder,//查询指令下单
      getOrderInfo: getOrderInfo,//查询指令详情
      createBizOrder: createBizOrder,//派生交易
      getBlack: getBlack,//查询黑名单
      getRcHistory: getRcHistory,//查询详细信息
      refreshCalculate: refreshCalculate,//重算考勤
      getWindCode: getWindCode,//获取万德code
      getSecurityInfo: getSecurityInfo,//获取aside信息
      getRepoSummary: getRepoSummary,//获取质押加权信息
      getBizUserSummary: getBizUserSummary,//获取质押加权信息
      getManual: getManual,//获取日终交易说明
      PostManual: postManual,//添加日终交易说明
      putManual: putManual,//修改日终交易说明
      getQuote: getQuote,//查看行情
      getClear: getClear,//获取清算列表
      startClear: startClear,//开始清算
      createNBfAccount: createNBfAccount,//创建期货账户
      deleteNbfAccount: deleteNbfAccount,//删除期货账户
      updateNbfAccount: updateNbfAccount,//修改期货账户
      getNbfAccount: getNbfAccount,//查询期货账户
      getTradeList: getTradeList,//查询智能分析报告行业配置
      getWordMatch: getWordMatch,//查询智能分析报告配置
      addWordMatch: addWordMatch,//新增智能分析报告配置
      addTradeRelate: addTradeRelate,//新增行业关联
      deleteTradeRelate: deleteTradeRelate,//删除行业关联
      updateWordMatch: updateWordMatch,//修改智能分析报告配置
      deleteWordMatch: deleteWordMatch,//删除智能分析报告配置
      getWordTarget: getWordTarget,//获取定向指标
      getFileInfo: getFileInfo,//获取解析报告
      getServerList: getServerList,//获取服务列表
      restartServer: restartServer,//重启服务
    };
  }]);
});