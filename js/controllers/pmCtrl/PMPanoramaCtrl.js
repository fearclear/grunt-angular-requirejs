define(['app', 'storage'], function (app, storage) {
    return app.controller('PMPanoramaCtrl',['$scope', '$rootScope', 'serverService', '$cookies', '$timeout', '$location', 'baseService',
        function ($scope, $rootScope, serverService, $cookies, $timeout, $location) {
            $rootScope.pageNow = 'pmPanorama';
            $rootScope.positionManagement.pageNow = $rootScope.pageNow;
            $rootScope.isPagination = false;
            $rootScope.title = '持仓管理';
            $rootScope.name = '持仓全景';
            $scope.pmData = {};
            $scope.isShowMoreList = {};
            $scope.pagePogination = {
                pageIndexDueDate: 1,
                pageSizeDueDate: 10,
                pageTotalDueDate: 0,
                totalCountDueDate: 0
            }
            if(storage.session.getItem(storage.KEY.POSITIONMANAGEMENT.KEY)){
                $timeout(function () {
                    $scope.pmDate = storage.session.getItem(storage.KEY.POSITIONMANAGEMENT.PMDATE);
                    var data = storage.session.getItem(storage.KEY.POSITIONMANAGEMENT.DATA);
                    getHoldingGroup(data);
                    getProport(data);
                    getPieChart(data);
                    getHoldingCompanyTop10Result(data);
                    getHoldingDueDateGroupResult(data);
                }, 50)
            }
            $scope.getHolding = function (date) {
                showLoading();
                serverService.getHoldingAll(date)
                    .then(function (data) {
                        hideLoading();
                        getHoldingGroup(data);
                        getProport(data);
                        getPieChart(data);
                        getHoldingCompanyTop10Result(data);
                        getHoldingDueDateGroupResult(data);
                        storage.session.setItem(storage.KEY.POSITIONMANAGEMENT.KEY, true);
                        storage.session.setItem(storage.KEY.POSITIONMANAGEMENT.DATA, data);
                        storage.session.setItem(storage.KEY.POSITIONMANAGEMENT.PMDATE, $scope.pmDate);
                    }, function (err) {
                        $scope.$emit('rejectError', err)
                    })
            }
            //获取列表组
            function getHoldingGroup(data) {
                $scope.pmData.holdingGroupLeft = [];
                $scope.pmData.holdingGroupRight = [];
                if(data){
                    var length = data.holdingGroup.length,
                        flag = true;
                    for(var i=0;i<length;i++){
                        if(flag){
                            $scope.pmData.holdingGroupLeft.push(data.holdingGroup[i]);
                        }else{
                            $scope.pmData.holdingGroupRight.push(data.holdingGroup[i]);
                        }
                        flag = !flag;
                    }
                }
            }
            //获取金额百分比
            function getProport(data) {
                if(data){
                    var totalCount = 0;
                    data.holdingGroup.forEach(function (i) {
                        totalCount += +i.amount;
                    })
                    data.holdingGroup.forEach(function (i) {
                        i.proport = +i.amount/+totalCount;
                    })
                    $scope.holdingData = [
                        {
                            key: "Cumulative Return",
                            values: data.holdingGroup
                        }
                    ];
                }
            }
            //获取饼状图
            function getPieChart(data) {
                $scope.pieProvinceDataNumber = []
                $scope.pieProvinceDataAmount = []
                $scope.pieIndustryDataNumber = []
                $scope.pieIndustryDataAmount = []
                $scope.pieRatingDataNumber = []
                $scope.pieRatingDataAmount = []
                $scope.pieCompanyDataNumber= []
                $scope.pieCompanyDataAmount = []
                if(data && data.emData){
                    var pieProvinceData = data.emData.groupByProvince;
                    var pieIndustryData = data.emData.groupByIndustryOne;
                    var pieRatingData = data.emData.groupByCompanyOutGrade;
                    var pieCompanyData = data.emData.groupByCompanyType;
                    var provinceNumber = 0,
                        provinceAmount = 0,
                        industryNumber = 0,
                        industryAmount = 0,
                        ratingNumber = 0,
                        ratingAmount = 0,
                        companyNumber = 0,
                        companyAmount = 0;
                    pieProvinceData.forEach(function (i) {
                        provinceNumber += i.number
                        provinceAmount += i.amount
                    })
                    pieProvinceData.forEach(function (i) {
                        $scope.pieProvinceDataNumber.push({
                            name: i.province,
                            displayName: '数量',
                            value: i.number,
                            ratio: i.number/provinceNumber
                        })
                        $scope.pieProvinceDataAmount.push({
                            name: i.province,
                            displayName: '金额',
                            value: i.amount,
                            ratio: i.amount/provinceAmount
                        })
                    })
                    pieIndustryData.forEach(function (i) {
                        industryNumber += i.number
                        industryAmount += i.amount
                    })
                    pieIndustryData.forEach(function (i) {
                        $scope.pieIndustryDataNumber.push({
                            name: i.industryOne,
                            displayName: '数量',
                            value: i.number,
                            ratio: i.number/industryNumber
                        })
                        $scope.pieIndustryDataAmount.push({
                            name: i.industryOne,
                            displayName: '金额',
                            value: i.amount,
                            ratio: i.amount/industryAmount
                        })
                    })
                    pieRatingData.forEach(function (i) {
                        ratingNumber += i.number
                        ratingAmount += i.amount
                    })
                    pieRatingData.forEach(function (i) {
                        $scope.pieRatingDataNumber.push({
                            name: i.companyOutGrade,
                            displayName: '数量',
                            value: i.number,
                            ratio: i.number/ratingNumber
                        })
                        $scope.pieRatingDataAmount.push({
                            name: i.companyOutGrade,
                            displayName: '金额',
                            value: i.amount,
                            ratio: i.amount/ratingAmount
                        })
                    })
                    pieCompanyData.forEach(function (i) {
                        companyNumber += i.number
                        companyAmount += i.amount
                    })
                    pieCompanyData.forEach(function (i) {
                        $scope.pieCompanyDataNumber.push({
                            name: i.companyType,
                            displayName: '数量',
                            value: i.number,
                            ratio: i.number/companyNumber
                        })
                        $scope.pieCompanyDataAmount.push({
                            name: i.companyType,
                            displayName: '金额',
                            value: i.amount,
                            ratio: i.amount/companyAmount
                        })
                    })
                }
            }
            //获取十大重仓企业
            function getHoldingCompanyTop10Result(data) {
                if(data && data.emData){
                    $scope.pmData.holdingCompanyTop10Result = data.emData.holdingCompanyTop10Result;
                }
            }
            //获取到期日期
            function getHoldingDueDateGroupResult(data) {
                if(data && data.emData){
                    $scope.pmData.holdingDueDateGroupResultAll = data.emData.holdingDueDateGroupResult;
                    $scope.pagePogination.totalCountDueDate = $scope.pmData.holdingDueDateGroupResultAll.length;
                    $scope.pagePogination.pageTotalDueDate = Math.ceil($scope.pagePogination.totalCountDueDate/$scope.pagePogination.pageSizeDueDate);
                    $scope.pmData.holdingDueDateGroupResult = $scope.pmData.holdingDueDateGroupResultAll.slice(0, $scope.pagePogination.pageSizeDueDate);
                }
            }
            //日期项分页
            $scope.toPageDueDate = function (pageIndex) {
                if(!/^\d*$/.test(pageIndex)){
                    pageIndex = $scope.goIndex = 1;
                }
                $scope.goIndex = pageIndex = pageIndex<1?1:pageIndex>$scope.pagePogination.pageTotalDueDate?$scope.pagePogination.pageTotalDueDate:pageIndex;
                $scope.pmData.holdingDueDateGroupResult = $scope.pmData.holdingDueDateGroupResultAll.slice($scope.pagePogination.pageSizeDueDate*(pageIndex-1), $scope.pagePogination.pageSizeDueDate*(pageIndex-1)+$scope.pagePogination.pageSizeDueDate);
                $scope.pagePogination.pageIndexDueDate = pageIndex;
            }
            //查看详情
            $scope.showMoreList = function (item, flag) {
                $scope.isShowMoreList[flag] = true;
                switch (flag){
                    case 'top10':
                        serverService.getHoldingProductByCompanyEID($scope.pmDate, item.companyEID)
                            .then(function (data) {
                                $scope.Top10MoreItems = data;
                            }, function (err) {
                                $scope.$emit('rejectError', err)
                            })
                        break;
                    case 'dueDate':
                        serverService.getHoldingProductByDueDate($scope.pmDate, item.dueDate)
                            .then(function (data) {
                                $scope.dueDateMoreItems = data;
                            }, function (err) {
                                $scope.$emit('rejectError', err)
                            })
                        break;
                }
            }
            //取消查看
            $scope.cancelShowMore = function () {
                $scope.isShowMoreList = {};
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
                $location.path('/creditManagement').replace();
                $rootScope.tabItemId = item.companyEID;
                $rootScope.isBondContentDetail = true;
            }
            $scope.holdingOption = {
                chart: {
                    type: 'discreteBarChart',
                    height: 252,
                    margin : {
                        top: 20,
                        right: 20,
                        bottom: 50,
                        left: 55
                    },
                    x: function(d){return d.type;},
                    y: function(d){return d.proport;},
                    showValues: true,
                    valueFormat: function(d){
                        return d3.format('.2%')(d);
                    },
                    duration: 500,
                    xAxis: {
                        axisLabel: '券种'
                    },
                    yAxis: {
                        axisLabel: '百分比',
                        tickFormat: function (d) {
                            return d3.format('%')(d);
                        },
                        axisLabelDistance: -10
                    },
                    tooltip: {
                        contentGenerator: function (e) {
                            var data = e.data
                            var series = e.series[0];
                            if (series.value === null) return;
                            var rows =
                                "<tr>" +
                                "<td class='key'>" + '数量: ' + "</td>" +
                                "<td class='x-value'>" + (+data.number).toFixed(0) + "</td>" +
                                "</tr>" +
                                "<tr>" +
                                "<td class='key'>" + '金额: ' + "</td>" +
                                "<td class='x-value'>" + data.amount + "</td>" +
                                "</tr>" +
                                "<tr>" +
                                "<td class='key'>" + '百分比: ' + "</td>" +
                                "<td class='x-value'>" + d3.format('.2%')(series.value) + "</td>" +
                                "</tr>";

                            var header =
                                "<thead>" +
                                "<tr>" +
                                "<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
                                "<td class='key'><strong>" + series.key + "</strong></td>" +
                                "</tr>" +
                                "</thead>";

                            return "<table>" +
                                header +
                                "<tbody>" +
                                rows +
                                "</tbody>" +
                                "</table>";
                        }
                    }
                }
            };
            var holdTimer = $timeout(function () {
                $scope.holdingData = []
            })
            $scope.pieChartOption = {
                chart: {
                    type: 'pieChart',
                    height: 260,
                    x: function(d){return d.name;},
                    y: function(d){return d.value;},
                    showLabels: true,
                    duration: 500,
                    labelThreshold: 0.01,
                    labelSunbeamLayout: false,
                    labelsOutside: true,
                    showLegend: false,
                    legend: {
                        margin: {
                            top: 5,
                            right: 35,
                            bottom: 5,
                            left: 0
                        }
                    },
                    tooltip: {
                        contentGenerator: function (e) {
                            var data = e.data
                            var series = e.series[0];
                            if (series.value === null) return;
                            var rows =
                                "<tr>" +
                                "<td class='key'>" + data.displayName + "</td>" +
                                "<td class='x-value'>" + (+data.value) + "</td>" +
                                "</tr>" +
                                "<tr>" +
                                "<td class='key'>" + '百分比: ' + "</td>" +
                                "<td class='x-value'>" + d3.format('.2%')(data.ratio) + "</td>" +
                                "</tr>";

                            var header =
                                "<thead>" +
                                "<tr>" +
                                "<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
                                "<td class='key'><strong>" + series.key + "</strong></td>" +
                                "</tr>" +
                                "</thead>";

                            return "<table>" +
                                header +
                                "<tbody>" +
                                rows +
                                "</tbody>" +
                                "</table>";
                        }
                    }
                }
            };
            var pieChartTimer = $timeout(function () {
                $scope.pieProvinceDataNumber = []
                $scope.pieProvinceDataAmount = []
                $scope.pieIndustryDataNumber = []
                $scope.pieIndustryDataAmount = []
                $scope.pieRatingDataNumber = []
                $scope.pieRatingDataAmount = []
                $scope.pieCompanyDataNumber= []
                $scope.pieCompanyDataAmount = []
            });
            //清除定时器
            $scope.$on(
                "$destroy",
                function( event ) {
                    $timeout.cancel(holdTimer);
                    $timeout.cancel(pieChartTimer);
                }
            );
        }])
})