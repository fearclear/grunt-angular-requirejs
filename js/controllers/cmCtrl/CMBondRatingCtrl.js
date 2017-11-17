define(['app'], function (app) {
    return app.controller('CMBondRatingCtrl',['$scope', '$rootScope', 'serverService', '$cookies', '$location', 'baseService',
        function ($scope, $rootScope, serverService, $cookies, $location) {
            $rootScope.title = '信用管理';
            $rootScope.pageNow = 'cmBondRating';
            $rootScope.pageIndex = 1;
            $rootScope.isPagination = true;
            $scope.cmSearch = {};
            getProducts($rootScope.pageIndex, 17, $scope.cmSearch.bondName, $rootScope.selectMainId, $scope.cmSearch.claireEmIndustry);
            function getProducts(pageIndex, pageSize, keyWord, companyEID, industry) {
                showLoading();
                serverService.getProducts(pageIndex, pageSize, keyWord, companyEID, industry)
                    .then(function (data) {
                        hideLoading();
                        $scope.items = data.listData;
                        $rootScope.pageTotal = Math.ceil(data.totalCount / 17);
                        $rootScope.totalCount = data.totalCount;
                    }, function (err) {
                        $scope.$emit('rejectError', err)
                    })
            }
            $scope.chooseTwo = function () {
                $scope.claireEmIndustryTwos = $scope.claireEmIndustryThrees = '';
                serverService.getClaireEmIndustryTwo($scope.cmSearch.claireEmIndustryOne)
                    .then(function (data) {
                        $scope.claireEmIndustryTwos = data;
                    }, function (err) {
                        $scope.$emit('rejectError', err)
                    })
            }
            $scope.chooseThree = function () {
                $scope.claireEmIndustryThrees = '';
                serverService.getClaireEmIndustryThree($scope.cmSearch.claireEmIndustryTwo)
                    .then(function (data) {
                        $scope.claireEmIndustryThrees = data;
                    }, function (err) {
                        $scope.$emit('rejectError', err)
                    })
            }
            //搜索
            $scope.searchBond = function () {
                if($scope.cmSearch.claireEmIndustryThree){
                    $scope.cmSearch.claireEmIndustry = $scope.cmSearch.claireEmIndustryThrees
                }else if($scope.cmSearch.claireEmIndustryTwo){
                    $scope.cmSearch.claireEmIndustry = $scope.cmSearch.claireEmIndustryTwo
                }else {
                    $scope.cmSearch.claireEmIndustry = $scope.cmSearch.claireEmIndustryOne
                }
                getProducts($rootScope.pageIndex, 17, $scope.cmSearch.bondName, $rootScope.selectMainId, $scope.cmSearch.claireEmIndustry);
            }
            //重置
            $scope.resetBond = function () {
                $scope.cmSearch = {};
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
            //事件通信
            $scope.$on("cmBondRating", function (event, data) {
                // 这里取到发送过来的数据 data
                getProducts(data.pageIndex, 17, $scope.cmSearch.bondName, $rootScope.selectMainId, $scope.cmSearch.claireEmIndustry);
            });
        }])
})