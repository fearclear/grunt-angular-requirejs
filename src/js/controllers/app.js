/**
 * 应用模块
 */
'use strict';

define(['angular', 'storage', 'echarts'], function (angular, storage, echarts) {
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
          logOut();
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
              url: '#/positionInformation',
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
            logOut();
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
        function logOut() {
          $rootScope.isBondContentDetail = false;
          $location.path('/login').replace();
          storage.session.clearAll();
          storage.local.removeItem(storage.KEY.USERINFO)
          serverService.changeToken('')
          checkTheme()
        }
        $rootScope.logOut = function () {
          logOut();
        };
        var timer = $timeout(function () {
          $('#allWrap').show();
          $('#spinner').hide();
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
        $rootScope.color = {
          upColor: '#ec0000',
          upBorderColor: '#8A0000',
          downColor: '#00da3c',
          downBorderColor: '#008F28',
          break: '#dc4454',
          breakUpDown: '#d970ad',
          exit: '#f7bb44',
          stopLoss: '#34bd9a',
          closeout: '#4a8bdb',
          openPosition: '#977adb',
        }
        $rootScope.isShowModal = false;
        $rootScope.closeModal = function () {
          $rootScope.isShowModal = false;
        }
        // 数据意义：开盘(open)，收盘(close)，最低(lowest)，最高(highest)
        var dataList = splitData([]);
        function splitData(rawData) {
          var categoryData = [];
          var values = []
          for (var i = 0; i < rawData.length; i++) {
            categoryData.push(new Date(rawData[i].workday).Format('yyyy/MM/dd'));
            values.push([rawData[i].open, rawData[i].close, rawData[i].low, rawData[i].high])
          }
          return {
            categoryData: categoryData,
            values: values
          };
        }

        function calculateMA(dayCount) {
          var result = [];
          for (var i = 0, len = dataList.values.length; i < len; i++) {
            if (i < dayCount) {
              result.push('-');
              continue;
            }
            var sum = 0;
            for (var j = 0; j < dayCount; j++) {
              sum += dataList.values[i - j][1];
            }
            result.push(sum / dayCount);
          }
          return result;
        }
        var option = {
          title: {
            show: false
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          legend: {
            data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30']
          },
          grid: {
            left: '10%',
            right: '10%',
            bottom: '15%',
          },
          xAxis: {
            type: 'category',
            data: [],
            scale: true,
            boundaryGap: false,
            axisLine: {onZero: false},
            splitLine: {show: false},
            splitNumber: 20,
            min: 'dataMin',
            max: 'dataMax'
          },
          yAxis: {
            scale: true,
            splitArea: {
              show: true
            }
          },
          dataZoom: [
            {
              type: 'inside',
              start: 0,
              end: 100
            },
            {
              show: true,
              type: 'slider',
              y: '90%',
              start: 50,
              end: 100
            }
          ],
          series: [
            {
              name: '日K',
              type: 'candlestick',
            },
            {
              name: 'MA5',
              type: 'line',
            },
            {
              name: 'MA10',
              type: 'line',
            },
            {
              name: 'MA20',
              type: 'line',
            },
            {
              name: 'MA30',
              type: 'line',
            },
          ]
        };
        var myChart
        $rootScope.showKChart = function (item) {
          $rootScope.isShowModal = true
          $timeout(function () {
            if(!myChart){
              myChart = echarts.init($('#mainChart')[0])
              myChart.setOption(option);
            }
            getQuotation(item)
          }, 20)
          function getQuotation(params) {
            var pointList = []
            params = params || {}
            myChart.showLoading()
            params.instrument_id = params.instrument_id || params.instrumentCode || ''
            serverService.getSingnal(params)
              .then(function (data) {
                console.log(data)
                var dataUri = '';
                data.forEach(function (i) {
                  switch (i.signal){

                  }
                  pointList.push({
                    name: i.signal,
                    // coord: [new Date(i.createTime).Format('yyyy/MM/dd'), i.positionPrice],
                    coord: ['2013/11/29', 4200],
                    value: i.signal,
                    symbolSize: [147, 32],
                    symbol: 'image://../../img/10daysexit'+i.type+i.direction+'.png',
                  })
                })
              })
              .then(function () {
                serverService.getQuotation(params)
                  .then(function (data) {
                    myChart.hideLoading()
                    dataList = splitData(data)
                    option.xAxis.data = dataList.categoryData
                    option.series = [
                      {
                        name: '日K',
                        type: 'candlestick',
                        data: dataList.values,
                        itemStyle: {
                          normal: {
                            color: $rootScope.color.upColor,
                            color0: $rootScope.color.downColor,
                            borderColor: $rootScope.color.upBorderColor,
                            borderColor0: $rootScope.color.downBorderColor
                          }
                        },
                        markPoint: {
                          label: {
                            normal: {
                              formatter: function (param) {
                                return ''
                              }
                            }
                          },
                          data: pointList,
                          tooltip: {
                            show: true,
                            formatter: function (param) {
                              return param.name + '<br>' + (param.data.coord || '');
                            }
                          }
                        }
                      },
                      {
                        name: 'MA5',
                        type: 'line',
                        data: calculateMA(5),
                        smooth: true,
                        lineStyle: {
                          normal: {opacity: 0.5}
                        }
                      },
                      {
                        name: 'MA10',
                        type: 'line',
                        data: calculateMA(10),
                        smooth: true,
                        lineStyle: {
                          normal: {opacity: 0.5}
                        }
                      },
                      {
                        name: 'MA20',
                        type: 'line',
                        data: calculateMA(20),
                        smooth: true,
                        lineStyle: {
                          normal: {opacity: 0.5}
                        }
                      },
                      {
                        name: 'MA30',
                        type: 'line',
                        data: calculateMA(30),
                        smooth: true,
                        lineStyle: {
                          normal: {opacity: 0.5}
                        }
                      },

                    ]
                    myChart.setOption(option)
                  })
              })
          }
        }

        //重置mychart大小
        window.onresize = function () {
          if(myChart){
            myChart.resize()
          }
        }
      }])
});