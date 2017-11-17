/**
 * 应用模块
 */
'use strict';

define(['angular', 'storage'], function (angular, storage) {
  return angular.module('TransactionRecord', ['ngSanitize', 'ngTouch', 'ngAnimate', 'ui.router', 'ui.grid', 'ui.grid.resizeColumns', 'ui.grid.exporter', 'ui.grid.selection', 'angular-drag', 'ui.grid.moveColumns', 'ui.grid.pinning', 'ui.grid.cellNav', 'ui.grid.autoResize', 'ui.grid.treeView', 'ui.grid.edit', 'ui.grid.rowEdit', 'ui.grid.pagination', 'ui.select', 'ui.bootstrap'])
    .service('baseService', ['$rootScope', '$interval', 'serverService', '$timeout', '$location', '$state', 'i18nService',
      function ($rootScope, $interval, serverService, $timeout, $location, $state, i18nService) {
        $rootScope.pageNow = 'baseApp';
        //信用管理分页
        $rootScope.tabLists = [];
        $rootScope.eft = 4;//有效数字
        $rootScope.errConfirm = false;
        $rootScope.needHandle = false;
        i18nService.setCurrentLang("zh-cn");
        var userInfo = $rootScope.userInfo = storage.local.getItem(storage.KEY.USERINFO) || {}
        var token = userInfo.userId
        if (token === 'null' || token === undefined || token === null || !token) {
          $location.path('/login').replace();
        }
        $rootScope.username = userInfo.userName
        //点击变换样式
        $rootScope.activeListStyle = function (ev, item, callback) {
          if (item !== undefined) {
            item.isShow = !item.isShow;
          }
          if (callback) {
            callback();
          }
        };
        /**************************左侧菜单栏*************************************/
        function createTitleList() {
          userInfo = storage.local.getItem(storage.KEY.USERINFO) || {}
          $rootScope.titleList = {
            '持仓信息': {
              url: '#/positionInformation.html',
              visible: true,
              title: '持仓信息',
              list: []
            },
            '历史头寸单价': {
              url: '#/historicalPosition',
              visible: true,
              title: '历史头寸单价',
              list: []
            },
            '历史交易': {
              url: '#/historicalTrading',
              visible: true,
              title: '历史交易',
              list: []
            },
            '信号查询': {
              url: '#/signalQuery',
              visible: true,
              title: '信号查询',
              list: []
            },
          }
          /*$rootScope.$watch('title', function (nv, ov) {
            $rootScope.itemTitle = $rootScope.titleList[nv].list
          })*/
        }
        createTitleList()
        /****************************数据处理*******************************************/
        $rootScope.close = function () {
          $rootScope.isError = false;
          $rootScope.errConfirm = false;
          $rootScope.needHandle = false;
          if ($rootScope.errText === '用户未登录') {
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
        //k线图
        $rootScope.isShowModal = false;
        $rootScope.closeModal = function () {
          $rootScope.isShowModal = false;
        }

      }])
});