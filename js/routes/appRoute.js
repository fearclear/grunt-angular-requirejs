/**
 * 前端路由配置模块
 */
define(['app', 'storage'], function (app, storage) {
    return app.config(["$stateProvider","$urlRouterProvider", 'ivhTreeviewOptionsProvider', '$httpProvider' ,function ($stateProvider,$urlRouterProvider, ivhTreeviewOptionsProvider, $httpProvider) {
      //http默认值设置
      $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
      $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
      $httpProvider.defaults.headers.common['x-basin-terminal'] = 'PC'
      $httpProvider.defaults.headers.common['x-basin-version'] = '1'
      $httpProvider.defaults.headers.common['x-basin-token'] = storage.local.getItem(storage.KEY.USERINFO)?storage.local.getItem(storage.KEY.USERINFO).userId:''
      $httpProvider.interceptors.push('HttpInterceptor');
      //   树形图选择
        ivhTreeviewOptionsProvider.set({
            defaultSelectedState: false,
            validate: true
        });
        //注册路由
        $stateProvider
            .state('login', {
                url: '/login',
                views: {
                    '': {
                        templateUrl : 'js/templates/login.html',
                        controller : 'LoginCtrl'
                    }
                }
            })
            .state('changePassword', {
                url: '/changePassword',
                views: {
                    '': {
                        templateUrl : 'js/templates/changePassword.html',
                        controller : 'ChangePasswordCtrl'
                    }
                }
            })
            .state('businessReminder', {
                url: '/businessReminder',
                views: {
                    '': {
                        templateUrl : 'js/templates/businessReminder.html',
                        controller : 'BusinessReminderCtrl'
                    }
                }
            })
            .state('creditManagement', {
                url: '/creditManagement',
                views: {
                    'viewRating': {
                        templateUrl : 'js/templates/creditManagement.html',
                        controller : 'CreditManagementCtrl'
                    }
                }
            })
            .state('cmBondRating', {
                url: '/cmBondRating',
                views: {
                    '': {
                        templateUrl : 'js/templates/cmTemp/cmBondRating.html',
                        controller : 'CMBondRatingCtrl'
                    }
                }
            })
            .state('cmFocusBond', {
                url: '/cmFocusBond',
                views: {
                    '': {
                        templateUrl : 'js/templates/cmTemp/cmFocusBond.html',
                        controller : 'CMFocusBondCtrl'
                    }
                }
            })
            .state('cmFocusMain', {
                url: '/cmFocusMain',
                views: {
                    '': {
                        templateUrl : 'js/templates/cmTemp/cmFocusMain.html',
                        controller : 'CMFocusMainCtrl'
                    }
                }
            })
            .state('cmMainRating', {
                url: '/cmMainRating',
                views: {
                    '': {
                        templateUrl : 'js/templates/cmTemp/cmMainRating.html',
                        controller : 'CMMainRatingCtrl'
                    }
                }
            })
            .state('cmPositionAnalysis', {
                url: '/cmPositionAnalysis',
                views: {
                    '': {
                        templateUrl : 'js/templates/cmTemp/cmPositionAnalysis.html',
                        controller : 'CMPositionAnalysisCtrl'
                    }
                }
            })
            .state('cmRiskPreview', {
                url: '/cmRiskPreview',
                views: {
                    '': {
                        templateUrl : 'js/templates/cmTemp/cmRiskPreview.html',
                        controller : 'CMRiskPreviewCtrl'
                    }
                }
            })
            .state('cmSearch', {
                url: '/cmSearch',
                views: {
                    '': {
                        templateUrl : 'js/templates/cmTemp/cmSearch.html',
                        controller : 'CMSearchCtrl'
                    }
                }
            })
            .state('cmWarning', {
                url: '/cmWarning',
                views: {
                    '': {
                        templateUrl : 'js/templates/cmTemp/cmWarning.html',
                        controller : 'CMWarningCtrl'
                    }
                }
            })
            .state('cmAnalysisReport', {
                url: '/cmAnalysisReport',
                views: {
                    '': {
                        templateUrl : 'js/templates/cmTemp/cmAnalysisReport.html',
                        controller : 'CMAnalysisReportCtrl'
                    }
                }
            })
            .state('cmAnalysisConfig', {
                url: '/cmAnalysisConfig',
                views: {
                    '': {
                        templateUrl : 'js/templates/cmTemp/cmAnalysisConfig.html',
                        controller : 'CMAnalysisConfigCtrl'
                    }
                }
            })
            .state('fundManagement', {
                url: '/fundManagement',
                views: {
                    '': {
                        templateUrl : 'js/templates/fundManagement.html',
                        controller : 'FundManagementCtrl'
                    }
                }
            })
            .state('fundManagementConfig', {
                url: '/fundManagementConfig',
                views: {
                    '': {
                        templateUrl : 'js/templates/fundManagementConfig.html',
                        controller : 'FundManagementConfigCtrl'
                    }
                }
            })
            .state('fundPaymentFlow', {
                url: '/fundPaymentFlow',
                views: {
                    '': {
                        templateUrl : 'js/templates/fundPaymentFlow.html',
                        controller : 'FundPaymentFlowCtrl'
                    }
                }
            })
            .state('integralManagement', {
                url: '/integralManagement',
                views: {
                    '': {
                        templateUrl : 'js/templates/integralManagement.html',
                        controller : 'IntegralManagementCtrl'
                    }
                }
            })
            .state('statisticalReport', {
                url: '/statisticalReport',
                views: {
                    '': {
                        templateUrl : 'js/templates/statisticalReport.html',
                        controller : 'StatisticalReportCtrl'
                    }
                }
            })
            .state('srPositionReport', {
                url: '/srPositionReport',
                views: {
                    '': {
                        templateUrl : 'js/templates/srTemp/srPositionReport.html',
                        controller : 'SRPositionReportCtrl'
                    }
                }
            })
            .state('srPledgeWeighted', {
                url: '/srPledgeWeighted',
                views: {
                    '': {
                        templateUrl : 'js/templates/srTemp/srPledgeWeighted.html',
                        controller : 'SRPledgeWeightedCtrl'
                    }
                }
            })
            .state('srPositionChange', {
                url: '/srPositionChange',
                views: {
                    '': {
                        templateUrl : 'js/templates/srTemp/srPositionChange.html',
                        controller : 'SRPositionChangeCtrl'
                    }
                }
            })
            .state('srFundAssetReport', {
                url: '/srFundAssetReport',
                views: {
                    '': {
                        templateUrl : 'js/templates/srTemp/srFundAssetReport.html',
                        controller : 'SRFundAssetReportCtrl'
                    }
                }
            })
            .state('srPositionIndicator', {
                url: '/srPositionIndicator',
                views: {
                    '': {
                        templateUrl : 'js/templates/srTemp/srPositionIndicator.html',
                        controller : 'SRPositionIndicatorCtrl'
                    }
                }
            })
            .state('srNetValueTrend', {
                url: '/srNetValueTrend',
                views: {
                    '': {
                        templateUrl : 'js/templates/srTemp/srNetValueTrend.html',
                        controller : 'SRNetValueTrendCtrl'
                    }
                }
            })
            .state('srTransactionStatistics', {
                url: '/srTransactionStatistics',
                views: {
                    '': {
                        templateUrl : 'js/templates/srTemp/srTransactionStatistics.html',
                        controller : 'SRTransactionStatisticsCtrl'
                    }
                }
            })
            .state('transactionKanban', {
                url: '/transactionKanban',
                views: {
                    '': {
                        templateUrl : 'js/templates/transactionKanban.html',
                        controller : 'TransactionKanbanCtrl'
                    }
                }
            })
            .state('TKFundFunds', {
                url: '/TKFundFunds',
                views: {
                    '': {
                        templateUrl : 'js/templates/tkTemp/TKFundFunds.html',
                        controller : 'TKFundFundsCtrl'
                    }
                }
            })
            .state('TKBondPositions', {
                url: '/TKBondPositions',
                views: {
                    '': {
                        templateUrl : 'js/templates/tkTemp/TKBondPositions.html',
                        controller : 'TKBondPositionsCtrl'
                    }
                }
            })
            .state('TKBondDetails', {
                url: '/TKBondDetails',
                views: {
                    '': {
                        templateUrl : 'js/templates/tkTemp/TKBondDetails.html',
                        controller : 'TKBondDetailsCtrl'
                    }
                }
            })
            .state('tkServerState', {
                url: '/tkServerState',
                views: {
                    '': {
                        templateUrl : 'js/templates/tkTemp/tkServerState.html',
                        controller : 'TKServerStateCtrl'
                    }
                }
            })
            .state('transactionManagement', {
                url: '/transactionManagement',
                views: {
                    '': {
                        templateUrl : 'js/templates/transactionManagement.html',
                        controller : 'TransactionManagementCtrl'
                    }
                }
            })
            .state('tmAll', {
                url: '/tmAll',
                views: {
                    '': {
                        templateUrl : 'js/templates/tmTemp/tmAll.html',
                        controller : 'TMAllCtrl'
                    }
                }
            })
            .state('tmCounterparty', {
                url: '/tmCounterparty',
                views: {
                    '': {
                        templateUrl : 'js/templates/tmTemp/tmCounterparty.html',
                        controller : 'TMCounterpartyCtrl'
                    }
                }
            })
            .state('tmOwn', {
                url: '/tmOwn',
                views: {
                    '': {
                        templateUrl : 'js/templates/tmTemp/tmOwn.html',
                        controller : 'TMOwnCtrl'
                    }
                }
            })
            .state('tmTraderCounterparty', {
                url: '/tmTraderCounterparty',
                views: {
                    '': {
                        templateUrl : 'js/templates/tmTemp/tmTraderCounterparty.html',
                        controller : 'TMTraderCounterpartyCtrl'
                    }
                }
            })
            .state('tmTradingDescription', {
                url: '/tmTradingDescription',
                views: {
                    '': {
                        templateUrl : 'js/templates/tmTemp/tmTradingDescription.html',
                        controller : 'TMTradingDescriptionCtrl'
                    }
                }
            })
            .state('tmTradeImport', {
                url: '/tmTradeImport',
                views: {
                    '': {
                        templateUrl : 'js/templates/tmTemp/tmTradeImport.html',
                        controller : 'TMTradeImportCtrl'
                    }
                }
            })
            .state('taTreasuryTransactions', {
                url: '/taTreasuryTransactions',
                views: {
                    '': {
                        templateUrl : 'js/templates/taTemp/taTreasuryTransactions.html',
                        controller : 'TATreasuryTransactionsCtrl'
                    }
                }
            })
            .state('taTreasuryFutures', {
                url: '/taTreasuryFutures',
                views: {
                    '': {
                        templateUrl : 'js/templates/taTemp/taTreasuryFutures.html',
                        controller : 'TATreasuryFuturesCtrl'
                    }
                }
            })
            .state('taTreasurySpot', {
                url: '/taTreasurySpot',
                views: {
                    '': {
                        templateUrl : 'js/templates/taTemp/taTreasurySpot.html',
                        controller : 'TATreasurySpotCtrl'
                    }
                }
            })
            .state('taDayOff', {
                url: '/taDayOff',
                views: {
                    '': {
                        templateUrl : 'js/templates/taTemp/taDayOff.html',
                        controller : 'TADayOffCtrl'
                    }
                }
            })
            .state('taBondDetails', {
                url: '/taBondDetails',
                views: {
                    '': {
                        templateUrl : 'js/templates/taTemp/taBondDetails.html',
                        controller : 'TABondDetailsCtrl'
                    }
                }
            })
            .state('taAccountSetting', {
                url: '/taAccountSetting',
                views: {
                    '': {
                        templateUrl : 'js/templates/taTemp/taAccountSetting.html',
                        controller : 'TAAccountSettingCtrl'
                    }
                }
            })
            .state('taTradeTargetPool', {
                url: '/taTradeTargetPool',
                views: {
                    '': {
                        templateUrl : 'js/templates/taTemp/taTradeTargetPool.html',
                        controller : 'TATradeTargetPoolCtrl'
                    }
                }
            })
            .state('valuationManagement', {
                url: '/valuationManagement',
                views: {
                    '': {
                        templateUrl : 'js/templates/valuationManagement.html',
                        controller : 'ValuationManagementCtrl'
                    }
                }
            })
            .state('vmCorrect', {
                url: '/vmCorrect',
                views: {
                    '': {
                        templateUrl : 'js/templates/vmTemp/vmCorrect.html',
                        controller : 'VMCorrectCtrl'
                    }
                }
            })
            .state('vmReport', {
                url: '/vmReport',
                views: {
                    '': {
                        templateUrl : 'js/templates/vmTemp/vmReport.html',
                        controller : 'VMReportCtrl'
                    }
                }
            })
            .state('userManagement', {
                url: '/userManagement',
                views: {
                    '': {
                        templateUrl : 'js/templates/userManagement.html',
                        controller : 'UserManagementCtrl'
                    }
                }
            })
            .state('positionManagement', {
                url: '/positionManagement',
                views: {
                    '': {
                        templateUrl : 'js/templates/positionManagement.html',
                        controller : 'PositionManagementCtrl'
                    }
                }
            })
            .state('pmPanorama', {
                url: '/pmPanorama',
                views: {
                    '': {
                        templateUrl : 'js/templates/pmTemp/pmPanorama.html',
                        controller : 'PMPanoramaCtrl'
                    }
                }
            })
            .state('pmOverview', {
                url: '/pmOverview',
                views: {
                    '': {
                        templateUrl : 'js/templates/pmTemp/pmOverview.html',
                        controller : 'PMOverviewCtrl'
                    }
                }
            })
            .state('pmOperatingIndicators', {
                url: '/pmOperatingIndicators',
                views: {
                    '': {
                        templateUrl : 'js/templates/pmTemp/pmOperatingIndicators.html',
                        controller : 'PMOperatingIndicatorsCtrl'
                    }
                }
            })
            .state('pmControlIndex', {
                url: '/pmControlIndex',
                views: {
                    '': {
                        templateUrl : 'js/templates/pmTemp/pmControlIndex.html',
                        controller : 'PMControlIndexCtrl'
                    }
                }
            })
            .state('riskManagement', {
                url: '/riskManagement',
                views: {
                    '': {
                        templateUrl : 'js/templates/riskManagement.html',
                        controller : 'RiskManagementCtrl'
                    }
                }
            })
            .state('rmAssetPool', {
                url: '/rmAssetPool',
                views: {
                    '': {
                        templateUrl : 'js/templates/rmTemp/rmAssetPool.html',
                        controller : 'RMAssetPoolCtrl'
                    }
                }
            })
            .state('rmStaticCheck', {
                url: '/rmStaticCheck',
                views: {
                    '': {
                        templateUrl : 'js/templates/rmTemp/rmStaticCheck.html',
                        controller : 'RMStaticCheckCtrl'
                    }
                }
            })
            .state('rmSubOrders', {
                url: '/rmSubOrders',
                views: {
                    '': {
                        templateUrl : 'js/templates/rmTemp/rmSubOrders.html',
                        controller : 'RMSubOrdersCtrl'
                    }
                }
            })
            .state('rmWindRule', {
                url: '/rmWindRule',
                views: {
                    '': {
                        templateUrl : 'js/templates/rmTemp/rmWindRule.html',
                        controller : 'RMWindRuleCtrl'
                    }
                }
            })
        $urlRouterProvider.otherwise('/login');
    }])
});
