define(['app', 'storage'], function (app, storage) {
    return app.controller('TMAllCtrl', ['$scope', '$rootScope', 'serverService', '$cookies', '$timeout', '$location', 'baseService',
        function ($scope, $rootScope, serverService, $cookies, $timeout, $location) {
            $rootScope.title = '交易管理';
            $rootScope.name = '全部交易'
            $rootScope.pageNow = 'tmAll';
            $rootScope.pageIndex = 1;
            $scope.tmFundS = {};
            $scope.tmState = '';
            $scope.showMoreList = {
                isTicket: false,
                isBuyBack: false,
                isBuySell: false,
                isTrading: false
            };
            $timeout(function () {
                $scope.tmFundS.startTime = $rootScope.date.yesterDay;
                $scope.tmFundS.endTime = $rootScope.date.today;
            }, 200)
            //获取列表
            getTransaction($rootScope.pageIndex, 10000, '', $scope.tmFundS.businessType, $rootScope.date.yesterDay, $rootScope.date.today, $scope.tmFundS.traderName, $scope.tmFundS.direction, $scope.tmFundS.businessState, '', '', $scope.tmFundS.liquidationSpeed);
            function getTransaction(pageIndex, pageSize, keyWord, businessType, startTime, endTime, traderId, businessDirection, state, fundId, entryIntoForceTime, liquidationSpeed) {
                $rootScope.pageIndex = pageIndex;
                showLoading();
                serverService.getTransaction(pageIndex, pageSize, keyWord, businessType, startTime, endTime, traderId, businessDirection, state, fundId, entryIntoForceTime, liquidationSpeed)
                    .then(function (data) {
                        hideLoading();
                        handleData(data);
                        setCsv(data.listData);
                    }, function (err) {
                        $scope.$emit('rejectError', err)
                    });
            }
            function handleData(data) {
              $scope.items = data.listData;
              $scope.items.forEach(function (i) {
                i.amount = +i.amount;
                i.bondNameMoreLists = [];
                i.isChecked = false;
                if(i.businessTypeCode == '2' || i.businessTypeCode == '3'){
                  switch (i.businessDirectionCode){
                    case '3':
                    case '7':
                      $scope.tmOwnTotalPrice += +i.transPrice;
                      break;
                    default:
                      $scope.tmOwnTotalPrice -= +i.transPrice;
                      break;
                  }
                  if(i.bondName.indexOf('[')!=-1){
                    var length = JSON.parse(i.bondName).length;
                    i.bondNameUpdateLists = [];
                    i.bondNameMoreListsStr = '';
                    for(var t=0;t<length;t++){
                      //分号显示
                      if(t==length-1){
                        i.bondNameShow += ''+JSON.parse(i.bondName)[t].securityName;
                        i.bondNumberShow += ''+JSON.parse(i.bondName)[t].volume;
                      }else{
                        i.bondNameShow += ''+JSON.parse(i.bondName)[t].securityName+';';
                        i.bondNumberShow += ''+JSON.parse(i.bondName)[t].volume + ';';
                      }
                      i.bondNameUpdateLists.push({
                        securityName: JSON.parse(i.bondName)[t].securityName,
                        securityId: JSON.parse(i.bondName)[t].securityId,
                        available: JSON.parse(i.bondName)[t].volume,
                        proport: JSON.parse(i.bondName)[t].proport
                      })
                      //列表显示
                      i.bondNameMoreLists.push({
                        securityName: JSON.parse(i.bondName)[t].securityName,
                        securityId: JSON.parse(i.bondName)[t].securityId,
                        volume: JSON.parse(i.bondName)[t].volume,
                        proport: JSON.parse(i.bondName)[t].proport
                      })
                      i.bondNameMoreListsStr += '[ ' + JSON.parse(i.bondName)[t].securityName + ', ' +JSON.parse(i.bondName)[t].securityId + ', ' + JSON.parse(i.bondName)[t].volume + ', ' + JSON.parse(i.bondName)[t].proport + ' ]\n'
                    }
                    if(i.bondNameShow){
                      i.bondNameShow = i.bondNameShow.replace('undefined', '');
                    }
                    if(i.bondNumberShow){
                      i.bondNumberShow = i.bondNumberShow.replace('undefined', '');
                    }
                  }
                }else{
                  if(i.bondName!='undefined'){
                    i.bondNameShow = JSON.parse(i.bondName).securityName;
                  }
                  switch (i.businessDirectionCode){
                    case '2':
                    case '5':
                      $scope.tmOwnTotalPrice += +i.amount;
                      break;
                    default:
                      $scope.tmOwnTotalPrice -= +i.amount;
                      break;
                  }
                }
              })
              $rootScope.pageTotal = Math.ceil(data.totalCount / 10000);
              $rootScope.totalCount = data.totalCount;
            }
            //查询
            $scope.search = function () {
                $scope.tmFundS.businessType = '';
                for(i in $scope.tmAllBusinessType){
                    if(i && $scope.tmAllBusinessType[i]){
                        $scope.tmFundS.businessType += $scope.tmAllBusinessType[i]+';'
                    }
                }
                getTransaction($rootScope.pageIndex, 10000, '', $scope.tmFundS.businessType, $scope.tmFundS.startTime, $scope.tmFundS.endTime, $scope.tmFundS.traderName, $scope.tmFundS.direction, $scope.tmFundS.businessState, $scope.tmFundS.fundName, '', $scope.tmFundS.liquidationSpeed);
            };
            $scope.reset = function () {
                $scope.tmFundS = {
                    startTime : $rootScope.date.yesterDay,
                    endTime: $rootScope.date.today
                };
                $scope.tmAllBusinessType = {};
            };
            //选中全部
            $scope.isCheckedAll = function (checkedAll) {
                if(checkedAll){
                    $scope.items.forEach(function (i) {
                        i.isChecked = true;
                    })
                }else{
                    $scope.items.forEach(function (i) {
                        i.isChecked = false;
                    })
                }
            }
            //检查全选状态
            $scope.checkChecked = function () {
                for(var i = 0;i<$scope.items.length;i++){
                    if($scope.items[i].isChecked === false){
                        $scope.checkedAll = false;
                        return;
                    }
                }
                $scope.checkedAll = true;
            }
            //撤销与确认
            $scope.deleteBusiness = function (item) {
                var passCount = 0;
                var errCount = 0;
                var totalCount = 0;
                if(item.state != '待确认'){
                    return;
                }
                var isFirst = true;
                if(isFirst){
                    isFirst = false;
                    var subMore = false;
                    for(var j=0;j<$scope.items.length;j++){
                        if($scope.items[j].isChecked == true){
                            subMore = true;
                            totalCount++;
                        }
                    }
                    if(subMore){
                        $scope.$emit('chooseResult', {
                            str: '暂不支持批量撤销功能',
                            cb: function () {
                                return
                            }
                        })
                    }else{
                        $scope.$emit('chooseResult', {
                            str: '确定撤销该订单吗？',
                            cb: function () {
                                serverService.cancelTransaction(item.businessId).then(function (data) {
                                    $rootScope.errText = '撤销成功';
                                    $rootScope.isError = true;
                                    getTransaction($rootScope.pageIndex, 10000, '', $scope.tmFundS.businessType, $rootScope.date.yesterDay, $rootScope.date.today, $scope.tmFundS.traderName, $scope.tmFundS.direction, $scope.tmFundS.businessState, '', '', $scope.tmFundS.liquidationSpeed);
                                    isFirst = true;
                                }, function (err) {
                                    $scope.$emit('rejectError', err)
                                    isFirst = true;
                                });
                            }
                        })
                    }
                }
                function serverEnd() {
                    if(passCount+errCount==totalCount){
                        $rootScope.isError = true;
                        $rootScope.errText = '操作完毕，成功' + passCount + '，失败' + errCount;
                        getTransaction($rootScope.pageIndex, 10000, '', $scope.tmFundS.businessType, $rootScope.date.yesterDay, $rootScope.date.today, $scope.tmFundS.traderName, $scope.tmFundS.direction, $scope.tmFundS.businessState, '', '', $scope.tmFundS.liquidationSpeed);
                        isFirst = true;
                    }
                }
            };
            $scope.passBusiness = function (item) {
                var passCount = 0;
                var errCount = 0;
                var totalCount = 0;
                if(item.state != '待确认'){
                    return;
                }
                var isFirst = true;
                if(isFirst) {
                    isFirst = false;
                    var subMore = false;
                    for (var j = 0; j < $scope.items.length; j++) {
                        if ($scope.items[j].isChecked == true) {
                            subMore = true;
                            totalCount++;
                        }
                    }
                    if (subMore) {
                        $scope.$emit('chooseResult', {
                            str: '确认选中订单么？',
                            cb: function () {
                                var tempList = ''
                                $scope.items.forEach(function (i) {
                                    if (i.isChecked == true && i.state=='待确认' && i.businessTypeCode != '2' && i.businessTypeCode != '3') {
                                        tempList += i.businessId + ';';
                                    }
                                })
                                if(tempList==''){
                                    return
                                }
                                serverService.transactionCompleteAll(tempList).then(function () {
                                    serverEnd();
                                }, function (err) {
                                    serverEnd();
                                });
                            }
                        })
                    } else {
                        $scope.$emit('chooseResult', {
                            str: '确认该订单？',
                            cb: function () {
                                serverService.transactionComplete(item.businessId).then(function () {
                                    $rootScope.errText = '订单提交成功';
                                    $rootScope.isError = true;
                                    getTransaction($rootScope.pageIndex, 10000, '', $scope.tmFundS.businessType, $rootScope.date.yesterDay, $rootScope.date.today, $scope.tmFundS.traderName, $scope.tmFundS.direction, $scope.tmFundS.businessState, '', '', $scope.tmFundS.liquidationSpeed);
                                    isFirst = true;
                                }, function (err) {
                                    $scope.$emit('rejectError', err)
                                    isFirst = true;
                                });
                            }
                        })
                    }
                    function serverEnd() {
                        $rootScope.isError = true;
                        $rootScope.errText = '操作完成'
                        getTransaction($rootScope.pageIndex, 10000, '', $scope.tmFundS.businessType, $rootScope.date.yesterDay, $rootScope.date.today, $scope.tmFundS.traderName, $scope.tmFundS.direction, $scope.tmFundS.businessState, '', '', $scope.tmFundS.liquidationSpeed);
                        isFirst = true;
                    }
                }
            };
            //查看更多
            $scope.showMore = function (item) {
                $scope.tempTicket = item;
                switch(item.businessTypeCode){
                    case '1':
                        $scope.showMoreList.isTicket = true;
                        break;
                    case '2':
                    case '3':
                        $scope.showMoreList.isBuyBack = true;
                        break;
                    case '4':
                        $scope.showMoreList.isTrading = true;
                        break;
                    case '5':
                        $scope.showMoreList.isBuySell = true;
                        break;
                    default:
                        break;
                }
            };

          //跳转到指令详情
          $scope.goOrder = function (item) {
            storage.session.setItem(storage.KEY.NOTI, item.orderId)
            $location.path('/rmSubOrders').replace();
            $scope.$broadcast('showModal')
          }
          //指令跳转回交易详情
          var buySellId = storage.session.getItem(storage.KEY.RISKMANAGEMENT.FORMORDER)
          if(buySellId){
            getTransactionInfo(buySellId)
            storage.session.removeItem(storage.KEY.RISKMANAGEMENT.FORMORDER)
          }
          function getTransactionInfo(buySellId) {
            serverService.getTransactionInfo(buySellId)
              .then(function (data) {
                var dataArr = {
                  listData: [data]
                }
                handleData(dataArr)
                $scope.showMore(data);
              }, function (err) {
                $scope.$emit('rejectError', err);
              })
          }
            //取消查看
            $scope.cancelShowMore = function (str) {
                $scope.tempTicket = {};
                $scope.showMoreList[str] = false;
            }

          //获取CSV
          function setCsv(data) {
            $scope.getArray = data.slice();
            var tempArr = [];
            if($scope.getArray && $scope.getArray.length){
              $scope.getArray.forEach(function (i) {
                if(i.state === '已确认' && i.marketCode === '0'){
                  tempArr.push({
                    a: i.fundName,
                    b: i.businessDirection,
                    c: i.amount,
                    d: i.interestRate,
                    e: i.capitalUserName,
                    f: i.counterpartyShortName,
                    g: (new Date(i.buyBackClosingDate.replace(/-/g, '/')).getTime()-new Date(i.startTime.replace(/-/g, '/')).getTime())/(24*60*60*1000),
                    h: i.startTime,
                    i: i.buyBackClosingDate,
                  })
                }
              })
              tempArr.unshift({
                'a': '产品名称',
                'b': '交易方向',
                'c': '净资金额(元)',
                'd': '利率',
                'e': '资金负责人',
                'f': '交易对手',
                'g': '期限(天)',
                'h': '开始日期',
                'i': '结束日期',
              })
            }
            $scope.getArray = tempArr;
          }
            //事件通信
            $scope.$on("tmAll", function (event, data) {
                // 这里取到发送过来的数据 data
                getTransaction(data.pageIndex, 10000, '', $scope.tmFundS.businessType, $scope.tmFundS.startTime, $scope.tmFundS.endTime, $scope.tmFundS.traderName, $scope.tmFundS.direction, $scope.tmFundS.businessState, '', '', $scope.tmFundS.liquidationSpeed);
            });
    }]);
});