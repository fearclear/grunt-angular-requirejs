/**
 * 前端路由配置模块
 */
define(['app', 'storage'], function (app, storage) {
    return app.config(["$stateProvider","$urlRouterProvider", '$httpProvider' ,function ($stateProvider,$urlRouterProvider, $httpProvider) {
      //http默认值设置
      $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
      $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
      $httpProvider.defaults.headers.common['x-basin-terminal'] = 'PC'
      $httpProvider.defaults.headers.common['x-basin-version'] = '1'
      $httpProvider.defaults.headers.common['x-basin-token'] = storage.local.getItem(storage.KEY.USERINFO)?storage.local.getItem(storage.KEY.USERINFO).userId:''
      $httpProvider.interceptors.push('HttpInterceptor');
      //注册路由
      $stateProvider
        .state('login', {
          url: '/login',
          views: {
            '': {
              templateUrl: 'js/templates/login.html',
              controller: 'LoginCtrl'
            }
          }
        })
        .state('positionInformation', {
          url: '/positionInformation.html',
          views: {
            '': {
              templateUrl: 'js/templates/positionInformation.html',
              controller: 'PositionInformationCtrl'
            }
          }
        })
        .state('historicalPosition', {
          url: '/historicalPosition',
          views: {
            '': {
              templateUrl: 'js/templates/historicalPosition.html',
              controller: 'HistoricalPositionCtrl'
            }
          }
        })
        .state('historicalTrading', {
          url: '/historicalTrading',
          views: {
            '': {
              templateUrl: 'js/templates/historicalTrading.html',
              controller: 'HistoricalTradingCtrl'
            }
          }
        })
        .state('signalQuery', {
          url: '/signalQuery',
          views: {
            '': {
              templateUrl: 'js/templates/signalQuery.html',
              controller: 'SignalQueryCtrl'
            }
          }
        })
      $urlRouterProvider.otherwise('/login');
    }])
});
