define(['app'], function (app) {
    return app.controller('CMMainRatingCtrl',['$scope', '$rootScope', 'serverService', '$cookies', '$location', 'baseService',
        function ($scope, $rootScope, serverService, $cookies, $location) {
            $rootScope.title = '信用管理';
            $rootScope.pageNow = 'cmMainRating';
            $rootScope.isPagination = true;
            $rootScope.selectMainId = '';
            $scope.cmRating = {};
            $scope.cmSearch = {};
            if(!$rootScope.mainRatingCash.pageIndex){
                $rootScope.pageIndex = 1;
                $rootScope.mainRatingCash.pageIndex = $rootScope.pageIndex;
            }else {
                $rootScope.pageIndex = $rootScope.mainRatingCash.pageIndex;
            }
            if(!$rootScope.mainRatingCash.fileList){
                getCompanies($rootScope.pageIndex, 15, $scope.cmSearch.mainName, $scope.cmSearch.claireEmIndustry, $scope.cmSearch.claireGrade, $scope.cmSearch.claireScore)
            }else{
                $scope.items = $rootScope.mainRatingCash.fileList;
            }
            function getCompanies(pageIndex, pageSize, keyWord, industry, companyOutGrade, companyLanShiScore, isHolding) {
                showLoading();
                serverService.getCompanies(pageIndex, pageSize, keyWord, industry, companyOutGrade, companyLanShiScore, isHolding)
                    .then(function (data) {
                        $rootScope.mainRatingCash.fileList = $scope.items = data.listData;
                        $scope.items.forEach(function (i) {
                            if(i.city=='--'){
                                i.placeShow = i.province;
                            }else {
                                i.placeShow = i.province + i.city;
                            }
                        })
                        $rootScope.pageTotal = Math.ceil(data.totalCount / 15);
                        $rootScope.mainRatingCash.pageIndex = $rootScope.pageIndex = pageIndex;                        $rootScope.totalCount = data.totalCount;
                        hideLoading();
                    }, function (err) {
                        $scope.$emit('rejectError', err)
                    })
            }
            //添加到蓝石评级
            $scope.showEditRating = function (item) {
                $scope.isEditRating = true;
                $scope.cmRating.companyId = item.companyId;
                $scope.cmRating.companyLanShiScore = item.companyLanShiScoreCode;
                $scope.cmRating.companyScoreNote = item.companyScoreNote || '';
                $scope.cmRating.companyNote = item.companyNote || '';
            }
            //提交修改评级
            $scope.subEditRating = function () {
                serverService.updateMain($scope.cmRating)
                    .then(function () {
                        $rootScope.isError = true;
                        $rootScope.errText = '添加成功';
                        $scope.cmRating = {};
                        $scope.isEditRating = false;
                        getCompanies($rootScope.pageIndex, 15, $scope.cmSearch.mainName, $scope.cmSearch.claireEmIndustry, $scope.cmSearch.claireGrade, $scope.cmSearch.claireScore)
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
            //取消添加评级
            $scope.cancelEditRating = function () {
                $scope.isEditRating = false;
                $scope.cmRating = {};
            }
            //搜索
            $scope.searchMain = function () {
                if($scope.cmSearch.claireEmIndustryThree){
                    $scope.cmSearch.claireEmIndustry = $scope.cmSearch.claireEmIndustryThree
                }else if($scope.cmSearch.claireEmIndustryTwo){
                    $scope.cmSearch.claireEmIndustry = $scope.cmSearch.claireEmIndustryTwo
                }else {
                    $scope.cmSearch.claireEmIndustry = $scope.cmSearch.claireEmIndustryOne
                }
                getCompanies($rootScope.pageIndex, 15, $scope.cmSearch.mainName, $scope.cmSearch.claireEmIndustry, $scope.cmSearch.claireGrade, $scope.cmSearch.claireScore, $scope.cmSearch.isHolding)
            }
            //重置
            $scope.resetMain = function () {
                $scope.cmSearch = {};
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
              $scope.params = {
                holdingList: [
                  {
                    code: 'true',
                    name: '是',
                  },
                  {
                    code: 'false',
                    name: '否',
                  },
                ]
              }
            //查看债项详情
            $scope.goBondRating = function (item) {
                $rootScope.selectMainId = item.companyEID;
                $location.path('cmBondRating').replace();
            }
            //事件通信
            $scope.$on("cmMainRating", function (event, data) {
                $scope.items = [];
                // 这里取到发送过来的数据 data
                getCompanies(data.pageIndex, 15, $scope.cmSearch.mainName, $scope.cmSearch.claireEmIndustry, $scope.cmSearch.claireGrade, $scope.cmSearch.claireScore)
            });
        }])
})