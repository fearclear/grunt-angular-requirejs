define(['app', 'storage'], function (app, storage) {
    return app.controller('CreditManagementCtrl', ['$scope', '$rootScope', 'serverService', '$cookies', '$location', '$timeout', 'baseService',
        function ($scope, $rootScope, serverService, $cookies, $location, $timeout) {
            $rootScope.title = '信用管理';
            // $rootScope.isBondContentDetail = true;//信用管理分页
            $rootScope.name = '搜索';
            $scope.cmRating = {};
            $scope.cmReportType = {};
            $scope.cmReportYear = '3';
            $scope.filUnits = [
                {
                    code: 1,
                    name: '元'
                },
                {
                    code: 1000,
                    name: '千元'
                },
                {
                    code: 10000,
                    name: '万元'
                },
                {
                    code: 100000,
                    name: '十万元'
                },
                {
                    code: 1000000,
                    name: '百万元'
                },
                {
                    code: 10000000,
                    name: '千万元'
                },
                {
                    code: 100000000,
                    name: '亿元'
                },
                {
                    code: 1000000000,
                    name: '十亿元'
                },
                {
                    code: 10000000000,
                    name: '百亿元'
                },
            ]
            $timeout(function () {
                $scope.filUnit = 1;
            })
            $scope.itemNavies = [
                {
                    name: '公司资料',
                    url: '',
                    list: [
                        {
                            name: '公司介绍',
                            key: 'profile'
                        },
                        {
                            name: '历史评级',
                            key: 'historyRating'
                        },
                        {
                            name: '机构资格',
                            key: 'qualification'
                        }
                    ],
                    isShow: true,
                },
                {
                    name: '财务数据',
                    url: '',
                    list: [
                        {
                            name: '公司授信额度表',
                            key: 'creditLine'
                        },
                        {
                            name: '募集资金投向变更',
                            key: 'fundsToChange'
                        },
                        {
                            name: '募集资金投向项目',
                            key: 'fundsToInvest'
                        }
                    ],
                    isShow: true,
                },
                {
                    name: '财务报表',
                    url: '',
                    list: [
                        {
                            name: '通用类利润表',
                            key: 'profitStatement'
                        },
                        {
                            name: '通用类现金流量表',
                            key: 'cashFlowStatement'
                        },
                        {
                            name: '现金流补充表',
                            key: 'cashFlowSupplement'
                        },
                        {
                            name: '资产负债表',
                            key: 'balanceSheet'
                        }
                    ],
                    isShow: true,
                }
            ]
            $scope.productList = [
                {
                    name: '主要条款',
                    key: 'productProfile'
                },
                {
                    name: '历史评级',
                    key: 'productHistoryRating'
                }
            ]
            if(!$rootScope.isBondContentDetail){
                $location.path('/cmSearch').replace();
            }else {
                $rootScope.tabLists.forEach(function (i) {
                    if($rootScope.tabItemId == i.id){
                        $scope.allData = i;
                        switch (i.type){
                            case 'company':
                                if(!i.key){
                                    i.key = 'profile';
                                }
                                $scope.isCompany = true;
                                if(i.information == undefined){
                                    serverService.getoCmpanyInfo(i.id)
                                        .then(function (data) {
                                            i.information = data;
                                        }, function (err) {
                                            $scope.$emit('rejectError', err)
                                        })
                                }
                                break;
                            case 'product':
                                if(!i.key){
                                    i.key = 'productProfile';
                                }
                                $scope.isCompany = false;
                                if(i.information == undefined){
                                    serverService.getProductInfo(i.id)
                                        .then(function (data) {
                                            i.information = data;
                                        }, function (err) {
                                            $scope.$emit('rejectError', err)
                                        })
                                }
                                break;
                            default:
                                break;
                        }
                    }
                })
            }
            //子标签切换
            $scope.changeKey = function (key) {
                showLoading()
                $scope.allData.key = key;
                switch (key) {
                    case 'profile':
                    case 'productProfile':
                        hideLoading()
                        break;
                    case 'productHistoryRating':
                        if ($scope.allData.creditRating == undefined) {
                            serverService.getRecordProductIcrate($scope.allData.id)
                                .then(function (data) {
                                    hideLoading()
                                    $scope.allData.creditRating = data;
                                }, function (err) {
                                    $scope.$emit('rejectError', err)
                                })
                        }
                        break;
                    case 'historyRating':
                        if ($scope.allData.creditRating == undefined) {
                            serverService.getRecordCompanyIcrate($scope.allData.id)
                                .then(function (data) {
                                    hideLoading()
                                    $scope.allData.creditRating = data;
                                }, function (err) {
                                    $scope.$emit('rejectError', err)
                                })
                        }
                        break;
                    case 'qualification':
                        if ($scope.allData.qualification == undefined) {
                            serverService.getCompanyQualifyInfo($scope.allData.id)
                                .then(function (data) {
                                    hideLoading()
                                    $scope.allData.qualification = data;
                                }, function (err) {
                                    $scope.$emit('rejectError', err)
                                })
                        }
                        break;
                    case 'creditLine':
                        if ($scope.allData.creditLine == undefined) {
                            serverService.getCompanyCredit($scope.allData.id)
                                .then(function (data) {
                                    hideLoading()
                                    $scope.allData.creditLine = data;
                                }, function (err) {
                                    $scope.$emit('rejectError', err)
                                })
                        }
                        break;
                    case 'fundsToChange':
                        if ($scope.allData.fundsToChange == undefined) {
                            serverService.getCompanyCmRfinvestchg($scope.allData.id)
                                .then(function (data) {
                                    hideLoading()
                                    $scope.allData.fundsToChange = data;
                                    data.forEach(function (i) {
                                        if (i.CHANGEDSCRP) {
                                            i.CHANGEDSCRPSHOW = i.CHANGEDSCRP.substr(0, 40) + '...';
                                        }
                                    })
                                }, function (err) {
                                    $scope.$emit('rejectError', err)
                                })
                        }
                        break;
                    case 'fundsToInvest':
                        if ($scope.allData.fundsToInvest == undefined) {
                            serverService.getCompanyMJZJTXB($scope.allData.id)
                                .then(function (data) {
                                    hideLoading()
                                    data.forEach(function (i) {
                                        if (i.PROFITDESC) {
                                            i.PROFITDESCSHOW = i.PROFITDESC.substr(0, 40) + '...';
                                        }
                                        if (i.PROJECTPRODESC) {
                                            i.PROJECTPRODESCSHOW = i.PROJECTPRODESC.substr(0, 40) + '...';
                                        }
                                    })
                                    $scope.allData.fundsToInvest = data;
                                }, function (err) {
                                    $scope.$emit('rejectError', err)
                                })
                        }
                        break;
                    case 'profitStatement':
                        if ($scope.allData.profitStatement == undefined) {
                            $scope.getFinincome('', 3);
                        }
                        hideLoading()
                        break;
                    case 'cashFlowStatement':
                        if ($scope.allData.cashFlowStatement == undefined) {
                            $scope.getFinCashFlow('', 3);
                        }
                        hideLoading()
                        break;
                    case 'cashFlowSupplement':
                        if ($scope.allData.cashFlowSupplement == undefined) {
                            $scope.getFinCashFlowadd('', 3);
                        }
                        hideLoading()
                        break;
                    case 'balanceSheet':
                        if ($scope.allData.balanceSheet == undefined) {
                            $scope.getFinBalance('', 3);
                        }
                        hideLoading()
                        break;
                    default:
                        break;
                }
            }
            //查询
            $scope.searchFin = function (funName) {
                var reportTimeTypeCode = '';
                for(var i in $scope.cmReportType){
                    if($scope.cmReportType[i]){
                        reportTimeTypeCode += $scope.cmReportType[i]+','
                    }
                }
                reportTimeTypeCode = reportTimeTypeCode.substr(0, reportTimeTypeCode.length-1);
                $scope[funName]('', $scope.cmReportYear, reportTimeTypeCode);
            }
            //重置
            $scope.resetFin = function () {
                $scope.cmReportType = {};
                $scope.cmReportYear = '3';
            }
            $scope.getFinincome = function(id, year, reportTimeTypeCode) {
                showLoading()
                serverService.getFinincome($scope.allData.id, year, reportTimeTypeCode)
                    .then(function (data) {
                        hideLoading()
                        $scope.allData.profitStatement = data;
                        data.forEach(function (i) {
                            i.TITLE = new Date(i.REPORTDATE).getFullYear()+'年'+i.REPORTTIMETYPE
                        })
                    }, function (err) {
                        $scope.$emit('rejectError', err)
                    })
            }
            $scope.getFinCashFlow = function(id, year, reportTimeTypeCode) {
                showLoading()
                serverService.getFinCashflow($scope.allData.id, year, reportTimeTypeCode)
                    .then(function (data) {
                        hideLoading()
                        $scope.allData.cashFlowStatement = data;
                        data.forEach(function (i) {
                            i.TITLE = new Date(i.REPORTDATE).getFullYear()+'年'+i.REPORTTIMETYPE
                        })
                    }, function (err) {
                        $scope.$emit('rejectError', err)
                    })
            }
             $scope.getFinCashFlowadd = function(id, year, reportTimeTypeCode) {
                showLoading()
                serverService.getFinCashflowadd($scope.allData.id, year, reportTimeTypeCode)
                    .then(function (data) {
                        hideLoading()
                        $scope.allData.cashFlowSupplement = data;
                        data.forEach(function (i) {
                            i.TITLE = new Date(i.REPORTDATE).getFullYear()+'年'+(i.REPORTTIMETYPE || i.DATASOURCE)
                        })
                    }, function (err) {
                        $scope.$emit('rejectError', err)
                    })
            }
            $scope.getFinBalance = function(id, year, reportTimeTypeCode) {
                showLoading()
                serverService.getFinBalance($scope.allData.id, year, reportTimeTypeCode)
                    .then(function (data) {
                        hideLoading()
                        $scope.allData.balanceSheet = data;
                        data.forEach(function (i) {
                            i.TITLE = new Date(i.REPORTDATE).getFullYear()+'年'+i.REPORTTIMETYPE
                        })
                    }, function (err) {
                        $scope.$emit('rejectError', err)
                    })
            }
            //切换展示更多
            $scope.toggleShowMore = function (item) {
                item.isShow = !item.isShow;
            }
            addClass(document.querySelector('.main_detail'),'main_detail_more');
            //信用管理页面去掉时间显示
            var pageWatch = $rootScope.$watch('title', function (nv, ov) {
                if(nv!='信用管理'){
                    removeClass(document.querySelector('.main_detail'),'main_detail_more');
                    $rootScope.isBondContentDetail = false;
                    pageWatch();
                }
            })
            $scope.$on('creditManagement', function (event, data) {
                $scope.allData = data.result;
                if($scope.allData.type === 'company'){
                    $scope.isCompany = true;
                }else {
                    $scope.isCompany = false;
                }
            })
        }])
})