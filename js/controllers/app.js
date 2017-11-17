/**
 * 应用模块
 */
'use strict';

define(['angular', 'storage'], function (angular, storage) {
  return angular.module('FundsManagementSystem', ['ngRoute', 'ngCookies', 'ngSanitize', 'ngTouch', 'ngCsv', 'ngAnimate', 'ui.router', 'ui.grid', 'ui.grid.resizeColumns', 'ui.grid.exporter', 'ui.grid.selection', 'angular-drag', 'ui.grid.moveColumns', 'ui.grid.pinning', 'ui.grid.cellNav', 'ui.grid.autoResize', 'ui.grid.treeView', 'ui.grid.edit', 'ui.grid.rowEdit', 'ui.grid.pagination', 'nvd3', 'ui.select', 'ui.bootstrap', 'ivh.treeview', 'angularjs-dropdown-multiselect', 'angularFileUpload', 'MassAutoComplete'])
    .service('baseService', ['$rootScope', '$interval', 'serverService', '$cookies', '$timeout', '$location', '$state', 'i18nService',
      function ($rootScope, $interval, serverService, $cookies, $timeout, $location, $state, i18nService) {
        $rootScope.pageNow = '1';
        //信用管理分页
        $rootScope.tabLists = [];
        $rootScope.isBondContentDetail = false;
        $rootScope.effectiveNumber = 4;//有效数字
        $rootScope.errConfirm = false;
        $rootScope.needHandle = false;
        $rootScope.mainRatingCash = {};//信评主体评级缓存
        i18nService.setCurrentLang("zh-cn");
        $rootScope.statistical = {
          pageNow: 'srFundAssetReport'
        };//统计报表缓存
        $rootScope.positionManagement = {
          pageNow: 'pmPanorama'
        }
        $rootScope.date = {
          dateNow: new Date().Format("yyyy年MM月dd日 hh时mm分ss秒 EEE"),
          yesterDay: new Date().Format('yyyy-MM-dd'),//今天的格式化日期
          today: new Date(new Date().getTime() + 86400000).Format('yyyy-MM-dd')//明天の格式化日期
        }
        $interval(function () {
          $rootScope.date.dateNow = new Date().Format("yyyy年MM月dd日 hh时mm分ss秒 EEE");
        }, 1000);
        $rootScope.isAdmin = false
        var userInfo = $rootScope.userInfo = storage.local.getItem(storage.KEY.USERINFO) || {}
        if (/admin/.test(userInfo.authority)) {
          $rootScope.isAdmin = true;
        } else {
          $rootScope.isAdmin = false
        }
        var token = userInfo.userId
        if (token === 'null' || token === undefined || token === null || !token) {
          $location.path('/login').replace();
        }
        //浏览器通知提醒
        if (window.Notification) {
          Notification.requestPermission(function (status) {
            if (Notification.permission !== status) {
              Notification.permission = status;
            }
          });
        } else {
          alert('该浏览器无法获取通知提醒');
        }
        //websocket连接
        sendWs(token)
        var timer = ''
        function sendWs(token) {
          clearTimeout(timer);
          var ws = new WebSocket(storage.KEY.API.wsUrl, token);
          $rootScope.ws = ws;
          ws.onopen = function (data) {
            ws.send('hello');
          }
          ws.onmessage = function (res) {
            // var noti = new Notification('hello')
            var data = JSON.parse(res.data);
            if (window.Notification) {
              var noti = new Notification('新消息提醒', {
                body: data.msg,
                data: data,
                icon: './img/favicon.ico',
              });
              noti.onclick = function () {
                window.focus();
                noti.close()
                storage.session.setItem(storage.KEY.NOTI, noti.data.orderId)
                if($location.$$path === '/rmSubOrders'){
                  $rootScope.$broadcast('showModal')
                }else {
                  $location.path(noti.data.route).replace();
                }
              }
            }
          }
          ws.onclose = function (data) {
            timer = setTimeout(function () {
              sendWs(token);
            }, 30000)
          }
          ws.onerror = function (err) {

          }
        }

        $rootScope.$on('changeWsLink', function (ev, data) {
          $rootScope.ws.close()
          sendWs(data.token)
        })
        $rootScope.username = userInfo.userName
        $rootScope.isPagination = true;
        $rootScope.isFirstLoad = {
          tmOwn: true
        }
        //设置
        $rootScope.goUserSetting = function () {
          if ($rootScope.userInfo.userName === '系统管理员') {
            $location.path('/userManagement').replace();
          } else {
            $location.path('/changePassword').replace()
          }
        }
        //点击变换样式
        $rootScope.activeListStyle = function (ev, item, callback) {
          if (item !== undefined) {
            item.isShow = !item.isShow;
          }
          if (callback) {
            callback();
          }
        };
        //分页模块
        $rootScope.pageIndex = 1;
        $rootScope.pageTotal = 1;
        $rootScope.totalCount = 0;
        // createPage();
        $rootScope.toPage = function (item, ev) {
          if ($rootScope.pageTotal) {
            if ($rootScope.pageTotal < item) {
              item = $rootScope.pageTotal;
            }
            if (item < 1) {
              item = 1;
            }
          }
          $rootScope.pageIndex = item;
          // ajax请求
          $rootScope.$broadcast($rootScope.pageNow, {pageIndex: item});
        };
        //关闭弹窗
        /**************************左侧菜单栏*************************************/
        function createTitleList() {
          userInfo = storage.local.getItem(storage.KEY.USERINFO) || {}
          $rootScope.titleList = {
            '交易看板': {
              url: '#/transactionKanban',
              visible: true,
              title: '交易看板',
              list: [
                {
                  name: '产品资金动态',
                  url: '#/TKFundFunds',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'TKFundFunds',
                },
                {
                  name: '债券持仓动态',
                  url: '#/TKBondPositions',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'TKBondPositions',
                },
                {
                  name: '债券明细动态',
                  url: '#/TKBondDetails',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'TKBondDetails'
                }/*,
                {
                  name: '服务状态管理',
                  url: '#/tkServerState',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'tkServerState'
                }*/
              ]
            },
            '交易管理': {
              url: '#/transactionManagement',
              visible: true,
              title: '交易管理',
              list: [
                {
                  name: '全部交易',
                  url: '#/tmAll',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'tmAll'
                },
                {
                  name: '我的下单',
                  url: '#/tmOwn',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'tmOwn'
                },
                {
                  name: '交易对手维护',
                  url: '#/tmTraderCounterparty',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'tmTraderCounterparty'
                },
                {
                  name: '过券机构维护',
                  url: '#/tmCounterparty',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'tmCounterparty'
                },
                {
                  name: '日终交易说明',
                  url: '#/tmTradingDescription',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'tmTradingDescription'
                },
              ]
            },
            '国债账户': {
              url: '#/taTreasurySpot',
              visible: true,
              title: '国债账户',
              list: [
                {
                  name: '现货账户',
                  url: '#/taTreasurySpot',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'taTreasurySpot'
                },
                {
                  name: '现货交易',
                  url: '#/taTreasuryTransactions',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'taTreasuryTransactions'
                },
                {
                  name: '利率债明细',
                  url: '#/taBondDetails',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'taBondDetails'
                },
                {
                  name: '期货账户',
                  url: '#/taTreasuryFutures',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'taTreasuryFutures'
                },
                {
                  name: '期货清算',
                  url: '#/taDayOff',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'taDayOff'
                },
              ]
            },
            '业务提醒': {
              url: '#/businessReminder',
              visible: true,
              title: '业务提醒',
              list: []
            },
            '统计报表': {
              url: '#/statisticalReport',
              visible: true,
              title: '统计报表',
              list: [
                {
                  name: '资产统计',
                  url: '#/srFundAssetReport',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'srFundAssetReport'
                },
                {
                  name: '持仓指标',
                  url: '#/srPositionIndicator',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'srPositionIndicator'
                },
                {
                  name: '净值走势',
                  url: '#/srNetValueTrend',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'srNetValueTrend'
                },
                {
                  name: '质押加权',
                  url: '#/srPledgeWeighted',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'srPledgeWeighted'
                },
                {
                  name: '交易统计',
                  url: '#/srTransactionStatistics',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'srTransactionStatistics'
                },
                {
                  name: '持仓报表',
                  url: '#/srPositionReport',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'srPositionReport'
                },
                {
                  name: '持仓变化',
                  url: '#/srPositionChange',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'srPositionChange'
                },
              ]
            },
            '信用管理': {
              url: '#/creditManagement',
              visible: true,
              title: '信用管理',
              list: [
                {
                  name: '搜索',
                  url: '#/cmSearch',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'cmSearch'
                },
                {
                  name: '评级预警',
                  url: '#/cmWarning',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'cmWarning'
                },
                {
                  name: '蓝石主体评级',
                  url: '#/cmMainRating',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'cmMainRating'
                },/*
                {
                  name: '信用风险预览',
                  url: '#/cmRiskPreview',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'cmRiskPreview'
                },
                {
                  name: '持仓信用分析',
                  url: '#/cmPositionAnalysis',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'cmPositionAnalysis'
                },*/
                {
                  name: '我关注主体',
                  url: '#/cmFocusMain',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'cmFocusMain'
                },
                {
                  name: '我关注债项',
                  url: '#/cmFocusBond',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'cmFocusBond'
                },
                {
                  name: '智能分析',
                  url: '#/cmAnalysisReport',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'cmAnalysisReport'
                },
                {
                  name: '分析报告配置',
                  url: '#/cmAnalysisConfig',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'cmAnalysisConfig'
                }
              ]
            },
            '产品管理': {
              url: '#/fundManagement',
              visible: true,
              title: '产品管理',
              list: [
                {
                  name: '产品基本信息',
                  url: '#/fundManagement',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'fundManagement'
                },
                {
                  name: '估值报表参数',
                  url: '#/fundManagementConfig',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'fundManagementConfig'
                },
                {
                  name: '产品缴款流水',
                  url: '#/fundPaymentFlow',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'fundPaymentFlow'
                },
              ]
            },
            '估值管理': {
              url: '#/valuationManagement',
              visible: true,
              title: '估值管理',
              list: [
                {
                  name: '估值报表',
                  url: '#/vmReport',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'vmReport'
                },
                {
                  name: '估值修正',
                  url: '#/vmCorrect',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'vmCorrect'
                }
              ]
            },
            '持仓管理': {
              url: '#/positionManagement',
              visible: true,
              title: '持仓管理',
              list: [
                {
                  name: '持仓全景',
                  url: '#/pmPanorama',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'pmPanorama'
                },
                {
                  name: '风控指标',
                  url: '#/pmControlIndex',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'pmControlIndex'
                },
                {
                  name: '产品纵览',
                  url: '#/pmOverview',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'pmOverview'
                },/*
                {
                  name: '经营指标',
                  url: '#/pmOperatingIndicators',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'pmOperatingIndicators'
                }*/
              ]
            },
            '风险管理': {
              url: '#/riskManagement',
              visible: true,
              title: '风险管理',
              list: [
                {
                  name: '指令管理',
                  url: '#/rmSubOrders',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'rmSubOrders'
                },
                {
                  name: '风控规则',
                  url: '#/rmWindRule',
                  list: [],
                  isShow: false,
                  visible: true,
                  pageName: 'rmWindRule'
                }, /*
                    {
                        name: '静态检查',
                        url: '#/rmStaticCheck',
                        list: [],
                        isShow: false,
                        pageName: 'rmStaticCheck'
                    },
                    {
                        name: '资产池管理',
                        url: '#/rmAssetPool',
                        list: [],
                        isShow: false,
                        pageName: 'rmAssetPool'
                    }*/
              ]
            },
          }
          var list = [];
          if(/(nationmanagerInvestment;|admin;|natiocrashtrader;)/.test(userInfo.authority)){
            list.push({
              name: '现货账户',
              url: '#/taTreasurySpot',
              list: [],
              isShow: false,
              visible: true,
              pageName: 'taTreasurySpot'
            })
            list.push({
              name: '现货交易',
              url: '#/taTreasuryTransactions',
              list: [],
              isShow: false,
              visible: true,
              pageName: 'taTreasuryTransactions'
            })
            list.push({
              name: '利率债明细',
              url: '#/taBondDetails',
              list: [],
              isShow: false,
              visible: true,
              pageName: 'taBondDetails'
            })
          }
          if(/(nationmanagerInvestment;|admin;|natiofuturetrader;)/.test(userInfo.authority)) {
            list.push({
              name: '期货账户',
              url: '#/taTreasuryFutures',
              list: [],
              isShow: false,
              visible: true,
              pageName: 'taTreasuryFutures'
            })
            list.push({
              name: '期货清算',
              url: '#/taDayOff',
              list: [],
              isShow: false,
              visible: true,
              pageName: 'taDayOff'
            })
          }
          if(list.length === 0){
            delete $rootScope.titleList.国债账户
          }else if(!/(natiocrashtrader;)/.test(userInfo.authority)){
            $rootScope.titleList['国债账户'].url = '#/taTreasuryFutures'
          }
          if($rootScope.titleList['国债账户']){
            $rootScope.titleList['国债账户'].list = list;
          }
          if(!(/(admin;|creditmanagerInvestment;)/.test(userInfo.authority))){
            $rootScope.titleList['交易看板'].list.pop()
          }
          $rootScope.$watch('title', function (nv, ov) {
            $rootScope.itemTitle = $rootScope.titleList[nv].list
          })
        }
        createTitleList()
        /**************************service请求*************************************/
        $rootScope.$on('getParams', getParams);
        var Params = {
          getBusinessType: function () {
            serverService.getBusinessType().then(function (data) {
              $rootScope.businessTypes = data;
              storage.local.setItem(storage.KEY.INITPARAMS.BUSINESSTYPES, data)
            }, errCallback.bind(this, 'BUSINESSTYPES', 'businessTypes'));
          },
          getBusinessDirection: function () {
            serverService.getBusinessDirection().then(function (data) {
              $rootScope.directions = data;
              storage.local.setItem(storage.KEY.INITPARAMS.DIRECTIONS, data)
            }, errCallback.bind(this, 'DIRECTIONS', 'directions'));
          },
          getLiquidationSpeed: function () {
            serverService.getLiquidationSpeed().then(function (data) {
              $rootScope.liquidationSpeeds = data;
              storage.local.setItem(storage.KEY.INITPARAMS.LIQUIDATIONSPEEDS, data)
            }, errCallback.bind(this, 'LIQUIDATIONSPEEDS', 'liquidationSpeeds'));
          },
          getBusinessState: function () {
            serverService.getBusinessState().then(function (data) {
              $rootScope.businessStates = data;
              storage.local.setItem(storage.KEY.INITPARAMS.BUSINESSSTATES, data)
            }, errCallback.bind(this, 'BUSINESSSTATES', 'businessStates'));
          },
          getCounterpartyType: function () {
            serverService.getCounterpartyType().then(function (data) {
              $rootScope.counterpartyTypes = data;
              storage.local.setItem(storage.KEY.INITPARAMS.COUNTERPARTYTYPES, data)
            }, errCallback.bind(this, 'COUNTERPARTYTYPES', 'counterpartyTypes'));
          },
          getCounterpartyGroup: function () {
            serverService.getCounterpartyGroup().then(function (data) {
              $rootScope.counterparties = data.result;
              storage.local.setItem(storage.KEY.INITPARAMS.COUNTERPARTIES, data.result)
            }, errCallback.bind(this, 'COUNTERPARTIES', 'counterparties'));
          },
          getMarket: function () {
            serverService.getMarket().then(function (data) {
              $rootScope.markets = data;
              data.forEach(function (i) {
                if (i.code == '0' || i.code == '3') {
                  i.sel = true;
                } else {
                  i.sel = false;
                }
              })
              storage.local.setItem(storage.KEY.INITPARAMS.MARKETS, data)
            }, errCallback.bind(this, 'MARKETS', 'markets'));
          },
          getTraders: function () {
            serverService.getTraders().then(function (data) {
              $rootScope.traderNames = data;
              storage.local.setItem(storage.KEY.INITPARAMS.TRADERNAMES, data)
            }, errCallback.bind(this, 'TRADERNAMES', 'traderNames'));
          },
          getServiceType: function () {
            serverService.getServiceType().then(function (data) {
              $rootScope.serviceTypes = data;
              storage.local.setItem(storage.KEY.INITPARAMS.SERVICETYPES, data)
            }, errCallback.bind(this, 'SERVICETYPES', 'serviceTypes'));
          },
          getFundParametersNormal: function () {
            serverService.getFundParameters(true).then(function (data) {
              $rootScope.fundNamesNormal = data;
              storage.local.setItem(storage.KEY.INITPARAMS.FUNDNAMESNORMAL, data)
            }, errCallback.bind(this, 'FUNDNAMESNORMAL', 'fundNamesNormal'));
          },
          getFundTKFund: function () {
            serverService.getFundTKFund().then(function (data) {
              $rootScope.fundNamesFund = data;
              storage.local.setItem(storage.KEY.INITPARAMS.FUNDNAMESFUND, data)
            }, errCallback.bind(this, 'FUNDNAMESFUND', 'fundNamesFund'));
          },
          getFundParameters: function () {
            serverService.getFundParameters().then(function (data) {
              data.forEach(function (i) {
                i.id = i.fundId;
                i.value = i.fundName;
              })
              $rootScope.fundNames = data;
              storage.local.setItem(storage.KEY.INITPARAMS.FUNDNAMES, data)
            }, errCallback.bind(this, 'FUNDNAMES', 'fundNames'));
          },
          getPayType: function () {
            serverService.getPayType().then(function (data) {
              $rootScope.payTypes = data;
              storage.local.setItem(storage.KEY.INITPARAMS.PAYTYPES, data)
            }, errCallback.bind(this, 'PAYTYPES', 'payTypes'));
          },
          getProvinces: function () {
            serverService.getProvinces().then(function (data) {
              $rootScope.provinces = data;
              storage.local.setItem(storage.KEY.INITPARAMS.PROVINCES, data)
            }, errCallback.bind(this, 'PROVINCES', 'provinces'));
          },
          getClaireEmIndustryOne: function () {
            serverService.getClaireEmIndustryOne().then(function (data) {
              $rootScope.claireEmIndustryOnes = data;
              $rootScope.claireSREmIndustryOnes = data;
              storage.local.setItem(storage.KEY.INITPARAMS.CLAIREEMINDUSTRYONES, data)
            }, errCallback.bind(this, 'CLAIREEMINDUSTRYONES', 'claireEmIndustryOnes'));
          },
          getClaireGrade: function () {
            serverService.getClaireGrade().then(function (data) {
              $rootScope.claireGrades = data;
              storage.local.setItem(storage.KEY.INITPARAMS.CLAIREGRADES, data)
            }, errCallback.bind(this, 'CLAIREGRADES', 'claireGrades'));
          },
          getClaireScore: function () {
            serverService.getClaireScore().then(function (data) {
              $rootScope.claireScores = data;
              storage.local.setItem(storage.KEY.INITPARAMS.CLAIRESCORES, data)
            }, errCallback.bind(this, 'CLAIRESCORES', 'claireScores'));
          },
          getAccount: function () {
            serverService.getNbAccount().then(function (data) {
              $rootScope.nbAccounts = data;
              storage.local.setItem(storage.KEY.INITPARAMS.NBACCOUNTS, data)
            }, errCallback.bind(this, 'NBACCOUNTS', 'nbAccounts'));
          },
        }

        function getParams() {
          createTitleList()
          for (var i in Params) {
            Params[i]()
          }
        }

        getParams();

        function errCallback(str, flag, err) {
          $rootScope[flag] = storage.local.getItem(storage.KEY.INITPARAMS[str])
          if (err && err.text) {
            $rootScope.errText = err.text;
            $rootScope.isError = true;
          }
        }

        $rootScope.$watch('counterpartyType', function (nv, ov) {
          serverService.getCounterpartyGroup(nv).then(function (data) {
            $rootScope.counterparties = data.result;
          }, errCallback);
        })

        /**************************错误处理函数*************************************/
        $rootScope.$on('rejectError', function (data, err) {
          hideLoading()
          if (err && err.text) {
            $rootScope.isError = true
            $rootScope.errText = err.text
          } else {
            $rootScope.isError = true
            $rootScope.errText = '网络错误'
          }
        });
        /**************************************************************************/
        $rootScope.close = function () {
          $rootScope.isError = false;
          $rootScope.errConfirm = false;
          $rootScope.needHandle = false;
          if ($rootScope.errText == '用户未登录') {
            $location.path('/login').replace();
          }
          $rootScope.errText = '';
        };
        $rootScope.resultConfirm = function () {
          $rootScope.isError = false;
          $rootScope.errConfirm = true;
          $rootScope.errText = '';
          $rootScope.needHandle = false;
          if($rootScope.successFun){
            $rootScope.successFun();
          }
        }
        $rootScope.$on('chooseResult', function (event, data) {
          $rootScope.needHandle = true;
          $rootScope.isError = true;
          if (data.str) {
            $rootScope.errText = data.str;
          }
          $rootScope.successFun = data.cb;
        })
        //信用管理
        $rootScope.creditGoHome = function () {
          $rootScope.isBondContentDetail = false;
          $rootScope.tabItemId = 'home';
          $location.path('/cmSearch').replace();
        }
        $rootScope.goItemContentDetail = function (item) {
          $rootScope.tabItemId = item.id;
          $rootScope.$broadcast('creditManagement', {result: item})
          $rootScope.isBondContentDetail = true;
          $location.path('/creditManagement').replace();
        }
        $rootScope.closeItemDetail = function (index, item) {
          $rootScope.tabLists.splice(index, 1);
          if (item.id == $rootScope.tabItemId) {
            if ($rootScope.tabLists.length == 0) {
              $rootScope.isBondContentDetail = false;
              $location.path('/cmSearch').replace();
            } else if (index == 0) {
              $rootScope.tabItemId = $rootScope.tabLists[index].id;
              $rootScope.$broadcast('creditManagement', {result: $rootScope.tabLists[index]})
            } else {
              $rootScope.tabItemId = $rootScope.tabLists[index - 1].id;
              $rootScope.$broadcast('creditManagement', {result: $rootScope.tabLists[index - 1]})
            }
          }
        }
        //敬请期待
        $rootScope.willDone = function () {
          $rootScope.errText = '正在开发中...\n敬请期待';
          $rootScope.isError = true;
        }
        //退出登录
        $rootScope.logOut = function () {
          $rootScope.isBondContentDetail = false;
          $location.path('/login').replace();
          storage.session.clearAll();
          storage.local.removeItem(storage.KEY.USERINFO)
          serverService.changeToken('')
          checkTheme()
        };
        var timer = $timeout(function () {
          document.querySelector('#allWrap').style.display = 'block';
          document.querySelector('#spinner').style.display = 'none';
        }, 50)
        $rootScope.$on('$destroy', function (ev) {
          $timeout.cancel(timer);
        })
        //区分测试生产环境
        function checkTheme() {
          if(!/192.168.1.188/.test(storage.KEY.API.url)){
            storage.changeTheme();
          }
        }
        checkTheme()
        checkPlatform()
        function checkPlatform() {
          var browser={
            versions:function(){
              var u = navigator.userAgent, app = navigator.appVersion;
              return {//移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
              };
            }(),
            language:(navigator.browserLanguage || navigator.language).toLowerCase()
          }

          if(browser.versions.mobile || browser.versions.ios || browser.versions.android ||
            browser.versions.iPhone || browser.versions.iPad){
            document.write('<h1 style="margin: 200px auto; text-align: center;font-size:26px;">请用电脑客户端访问</h1>')
          }
        }
        document.addEventListener('keydown', function (ev) {
          if (ev.keyCode === 32 || ev.keyCode === 13 || ev.keyCode === 27) {
            if ($rootScope.isError) {
              $rootScope.$apply($rootScope.close())
            }
          }
        })

        $timeout(function () {
          $('.hide-model').show()
        }, 1000)


        function gogogo() {
          if(screen.width<1367){
            $('.slick').css({
              width: 760
            })
          }else {
            $('.slick').css({
              width: 1000
            })
          }
          $('.slick-tip')[0].style.transition = '45s linear'
          $rootScope.slickTip = ''
          serverService.getServerList()
            .then(function (data) {
              $rootScope.slickTip = ''
              var stateInfo = 'state_up'
              var stateName = ''
              if(data&&data.length){
                data.forEach(function (i) {
                  stateInfo = 'state_up'
                  if(i.CurrentState === 1){
                    stateInfo = ''
                  }
                  stateName = i.CurrentState===1?'运行正常':i.CurrentState===2?'运行出错':i.CurrentState===3?'重启中':'未运行'
                  $rootScope.slickTip += '&nbsp;&nbsp;&nbsp;&nbsp;<span class="'+stateInfo+'">'+i.StateName+'('+i.StateInfo+')</span>'
                })
                setTimeout(function () {
                  var width = $('.slick-tip').width()
                  $('.slick-tip').css({
                    marginLeft: -width,
                  })
                  $timeout(function () {
                    $('.slick-tip').css({
                      transition: 'none',
                      marginLeft: '100%',
                    })
                  }, 45 * 1000)
                }, 20)
              }
            })
        }
        gogogo()
        setInterval(function () {
          gogogo()
        }, 46*1000)
      }])
});