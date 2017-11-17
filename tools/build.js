({
  appDir: '../src',
  mainConfigFile: '../src/js/main.js',
  dir: '../built',
  optimizeCss: 'standard',
  paths: {
    //lib模块
    'angular': '../src/js/libs/angular.min',
    'angular-sanitize': '../src/js/libs/angular-sanitize.min',
    'angular-animate': '../src/js/libs/angular-animate.min',
    'angular-drag': '../src/js/libs/angular-drag',
    'angular-touch': '../src/js/libs/angular-touch.min',
    'uiGrid': '../src/js/libs/ui-grid.min',
    'jquery': '../src/js/libs/jquery.min',
    'router': '../src/js/libs/angular-ui-router.min',
    'ui-select': '../src/js/libs/select',
    'ui-bootstrap': '../src/js/libs/ui-bootstrap-tpls-2.5.0',

    //controllers
    'app': '../src/js/controllers/app',
    'LoginCtrl': '../src/js/controllers/LoginCtrl',
    //routes
    'appRoute': '../src/js/routes/appRoute',

    //factory
    'factory': '../src/js/factories/factory',

    //services
    'serverService': '../src/js/services/serverService',

    //util
    'storage': '../src/js/utils/util',
    'common': '../src/js/utils/common',
    'echarts': '../src/js/utils/echarts',
    'md5': '../src/js/utils/md5',
    'xlsx': '../src/js/utils/xlsx.full.min',

    //directive
  },
  shim: {
    'angular': {
      exports: 'angular',
      deps: ['jquery']
    },
    'angular-sanitize': {
      exports: 'angular-sanitize',
      deps: ['angular']
    },
    'angular-animate': {
      exports: 'angular-animate',
      deps: ['angular']
    },
    'angular-touch': {
      exports: 'angular-touch',
      deps: ['angular']
    },
    'angular-drag': {
      exports: 'angular-drag',
      deps: ['angular', 'jquery']
    },
    'ui-bootstrap': {
      exports: 'ui-bootstrap',
      deps: ['angular']
    },
    'uiGrid': {
      exports: 'uiGrid',
      deps: ['angular']
    },
    'router': {
      exports: 'router',
      deps: ['angular']
    },
    'ui-select': {
      exports: 'ui-select',
      deps: ['jquery', 'angular']
    },
  },
  modules: []
})