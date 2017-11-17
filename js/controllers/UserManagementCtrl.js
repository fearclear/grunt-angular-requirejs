define(['app'], function (app) {
  return app.controller('UserManagementCtrl', ['$scope', '$rootScope', 'serverService', '$cookies', 'baseService',
    function ($scope, $rootScope, serverService, $cookies) {
      $rootScope.title = '系统设置';
      $rootScope.name = '人员管理';
      $rootScope.pageNow = 'userManagement';
      $rootScope.isPagination = false;
      $rootScope.itemTitle = [];
      $scope.user = {};
      getAllUser();
      $scope.gridOptions = {
        enableGridMenu: false,
        enableSelectAll: true,
        exporterMenuPdf: false, // ADD THIS
        rowHeight: '36',
        exporterOlderExcelCompatibility: true,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        columnDefs: [
          {
            width: 50,
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'index',
            displayName: '序号',
            cellClass: 'align_center',
            type: 'number'
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'loginName',
            displayName: '登录名',
            cellClass: 'align_center'
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'userName',
            displayName: '用户名',
            cellClass: 'align_center'
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'kqcode',
            displayName: '考勤机号码',
            cellClass: 'align_center'
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'email',
            displayName: '邮箱',
            cellClass: 'align_center'
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'fundName',
            displayName: '负责产品',
            cellClass: 'align_center'
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'authorityName',
            displayName: '权限名',
            cellClass: 'align_center'
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'organiz',
            displayName: '组织划分',
            cellClass: 'align_center'
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'mobilePhone',
            displayName: '手机号',
            cellClass: 'align_center'
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'hireDate',
            displayName: '入职时间',
            cellClass: 'align_center'
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'isQuitShow',
            displayName: '在职状态',
            cellClass: 'align_center'
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'handle',
            displayName: '操作',
            cellClass: 'main_color align_center',
            cellTemplate: '<div class="ui-grid-cell-contents main_color pointer"><span ng-click="grid.appScope.showEdit(\'edit\',row.entity)" style="margin-left: 10px"><a href="javascript:;" class="main_color">修改</a></span><span ng-click="grid.appScope.deleteUser(row.entity)" style="margin-left: 10px"><a href="javascript:;" style="color: red">删除</a></span></div>'
          },
        ],
        onRegisterApi: function (gridApi) {
          $scope.gridApi = gridApi;
          gridApi.core.on.columnVisibilityChanged($scope, function (changedColumn) {
            $scope.columnChanged = {name: changedColumn.colDef.name, visible: changedColumn.colDef.visible};
          });
        },
        enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
      };
      $scope.getUser = function (val) {
        getUser(val);
      }

      function getUser(val) {
        $scope.fuzzyName = '';
        if (val == '') {
          getAllUser();
        } else {
          getFunctionGroup(val);
        }
      }

      //获取所有用户
      function getAllUser() {
        showLoading()
        serverService.getAllUsers()
          .then(function (data) {
            hideLoading()
            var count = 0
            data.forEach(function (i) {
              i.index = ++count
              i.isQuitShow = i.isQuit === '0' ? '在职' : '离职';
            })
            $scope.gridOptions.data = data;
            $scope.delPutUsers = data;
          }, function (err) {
            hideLoading()
            if (err && err.text) {
              $rootScope.isError = true;
              $rootScope.errText = err.text;
            }
          })
      }

      //获取指定组用户
      function getFunctionGroup(val) {
        showLoading()
        serverService.getFunctionGroup(val)
          .then(function (data) {
            hideLoading()
            var count = 0
            data.forEach(function (i) {
              i.index = ++count
              i.isQuitShow = i.isQuit === '0' ? '在职' : '离职';
            })
            $scope.gridOptions.data = data;
            $scope.delPutUsers = data;
          }, function (err) {
            if (err && err.text) {
              $rootScope.isError = true;
              $rootScope.errText = err.text;
            }
          })
      }

      //模糊搜索
      var tempArr = [];

      function getUserByName(name) {
        $scope.umUser = '';
        tempArr.push(name);
        showLoading()
        serverService.getUserByName(name)
          .then(function (doc) {
            if (doc.key != tempArr[tempArr.length - 1]) {
              return;
            }
            var count = 0
            var data = doc.result
            data.forEach(function (i) {
              i.index = ++count
              i.isQuitShow = i.isQuit === '0' ? '在职' : '离职';
            })
            $scope.gridOptions.data = data;
            $scope.delPutUsers = data;
            tempArr = [];
          }, function (err) {
            $scope.$emit('rejectError', err)
          })
      }

      // 模糊查询
      $scope.fuzzySearch = function (name) {
        getUserByName(name);
      }
      //新增用户
      $scope.showEdit = function (flag, update) {
        $scope.tempList = {};
        $scope.isEdit = true;
        $scope.user = {
          kaoqinType: '1',
          organizLevel: '3',
          isQuit: '0',
        }
        switch (flag) {
          case 'add':
            $scope.isUpdate = false; //是否可修改
            $scope.user.title = '新增用户';
            $scope.user.confirm = '创建';
            break;
          case 'edit':
            $scope.isUpdate = true;
            $scope.user.title = '修改用户';
            $scope.user.confirm = '修改';
            $scope.user.userId = update.userId;
            $scope.user.loginName = update.loginName;
            $scope.user.userName = update.userName;
            $scope.user.mobilePhone = update.mobilePhone;
            $scope.user.email = update.email;
            $scope.user.hireDate = update.hireDate;
            $scope.user.organizLevel = update.organizLevel;
            $scope.user.kaoqinType = update.kaoqinType;
            $scope.user.kqcode = update.kqcode;
            $scope.user.isQuit = update.isQuit;
            break;
          default:
            break;
        }
      };
      serverService.getAllFunctionGroups()
        .then(function (data) {
          $scope.authorities = data;
          serverService.getAllOrganizGroups()
            .then(function (data) {
              $scope.ogAuthorities = data;
              $scope.params.authority_organiz = $scope.ogAuthorities.concat($scope.authorities)
            })
        })
      //删除用户
      $scope.deleteUser = function (item) {
        $scope.$emit('chooseResult', {
          str: '确认删除' + item.userName + '么？',
          cb: function () {
            serverService.delUser(item.userId).then(function () {
              $rootScope.errText = '删除成功';
              $rootScope.isError = true;
              doRefresh();
            }, function (err) {
              $scope.$emit('rejectError', err)
            });
          }
        })
      };
      //确认
      var isFirstClick = true;
      $scope.subEdit = function () {
        $scope.tempList = $scope.user
        $scope.tempList.isQuit = $scope.user.isQuit || '0';
        if(!$scope.tempList.topUserId){
          $rootScope.isError = true
          $rootScope.errText = '请选择上级'
          return
        }
        if(!$scope.tempList.crmAuthority){
          $rootScope.isError = true
          $rootScope.errText = '请选择crm权限'
          return
        }
        showLoading();
        if ($scope.tempList.userId) {
          serverService.updateUser($scope.tempList).then(function () {
            $rootScope.errText = '修改成功';
            $rootScope.isError = true;
            $scope.user = {};
            $scope.tempList = {};
            $scope.isEdit = false;
            doRefresh();
          });
        } else {
          serverService.addUser($scope.tempList).then(function () {
            $rootScope.errText = '创建成功';
            $rootScope.isError = true;
            $scope.user = {};
            $scope.tempList = {};
            $scope.isEdit = false;
            doRefresh();
          });
        }
      };
      //取消
      $scope.cancelEdit = function () {
        $scope.isEdit = false;
        $scope.user = {};
        $scope.tempList = {};
      };
      $scope.showMoreList = {};
      $scope.showMore = function (str) {
        $scope.showMoreList[str] = true;
      }
      $scope.cancelShowMore = function (str) {
        $scope.showMoreList[str] = false;
      }
      $scope.delPutAdd = function (userId, groupId) {
        serverService.addUserIntoGroup({userId: userId, groupId: groupId})
          .then(function () {
            $rootScope.errText = '添加成功';
            $rootScope.isError = true;
            $scope.showMoreList.user = false;
            doRefresh();
          }, function (err) {
            $scope.$emit('rejectError', err)
          })
      }
      $scope.delPutDel = function (userId, groupId) {
        serverService.delUserIntoGroup(groupId, userId)
          .then(function () {
            $rootScope.errText = '删除成功';
            $rootScope.isError = true;
            $scope.showMoreList.user = false;
            doRefresh();
          }, function (err) {
            $scope.$emit('rejectError', err)
          })
      }
      $scope.delPutAddFund = function (userId, fundId, fundName) {
        serverService.addUserIntoGroupFund({userId: userId, fundId: fundId, fundName: fundName})
          .then(function () {
            $rootScope.errText = '添加成功';
            $rootScope.isError = true;
            $scope.showMoreList.fund = false;
            doRefresh();
          }, function (err) {
            $scope.$emit('rejectError', err)
          })
      }
      $scope.delPutDelFund = function (userId, fundId) {
        serverService.delUserIntoGroupFund(userId, fundId, $scope.needFundName)
          .then(function () {
            $rootScope.errText = '删除成功';
            $rootScope.isError = true;
            $scope.showMoreList.fund = false;
            doRefresh();
          }, function (err) {
            $scope.$emit('rejectError', err)
          })
      }

      function doRefresh() {
        serverService.getTraders().then(function (data) {
          $rootScope.traderNames = data;
        }, function (err) {
          $scope.$emit('rejectError', err)
        });
        if ($scope.fuzzyName) {
          getUserByName($scope.fuzzyName);
        } else if ($scope.umUser) {
          getUser($scope.umUser);
        } else {
          getAllUser();
        }
      }

      $scope.params = {
        kaoqinType: [
          {id: '1', label: '8:30-17:00'},
          {id: '2', label: '9:00-17:30'},
        ],
        isQuit: [
          {id: '0', label: '在职'},
          {id: '1', label: '离职'},
        ],
        crmAuthority: [
          {id: 'boss', label: '管理员'},
          {id: 'transaction', label: '交易团队'},
          {id: 'sale', label: '渠道销售团队'},
        ],
        crmOrganiz: [
          {id: 'oa', label: 'OA'},
          {id: 'clientManager', label: '客户经理'},
          {id: 'centerTrader', label: '交易中台'},
          {id: 'admin', label: '管理员'},
        ],
        authority_organiz: []
      }
    }])
})