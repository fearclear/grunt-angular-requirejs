define(['app', 'storage'], function (app, storage) {
  return app.controller('RMWindRuleCtrl', ['$scope', '$rootScope', 'serverService', '$cookies', '$location', '$timeout', 'ivhTreeviewBfs', 'baseService',
    function ($scope, $rootScope, serverService, $cookies, $location, $timeout, ivhTreeviewBfs) {
      $rootScope.pageNow = 'rmWindRule';
      $rootScope.isPagination = false;
      $rootScope.title = '风险管理';
      $rootScope.name = '风控规则';
      $scope.rmForm = {}
      $scope.rmFormS = {
        state: '100'
      }
      $scope.isEdit = {
        compareVolume: false,
        compareCost: false,
        compareModidura: false,
        compareLeveraging: false,
        notinBlack: false
      }
      $scope.gridOptions = {
        enableGridMenu: false,
        rowHeight: '42px',
        enableSelectAll: true,
        exporterMenuPdf: false, // ADD THIS
        exporterOlderExcelCompatibility: true,
        enableRowHeaderSelection: false,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        columnDefs: [
          { width: 50, enableColumnMenu: false, headerCellClass: 'align_center', field: 'index', displayName: '序号', cellClass: 'align_center', type: 'number', cellTemplate: '<div class="ui-grid-cell-contents">{{grid.getCellValue(row, col)}}</div>'},
          { width: 80, enableColumnMenu: false, headerCellClass: 'align_center', field: 'id', displayName: '风控编号', cellClass: 'align_center', type: 'number', cellTemplate: '<div class="ui-grid-cell-contents">{{grid.getCellValue(row, col)}}</div>'},
          { width: 200, enableColumnMenu: false, headerCellClass: 'align_center', field: 'ruleTypeName', displayName: '规则类型', cellClass: 'align_center', cellTemplate: '<div class="ui-grid-cell-contents " title={{row.entity.securityTypes}}>{{grid.getCellValue(row, col)}}</div>'},
          { width: '**', enableColumnMenu: false, headerCellClass: 'align_center', field: 'desc', displayName: '风控描述', cellClass: 'align_center', cellTemplate: '<div class="ui-grid-cell-contents " title={{row.entity.desc}}>{{grid.getCellValue(row, col)}}</div>'},
          { width: '**', enableColumnMenu: false, headerCellClass: 'align_center', field: 'fundName', displayName: '适用产品', cellClass: 'align_center', cellTemplate: '<div class="ui-grid-cell-contents " title={{row.entity.fundName}}>{{grid.getCellValue(row, col)}}</div>'},
          { width: '**', enableColumnMenu: false, headerCellClass: 'align_center', field: 'modifyTimeShow', displayName: '最后修改时间', cellClass: 'align_center', cellFilter: 'date: "yyyy-MM-dd"'},
          { width: 120, enableColumnMenu: false, headerCellClass: 'align_center', field: 'stateShow', displayName: '规则状态', cellClass: changeColor, cellTemplate: '<div class="ui-grid-cell-contents"><span class="state_child">{{grid.getCellValue(row, col)}}</span></div>'},
          { width: 160, enableColumnMenu: false, headerCellClass: 'align_center', field: 'handle', displayName: '操作', cellTemplate: '<div class="ui-grid-cell-contents main_color pointer align_center"><span><a href="javascript:;" class="main_color" ng-click="grid.appScope.showContent(row.entity, false)">查询</a></span><span style="margin-left: 10px"><a href="javascript:;" class="main_color"  ng-click="grid.appScope.showContent(row.entity, true)">修改</a></span><span style="margin-left: 10px"><a href="javascript:;" class="main_color"  ng-click="grid.appScope.changeState(row.entity)">{{row.entity.stateName}}</a></span><span style="margin-left: 10px"><a href="javascript:;" class="main_color"  ng-click="grid.appScope.delRule(row.entity)">删除</a></span></div>'},
        ],
        onRegisterApi: function (gridApi) {
          $scope.gridApi = gridApi;
          gridApi.core.on.columnVisibilityChanged($scope, function (changedColumn) {
            $scope.columnChanged = {name: changedColumn.colDef.name, visible: changedColumn.colDef.visible};
          });
        },
        enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
      };
      //状态样式
      function changeColor(grid, row) {
        if (row.entity.state) {
          return 'tm_state_normal_parent align_center'
        } else {
          return 'tm_state_pass_parent align_center'
        }
      }

      $scope.changeState = function (item) {
        $scope.$emit('chooseResult', {
          str: '确定' + item.stateName + '该规则吗？',
          cb: function () {
            if (item.state) {
              item.state = 0
            } else {
              item.state = 1
            }
            if (item.desc) {
              item.desc = encodeURIComponent(item.desc)
            }
            if (item.ratings) {
              item.ratings = encodeURIComponent(item.ratings)
            }
            showLoading()
            serverService.updateRcRule(item)
              .then(function () {
                hideLoading()
                $rootScope.errText = item.stateName + '成功';
                $rootScope.isError = true;
                getRcRule($scope.rmFormS.state, $scope.rmFormS.fundId, $scope.rmFormS.ruleType)
              }, function (err) {
                $scope.$emit('rejectError', err)
              })
          }
        })
      }
      //删除规则
      $scope.delRule = function (item) {
        $scope.$emit('chooseResult', {
          str: '确定删除该规则吗？',
          cb: function () {
            item.state = 2
            if (item.desc) {
              item.desc = encodeURIComponent(item.desc)
            }
            if (item.ratings) {
              item.ratings = encodeURIComponent(item.ratings)
            }
            serverService.updateRcRule(item)
              .then(function () {
                $rootScope.errText = '删除成功';
                $rootScope.isError = true;
                getRcRule($scope.rmFormS.state, $scope.rmFormS.fundId, $scope.rmFormS.ruleType)
              }, function (err) {
                $scope.$emit('rejectError', err)
              })
          }
        })
      }
      getRcRule(100)
      function getRcRule(state, fundId, ruleType) {
        showLoading()
        serverService.getRcRule(state, fundId, ruleType)
          .then(function (data) {
            hideLoading()
            var count = 0
            data.forEach(function (i) {
              i.index = ++count
              if (i.state) {
                i.stateShow = '关闭'
                i.stateName = '启用'
              } else {
                i.stateName = '停用'
                i.stateShow = '开启'
              }
              $scope.params.ruleType.forEach(function (t) {
                if (i.ruleType === t.id) {
                  i.ruleTypeName = t.label
                }
              })
              i.funds.forEach(function (t) {
                i.fundName += t.fundName + ';'
              })
              if (i.fundName) {
                i.fundName = i.fundName.replace('undefined', '')
              }
              if (i.modifyTime) {
                i.modifyTimeShow = new Date(i.modifyTime).Format('yyyy-MM-dd HH:mm')
              }
            })
            $scope.gridOptions.data = data
          }, function (err) {
            $scope.$emit('rejectError', err)
          })
      }

      $scope.addCtrl = function (flag) {
        $scope.isUpdate = false
        $scope.updateRule = false
        $scope.model = {
          securityTypes: [],
          fundIds: [],
          ratings: [],
          markets: [],
        }
        $scope.rmForm = {
          divisor: 'fundNet',
          confirm: '确认',
          state: true,
        }
        switch (flag) {
          case 1:
            $scope.isEdit.compareVolume = true
            $scope.rmForm.title = '数量控制规则配置'
            $scope.rmForm.ruleType = 'compareVolume'
            $scope.rmForm.compareThresholdType = '1'
            $scope.rmForm.compareDirection = '<'
            $scope.rmForm.compareType = $scope.rmForm.dividend = 'everyone'
            $scope.rmForm.divisor = 'issueAmount'
            break
          case 2:
            $scope.isEdit.compareCost = true
            $scope.rmForm.title = '成本控制规则配置'
            $scope.rmForm.ruleType = 'compareCost'
            $scope.rmForm.compareThresholdType = '1'
            $scope.rmForm.compareDirection = '<'
            $scope.rmForm.compareType = $scope.rmForm.dividend = 'everyone'
            break
          case 3:
            $scope.isEdit.compareModidura = true
            $scope.rmForm.title = '久期控制规则配置'
            $scope.rmForm.ruleType = 'compareModidura'
            $scope.rmForm.compareDirection = '<'
            break
          case 4:
            $scope.isEdit.compareLeveraging = true
            $scope.rmForm.title = '杠杆率控制规则配置'
            $scope.rmForm.ruleType = 'compareLeveraging'
            $scope.rmForm.compareDirection = '<'
            $scope.rmForm.compareThresholdType = '4'
            break
          case 5:
            $scope.isEdit.notinBlack = true
            $scope.rmForm.title = '投资标的黑名单规则配置'
            $scope.rmForm.ruleType = 'notinBlack'
            break
          default:
            break
        }
      }
      //展示详情
      $scope.showContent = function (item, flag) {
        if(!flag){
          $scope.isUpdate = true
          $scope.updateRule = false
          $scope.rmForm.confirm = '确认'
        }else {
          $scope.isUpdate = false
          $scope.updateRule = true
          $scope.rmForm.confirm = '修改'
          $scope.rmForm.title = '规则配置修改'
          $scope.rmForm.id = item.id
        }
        $scope.rmForm.ruleType = item.ruleType
        $scope.isEdit[item.ruleType] = true
        if (item.funds) {
          var tempId = []
          item.funds.forEach(function (i) {
            tempId.push({
              id: i.fundId + ''
            })
          })
          $scope.model.fundIds = tempId
        }
        if (item.compareType) {
          $scope.rmForm.dividend = item.compareType
        }
        if (item.compareDirection) {
          $scope.rmForm.compareDirection = item.compareDirection
        }
        if (item.dividend) {
          $scope.rmForm.dividend = item.dividend
        }
        if (item.divisor === '1') {
          $scope.rmForm.compareThresholdNumber = item.compareThreshold / 10000
          $scope.rmForm.compareThresholdType = '2'
        } else {
          $scope.rmForm.compareThresholdShow = item.compareThreshold * 100
          if (item.ruleType === 'compareCost') {
            $scope.rmForm.compareThresholdType = '1'
          } else {
            $scope.rmForm.compareThresholdType = '4'
          }
        }
        if (item.ruleType === 'compareModidura') {
          $scope.rmForm.compareThreshold = item.compareThreshold
        } else if (item.ruleType === 'compareLeveraging') {
          $scope.rmForm.compareThresholdType = '4'
          $scope.rmForm.compareThresholdShow = item.compareThreshold * 100
        }
        if (item.securityTypes) {
          var tempSecurityTypes = []
          var tempSecurityList = item.securityTypes.split(',')
          tempSecurityList.forEach(function (i) {
            if (i) {
              tempSecurityTypes.push({
                id: i
              })
            }
          })
          $scope.model.securityTypes = tempSecurityTypes
        }
        if (item.markets) {
          var tempMarkets = []
          var tempMarketsList = item.markets.split(',')
          tempMarketsList.forEach(function (i) {
            if (i) {
              tempMarkets.push({
                id: i
              })
            }
          })
          $scope.model.markets = tempMarkets
        }
        if (item.ratings) {
          var tempRatings = []
          var tempRatingsList = item.ratings.split(',')
          tempRatingsList.forEach(function (i) {
            if (i) {
              tempRatings.push({
                id: i
              })
            }
          })
          $scope.model.ratings = tempRatings
        }
        if (item.divisor) {
          $scope.rmForm.divisor = item.divisor
        }
        //设置查看是是否选中
        if (item.state) {
          $scope.rmForm.state = false
        } else {
          $scope.rmForm.state = true
        }
        if (item.desc) {
          $scope.rmForm.desc = item.desc
        }
      }
      var firstClick = true
      $scope.subEdit = function () {
        if (firstClick) {
          firstClick = false
          if ($scope.isUpdate) {
            $scope.isEdit = {
              compareVolume: false,
              compareCost: false,
              compareModidura: false,
              compareLeveraging: false,
              notinBlack: false
            }
            return
          }
          var formData = {}
          formData.id = $scope.rmForm.id || ''
          var tempIds = ''
          $scope.model.fundIds.forEach(function (i) {
            tempIds += i.id + ','
          })
          formData.fundIds = tempIds
          formData.ruleType = $scope.rmForm.ruleType
          formData.compareType = $scope.rmForm.dividend || ''
          formData.dividend = $scope.rmForm.dividend || ''
          formData.compareDirection = $scope.rmForm.compareDirection || ''
          formData.divisor = $scope.rmForm.divisor || 1
          formData.compareThreshold = $scope.rmForm.compareThreshold
          switch ($scope.rmForm.compareThresholdType) {
            case '1':
              formData.compareThreshold = $scope.rmForm.compareThresholdShow / 100
              break;
            case '2':
              formData.compareThreshold = $scope.rmForm.compareThresholdNumber * 10000
              formData.divisor = 1
              break;
            case '3':
              formData.compareThreshold = 1
              $scope.rmForm.state = false
              break;
            case '4':
              formData.compareThreshold = $scope.rmForm.compareThresholdShow / 100
              break;
            default:
              break;
          }
          formData.compareThreshold = formData.compareThreshold || 0
          var tempSecurityTypes = ''
          $scope.model.securityTypes.forEach(function (i) {
            tempSecurityTypes += i.id + ','
          })
          formData.securityTypes = tempSecurityTypes
          var tempMarkets = ''
          $scope.model.markets.forEach(function (i) {
            tempMarkets += i.id + ','
          })
          formData.markets = tempMarkets
          var tempRatings = ''
          $scope.model.ratings.forEach(function (i) {
            tempRatings += i.id + ','
          })
          formData.ratings = tempRatings ? encodeURIComponent(tempRatings) : ''
          formData.state = $scope.rmForm.state ? 0 : 1
          formData.desc = $scope.rmForm.desc ? encodeURIComponent($scope.rmForm.desc) : ''
          if (!formData.fundIds) {
            showErrorTip('请至少选择一个产品')
            return
          }
          switch (formData.ruleType) {
            case 'compareVolume':
              if (!formData.compareThreshold) {
                showErrorTip('请输入比例')
                return
              }
              break
            case 'compareCost':
              if (!formData.compareThreshold) {
                showErrorTip('请输入比例或金额')
                return
              }
              break
            case 'notinBlack':
              break
            case 'compareLeveraging':
              if (!formData.compareThreshold) {
                showErrorTip('请输入杠杆率')
                return
              }
              formData.compareType = 'leveraging'
              break
            case 'compareModidura':
              if (!formData.compareThreshold) {
                showErrorTip('请输入久期年限')
                return
              }
              formData.compareType = 'modidura'
              break
            default:
              break
          }
          if($scope.updateRule){
            serverService.updateRcRule(formData)
              .then(function () {
                firstClick = true
                $scope.isEdit = {
                  compareVolume: false,
                  compareCost: false,
                  compareModidura: false,
                  compareLeveraging: false,
                  notinBlack: false
                }
                showErrorTip('修改成功')
                getRcRule($scope.rmFormS.state, $scope.rmFormS.fundId, $scope.rmFormS.ruleType)
              }, function (err) {
                firstClick = true
                $scope.$emit('rejectError', err)
              })
          }else {
            serverService.addRcRule(formData)
              .then(function () {
                firstClick = true
                $scope.isEdit = {
                  compareVolume: false,
                  compareCost: false,
                  compareModidura: false,
                  compareLeveraging: false,
                  notinBlack: false
                }
                showErrorTip('添加成功')
                getRcRule($scope.rmFormS.state, $scope.rmFormS.fundId, $scope.rmFormS.ruleType)
              }, function (err) {
                firstClick = true
                $scope.$emit('rejectError', err)
              })
          }
          function showErrorTip(str) {
            firstClick = true
            $rootScope.isError = true
            $rootScope.errText = str
          }
        }
      }

      $scope.cancelEdit = function () {
        $scope.isEdit = {
          compareVolume: false,
          compareCost: false,
          compareModidura: false,
          compareLeveraging: false,
          notinBlack: false
        }
      };
      //查询
      $scope.search = function () {
        getRcRule($scope.rmFormS.state, $scope.rmFormS.fundId, $scope.rmFormS.ruleType)
      }
      /*
       $scope.selectByGroupSettings = {
       groupByTextProvider: function(groupValue) {
       if (groupValue === 'M') {
       return 'Male';
       } else {
       return 'Female';
       }
       },
       groupBy: 'gender',
       };*/
      /***********************************数据模块****************************************/
      //初始化数组
      $scope.model = {
        securityTypes: [],
        fundIds: [],
        ratings: [],
        markets: [],
      }
      //初始化数据
      $scope.params = {
        //比较方向
        compareDirection: [
          {disabled: $scope.isUpdate, id: '<', label: '小于'},
          {disabled: $scope.isUpdate, id: '>', label: '大于'},
          {disabled: $scope.isUpdate, id: '<=', label: '小于等于'},
          {disabled: $scope.isUpdate, id: '>=', label: '大于等于'},
          {disabled: $scope.isUpdate, id: '!=', label: '不等于'}
        ],
        //控制方式
        compareType: [
          {disabled: $scope.isUpdate, id: 'everyone', label: '单一债券'},
          {disabled: $scope.isUpdate, id: 'groupIssuer', label: '单一主体'},
          {disabled: $scope.isUpdate, id: 'groupSecurityTypes', label: '指定类型'},
          {disabled: $scope.isUpdate, id: 'groupRatings', label: '指定评级'}
        ],
        //分子类型
        dividend: [
          {id: 'everyone', label: '单一债券'},
          {id: 'groupIssuer', label: '单一主体'},
          {id: 'groupSecurityTypes', label: '指定类型'},
          {id: 'groupRatings', label: '指定评级'}
        ],
        //ruleType
        ruleType: [
          {id: 'compareVolume', label: '数量控制'},
          {id: 'compareCost', label: '成本控制'},
          {id: 'compareModidura', label: '久期控制'},
          {id: 'compareLeveraging', label: '杠杆率控制'},
          {id: 'notinBlack', label: '投资标的控制'},
        ],
        //状态
        state: [
          {id: '100', label: '全部'},
          {id: '1', label: '关闭'},
          {id: '0', label: '开启'},
        ],
        //投资标的
        securityTypes: [
          {id: '国债', label: '国债', group: '利率债'},
          {id: '地方政府债', label: '地方政府债', group: '利率债'},
          {id: '央行票据', label: '央行票据', group: '利率债'},
          {id: '金融债', label: '金融债', group: '利率债'},
          {id: '同业存单', label: '同业存单', group: '利率债'},
          {id: '企业债', label: '企业债', group: '信用债'},
          {id: '公司债', label: '公司债', group: '信用债'},
          {id: '中期票据', label: '中期票据', group: '信用债'},
          {id: '短期融资', label: '短期融资', group: '信用债'},
          {id: '超短融', label: '超短融', group: '信用债'},
          {id: '非公开定向', label: '非公开定向', group: '非公开'},
          {id: '中小型私募', label: '中小型私募', group: '非公开'},
          {id: '资产支持证券(ABS)', label: '资产支持证券(ABS)', group: '非公开'},
          {id: '资产支持票据(ABN)', label: '资产支持票据(ABN)', group: '非公开'},
        ],
        //更多
        securityTypesMore: [
          {id: '国债', label: '国债', group: '利率债'},
          {id: '地方政府债', label: '地方政府债', group: '利率债'},
          {id: '央行票据', label: '央行票据', group: '利率债'},
          {id: '金融债', label: '金融债', group: '利率债'},
          {id: '同业存单', label: '同业存单', group: '利率债'},
          {id: '企业债', label: '企业债', group: '信用债'},
          {id: '公司债', label: '公司债', group: '信用债'},
          {id: '中期票据', label: '中期票据', group: '信用债'},
          {id: '短期融资', label: '短期融资', group: '信用债'},
          {id: '超短融', label: '超短融', group: '信用债'},
          {id: '非公开定向', label: '非公开定向', group: '非公开'},
          {id: '中小型私募', label: '中小型私募', group: '非公开'},
          {id: '资产支持证券(ABS)', label: '资产支持证券(ABS)', group: '非公开'},
          {id: '资产支持票据(ABN)', label: '资产支持票据(ABN)', group: '非公开'},
          {id: '货币市场基金', label: '货币市场基金', group: '现金'},
          {id: '大额存单', label: '大额存单', group: '现金'},
          {id: '协议存单', label: '协议存单', group: '现金'},
          {id: '证券回购', label: '证券回购', group: '现金'},
          {id: '股票股票型基金', label: '股票股票型基金', group: '股票基金期货'},
          {id: '混合型基金', label: '混合型基金', group: '股票基金期货'},
          {id: '分级基金进取型', label: '分级基金进取型', group: '股票基金期货'},
          {id: '估值期货', label: '估值期货', group: '股票基金期货'},
          {id: '国债期货', label: '国债期货', group: '股票基金期货'},
          {id: '权证', label: '权证', group: '股票基金期货'},
        ],
        //分母类型
        divisor: [
          {id: 'fundNet', label: '产品净值'},
          {id: '1', label: '其他'},
        ],
        //分母类型
        divisorNumber: [
          {id: 'issueAmount', label: '单一债券发行量'},
          {id: '1', label: '其他'},
        ],
        //产品编号
        fundIds: getFundIds(),
        //投资标的评级
        ratings: [
          {id: 'A-', label: 'A-'},
          {id: 'A', label: 'A'},
          {id: 'A+', label: 'A+'},
          {id: 'AA-', label: 'AA-'},
          {id: 'AA', label: 'AA'},
          {id: 'AA+', label: 'AA+'},
          {id: 'AAA-', label: 'AAA-'},
          {id: 'AAA', label: 'AAA'},
          {id: 'AAA+', label: 'AAA+'},
          {id: '其他评级', label: '其他评级'},
        ],
        //市场
        markets: [
          {id: '1', label: '银行间'},
          {id: '2', label: '交易所'},
          {id: '3', label: '中证报价'},
        ]
      }
      //初始化控制
      $scope.ctrl = {
        fundIds: {
          enableSearch: true
        }
      }
      $scope.defaultText = {
        fundIds: {
          searchPlaceholder: '请输入产品名称...'
        }
      }
      function getFundIds() {
        var fundIds = []
        if ($rootScope.fundNamesNormal) {
          fundIds = $rootScope.fundNamesNormal.slice()
          fundIds.forEach(function (i) {
            i.id = i.fundId;
            i.label = i.fundName;
            i.disabled = $scope.isUpdate;
          })
          storage.session.setItem(storage.KEY.RISKMANAGEMENT.WINDFUNDIDS, fundIds)
          return fundIds
        } else {
          fundIds = storage.session.getItem(storage.KEY.RISKMANAGEMENT.WINDFUNDIDS)
          return fundIds
        }
      }

      //键盘快捷键
      document.addEventListener('keydown', startEdit)
      function startEdit(ev) {
        if ($rootScope.pageNow !== 'rmWindRule') {
          document.removeEventListener('keydown', startEdit)
        } else if (ev.altKey) {
          switch (ev.keyCode) {
            case 49:
              $scope.addCtrl(1)
              break
            case 50:
              $scope.addCtrl(2)
              break
            case 51:
              $scope.addCtrl(3)
              break
            case 52:
              $scope.addCtrl(4)
              break
            case 53:
              $scope.addCtrl(5)
              break
            default:
              break
          }
        }
      }
    }])
})