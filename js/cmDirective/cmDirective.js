/**
 * cmDirective
 */
define(['app'], function (app) {
    return app
        .directive('cmProfile', ['serverService', '$rootScope', function (serverService, $rootScope) {
            return {
                restrict: 'AE',
                templateUrl: 'js/cmDirective/cmProfile.html',
                link: function (scope, element, attr, ngModel) {
                    //添加关注
                    scope.addAttentionCompany = function (EID, type) {
                        if (scope.allData.information.concern == 'true') {
                            return;
                        }
                        switch (type) {
                            case 'company':
                                var data = {
                                    code: EID
                                }
                                serverService.addConcernCompany(data)
                                    .then(function () {
                                        $rootScope.isError = true;
                                        $rootScope.errText = '关注成功';
                                        scope.allData.information.concern = 'true';
                                    }, function (err) {
                                        scope.$emit('rejectError', err)
                                    })
                                break;
                            case 'product':
                                var data = {
                                    code: EID
                                }
                                serverService.addConcernProduct(data)
                                    .then(function () {
                                        $rootScope.isError = true;
                                        $rootScope.errText = '关注成功';
                                        scope.allData.information.concern = 'true';
                                    }, function (err) {
                                        scope.$emit('rejectError', err)
                                    })
                                break;
                            default:
                                break;
                        }
                    }

                    //添加到蓝石评级
                    scope.showEditRating = function () {
                        if (scope.allData.information.lanshi == 'true') {
                            return;
                        }
                        scope.isEditRating = true;
                    }
                    //提交添加评级
                    scope.subEditRating = function () {
                        scope.cmRating.companyEID = scope.allData.id;
                        scope.cmRating.companyScoreNote = scope.cmRating.companyScoreNote || '';
                        scope.cmRating.companyNote = scope.cmRating.companyNote || '';
                        serverService.createMain(scope.cmRating)
                            .then(function () {
                                $rootScope.isError = true;
                                $rootScope.errText = '添加成功';
                                scope.cmRating = {};
                                scope.isEditRating = false;
                            }, function (err) {
                                scope.$emit('rejectError', err)
                            })
                    }
                    //取消添加评级
                    scope.cancelEditRating = function () {
                        scope.isEditRating = false;
                        scope.cmRating = {};
                    }
                }
            }
        }])
        .directive('cmQualification', ['serverService', '$rootScope', function (serverService, $rootScope) {
            return {
                restrict: 'AE',
                templateUrl: 'js/cmDirective/cmQualification.html',
                link: function (scope, element, attr, ngModel) {
                }
            }
        }])
        .directive('cmCreditLine', ['serverService', '$rootScope', function (serverService, $rootScope) {
            return {
                restrict: 'AE',
                templateUrl: 'js/cmDirective/cmCreditLine.html',
                link: function (scope, element, attr, ngModel) {

                }
            }
        }])
        .directive('cmFundsToChange', ['serverService', '$rootScope', function (serverService, $rootScope) {
            return {
                restrict: 'AE',
                templateUrl: 'js/cmDirective/cmFundsToChange.html',
                link: function (scope, element, attr, ngModel) {

                }
            }
        }])
        .directive('cmFundsToInvest', ['serverService', '$rootScope', function (serverService, $rootScope) {
            return {
                restrict: 'AE',
                templateUrl: 'js/cmDirective/cmFundsToInvest.html',
                link: function (scope, element, attr, ngModel) {

                }
            }
        }])
        .directive('cmHistoryRating', ['serverService', '$rootScope', function (serverService, $rootScope) {
            return {
                restrict: 'AE',
                templateUrl: 'js/cmDirective/cmHistoryRating.html',
                link: function (scope, element, attr, ngModel) {

                }
            }
        }])
        .directive('cmProfitStatement', ['serverService', '$rootScope', function (serverService, $rootScope) {
            return {
                restrict: 'AE',
                templateUrl: 'js/cmDirective/cmProfitStatement.html',
                link: function (scope, element, attr, ngModel) {

                }
            }
        }])
        .directive('cmCashFlowStatement', ['serverService', '$rootScope', function (serverService, $rootScope) {
            return {
                restrict: 'AE',
                templateUrl: 'js/cmDirective/cmCashFlowStatement.html',
                link: function (scope, element, attr, ngModel) {

                }
            }
        }])
        .directive('cmCashFlowSupplement', ['serverService', '$rootScope', function (serverService, $rootScope) {
            return {
                restrict: 'AE',
                templateUrl: 'js/cmDirective/cmCashFlowSupplement.html',
                link: function (scope, element, attr, ngModel) {

                }
            }
        }])
        .directive('cmBalanceSheet', ['serverService', '$rootScope', function (serverService, $rootScope) {
            return {
                restrict: 'AE',
                templateUrl: 'js/cmDirective/cmBalanceSheet.html',
                link: function (scope, element, attr, ngModel) {

                }
            }
        }])
        .directive('cmProductProfile', ['serverService', '$rootScope', function (serverService, $rootScope) {
            return {
                restrict: 'AE',
                templateUrl: 'js/cmDirective/cmProductProfile.html',
                link: function (scope, element, attr, ngModel) {

                }
            }
        }])
        .directive('cmProductHistoryRating', ['serverService', '$rootScope', function (serverService, $rootScope) {
            return {
                restrict: 'AE',
                templateUrl: 'js/cmDirective/cmProductHistoryRating.html',
                link: function (scope, element, attr, ngModel) {

                }
            }
        }])
})