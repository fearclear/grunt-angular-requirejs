module.exports = function(grunt) {
    // 配置
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        requirejs : {
            build : {
                options : {
                    baseUrl : 'src',
                    name:'./js/main',    //主文件名字
                    optimize:'uglify',   //指定压缩工具类型  使用uglify工具压缩
                    mainConfigFile: './src/js/main.js',  //require 的主文件
                    out:'dist/all.js'       //压缩后的文件
                    //其他无需指定  本插件会自动寻找require引进的所有文件
                }
            }
        },
        concat : {
            css : {
                src : ['src/css/*.css'],
                dest : 'dist/index.css'
            }
        },
        cssmin : {
            buildCss : {
                src : 'dist/index.css',
                dest : 'dist/index.min.css'
            }
        },
        // watch : {
        //     alljs : {
        //         files :['frontend/styles/*.css'],
        //         tasks : ['concat', 'cssmin']
        //     },
        //     allcs : {
        //         files :['frontend/**/*.js'],
        //         tasks : ['requirejs']
        //     }
        // }
    });
    // 载入concat和uglify插件，分别对于合并和压缩
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-css');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-watch');  
    // 注册任务
    grunt.registerTask('default', ['concat', 'cssmin', 'requirejs']);
}; 