/**
 * 应用模块
 */
'use strict';

define(['app', 'storage'], function (app, storage) {
  function HttpInterceptor($q, $rootScope) {
    $rootScope.loading = 0
    function handleLoading() {
      $rootScope.loading--
      if($rootScope.loading === 0){
        hideLoading()
      }
    }
    return {
      request: function (config) {
        $rootScope.loading++
        return config;
      },
      requestError: function (err) {
        handleLoading()
        $rootScope.isError = true;
        $rootScope.errText = err.text;
        return $q.reject(err);
      },
      response: function (res) {
        handleLoading()
        return res;
      },
      responseError: function (err) {
        handleLoading()
        if(err && err.data){
          $rootScope.isError = true;
          $rootScope.errText = err.data.text;
        }else {
          err.data = {}
          $rootScope.isError = true;
          $rootScope.errText = '网络错误';
        }
        throw err
      }
    };
  }
  return app.factory('HttpInterceptor', ['$q', '$rootScope', HttpInterceptor])
});