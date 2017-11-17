define(['app', 'storage', 'echarts'], function (app, storage, echarts) {
  return app.controller('SignalQueryCtrl', ['$scope', '$rootScope', 'serverService', '$location', '$timeout', 'baseService',
    function ($scope, $rootScope, serverService, $location, $timeout) {
      $rootScope.pageNow = 'signalQuery';
      $rootScope.title = '信号查询';
      var params = {
        instrument_id: 'ag1312'
      }

      $scope.color = {
        upColor: '#ec0000',
        upBorderColor: '#8A0000',
        downColor: '#00da3c',
        downBorderColor: '#008F28'
      }
      $scope.gridOptions = {
        enableGridMenu: false,
        enableSelectAll: true,
        exporterMenuPdf: false, // ADD THIS
        rowHeight: '36',
        exporterOlderExcelCompatibility: true,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        columnDefs: [{
          width: 50,
          headerCellClass: 'align_center',
          enableColumnMenu: false,
          field: 'index',
          displayName: '序号',
          cellClass: 'align_center',
          type: 'number'
        },
          {
            width: 100,
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'operatorName',
            displayName: '姓名',
            cellClass: 'align_center'
          },
          {
            width: 100,
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'businessType',
            displayName: '流程类型',
            cellClass: 'align_center',
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'applicationShow',
            displayName: '流程时间',
            cellClass: 'align_center'
          },
          {
            width: 100,
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'stateShow',
            displayName: '审批状态',
            cellClass: 'align_center'
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'createTimeShow',
            displayName: '发起时间',
            cellClass: 'align_center',
            cellFilter: 'date: yyyy-MM-dd'
          },
          {
            width: 100,
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'handle',
            displayName: '操作',
            cellClass: 'main_color align_center',
            cellTemplate: '<div class="ui-grid-cell-contents main_color pointer" ng-click="grid.appScope.showDetail(row.entity.tabIndex, row.entity)"><span><a href="javascript:;" class="main_color">{{row.entity.handleText}}</a></span></div>'
          },
        ],
        onRegisterApi: function (gridApi) {
          $scope.gridApi = gridApi;
          gridApi.core.on.columnVisibilityChanged($scope, function (changedColumn) {
            $scope.columnChanged = {
              name: changedColumn.colDef.name,
              visible: changedColumn.colDef.visible
            };
          });
        },
        enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
        // enableVerticalScrollbar: 0,
      };
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
      var myChart;
      $rootScope.isShowModal = true
      $timeout(function () {
        myChart = echarts.init($('#mainChart')[0])
        myChart.setOption(option);
        window.mychart = myChart
      }, 20)
      $timeout(function () {
        getQuotation()
      }, 3000)
      function getQuotation() {
        myChart.showLoading()
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
                    color: $scope.color.upColor,
                    color0: $scope.color.downColor,
                    borderColor: $scope.color.upBorderColor,
                    borderColor0: $scope.color.downBorderColor
                  }
                },
                /*markPoint: {
                  label: {
                    normal: {
                      formatter: function (param) {
                        return param.value
                        return param != null ? Math.round(param.value) : '';
                      }
                    }
                  },
                  data: [
                    {
                      name: 'XX标点',
                      symbolSize: [200, 40],
                      coord: ['2013/5/31', 2300],
                      value: '二十日建仓突破',
                      symbolOffset: [0, '-100%'],
                      itemStyle: {
                        normal: {color: 'rgba(41,60,85)'}
                      }
                    }
                  ],
                  tooltip: {
                    show: true,
                    formatter: function (param) {
                      return param.name + '<br>' + (param.data.coord || '');
                    }
                  }
                }*/
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
      }
      window.onresize = function () {
        if(myChart){
          myChart.resize()
        }
      }
    }]);
});