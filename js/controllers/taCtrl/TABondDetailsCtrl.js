define(['app'], function (app) {
  return app.controller('TABondDetailsCtrl', ['$scope', '$rootScope', 'serverService', '$cookies', 'baseService',
    function ($scope, $rootScope, serverService, $cookies) {
      $rootScope.pageNow = 'taBondDetails';
      $rootScope.pageIndex = '1';
      $rootScope.title = '国债账户';
      $rootScope.name = '利率债明细';
      $rootScope.isPagination = false;
      $scope.marketNames = [
        {
          code: '银行间',
          name: '银行间',
        },
        {
          code: '交易所',
          name: '交易所',
        },
        {
          code: '其他',
          name: '其他',
        }
      ]
      $scope.tkSearch = {
        keyword: '',
        market: ''
      }
      getAllBond()
      function getAllBond() {
        showLoading()
        serverService.getAllBond()
          .then(function (data) {
            hideLoading()
            var tempCount = 0;
            setCsv(data);
            data.forEach(function (i) {
              i.$$treeLevel = i.level;
              i.holding = +i.holding/100;
              i.sellRepoBond = +i.sellRepoBond/100;
              if(i.level === 0){
                i.fundName = i.sellRepoExpiredDate = null;
              }else if(i.level === 1){
                i.securityId = i.securityName = i.sellRepoExpiredDate = i.expireDays = i.industry = i.companyType = i.companyRating = null;
              }else if(i.level === 2){
                i.securityId = i.securityName = i.fundName = i.holding = i.expireDays = i.insdustry = i.companyType = i.companyRating = null;
              }
              if(i.sellRepoExpiredDate){
                i.sellRepoExpiredDate = new Date(i.sellRepoExpiredDate).Format('yyyy-MM-dd');
              }
            })
            var flag = true;
            $scope.gridOptions.data = data.filter(function (i) {
              if(/(国债|国开|农发|进出)/.test(i.securityName) && i.level === 0){
                flag = true;
                tempCount++;
                return i
              }
              if(i.level !== 0 && flag){
                return i
              }else {
                flag = false
              }
            });
            $scope.levelCount = tempCount;
            $scope.globalData = $scope.gridOptions.data.slice();
          }, function (err) {
            $scope.$emit('rejectError', err)
          })
      }
      $scope.filData = function () {
        if(!$scope.tkSearch.market && !$scope.tkSearch.keyword){
          $scope.gridOptions.data = $scope.globalData;
          return
        }
        var data = $scope.globalData.slice();
        var tempArr = [];
        var flag = true;
        var tempCount = 0;
        for(var i=0;i<data.length;i++){
          if(data[i].level && flag){
            tempArr.push(data[i]);
            continue;
          }else {
            if((new RegExp("^"+$scope.tkSearch.market).test(data[i].marketName) || !$scope.tkSearch.market) && ((new RegExp("^"+$scope.tkSearch.keyword).test(data[i].securityId) || (new RegExp($scope.tkSearch.keyword).test(data[i].securityName))) || !$scope.tkSearch.keyword)){
              tempArr.push(data[i]);
              flag = true;
              tempCount++;
            }else {
              flag = false;
            }
          }
        }
        $scope.levelCount = tempCount;
        $scope.gridOptions.data = tempArr;
      }
      //获取CSV
      function setCsv(data) {
        $scope.getArray = data.slice();
        var useFulLevel = []
        var count = 1;
        for(var i=0;i<$scope.getArray.length;i++){
          if($scope.getArray[i].level == 1){
            useFulLevel.push($scope.getArray[i]);
          }
        }
        useFulLevel.sort(function (a, b) {
          if(a.fundName>b.fundName){
            return 1
          }else if(a.fundName == b.fundName){
            return 0
          }else {
            return -1
          }
        })
        $scope.getArray = useFulLevel;
        var tempArr = [];
        if($scope.getArray && $scope.getArray.length){
          $scope.getArray.forEach(function (i) {
            tempArr.push({
              a: i.fundName,
              b: i.securityId,
              c: i.securityName,
              d: i.holding,
              e: i.sellRepoBond
            })
          })
          tempArr.unshift({
            'a': '产品名称',
            'b': '债券代码',
            'c': '债券简称',
            'd': '日初持仓',
            'e': '质押'
          })
        }
        $scope.getArray = tempArr;
      }
      $scope.gridOptions = {
        enableGridMenu: true,
        enableSorting: true,
        showTreeExpandNoChildren: false,
        exporterMenuPdf: false, // ADD THIS
        rowHeight: '42',
        exporterCsvFilename: '债券明细动态表.csv',
        exporterOlderExcelCompatibility: true,
        columnDefs: [
          { enableColumnMenu: false, field: 'securityId', displayName: '债券代码'},
          { enableColumnMenu: false, field: 'securityName', displayName: '债券名称'},
          { enableColumnMenu: false, field: 'fundName', displayName: '产品名称'},
          { enableColumnMenu: false, field: 'holding', cellFilter: 'number: 0', displayName: '日初持仓', cellClass: 'number_type', type: 'number'},
          { enableColumnMenu: false, field: 'sellRepoBond', cellFilter: 'number: 0', displayName: '质押', cellClass: 'number_type', type: 'number'},
          { enableColumnMenu: false, field: 'sellRepoExpiredDate', displayName: '质押到期日'},
          { enableColumnMenu: false, field: 'expireDays', displayName: '兑换日', cellClass: 'number_type'},
          { enableColumnMenu: false, field: 'industry', displayName: '行业'},
          { enableColumnMenu: false, field: 'companyType', displayName: '公司类型'},
          { enableColumnMenu: false, field: 'companyRating', displayName: '公司评级'},
          // { enableColumnMenu: false, field: 'marketName', displayName: '交易市场'},
        ],
        rowTemplate: "<div ng-dblclick=\"grid.appScope.showInfo(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>",
        onRegisterApi: function( gridApi ) {
          $scope.gridApi = gridApi;
          $scope.gridApi.treeBase.on.rowExpanded($scope, function(row) {

          });
          $scope.gridApi.core.on.columnVisibilityChanged( $scope, function( changedColumn ) {
            $scope.columnChanged = {name: changedColumn.colDef.name, visible: changedColumn.colDef.visible};
          });
        },
      };
      $scope.showInfo = function (row) {
        $scope.gridApi.treeBase.toggleRowTreeState(row);
      }
      document.addEventListener('keydown', pushFilData)
      function pushFilData(ev) {
        if(ev.keyCode===13 && $rootScope.pageNow==='TKBondDetails'){
          $scope.filData();
        }else if($rootScope.pageNow !== 'TKBondDetails'){
          document.removeEventListener('keydown', pushFilData);
        }
      }
    }])
})