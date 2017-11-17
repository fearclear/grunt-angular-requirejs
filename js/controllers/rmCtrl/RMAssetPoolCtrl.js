define(['app', 'storage'], function (app, storage) {
    return app.controller('RMAssetPoolCtrl',['$scope', '$rootScope', 'serverService', '$cookies', '$location', 'FileUploader', 'baseService',
        function ($scope, $rootScope, serverService, $cookies, $location, FileUploader) {
            $rootScope.pageNow = 'rmAssetPool';
            $rootScope.isPagination = false;
            $rootScope.title = '风险管理';
            $rootScope.name = '资产池管理';
            var token = ''
            if(storage.local.getItem(storage.KEY.USERINFO)){
                token = storage.local.getItem(storage.KEY.USERINFO).userId
            }
            var uploader = $scope.uploader = new FileUploader({
                url: 'http://192.168.0.169:9666/oa/uploadkq',
                headers: {
                  "x-basin-terminal": "PC",
                  "x-basin-version": "1",
                  "x-basin-token": token,
                }
            });
            // FILTERS
            uploader.filters.push({
                name: 'customFilter',
                fn: function(item /*{File|FileLikeObject}*/, options) {
                    return this.queue.length < 10;
                }
            });
            // CALLBACKS
            uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
                console.info('onWhenAddingFileFailed', item, filter, options);
            };
            uploader.onAfterAddingFile = function(fileItem) {
                console.info('onAfterAddingFile', fileItem);
            };
            uploader.onAfterAddingAll = function(addedFileItems) {
                console.info('onAfterAddingAll', addedFileItems);
            };
            uploader.onBeforeUploadItem = function(item) {
                console.info('onBeforeUploadItem', item);
            };
            uploader.onProgressItem = function(fileItem, progress) {
                console.info('onProgressItem', fileItem, progress);
            };
            uploader.onProgressAll = function(progress) {
                console.info('onProgressAll', progress);
            };
            uploader.onSuccessItem = function(fileItem, response, status, headers) {
                console.info('onSuccessItem', fileItem, response, status, headers);
            };
            uploader.onErrorItem = function(fileItem, response, status, headers) {
                console.info('onErrorItem', fileItem, response, status, headers);
            };
            uploader.onCancelItem = function(fileItem, response, status, headers) {
                console.info('onCancelItem', fileItem, response, status, headers);
            };
            uploader.onCompleteItem = function(fileItem, response, status, headers) {
                console.info('onCompleteItem', fileItem, response, status, headers);
            };
            uploader.onCompleteAll = function() {
                console.info('onCompleteAll');
            };

            console.info('uploader', uploader);


            // -------------------------------


            var controller = $scope.controller = {
                isImage: function(item) {
                    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                }
            };
        }])
})