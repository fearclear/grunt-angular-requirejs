define(['app', 'storage'], function (app, storage) {
    return app.controller('SRNetValueTrendCtrl',['$scope', '$rootScope', 'serverService', '$timeout', '$cookies', '$location', 'baseService',
        function ($scope, $rootScope, serverService, $timeout, $cookies, $location) {
            $rootScope.pageNow = 'srNetValueTrend';
            $rootScope.statistical.pageNow = $rootScope.pageNow;
            $rootScope.isPagination = false;
            $rootScope.title = '统计报表';
            $rootScope.name = '净值走势对比图';
            $scope.sr = {};
            $timeout(function () {
                $scope.step = 1
            })
            $scope.list = [0,1,2,3];
            var colorSel = [
                {
                    index: 1,
                    style: {
                        background: '#fdc463',
                        color: '#000',
                    }
                },
                {
                    index: 2,
                    style: {
                        background: '#fc7a75',
                        color: '#000',
                    }
                },
                {
                    index: 3,
                    style: {
                        background: '#cc99ff',
                        color: '#000',
                    }
                },
                {
                    index: 4,
                    style: {
                        background: '#ffbb99',
                        color: '#000',
                    }
                }
            ];
            $scope.steps = [
                {
                    code: 'd',
                    name: '日净值'
                },
                {
                    code: 'w',
                    name: '周净值',
                },
                {
                    code: 'm',
                    name: '月净值',
                }
            ]
            $scope.cmSearchParts = [{
                index: 0,
                style: {
                    background: '#8fc8fa',
                    color: '#000'
                }
            }];
            //添加线图
            $scope.addSearchPart = function (length) {
                if(length>=5) {
                    return false
                }else{
                    $scope.cmSearchParts.push(colorSel[$scope.list[0]])
                    $scope.list.shift();
                }
            }
            //请求数据
            $scope.getFundNetValue = function (part) {
                if($scope.sr.startDate && $scope.sr.endDate){
                    serverService.getFindataTotalNetValue($scope.sr.startDate, $scope.sr.endDate, part.fund.id, $scope.step)
                        .then(function (data) {
                            getFundNet(data, part, false);
                        }, function (err) {
                            $scope.$emit('rejectError', err)
                        })
                }
            }
            //附加基准
            $scope.addQuote = function (str) {
                if($scope.sr.startDate && $scope.sr.endDate){
                    if(str){
                        serverService.getFindataNetValueQuote($scope.sr.startDate, $scope.sr.endDate, str, $scope.step)
                            .then(function (data) {
                                var fundNetValue = [];
                                if(data && data.length){
                                    var proport = str=='037.CS'?data[0].value:data[0].value
                                }
                                var tempColor = str == '037.CS'?'#999': '#d4bd96'
                                if(data.length){
                                    data.forEach(function (i) {
                                        if(i.workday){
                                            fundNetValue.push({
                                                workday: i.workday,
                                                value: (i.value/proport).toFixed(4),
                                            })
                                        }
                                    })
                                }
                                var flag = false;
                                $scope.fundNetData.forEach(function (i) {
                                    if(i.key == str){
                                        i.values = fundNetValue
                                        flag = true;
                                    }
                                })
                                if(!flag){
                                    $scope.fundNetData.push({
                                        key: str,
                                        values: fundNetValue,
                                        classed: 'dashed',
                                        color: tempColor
                                    })
                                }
                            }, function (err) {
                                $scope.$emit('rejectError', err)
                            })
                    }else{
                        str = str===0?'037.CS':'000300.SH';
                        for(var i=0;i<$scope.fundNetData.length;i++){
                            if($scope.fundNetData[i].key == str){
                                $scope.fundNetData.splice(i, 1);
                            }
                        }
                    }
                }
            }
            //删除产品
            $scope.delPart = function (part) {
                if(part.index==0){
                    $rootScope.isError = true;
                    $rootScope.errText = '不能删除初始产品';
                    return
                }
                for(var i=0;i<$scope.cmSearchParts.length;i++){
                    if($scope.cmSearchParts[i].index == part.index){
                        $scope.cmSearchParts.splice(i,1);
                        $scope.list.push(part.index-1);
                        break;
                    }
                }
                for(var i=0;i<$scope.fundNetData.length;i++){
                    if($scope.fundNetData[i].key == part.fund.name){
                        $scope.fundNetData.splice(i, i);
                        break;
                    }
                }
            }
            //时间改变重新请求
            $scope.changeDate = function (flag) {
                if($scope.sr.startDate && $scope.sr.endDate){
                    $scope.cmSearchParts.forEach(function (i) {
                        if(i.fund && i.fund.id){
                            serverService.getFindataTotalNetValue($scope.sr.startDate, $scope.sr.endDate, i.fund.id, $scope.step)
                                .then(function (data) {
                                    getFundNet(data, i, true);
                                }, function (err) {
                                    $scope.$emit('rejectError', err)
                                })
                        }
                    })
                    if($scope.srCs){
                        $scope.addQuote('037.CS');
                    }
                    if($scope.srSh){
                        $scope.addQuote('000300.SH');
                    }
                }
            }
            //获取净值走势
            function getFundNet(data, part, flag) {
                var fundNetValue = []
                if(data.length){
                    data.forEach(function (i) {
                        if(i.workday && i.value){//去除净值为0的数据
                            fundNetValue.push({
                                workday: i.workday,
                                value: i.value.toFixed(4)
                            })
                        }
                    })
                }
                var isNew = true;
                $scope.fundNetData.forEach(function (i) {
                    if(part.fund && i.key == part.fund.name && !flag){
                        $rootScope.isError = true;
                        $rootScope.errText = '选择产品重复';
                        part.fund = null;
                    }
                    if(i.color == part.style.background){
                        isNew = false;
                        i.values = fundNetValue;
                        i.key = part.fund.name;
                    }
                })
                if(isNew){
                    $scope.fundNetData.push({
                        key: part.fund.name,
                        values: fundNetValue,
                        color: part.style.background
                    })
                }
            }
            //改变净值类型
            $scope.changeStep = function (step) {
                if($scope.sr.startDate && $scope.sr.endDate){
                    $scope.cmSearchParts.forEach(function (i) {
                        if(i.fund && i.fund.id){
                            serverService.getFindataTotalNetValue($scope.sr.startDate, $scope.sr.endDate, i.fund.id, $scope.step)
                                .then(function (data) {
                                    getFundNet(data, i, true);
                                }, function (err) {
                                    $scope.$emit('rejectError', err)
                                })
                        }
                    })
                    if($scope.srCs){
                        $scope.addQuote('037.CS');
                    }
                    if($scope.srSh){
                        $scope.addQuote('000300.SH');
                    }
                }
            }
            //配置
            $scope.fundNetOption = {
                chart: {
                    type: 'lineChart',
                    height: 450,
                    margin : {
                        top: 20,
                        right: 20,
                        bottom: 50,
                        left: 55
                    },
                    x: function(d){
                            if(d && d.workday){
                                return d.workday;
                            }
                        },
                    y: function(d){
                            if(d && d.value){
                                return d.value;
                            }
                        },
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
            //清除定时器
            $scope.$on(
                "$destroy",
                function( event ) {
                    $timeout.cancel(fundNetTimer);
                }
            );
        }])
})