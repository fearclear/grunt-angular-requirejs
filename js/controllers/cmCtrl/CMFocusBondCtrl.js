define(['app'], function (app) {
    return app.controller('CMFocusBondCtrl',['$scope', '$rootScope', 'serverService', '$timeout', '$cookies', '$location', 'baseService',
        function ($scope, $rootScope, serverService, $timeout, $cookies, $location) {
            $rootScope.title = '信用管理';
            $rootScope.pageNow = 'cmFocusBond';
            $rootScope.pageIndex = 1;
            $rootScope.isPagination = true;
            getConcernProduct($rootScope.pageIndex, 17, '');
            function getConcernProduct(pageIndex, pageSize, keyWord) {
                showLoading();
                serverService.getConcernProduct(pageIndex, pageSize, keyWord)
                    .then(function (data) {
                        hideLoading();
                        $scope.items = data.listData;
                        $rootScope.pageTotal = Math.ceil(data.totalCount / 17);
                        $rootScope.totalCount = data.totalCount;
                    }, function (err) {
                        $scope.$emit('rejectError', err)
                    })
            }
            $scope.cancelConcern = function (item) {
                $scope.$emit('chooseResult', {
                    str: '确定取消关注？',
                    cb: function () {
                        serverService.cancelConcern(item.concernId)
                            .then(function () {
                                $rootScope.isError = true;
                                $rootScope.errText = '取消关注成功';
                                getConcernCompany($rootScope.pageIndex, 17, '');
                            }, function (err) {
                                $scope.$emit('rejectError', err)
                            })
                    }
                })
            }
            //查看债项详情
            $scope.goBondDetail = function (item) {
                var flag = true;
                $rootScope.tabLists.forEach(function (i) {
                    if(i.id == item.productEID){
                        $rootScope.tabItemId = item.productEID;
                        flag = false;
                    }
                })
                if(flag){
                    if($rootScope.tabLists.length>=9){
                        $rootScope.tabLists.shift();
                    }
                    $rootScope.tabLists.push({
                        id: item.productEID,
                        name: item.productName,
                        type: 'product'
                    })
                }
                // var companyList = [];
                // $rootScope.tabLists.forEach(function (i) {
                //     companyList.push(i.id);
                // })
                // storage.session.setItem(storage.KEY.COMPANYLIST, companyList);
                $location.path('/creditManagement').replace();
                $rootScope.tabItemId = item.productEID;
                $rootScope.isBondContentDetail = true;
            }
            //查看主体详情
            $scope.goMainDetail = function (item) {
                var flag = true;
                $rootScope.tabLists.forEach(function (i) {
                    if(i.id == item.companyEID){
                        $rootScope.tabItemId = item.companyEID;
                        flag = false;
                    }
                })
                if(flag){
                    if($rootScope.tabLists.length>=9){
                        $rootScope.tabLists.shift();
                    }
                    $rootScope.tabLists.push({
                        id: item.companyEID,
                        name: item.companyName,
                        type: 'company'
                    })
                }
                // var companyList = [];
                // $rootScope.tabLists.forEach(function (i) {
                //     companyList.push(i.id);
                // })
                // storage.session.setItem(storage.KEY.COMPANYLIST, companyList);
                $location.path('/creditManagement').replace();
                $rootScope.tabItemId = item.companyEID;
                $rootScope.isBondContentDetail = true;
            }
            //关键词筛选
            var tempKey
            $scope.filSearchBond = function (keyword) {
                tempKey = keyword
                var timer = $timeout(function () {
                    if(tempKey == keyword){
                        getConcernProduct($rootScope.pageIndex, 17, keyword)
                    }
                    $timeout.cancel(timer);
                }, 1000)
            }
            //事件通信
            $scope.$on("cmFocusBond", function (event, data) {
                // 这里取到发送过来的数据 data
                getConcernCompany($rootScope.pageIndex, 17, '');
            });
        }])
})