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
    'angular-cookies': 'libs/angular-cookies.min',
    'angular-route': 'libs/angular-route.min',
    'angular-sanitize': 'libs/angular-sanitize.min',
    'angular-animate': 'libs/angular-animate.min',
    'angular-drag': 'libs/angular-drag',
    'ng-csv': 'libs/ng-csv.min',
    'angular-touch': 'libs/angular-touch.min',
    'uiGrid': 'libs/ui-grid.min',
    'jquery': 'libs/jquery.min',
    'router': 'libs/angular-ui-router.min',
    'd3': 'libs/d3.min',
    'nv-d3': 'libs/nv.d3.min',
    'angular-nvd3': 'libs/angular-nvd3.min',
    'ui-select': 'libs/select',
    'massautocomplete': 'libs/massautocomplete',
    'ui-bootstrap': 'libs/ui-bootstrap-tpls-2.5.0',
    'ivh-treeview': 'libs/ivh-treeview',
    'angularjs-dropdown-multiselect': 'libs/angularjs-dropdown-multiselect',
    'angularFileUpload': 'libs/angular-file-upload',

    //controllers
    'app': 'controllers/app',
    'LoginCtrl': 'controllers/LoginCtrl',
    'ChangePasswordCtrl': 'controllers/ChangePasswordCtrl',
    'BusinessReminderCtrl': 'controllers/BusinessReminderCtrl',
    'SRPositionReportCtrl': 'controllers/srCtrl/SRPositionReportCtrl',
    'SRPositionChangeCtrl': 'controllers/srCtrl/SRPositionChangeCtrl',
    'SRFundAssetReportCtrl': 'controllers/srCtrl/SRFundAssetReportCtrl',
    'SRPositionIndicatorCtrl': 'controllers/srCtrl/SRPositionIndicatorCtrl',
    'SRNetValueTrendCtrl': 'controllers/srCtrl/SRNetValueTrendCtrl',
    'SRPledgeWeightedCtrl': 'controllers/srCtrl/SRPledgeWeightedCtrl',
    'SRTransactionStatisticsCtrl': 'controllers/srCtrl/SRTransactionStatisticsCtrl',
    'CreditManagementCtrl': 'controllers/CreditManagementCtrl',
    'CMBondRatingCtrl': 'controllers/cmCtrl/CMBondRatingCtrl',
    'CMFocusBondCtrl': 'controllers/cmCtrl/CMFocusBondCtrl',
    'CMFocusMainCtrl': 'controllers/cmCtrl/CMFocusMainCtrl',
    'CMMainRatingCtrl': 'controllers/cmCtrl/CMMainRatingCtrl',
    'CMPositionAnalysisCtrl': 'controllers/cmCtrl/CMPositionAnalysisCtrl',
    'CMRiskPreviewCtrl': 'controllers/cmCtrl/CMRiskPreviewCtrl',
    'CMSearchCtrl': 'controllers/cmCtrl/CMSearchCtrl',
    'CMWarningCtrl': 'controllers/cmCtrl/CMWarningCtrl',
    'CMAnalysisReportCtrl': 'controllers/cmCtrl/CMAnalysisReportCtrl',
    'CMAnalysisConfigCtrl': 'controllers/cmCtrl/CMAnalysisConfigCtrl',
    'FundManagementCtrl': 'controllers/FundManagementCtrl',
    'FundManagementConfigCtrl': 'controllers/FundManagementConfigCtrl',
    'FundPaymentFlowCtrl': 'controllers/FundPaymentFlowCtrl',
    'IntegralManagementCtrl': 'controllers/IntegralManagementCtrl',
    'StatisticalReportCtrl': 'controllers/StatisticalReportCtrl',
    'TransactionKanbanCtrl': 'controllers/TransactionKanbanCtrl',
    'TKFundFundsCtrl': 'controllers/tkCtrl/TKFundFundsCtrl',
    'TKBondPositionsCtrl': 'controllers/tkCtrl/TKBondPositionsCtrl',
    'TKBondDetailsCtrl': 'controllers/tkCtrl/TKBondDetailsCtrl',
    'TKServerStateCtrl': 'controllers/tkCtrl/TKServerStateCtrl',
    'TransactionManagementCtrl': 'controllers/TransactionManagementCtrl',
    'TMAllCtrl': 'controllers/tmCtrl/TMAllCtrl',
    'TMCounterpartyCtrl': 'controllers/tmCtrl/TMCounterpartyCtrl',
    'TMTraderCounterpartyCtrl': 'controllers/tmCtrl/TMTraderCounterpartyCtrl',
    'TMOwnCtrl': 'controllers/tmCtrl/TMOwnCtrl',
    'TMTradingDescriptionCtrl': 'controllers/tmCtrl/TMTradingDescriptionCtrl',
    'TMTradeImportCtrl': 'controllers/tmCtrl/TMTradeImportCtrl',
    'TATreasuryFuturesCtrl': 'controllers/taCtrl/TATreasuryFuturesCtrl',
    'TATreasurySpotCtrl': 'controllers/taCtrl/TATreasurySpotCtrl',
    'TABondDetailsCtrl': 'controllers/taCtrl/TABondDetailsCtrl',
    'TATreasuryTransactionsCtrl': 'controllers/taCtrl/TATreasuryTransactionsCtrl',
    'TADayOffCtrl': 'controllers/taCtrl/TADayOffCtrl',
    'TATradeTargetPoolCtrl': 'controllers/taCtrl/TATradeTargetPoolCtrl',
    'TAAccountSettingCtrl': 'controllers/taCtrl/TAAccountSettingCtrl',
    'ValuationManagementCtrl': 'controllers/ValuationManagementCtrl',
    'VMCorrectCtrl': 'controllers/vmCtrl/VMCorrectCtrl',
    'VMReportCtrl': 'controllers/vmCtrl/VMReportCtrl',
    'UserManagementCtrl': 'controllers/UserManagementCtrl',
    'PositionManagementCtrl': 'controllers/PositionManagementCtrl',
    'PMPanoramaCtrl': 'controllers/pmCtrl/PMPanoramaCtrl',
    'PMOverviewCtrl': 'controllers/pmCtrl/PMOverviewCtrl',
    'PMOperatingIndicatorsCtrl': 'controllers/pmCtrl/PMOperatingIndicatorsCtrl',
    'PMControlIndexCtrl': 'controllers/pmCtrl/PMControlIndexCtrl',
    'RiskManagementCtrl': 'controllers/RiskManagementCtrl',
    'RMAssetPoolCtrl': 'controllers/rmCtrl/RMAssetPoolCtrl',
    'RMStaticCheckCtrl': 'controllers/rmCtrl/RMStaticCheckCtrl',
    'RMSubOrdersCtrl': 'controllers/rmCtrl/RMSubOrdersCtrl',
    'RMWindRuleCtrl': 'controllers/rmCtrl/RMWindRuleCtrl',
    //routes
    'appRoute': 'routes/appRoute',

    //factory
    'factory': 'factories/factory',

    //services
    'serverService': 'services/serverService',

    //util
    'storage': 'utils/util',
    'common': 'utils/common',
    'layDate': 'utils/layDate',
    'echarts': 'utils/echarts',
    'md5': 'utils/md5',
    'pintuer': 'utils/pintuer',
    'fileSaver': 'utils/FileSaver',
    'xlsx': 'utils/xlsx.full.min',

    //directive
    'cmDirective': 'cmDirective/cmDirective',
    'pmDirective': 'pmDirective/pmDirective',
    'taDirective': 'controllers/taCtrl/taDirective',
    'taPoolDirective': 'controllers/taCtrl/taPoolDirective',
  },
  //非AMD模块
  shim: {
    'angular': {
      exports: 'angular',
      deps: ['jquery']
    },
    'angular-cookies': {
      exports: 'angular-cookies',
      deps: ['angular']
    },
    'angular-route': {
      exports: 'angular-route',
      deps: ['angular']
    },
    'angular-sanitize': {
      exports: 'angular-sanitize',
      deps: ['angular']
    },
    'ng-csv': {
      exports: 'ng-csv',
      deps: ['angular']
    },
    'angular-animate': {
      exports: 'angular-animate',
      deps: ['angular']
    },
    'massautocomplete': {
      exports: 'massautocomplete',
      deps: ['angular']
    },
    'ui-bootstrap' : {
      exports: 'ui-bootstrap',
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
    'uiGrid': {
      exports: 'uiGrid',
      deps: ['angular']
    },
    'router': {
      exports: 'router',
      deps: ['angular']
    },
    'nv-d3': {
      exports: 'nv-d3',
      deps: ['d3']
    },
    'angular-nvd3': {
      exports: 'angular-nvd3',
      deps: ['d3', 'nv-d3', 'angular']
    },
    'pintuer': {
      exports: 'pintuer',
      deps: ['jquery']
    },
    'ui-select': {
      exports: 'ui-select',
      deps: ['jquery', 'angular']
    },
    'ivh-treeview': {
      exports: 'ivh-treeview',
      deps: ['angular']
    },
    'angularjs-dropdown-multiselect': {
      exports: 'angularjs-dropdown-multiselect',
      deps: ['angular']
    },
    'angularFileUpload': {
      exports: 'angularFileUpload',
      deps: ['angular']
    },
  }
});

//加载模块, 启动angular
require([
  'angular', 'angular-cookies', 'app', 'angular-route', 'angular-sanitize', 'ng-csv', 'storage', 'LoginCtrl',
  'UserManagementCtrl', 'common', 'md5', 'angular-animate', 'uiGrid', 'jquery', 'angular-drag', 'angular-touch',
  'BusinessReminderCtrl', 'CreditManagementCtrl', 'appRoute', 'FundManagementCtrl', 'FundManagementConfigCtrl',
  'CMBondRatingCtrl', 'CMFocusBondCtrl', 'CMFocusMainCtrl', 'CMMainRatingCtrl', 'CMPositionAnalysisCtrl',
  'CMRiskPreviewCtrl', 'CMSearchCtrl', 'cmDirective', 'router', 'd3', 'nv-d3', 'angular-nvd3', 'ui-select',
  'IntegralManagementCtrl', 'StatisticalReportCtrl', 'TransactionKanbanCtrl', 'TKFundFundsCtrl', 'ivh-treeview',
  'TKBondPositionsCtrl', 'TransactionManagementCtrl', 'TMAllCtrl', 'TMCounterpartyCtrl', 'TMOwnCtrl',
  'TMTraderCounterpartyCtrl', 'PositionManagementCtrl', 'PMPanoramaCtrl', 'PMOverviewCtrl', 'PMOperatingIndicatorsCtrl',
  'PMControlIndexCtrl', 'ValuationManagementCtrl', 'serverService', 'layDate', 'SRPositionReportCtrl', 'pmDirective',
  'SRPledgeWeightedCtrl', 'SRPositionChangeCtrl', 'SRFundAssetReportCtrl', 'SRPositionIndicatorCtrl',
  'SRNetValueTrendCtrl', 'TKBondDetailsCtrl', 'FundPaymentFlowCtrl', 'VMCorrectCtrl', 'VMReportCtrl',
  'ChangePasswordCtrl', 'RiskManagementCtrl', 'RMAssetPoolCtrl', 'RMStaticCheckCtrl', 'RMSubOrdersCtrl',
  'RMWindRuleCtrl', 'angularjs-dropdown-multiselect', 'angularFileUpload', 'CMAnalysisReportCtrl', 'TMTradeImportCtrl',
  'SRTransactionStatisticsCtrl', 'TMTradingDescriptionCtrl', 'fileSaver', 'xlsx', 'TATreasuryFuturesCtrl',
  'TATreasurySpotCtrl', 'TATreasuryTransactionsCtrl', 'ui-bootstrap', 'TADayOffCtrl', 'TATradeTargetPoolCtrl',
  'TAAccountSettingCtrl', 'taDirective', 'taPoolDirective', 'massautocomplete', 'TABondDetailsCtrl',
  'CMAnalysisConfigCtrl', 'factory', 'CMWarningCtrl', 'TKServerStateCtrl', 'echarts',
], function (angular) {
  angular.bootstrap(document, ['FundsManagementSystem'])
})
