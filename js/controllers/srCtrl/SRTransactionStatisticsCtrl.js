define(['app', 'storage', 'fileSaver', 'xlsx'], function (app, storage, fileSaver) {
  return app.controller('SRTransactionStatisticsCtrl',['$scope', '$rootScope', 'serverService', '$timeout', '$cookies', '$location', 'baseService',
    function ($scope, $rootScope, serverService, $timeout, $cookies, $location) {
      $rootScope.pageNow = 'srTransactionStatistics';
      $rootScope.statistical.pageNow = $rootScope.pageNow;
      $rootScope.isPagination = false;
      $rootScope.title = '统计报表';
      $rootScope.name = '交易统计';
      $scope.sr = {};
      $scope.items = [];
      $scope.search = function () {
        showLoading();
        serverService.getBizUserSummary($scope.sr.startDate, $scope.sr.endDate)
          .then(function (data) {
            hideLoading();
            $scope.items = data;
          }, function (err) {
            $scope.$emit('rejectError', err);
          })
      }
      function saveAs(obj, fileName) {//当然可以自定义简单的下载文件实现方式
        var tmpa = document.createElement("a");
        tmpa.download = fileName || "下载";
        tmpa.href = URL.createObjectURL(obj); //绑定a标签
        tmpa.click(); //模拟点击实现下载
        setTimeout(function () { //延时释放
          URL.revokeObjectURL(obj); //用URL.revokeObjectURL()来释放这个object URL
        }, 100);
      }
      var wopts = { bookType: 'xlsx', bookSST: true, type: 'binary' };//这里的数据是用来定义导出的格式类型
      $scope.exportData = function (data, type) {
        data = []
        $scope.items.forEach(function (i, n) {
          data.push({
            序号: n+1,
            交易员: i.userName,
            现券买入笔数: i.buyCount,
            '现券买入金额(亿)': i.buyAmount/100000000,
            现券卖出笔数: i.sellCount,
            '现券卖出金额(亿)': i.sellAmount/100000000,
            质押式融资笔数: i.sellRepoCount,
            '质押式融资金额(亿)': i.sellRepoAmount/100000000,
            质押式融券笔数: i.reverseRepoCount,
            '质押式融券金额(亿)': i.reverseRepoAmount/100000000,
            买断式融资笔数: i.buyoutSellRepoCount,
            '买断式融资金额(亿)': i.buyoutSellRepoAmount/100000000,
            买断式融券笔数: i.buyoutReverseRepoCount,
            '买断式融券金额(亿)': i.buyoutReverseRepoAmount/100000000,
            过券笔数: i.transferCount,
            '过券金额(亿)': i.transferAmount/100000000,
            资金借入笔数: i.capitalInCount,
            '资金借入金额(亿)': i.capitalInAmount/100000000,
            资金借出笔数: i.capitalOutCount,
            '资金借出金额(亿)': i.capitalOutAmount/100000000,
          })
        })
        data.unshift({
          序号: '序号',
          交易员: '交易员',
          现券买入笔数: '现券买入',
          '现券买入金额(亿)': '现券买入',
          现券卖出笔数: '现券卖出',
          '现券卖出金额(亿)': '现券卖出',
          质押式融资笔数: '质押式融资',
          '质押式融资金额(亿)': '质押式融资',
          质押式融券笔数: '质押式融券',
          '质押式融券金额(亿)': '质押式融券',
          买断式融资笔数: '买断式融资',
          '买断式融资金额(亿)': '买断式融资',
          买断式融券笔数: '买断式融券',
          '买断式融券金额(亿)': '买断式融券',
          过券笔数: '过券',
          '过券金额(亿)': '过券',
          资金借入笔数: '资金借入',
          '资金借入金额(亿)': '资金借入',
          资金借出笔数: '资金借出',
          '资金借出金额(亿)': '资金借出',
        })
        var wb = { SheetNames: ['Sheet1'], Sheets: {}, Props: {} };
        //wb.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(data);//通过json_to_sheet转成单页(Sheet)数据
        data = XLSX.utils.json_to_sheet(data);
        data.C1 = {t: 's', v:'现券买入'}
        data.D1 = {t: 's', v:'现券买入'}
        data.E1 = {t: 's', v:'现券卖出'}
        data.F1 = {t: 's', v:'现券卖出'}
        data.G1 = {t: 's', v:'质押式融资'}
        data.H1 = {t: 's', v:'质押式融资'}
        data.I1 = {t: 's', v:'质押式融券'}
        data.J1 = {t: 's', v:'质押式融券'}
        data.K1 = {t: 's', v:'买断式融资'}
        data.L1 = {t: 's', v:'买断式融资'}
        data.M1 = {t: 's', v:'买断式融券'}
        data.N1 = {t: 's', v:'买断式融券'}
        data.O1 = {t: 's', v:'过券'}
        data.P1 = {t: 's', v:'过券'}
        data.Q1 = {t: 's', v:'资金借入'}
        data.R1 = {t: 's', v:'资金借入'}
        data.S1 = {t: 's', v:'资金借出'}
        data.T1 = {t: 's', v:'资金借出'}
        data.C2 = {t: 's', v:'笔数'}
        data.D2 = {t: 's', v:'金额(亿)'}
        data.E2 = {t: 's', v:'笔数'}
        data.F2 = {t: 's', v:'金额(亿)'}
        data.G2 = {t: 's', v:'笔数'}
        data.H2 = {t: 's', v:'金额(亿)'}
        data.I2 = {t: 's', v:'笔数'}
        data.J2 = {t: 's', v:'金额(亿)'}
        data.K2 = {t: 's', v:'笔数'}
        data.L2 = {t: 's', v:'金额(亿)'}
        data.M2 = {t: 's', v:'笔数'}
        data.N2 = {t: 's', v:'金额(亿)'}
        data.O2 = {t: 's', v:'笔数'}
        data.P2 = {t: 's', v:'金额(亿)'}
        data.Q2 = {t: 's', v:'笔数'}
        data.R2 = {t: 's', v:'金额(亿)'}
        data.S2 = {t: 's', v:'笔数'}
        data.T2 = {t: 's', v:'金额(亿)'}
        // data["B1"] = { t: "s", v: "哦呵呵呵" };
        data["!merges"] = [
          {//合并第一行数据[B1,C1,D1,E1]
            s: {//s为开始
              c: 2,//开始列
              r: 0//开始取值范围
            },
            e: {//e结束
              c: 3,//结束列
              r: 0//结束范围
            }
          },
          {
            s: {
              c: 4,
              r: 0
            },
            e: {
              c: 5,
              r: 0
            }
          },
          {
            s: {
              c: 6,
              r: 0
            },
            e: {
              c: 7,
              r: 0
            }
          },
          {
            s: {
              c: 8,
              r: 0
            },
            e: {
              c: 9,
              r: 0
            }
          },
          {
            s: {
              c: 10,
              r: 0
            },
            e: {
              c: 11,
              r: 0
            }
          },
          {
            s: {
              c: 12,
              r: 0
            },
            e: {
              c: 13,
              r: 0
            }
          },
          {
            s: {
              c: 14,
              r: 0
            },
            e: {
              c: 15,
              r: 0
            }
          },
          {
            s: {
              c: 16,
              r: 0
            },
            e: {
              c: 17,
              r: 0
            }
          },
          {
            s: {
              c: 18,
              r: 0
            },
            e: {
              c: 19,
              r: 0
            }
          },
          {
            s: {
              c: 20,
              r: 0
            },
            e: {
              c: 21,
              r: 0
            }
          },
          {
            s: {
              c: 0,
              r: 0
            },
            e: {
              c: 0,
              r: 1
            }
          },
          {
            s: {
              c: 1,
              r: 0
            },
            e: {
              c: 1,
              r: 1
            }
          },
        ];
        wb.Sheets['Sheet1'] = data;
        saveAs(new Blob([s2ab(XLSX.write(wb, wopts))], { type: "application/octet-stream"}), "交易统计" + '.' + (wopts.bookType == "biff2" ? "xls" : wopts.bookType));
      }
      function s2ab(s) {
        if (typeof ArrayBuffer !== 'undefined') {
          var buf = new ArrayBuffer(s.length);
          var view = new Uint8Array(buf);
          for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
          return buf;
        } else {
          var buf = new Array(s.length);
          for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
          return buf;
        }
      }
    }])
})