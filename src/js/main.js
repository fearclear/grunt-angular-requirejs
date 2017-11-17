/**
 * 主js
 */
//配置require
require.config({
  //基本路径
  baseUrl: 'js/',
  //强制刷新缓存
  urlArgs: "bust=v1.0.0/"+new Date().getTime(),
  //加长等待时间，防止模块加载超时
  waitSeconds: 0,
  //映射模块: name:path
  paths: {
    //lib模块
    'angular': 'libs/angular.min',
    'angular-sanitize': 'libs/angular-sanitize.min',
    'angular-animate': 'libs/angular-animate.min',
    'angular-drag': 'libs/angular-drag',
    'angular-touch': 'libs/angular-touch.min',
    'uiGrid': 'libs/ui-grid.min',
    'jquery': 'libs/jquery.min',
    'router': 'libs/angular-ui-router.min',
    'ui-select': 'libs/select',
    'ui-bootstrap': 'libs/ui-bootstrap-tpls-2.5.0',

    //controllers
    'app': 'controllers/app',
    'LoginCtrl': 'controllers/LoginCtrl',
    'PositionInformationCtrl': 'controllers/PositionInformationCtrl',
    'HistoricalPositionCtrl': 'controllers/HistoricalPositionCtrl',
    'HistoricalTradingCtrl': 'controllers/HistoricalTradingCtrl',
    'SignalQueryCtrl': 'controllers/SignalQueryCtrl',
    //routes
    'appRoute': 'routes/appRoute',

    //factory
    'factory': 'factories/factory',

    //services
    'serverService': 'services/serverService',

    //util
    'storage': 'utils/util',
    'common': 'utils/common',
    'echarts': 'utils/echarts',
    'md5': 'utils/md5',
    'xlsx': 'utils/xlsx.full.min',

    //directive
    'modalChart': 'directives/modalChart',
  },
  //非AMD模块
  shim: {
    'angular': {
      exports: 'angular',
      deps: ['jquery']
    },
    'angular-sanitize': {
      exports: 'angular-sanitize',
      deps: ['angular']
    },
    'angular-animate': {
      exports: 'angular-animate',
      deps: ['angular']
    },
    'angular-touch': {
      exports: 'angular-touch',
      deps: ['angular']
    },
    'angular-drag': {
      exports: 'angular-drag',
      deps: ['angular', 'jquery']
    },
    'ui-bootstrap' : {
      exports: 'ui-bootstrap',
      deps: ['angular']
    },
    'uiGrid': {
      exports: 'uiGrid',
      deps: ['angular']
    },
    'router': {
      exports: 'router',
      deps: ['angular']
    },
    'ui-select': {
      exports: 'ui-select',
      deps: ['jquery', 'angular']
    },
  }
});

//加载模块, 启动angular
var moduleList = [
  'angular', 'app', 'storage', 'common', 'md5', 'uiGrid', 'jquery',
  'appRoute', 'router', 'ui-select', 'serverService', 'xlsx', 'factory', 'ui-bootstrap',
  'echarts', 'LoginCtrl', 'angular-sanitize', 'angular-animate', 'angular-drag', 'angular-touch',
  'PositionInformationCtrl', 'HistoricalPositionCtrl', 'HistoricalTradingCtrl', 'SignalQueryCtrl',
  'modalChart',
];
require(moduleList, function (angular) {
  angular.bootstrap(document, ['TransactionRecord'])
});
