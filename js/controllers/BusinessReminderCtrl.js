define(['app'], function (app) {
    return app.controller('BusinessReminderCtrl', ['$scope', '$rootScope', 'serverService', '$cookies', '$location', 'baseService',
        function ($scope, $rootScope, serverService, $cookies, $location) {
            $rootScope.itemTitles = [];
            $rootScope.title = '业务提醒';
            $rootScope.name = '业务提醒';
            $rootScope.pageNow = 'businessReminder';
            $rootScope.isPagination = false;
            $scope.isShowDateList = 'date';
            $scope.tmFund = {};
            getWarningList();
            function getWarningList(keyWord, warningType, fundId, startTime, endTime) {
                showLoading();
                serverService.getWarningList(keyWord, warningType, fundId, startTime, endTime)
                    .then(function (data) {
                        hideLoading();
                        $scope.items = data;
                        $rootScope.pageTotal = Math.ceil(data.totalCount / 24);
                        $rootScope.totalCount = data.totalCount;
                    }, function (err) {
                        $scope.$emit('rejectError', err)
                    })
            }
            function getPaymentWarningList() {
                showLoading();
                serverService.getPaymentWarningList().then(function (data) {
                    hideLoading();
                    $scope.items = data;
                    $rootScope.pageTotal = Math.ceil(data.totalCount / 24);
                    $rootScope.totalCount = data.totalCount;
                }, function (err) {
                    $scope.$emit('rejectError', err)
                })
            }
            serverService.getWarningType().then(function (data) {
                $scope.warningTypes = data;
            }, function (err) {
                $scope.$emit('rejectError', err)
            });
            serverService.getFundParameters().then(function (data) {
                $scope.fundNames = data;
            }, function (err) {
                $scope.$emit('rejectError', err)
            });
            $scope.reset = function () {
                $scope.tmFund = {};
                $scope.isShowDateList = 'date';
                getdays(0);
            };


            //table列表
            $scope.todoLists = [];
            getdays(0);
            $scope.getdays = function (fundId) {
                if(!fundId){
                    fundId = 0;
                }
                getdays(fundId);
            }
            function getdays(fundId) {
                serverService.getdays(fundId)
                    .then(function (data) {
                        var interval = (data.endDate-data.startDate)/(24*3600*1000);
                        var passDay = new Date(data.startDate).getDay()-1;
                        var overCount = 0;
                        $scope.todoLists = [];
                        if(isNaN(passDay)){

                        }else{
                            var errV = 0;
                            for(var i=0;i<11;i++){
                                var tempTodo = [];
                                var firstV = 0;
                                for(var j=0;j<7;j++){
                                    var dateSec = i>0?data.startDate + firstV * (24 * 3600 * 1000) + i * (7 * 24 * 3600 * 1000) - errV * (24 * 3600 * 1000):data.startDate + firstV * (24 * 3600 * 1000) + i * (7 * 24 * 3600 * 1000);
                                    var flag = (new Date(dateSec).getTime() === new Date().setHours(0, 0, 0, 0));
                                    if(passDay>0 || overCount>=interval){
                                        passDay--;
                                        tempTodo.push({
                                            month: '',
                                            name: '',
                                            todo: [],
                                            realDate: null,
                                        })
                                        errV++;
                                    }else{
                                        overCount++;
                                        var childTodo = [];
                                        if(data.list && data.list.length){
                                            data.list.forEach(function (n) {
                                                if(dateSec == n.date){
                                                    childTodo.push(n)
                                                }
                                            })
                                        }
                                        tempTodo.push({
                                            month: new Date(dateSec).getMonth()+1+'月',
                                            name: new Date(dateSec).getDate(),
                                            todo: childTodo,
                                            realDate: new Date(dateSec),
                                            isToday: flag
                                        })
                                        firstV++;
                                    }
                                }
                                if(firstV==0){
                                    $scope.todoLists.push({
                                        todo: tempTodo,
                                        isShow: false
                                    })
                                }else {
                                    $scope.todoLists.push({
                                        todo: tempTodo,
                                        isShow: true
                                    })
                                }

                            }
                        }
                        // var endDate = new Date(data.endDate).getDay();
                    }, function (err) {
                        $scope.$emit('rejectError', err)
                    })
            }
            createTodo();
            function createTodo() {
                var tempTodo = [];
                for(var i=0;i<7;i++){
                    tempTodo.push({
                        name: i,
                        todo: []
                    })
                }
            }
            //展示详情
            $scope.showMoreData = function (todo) {
                if(!todo.name){
                    return;
                }
                $scope.isShowMoreList = true;
                todo.title = '';
                $scope.items = [];
                var tempDate = todo.realDate.Format('yyyy-MM-dd');
                serverService.getWarnings(tempDate, $scope.tmFund.fundName)
                    .then(function (data) {
                        $scope.items = data;
                        data.forEach(function (i) {
                            todo.title += '[' + i.warningType + ',' + i.fundName + ',' + i.bondName + ',' + i.bondNumber + ',' + i.amount + ']\n'
                        })
                    }, function (err) {
                        $scope.$emit('rejectError', err)
                    })
            }
            $scope.cancelShowMore = function () {
                $scope.isShowMoreList = false;
                $scope.items = {};
            }


            //查询列表
            $scope.search = function () {
                if($scope.tmFund.warningType == '5'){
                    $scope.isShowDateList = 'paymentList';
                    getPaymentWarningList()
                }else {
                    $scope.isShowDateList = 'list';
                    getWarningList('', $scope.tmFund.warningType, $scope.tmFund.fundName, $scope.tmFund.startTime, $scope.tmFund.endTime);
                }
            };
            //事件通信
            $scope.$on("businessReminder", function (event, data) {
                // 这里取到发送过来的数据 data
                getWarningList('', $scope.tmFund.warningType, $scope.tmFund.fundName, $scope.tmFund.startTime, $scope.tmFund.endTime);
            });
            document.addEventListener('keydown', pushShowMore)
            function pushShowMore(ev) {
                if(ev.keyCode==27 && $rootScope.pageNow=='businessReminder'){
                    $scope.isShowMoreList = false;
                    $scope.showMoreItems = {};
                }else if($rootScope.pageNow != 'businessReminder' ){
                    document.removeEventListener('keydown', pushShowMore)
                }
            }
        }])
})