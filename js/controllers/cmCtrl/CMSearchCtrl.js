define(['app', 'storage'], function (app, storage) {
    return app.controller('CMSearchCtrl',['$scope', '$rootScope', 'serverService', '$cookies','$location', '$timeout', 'baseService',
        function ($scope, $rootScope, serverService, $cookies, $location, $timeout) {
            $rootScope.title = '信用管理';
            $rootScope.pageNow = 'cmSearch';
            $rootScope.tabItemId = 'home';
            $rootScope.isPagination = false;
            $scope.fuzzyName = '';
            $scope.navKey = 'c';
            $scope.fuzzySearch = function (keyword) {
                fuzzySearch(keyword, $scope.navKey);
            }
            var tempArr = [];
            if($rootScope.searchList){
                $scope.fuzzyName = $rootScope.searchList.keyword;
                $scope.showList = $rootScope.searchList.showList;
            }
            var fuzzyNameLazyKeyWord = '';
            $scope.changeFuzzyName = function (keyword) {
                if(!keyword){
                    $scope.showList = []
                }
                fuzzyNameLazyKeyWord = keyword;
                var time1 = $timeout(function () {
                    if(keyword == fuzzyNameLazyKeyWord){
                        fuzzySearch(keyword, $scope.navKey);
                        $timeout.cancel(time1);
                    }
                }, 1000)
            }
            function fuzzySearch(keyword, type) {
                $scope.showList = [];
                tempArr.push(keyword);
                serverService.openDoor(keyword, type)
                    .then(function (data) {
                        if(data.key != tempArr[tempArr.length-1]){
                            return;
                        }
                        tempArr = [];
                        data.result.forEach(function (i) {
                            switch (i.type){
                                case 'product':
                                    i.showName = i.code + '&nbsp;&nbsp;&nbsp;' + i.name;
                                    break;
                                case 'company':
                                    i.showName = i.name;
                                    break;
                                default:
                                    break;
                            }
                            $scope.showList.push(i);
                        })
                        $rootScope.searchList = {
                            keyword: keyword,
                            showList: $scope.showList
                        }
                    }, function (err) {
                        $scope.$emit('rejectError', err)
                    })
            }
            $scope.openNewTab = function (item) {
                var flag = true;
                $rootScope.tabLists.forEach(function (i) {
                    if(i.id == item.EID){
                        $rootScope.tabItemId = item.EID;
                        flag = false;
                    }
                })
                if(flag){
                    if($rootScope.tabLists.length>=9){
                        $rootScope.tabLists.shift();
                    }
                    $rootScope.tabLists.push({
                        id: item.EID,
                        name: item.name,
                        type: item.type
                    })
                }
                // var companyList = [];
                // $rootScope.tabLists.forEach(function (i) {
                //     companyList.push(i.id);
                // })
                // storage.session.setItem(storage.KEY.COMPANYLIST, companyList);
                $location.path('/creditManagement').replace();
                $rootScope.tabItemId = item.EID;
                $rootScope.isBondContentDetail = true;
            }
            //改变主体或是债项
            $scope.changeType = function (type) {
                $scope.navKey = type;
                $scope.changeFuzzyName($scope.fuzzyName)
            }
            document.addEventListener('keydown', pushFuzzySearch);
            function pushFuzzySearch(ev) {
                if (ev.keyCode == '13' && $location.$$url == '/cmSearch' && $scope.fuzzyName) {
                    fuzzySearch($scope.fuzzyName);
                }else if($rootScope.pageNow != 'cmSearch'){
                    document.removeEventListener('keydown', pushFuzzySearch);
                }
            }
    }])
})