define(['app'], function (app) {
  return app.controller('SRPositionReportCtrl', ['$scope', '$rootScope', 'serverService', '$cookies', '$location', 'baseService',
    function ($scope, $rootScope, serverService, $cookies, $location) {
      $rootScope.pageNow = 'srPositionReport';
      $rootScope.statistical.pageNow = $rootScope.pageNow;
      $rootScope.isPagination = true;
      $rootScope.title = '统计报表';
      $rootScope.name = '持仓报表';
      $rootScope.pageIndex = 1
      $scope.sr = {};
      getStatisticalReport();
      function getStatisticalReport(params) {
        showLoading();
        params = params?params:{}
        params = {
          pageIndex: params.pageIndex||$rootScope.pageIndex,
          pageSize: params.pageSize||10000,
          keyWord: params.keyWord||$scope.sr.mainName,
          dueDate: params.dueDate||$scope.sr.dueDate,
          industryOneCode: params.industryOneCode||$scope.sr.claireEmIndustryOne,
          industryTwoCode: params.industryTwoCode||$scope.sr.claireEmIndustryTwo,
          industryThreeCode: params.industryThreeCode||$scope.sr.claireEmIndustryThree,
          provinceCode: params.provinceCode||$scope.sr.province,
          valueDate: params.valueDate||$scope.sr.valueDate,
        }
        serverService.getClaireHoldingReport(params)
          .then(function (data) {
            $scope.gridOptions.data = data.listData;
            $rootScope.pageIndex = params.pageIndex;
            $rootScope.pageTotal = Math.ceil(data.totalCount / 17);
            $rootScope.totalCount = data.totalCount;
          }, function (err) {
            $scope.$emit('rejectError', err)
          })
      }

      var paginationOptions = {
        pageNumber: 1,
        pageSize: 17,
        sort: null
      };
      $scope.gridOptions = {
        enableGridMenu: true,
        rowHeight: '42px',
        enableSelectAll: true,
        exporterMenuPdf: false, // ADD THIS
        exporterOlderExcelCompatibility: true,
        enableRowHeaderSelection: false,
        exporterCsvFilename: '持仓报表.csv',
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        columnDefs: [
          {
            enableColumnMenu: false,
            headerCellClass: 'align_center',
            field: 'productName',
            displayName: '债券简称',
            cellClass: 'align_center'
          },
          {
            enableColumnMenu: false,
            headerCellClass: 'align_center',
            field: 'companyName',
            displayName: '主体名称',
            cellClass: 'align_center',
          },
          {
            enableColumnMenu: false,
            headerCellClass: 'align_center',
            field: 'companyOutGrade',
            displayName: '外部评级',
            cellClass: 'align_center',
          },
          {
            enableColumnMenu: false,
            headerCellClass: 'align_center',
            field: 'companyOutGradeDate',
            displayName: '评级日期',
            cellClass: 'align_center',
          },
          {
            enableColumnMenu: false,
            headerCellClass: 'align_center',
            field: 'companyOutGradeName',
            displayName: '评级机构',
            cellClass: 'align_center',
          },
          {
            enableColumnMenu: false,
            headerCellClass: 'align_center',
            field: 'companyLanShiScore',
            displayName: '内部评分',
            cellClass: 'align_center',
          },
          {
            enableColumnMenu: false,
            headerCellClass: 'align_center',
            field: 'productNumber',
            displayName: '持仓数量',
            cellFilter: 'number: 0',
            cellClass: 'number_type',
            type: 'number'
          },
          {
            enableColumnMenu: false,
            headerCellClass: 'align_center',
            field: 'dueDate',
            displayName: '到期时间',
            cellClass: 'align_center',
          },
          {
            enableColumnMenu: false,
            headerCellClass: 'align_center',
            field: 'buyredemDate',
            displayName: '回售日期',
            cellClass: 'align_center',
          },
          {
            enableColumnMenu: false,
            headerCellClass: 'align_center',
            field: 'companyType',
            displayName: '企业类型',
            cellClass: 'align_center'
          },
          {
            enableColumnMenu: false,
            headerCellClass: 'align_center',
            field: 'province',
            displayName: '省份',
            cellClass: 'align_center'
          },
          {
            enableColumnMenu: false,
            headerCellClass: 'align_center',
            field: 'city',
            displayName: '地区',
            cellClass: 'align_center'
          },
          {
            enableColumnMenu: false,
            headerCellClass: 'align_center',
            field: 'industryOne',
            displayName: '一级行业',
            cellClass: 'align_center'
          },
          {
            enableColumnMenu: false,
            headerCellClass: 'align_center',
            field: 'industryTwo',
            displayName: '二级行业',
            cellClass: 'align_center'
          },
          {
            enableColumnMenu: false,
            headerCellClass: 'align_center',
            field: 'industryThree',
            displayName: '三级行业',
            cellClass: 'align_center'
          },
        ],
        onRegisterApi: function (gridApi) {
          $scope.gridApi = gridApi;
          gridApi.core.on.columnVisibilityChanged($scope, function (changedColumn) {
            $scope.columnChanged = {name: changedColumn.colDef.name, visible: changedColumn.colDef.visible};
          });
          $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
            if (sortColumns.length == 0) {
              paginationOptions.sort = null;
            } else {
              paginationOptions.sort = sortColumns[0].sort.direction;
            }
          });
          gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
            paginationOptions.pageNumber = newPage;
            $rootScope.pageIndex = newPage;
            paginationOptions.pageSize = pageSize;
          });
        },
        enablePaginationControls: false,
        paginationPageSize: 17,
        enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
      };
      //三级联动
      $scope.chooseTwo = function () {
        $scope.claireSREmIndustryTwos = $scope.claireSREmIndustryThrees = '';
        serverService.getClaireEmIndustryTwo($scope.sr.claireEmIndustryOne)
          .then(function (data) {
            $scope.claireSREmIndustryTwos = data;
          }, function (err) {
            $scope.$emit('rejectError', err)
          })
      }
      $scope.chooseThree = function () {
        $scope.claireSREmIndustryThrees = '';
        serverService.getClaireEmIndustryThree($scope.sr.claireEmIndustryTwo)
          .then(function (data) {
            $scope.claireSREmIndustryThrees = data;
          }, function (err) {
            $scope.$emit('rejectError', err)
          })
      }
      //查询和重置
      $scope.searchMain = function () {
        getStatisticalReport();
      }
      $scope.resetMain = function () {
        $scope.sr = {};
      }

      //分页插件通信
      $scope.$on('srPositionReport', function (ev, data) {
        $scope.gridApi.pagination.seek(+data.pageIndex)
      });
    }])
})