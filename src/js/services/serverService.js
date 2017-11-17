/**
 * 与服务器ajax交互的service模块
 */
'use strict';

define(['app', 'md5', 'storage'], function (app, md5, storage) {
  return app.factory('serverService', ['$http', '$q', function ($http, $q) {
    //基础url配置
    var url = storage.KEY.API.url;
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
      delete $http.defaults.headers.common['x-basin-token'];
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

    /**************************服务**********************************************/
    //k线图查询
    function getQuotation(params) {
      var defer = $q.defer();
      $http({
        url: url + '/getQuotation',
        method: 'GET',
        params: params,
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      })
      return defer.promise;
    }
    //查询持仓
    function getHolding(params) {
      var defer = $q.defer();
      $http({
        url: url + '/getHolding',
        method: 'GET',
        params: params,
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      })
      return defer.promise;
    }
    //查询历史头寸
    function getPosition(params) {
      var defer = $q.defer();
      $http({
        url: url + '/getPosition',
        method: 'GET',
        params: params,
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      })
      return defer.promise;
    }
    //查询历史交易
    function getTrade(params) {
      var defer = $q.defer();
      $http({
        url: url + '/getTrade',
        method: 'GET',
        params: params,
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      })
      return defer.promise;
    }
    //查询信号
    function getSingnal(params) {
      var defer = $q.defer();
      $http({
        url: url + '/getSingnal',
        method: 'GET',
        params: params,
      }).success(function (result) {
        defer.resolve(result);
      }).error(function (error) {
        defer.reject(error);
      })
      return defer.promise;
    }

    /**************************函数导出模块**********************************************/
    return {
      changeToken: changeToken,//更改token
      login: login,//登录
      getQuotation: getQuotation,//k线图查询
      getHolding: getHolding,//查询持仓
      getPosition: getPosition,//查询历史头寸
      getTrade: getTrade,//查询历史交易
      getSingnal: getSingnal,//查询信号
    };
  }]);
});