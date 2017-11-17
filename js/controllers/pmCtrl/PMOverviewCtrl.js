define(['app', 'storage'], function (app, storage) {
    return app.controller('PMOverviewCtrl',['$scope', '$rootScope', 'serverService', '$cookies', '$timeout', '$location', 'baseService',
        function ($scope, $rootScope, serverService, $cookies, $timeout, $location) {
            $rootScope.pageNow = 'pmOverview';
            $rootScope.isPagination = false;
            $rootScope.positionManagement.pageNow = $rootScope.pageNow;
            $rootScope.title = '持仓管理';
            $rootScope.name = '产品纵览';
            $scope.pmS = {}
            if(storage.session.getItem(storage.KEY.POSITIONMANAGEMENT.OVKEY)){
                $timeout(function () {
                    $scope.pmOVDate = storage.session.getItem(storage.KEY.POSITIONMANAGEMENT.PMOVDATE);
                    $scope.pmOVFund = storage.session.getItem(storage.KEY.POSITIONMANAGEMENT.PMOVFUND);
                    var data = storage.session.getItem(storage.KEY.POSITIONMANAGEMENT.PMOVDATA);
                    getFundDetail(data);
                    getFundNet(data);
                    getProport(data);
                    getPieChart(data);
                }, 50)
            }
            $scope.getFundOverView = function (params) {
                params = params || {}
                params = {
                    date: params.date||$scope.pmS.date,
                    fundId: params.fundId||$scope.pmS.fundId,
                }
                showLoading();
                serverService.getFundAll(params)
                    .then(function (data) {
                        storage.session.setItem(storage.KEY.POSITIONMANAGEMENT.OVKEY, true);
                        storage.session.setItem(storage.KEY.POSITIONMANAGEMENT.PMOVDATA, data);
                        storage.session.setItem(storage.KEY.POSITIONMANAGEMENT.PMOVDATE, $scope.pmOVDate);
                        storage.session.setItem(storage.KEY.POSITIONMANAGEMENT.PMOVFUND, $scope.pmOVFund);
                        getFundDetail(data);
                        getFundNet(data);
                        getProport(data);
                        getPieChart(data);
                    }, function (err) {
                        $scope.$emit('rejectError', err)
                    })
            }
            //获取产品详情
            function getFundDetail(data) {
                $scope.fundInfo = data.fundInfo
            }
            //查看详情
            $scope.showMore = function (item) {
                $scope.isShowMore = true
                $scope.showInfo = item
            }
            //关闭查看
            $scope.cancelShowMore = function () {
                $scope.isShowMore = false
            }
            //获取净值走势
            function getFundNet(data) {
                var fundNetValue = [],
                    fundTotalNetValue = [];
                data.fundNetValues.forEach(function (i) {
                    i.workday = new Date(i.workday.replace(/-/g, '/')).getTime();
                    fundNetValue.push({
                        workday: i.workday,
                        value: i.fundNetValue
                    })
                    fundTotalNetValue.push({
                        workday: i.workday,
                        value: i.fundTotalNetValue
                    })
                })
                $scope.fundNetData = [
                    {
                        key: '单位净值',
                        values: fundNetValue,
                    },
                    {
                        key: '累计净值',
                        values: fundTotalNetValue,
                    }
                ]
            }
            //获取数量百分比
            function getProport(data) {
                var totalCount = 0;
                data.holdingGroup.forEach(function (i) {
                    totalCount += +i.amount;
                })
                totalCount = totalCount?totalCount:1;
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
                if(data.emData){
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
                            name: i.productOutGrade,
                            displayName: '数量',
                            value: i.number,
                            ratio: i.number/ratingNumber
                        })
                        $scope.pieRatingDataAmount.push({
                            name: i.productOutGrade,
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
            $scope.fundNetOption = {
                chart: {
                    type: 'lineChart',
                    height: 252,
                    margin : {
                        top: 20,
                        right: 20,
                        bottom: 50,
                        left: 55
                    },
                    x: function(d){return d.workday;},
                    y: function(d){return d.value;},
                    useInteractiveGuideline: true,
                    xAxis: {
                        axisLabel: '日期',
                         tickFormat: function (d) {
                             return d3.time.format('%x')(new Date(d));
                         },
                    },
                    yAxis: {
                        axisLabel: '净值(元)',/*
                         tickFormat: function (d) {
                         return d3.format('%')(d);
                         },*/
                        axisLabelDistance: -10
                    }
                }
            };
            var fundNetTimer = $timeout(function () {
                $scope.fundNetData = []
            })
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
                        axisLabel: '券种名称'
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
                    $timeout.cancel(fundNetTimer);
                    $timeout.cancel(holdTimer);
                    $timeout.cancel(pieChartTimer);
                }
            );
        }])
})