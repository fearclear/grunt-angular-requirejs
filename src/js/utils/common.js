/*loading框*/
(function (w) {
    //自定义增删class
    w.hasClass = function (obj, cls) {
        return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    }

    w.addClass = function (obj, cls) {
        if (!this.hasClass(obj, cls)) obj.className += " " + cls;
    }

    w.removeClass = function (obj, cls) {
        if (hasClass(obj, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            obj.className = obj.className.replace(reg, ' ');
        }
    }

    w.toggleClass = function (obj,cls){
        if(hasClass(obj,cls)){
            removeClass(obj, cls);
        }else{
            addClass(obj, cls);
        }
    }
    //自定义格式化时间函数
    Date.prototype.Format=function(fmt) {
        var o = {
            "M+" : this.getMonth()+1, //月份
            "d+" : this.getDate(), //日
            "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
            "H+" : this.getHours(), //小时
            "m+" : this.getMinutes(), //分
            "s+" : this.getSeconds(), //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S" : this.getMilliseconds() //毫秒
        };
        var week = {
            "0" : "日",
            "1" : "一",
            "2" : "二",
            "3" : "三",
            "4" : "四",
            "5" : "五",
            "6" : "六"
        };
        if(/(y+)/.test(fmt)){
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        if(/(E+)/.test(fmt)){
            fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "星期" : "周") : "")+week[this.getDay()+""]);
        }
        for(var k in o){
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt;
    }

    //自定义loding
    w.showLoading = function(){
        if(document.querySelector('.showLoading')==null){
            var loadingBox = document.createElement('div');
            loadingBox.innerHTML = '<div class="loadingCircle" data-loader="circle"></div>';
            addClass(loadingBox, 'showLoading');
            document.body.appendChild(loadingBox);
            var scrollHeight = window.screen.availHeight;
            document.querySelector('.showLoading').style.height = scrollHeight + 'px';
            document.querySelector(".loadingCircle").style.top = '18rem';
        }
    }

    w.hideLoading = function(){
        if (document.querySelector(".showLoading")) {
            document.querySelector(".showLoading").parentNode.removeChild(document.querySelector(".showLoading"));
        }
    }

    // csv
    'use strict';
    /**
     * @name CSV
     * @namespace
     */
        // implemented as a singleton because JS is single threaded
    var CSV = {};
    CSV.RELAXED = false;
    CSV.IGNORE_RECORD_LENGTH = false;
    CSV.IGNORE_QUOTES = false;
    CSV.LINE_FEED_OK = true;
    CSV.CARRIAGE_RETURN_OK = true;
    CSV.DETECT_TYPES = true;
    CSV.IGNORE_QUOTE_WHITESPACE = true;
    CSV.DEBUG = false;

    CSV.COLUMN_SEPARATOR = ",";

    CSV.ERROR_EOF = "UNEXPECTED_END_OF_FILE";
    CSV.ERROR_CHAR = "UNEXPECTED_CHARACTER";
    CSV.ERROR_EOL = "UNEXPECTED_END_OF_RECORD";
    CSV.WARN_SPACE = "UNEXPECTED_WHITESPACE"; // not per spec, but helps debugging

    var QUOTE = "\"",
        CR = "\r",
        LF = "\n",
        SPACE = " ",
        TAB = "\t";

    // states
    var PRE_TOKEN = 0,
        MID_TOKEN = 1,
        POST_TOKEN = 2,
        POST_RECORD = 4;
    /**
     * @name CSV.parse
     * @function
     * @description rfc4180 standard csv parse
     * with options for strictness and data type conversion
     * By default, will automatically type-cast numeric an boolean values.
     * @param {String} str A CSV string
     * @return {Array} An array records, each of which is an array of scalar values.
     * @example
     * // simple
     * var rows = CSV.parse("one,two,three\nfour,five,six")
     * // rows equals [["one","two","three"],["four","five","six"]]
     * @example
     * // Though not a jQuery plugin, it is recommended to use with the $.ajax pipe() method:
     * $.get("csv.txt")
     *    .pipe( CSV.parse )
     *    .done( function(rows) {
     *        for( var i =0; i < rows.length; i++){
     *            console.log(rows[i])
     *        }
     *  });
     * @see http://www.ietf.org/rfc/rfc4180.txt
     */
    CSV.parse = function (str) {
        var result = CSV.result = [];
        CSV.offset = 0;
        CSV.str = str;
        CSV.record_begin();

        CSV.debug("parse()", str);

        var c;
        while( 1 ){
            // pull char
            c = str[CSV.offset++];
            CSV.debug("c", c);

            // detect eof
            if (c == null) {
                if( CSV.escaped )
                    CSV.error(CSV.ERROR_EOF);

                if( CSV.record ){
                    CSV.token_end();
                    CSV.record_end();
                }

                CSV.debug("...bail", c, CSV.state, CSV.record);
                CSV.reset();
                break;
            }

            if( CSV.record == null ){
                // if relaxed mode, ignore blank lines
                if( CSV.RELAXED && (c == LF || c == CR && str[CSV.offset + 1] == LF) ){
                    continue;
                }
                CSV.record_begin();
            }

            // pre-token: look for start of escape sequence
            if (CSV.state == PRE_TOKEN) {

                if ( (c === SPACE || c === TAB) && CSV.next_nonspace() == QUOTE ){
                    if( CSV.RELAXED || CSV.IGNORE_QUOTE_WHITESPACE ) {
                        continue;
                    }
                    else {
                        // not technically an error, but ambiguous and hard to debug otherwise
                        CSV.warn(CSV.WARN_SPACE);
                    }
                }

                if (c == QUOTE && ! CSV.IGNORE_QUOTES) {
                    CSV.debug("...escaped start", c);
                    CSV.escaped = true;
                    CSV.state = MID_TOKEN;
                    continue;
                }
                CSV.state = MID_TOKEN;
            }

            // mid-token and escaped, look for sequences and end quote
            if (CSV.state == MID_TOKEN && CSV.escaped) {
                if (c == QUOTE) {
                    if (str[CSV.offset] == QUOTE) {
                        CSV.debug("...escaped quote", c);
                        CSV.token += QUOTE;
                        CSV.offset++;
                    }
                    else {
                        CSV.debug("...escaped end", c);
                        CSV.escaped = false;
                        CSV.state = POST_TOKEN;
                    }
                }
                else {
                    CSV.token += c;
                    CSV.debug("...escaped add", c, CSV.token);
                }
                continue;
            }

            // fall-through: mid-token or post-token, not escaped
            if (c == CR ) {
                if( str[CSV.offset] == LF  )
                    CSV.offset++;
                else if( ! CSV.CARRIAGE_RETURN_OK )
                    CSV.error(CSV.ERROR_CHAR);
                CSV.token_end();
                CSV.record_end();
            }
            else if (c == LF) {
                if( ! (CSV.LINE_FEED_OK || CSV.RELAXED) )
                    CSV.error(CSV.ERROR_CHAR);
                CSV.token_end();
                CSV.record_end();
            }
            else if (c == CSV.COLUMN_SEPARATOR) {
                CSV.token_end();
            }
            else if( CSV.state == MID_TOKEN ){
                CSV.token += c;
                CSV.debug("...add", c, CSV.token);
            }
            else if ( c === SPACE || c === TAB) {
                if (! CSV.IGNORE_QUOTE_WHITESPACE )
                    CSV.error(CSV.WARN_SPACE );
            }
            else if( ! CSV.RELAXED ){
                CSV.error(CSV.ERROR_CHAR);
            }
        }
        return result;
    };

    CSV.json = function () {
        var s = new require('stream').Transform({objectMode: true})
        s._transform = function(chunk, encoding, done) {
            s.push(JSON.stringify(chunk.toString())+require('os').EOL)
            done()
        }
        return s
    }

    /**
     * @name CSV.stream
     * @function
     * @description stream a CSV file
     * @example
     * node -e "c=require('CSV-JS');require('fs').createReadStream('csv.txt').pipe(c.stream()).pipe(c.json()).pipe(process.stdout)"
     */
    CSV.stream = function () {
        var s = new require('stream').Transform({objectMode: true})
        s.EOL = '\n'
        s.prior = ""
        s.emitter = function(s) {
            return function(e) {
                s.push(CSV.parse(e+s.EOL))
            }
        }(s);

        s._transform = function(chunk, encoding, done) {
            var lines = (this.prior == "") ?
                chunk.toString().split(this.EOL) :
                (this.prior + chunk.toString()).split(this.EOL)
            this.prior = lines.pop();
            lines.forEach(this.emitter)
            done()
        }

        s._flush = function(done) {
            if (this.prior != "") {
                this.emitter(this.prior)
                this.prior = ""
            }
            done()
        }
        return s
    }

    CSV.reset = function () {
        CSV.state = null;
        CSV.token = null;
        CSV.escaped = null;
        CSV.record = null;
        CSV.offset = null;
        CSV.result = null;
        CSV.str = null;
    };

    CSV.next_nonspace = function () {
        var i = CSV.offset;
        var c;
        while( i < CSV.str.length ) {
            c = CSV.str[i++];
            if( !( c == SPACE || c === TAB ) ){
                return c;
            }
        }
        return null;
    };

    CSV.record_begin = function () {
        CSV.escaped = false;
        CSV.record = [];
        CSV.token_begin();
        CSV.debug("record_begin");
    };

    CSV.record_end = function () {
        CSV.state = POST_RECORD;
        if( ! (CSV.IGNORE_RECORD_LENGTH || CSV.RELAXED) && CSV.result.length > 0 && CSV.record.length !=  CSV.result[0].length ){
            CSV.error(CSV.ERROR_EOL);
        }
        CSV.result.push(CSV.record);
        CSV.debug("record end", CSV.record);
        CSV.record = null;
    };

    CSV.resolve_type = function (token) {
        if( token.match(/^\d+(\.\d+)?$/) ){
            token = parseFloat(token);
        }
        else if( token.match(/^(true|false)$/i) ){
            token = Boolean( token.match(/true/i) );
        }
        else if(token === "undefined" ){
            token = undefined;
        }
        else if(token === "null" ){
            token = null;
        }
        return token;
    };

    CSV.token_begin = function () {
        CSV.state = PRE_TOKEN;
        // considered using array, but http://www.sitepen.com/blog/2008/05/09/string-performance-an-analysis/
        CSV.token = "";
    };

    CSV.token_end = function () {
        if( CSV.DETECT_TYPES ) {
            CSV.token = CSV.resolve_type(CSV.token);
        }
        CSV.record.push(CSV.token);
        CSV.debug("token end", CSV.token);
        CSV.token_begin();
    };

    CSV.debug = function (){
        if( CSV.DEBUG )
            console.log(arguments);
    };

    CSV.dump = function (msg) {
        return [
            msg , "at char", CSV.offset, ":",
            CSV.str.substr(CSV.offset- 50, 50)
                .replace(/\r/mg,"\\r")
                .replace(/\n/mg,"\\n")
                .replace(/\t/mg,"\\t")
        ].join(" ");
    };

    CSV.error = function (err){
        var msg = CSV.dump(err);
        CSV.reset();
        throw msg;
    };

    CSV.warn = function (err){
        var msg = CSV.dump(err);
        try {
            console.warn( msg );
            return;
        } catch (e) {}

        try {
            console.log( msg );
        } catch (e) {}

    };

    (function(name, context, definition) {
            var define;
            if (typeof module != 'undefined' && module.exports) module.exports = definition();
            else if (typeof define == 'function' && typeof define.amd == 'object') define(definition);
            else context[name] = definition();
        }('CSV', Function('return this')(), function()
            { return CSV; }
        )
    );
})(window);