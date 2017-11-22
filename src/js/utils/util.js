/**
 * 浏览器端数据存储的工具模块
 * session
 * local
 */
define(function () {

    return {
        KEY: {
            API: {
                url: 'http://192.168.0.188:9333/basin',
                // url: 'http://192.168.0.120:9333/basin',
                // url: 'http://192.168.1.188:9333/basin',
            },
            USERINFO: '__user-info__',
        },
        session : {
            //保存
            setItem : function(key, value) {
                //如果value是对象, 转换成对应的json
                if(value instanceof Object) {
                    value = JSON.stringify(value);
                }
                //保存
                sessionStorage.setItem(key, value)
            },
            //读取
            getItem : function(key) {
                var value = sessionStorage.getItem(key);
                //如果value是json对象/json数组, 解析成js对象/数组
                if(value!=null && /^[\{\[].*[\}\]]$/.test(value)) {
                    value = JSON.parse(value);
                }
                return value;
            },
            //删除
            removeItem : function(key) {
                sessionStorage.removeItem(key);
            },
            clearAll : function () {
                sessionStorage.clear();
            }
        },

        local : {
            //保存
            setItem : function(key, value) {
                //如果value是对象, 转换成对应的json
                if(value instanceof Object) {
                    value = JSON.stringify(value);
                }
                //保存
                localStorage.setItem(key, value)
            },
            //读取
            getItem : function(key) {
                var value = localStorage.getItem(key);
                //如果value是json对象/json数组, 解析成js对象/数组
                if(value!=null && /^[\{\[].*[\}\]]$/.test(value)) {
                    value = JSON.parse(value);
                }
                return value;
            },
            //删除
            removeItem : function(key) {
                localStorage.removeItem(key);
            },
            clearAll : function () {
                localStorage.clear();
            }
        },
        changeTheme: function(){
          var lightColor = '#ff6c00',
            normalColor = '#f9521e',
            deepColor = '#ef3900';
          setTimeout(function () {
            var style = '';
            $('.header_list').addClass('header_list_test')
            $('.aside_list').addClass('aside_list_test')
            $('.lg_banner').addClass('lg_banner_test')
            var nodeArr = [
              {node: '.header',type: 'background', value: lightColor},
              {node: '.header_list .header_list_active',type: 'background', value: deepColor},
              {node: '.aside_list .aside_list_active',type: 'background', value: lightColor},
              {node: '.tk_search_handle span',type: 'background', value: lightColor},
              {node: '.step-main .step-wrap .step-btn',type: 'background', value: lightColor},
              {node: '.cmSearch_handle span',type: 'background', value: lightColor},
              {node: '.common-search-part .common-btn',type: 'background', value: lightColor},
              {node: '.tmOwn_addNew',type: 'background', value: lightColor},
              {node: '.tm_confirm',type: 'background', value: lightColor},
              {node: '.errHandle_confirm',type: 'background', value: lightColor},
              {node: '.search_btn',type: 'background', value: lightColor},
              {node: '.vm_export',type: 'background', value: lightColor},
              {node: '.vm_addNew span',type: 'background', value: lightColor},
              {node: '.reset_btn',type: 'background', value: lightColor},
              {node: '.logo_wrap',type: 'background', value: lightColor},
              {node: '.lg_submit',type: 'background', value: lightColor},
              {node: '.errTitle',type: 'background', value: lightColor},
              {node: '.pagination_goPage',type: 'background', value: lightColor},
              {node: '.isToday:before',type: 'background', value: lightColor},
              {node: '.showBusinessState .table th:nth-child(n+6)',type: 'background', value: deepColor},
              {node: '.main_color',type: 'color', value: lightColor},
              {node: '.showBusinessState .table td:nth-child(n+6) .todo_header',type: 'color', value: deepColor},
              {node: '.tk_search_handle span',type: 'border', value: '1px solid '+lightColor},
              {node: '.search_btn',type: 'border', value: '1px solid '+lightColor},
              {node: '.reset_btn',type: 'border', value: '1px solid '+lightColor},
              {node: '.tm_confirm',type: 'border', value: '1px solid '+lightColor},
              {node: '.cmSearch_handle span',type: 'border', value: '1px solid '+lightColor},
              {node: '.vm_addNew span',type: 'border', value: '1px solid '+lightColor},
              {node: '[data-loader=\'circle\']',type: 'border', value: '4px solid '+lightColor},
              {node: '[data-loader=\'circle\']',type: 'border-top-color', value: 'transparent'},
            ]
            changeTheme(nodeArr)
            function changeTheme(nodeArr) {
              nodeArr.forEach(function (i, n) {
                style += i.node+'{'+i.type+':'+i.value+' !important}'
              })
            }
            $('#header_logo').attr('src', 'img/logo_test.png')
            $('#head').append('<style>'+style+'</style>')
          }, 20)
        }
    }
})