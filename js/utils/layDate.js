/**
 * 时间控件模块，引入laydate并对其进行处理(layDate.js不是layDate源文件，修改过)
 */
define(['app'], function (app) {
    return app.directive('autoFocus', function () {
        return function (scope, element) {
            element[0].focus();
        }
    }).directive('defLaydate', function () {
        return {
            require: '?ngModel',
            restrict: 'A',
            scope: {
                ngModel: '='
            },
            link: function (scope, element, attr, ngModel) {
                var _date = null, _config = {};

                // 初始化参数
                _config = {
                    elem: '#' + attr.id,
                    format: attr.format != undefined && attr.format != '' ? attr.format : 'YYYY-MM-DD',
                    max: attr.hasOwnProperty('maxDate') ? attr.maxDate : '',
                    min: attr.hasOwnProperty('minDate') ? attr.minDate : '',
                    choose: function (data) {
                        scope.$apply(setViewValue);
                    },
                    clear: function () {
                        ngModel.$setViewValue(null);
                    }
                };
                // 初始化
                // _date = laydate(_config);
                if(attr.hasOwnProperty('initTomorrow')){
                  element.val(new Date(new Date().getTime()+86400000).Format('yyyy-MM-dd'));
                }
                if(attr.hasOwnProperty('initToday')){
                    element.val((new Date()).Format('yyyy-MM-dd'));
                }
                if(attr.hasOwnProperty('initYesterday')){
                    element.val(new Date(new Date().getTime()-86400000).Format('yyyy-MM-dd'));
                }
                element.on('click', function () {
                    laydate('',function () {
                        scope.$apply(setViewValue);
                    });
                })
                // 模型值同步到视图上
                ngModel.$render = function () {
                    element.val(ngModel.$viewValue || '');
                };

                // 监听元素上的事件
                /*element.on('blur keyup change input', function () {
                 scope.$apply(setViewValue);
                 });*/

                setViewValue();

                // 更新模型上的视图值
                function setViewValue() {
                    var val = element.val();
                    ngModel.$setViewValue(val);
                }
            }
        }
    })
})