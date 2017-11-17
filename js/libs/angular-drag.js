/*! angular-drag@0.0.1-beta | https://github.com/aui/angular-drag */
!function (t) {
    function e(o) {
        if (n[o])return n[o].exports;
        var r = n[o] = {exports: {}, id: o, loaded: !1};
        return t[o].call(r.exports, r, r.exports, e), r.loaded = !0, r.exports
    }

    var n = {};
    return e.m = t, e.c = n, e.p = "", e(0)
}([function (t, e, n) {
    "use strict";
    var o = n(1), r = n(2), i = r.module("angular-drag", []);
    i.directive("drag", function () {
        return {
            restrict: "A", link: function (t, e) {
                var n = e[0], r = n.querySelector("[drag-handle]");
                r || new o(n)
            }
        }
    }), i.directive("dragHandle", function () {
        return {
            restrict: "A", link: function (t, e) {
                for (var n = e[0]; !n.hasAttribute("drag");)n = n.parentNode;
                e.on(o.START, function (t) {
                    new o(n, t), t.preventDefault()
                })
            }
        }
    })
}, function (t, e, n) {
    "use strict";
    function o() {
    }

    function r() {
        return !1
    }

    function i(t, e, n) {
        return t ? new i.create(t, e, n) : (this.start = s.proxy(this.start, this), this.move = s.proxy(this.move, this), void(this.end = s.proxy(this.end, this)))
    }

    var s = n(3), u = s(window), c = s(document), a = "createTouch" in document, d = document.documentElement, h = !("minWidth" in d.style), f = !h && "onlosecapture" in d, l = "setCapture" in d, p = {
        start: a ? "touchstart" : "mousedown",
        move: a ? "touchmove" : "mousemove",
        end: a ? "touchend" : "mouseup"
    }, m = 0, v = a ? function (t, e) {
        return (t.touches || t.originalEvent.touches)[e]
    } : function (t) {
        return t
    }, x = function () {
        var t = document.createElement("div"), e = "Khtml Ms O Moz Webkit".split(" "), n = e.length;
        return function (o) {
            if (o in t.style)return o;
            for (o = o.replace(/^[a-z]/, function (t) {
                return t.toUpperCase()
            }); n--;)if (e[n] + o in t.style)return e[n] + o;
            return null
        }
    }(), g = x("transform");
    i.prototype = {
        constructor: i, start: function (t) {
            return this.touchId = m, t = v(t, m), m++, this.target = s(t.target), c.on("selectstart", r).on("dblclick", this.end), f ? this.target.on("losecapture", this.end) : u.on("blur", this.end), l && this.target[0].setCapture(), c.on(p.move, this.move).on(p.end, this.end), this.onstart(t), !1
        }, move: function (t) {
            return t = v(t, this.touchId), this.onmove(t), !1
        }, end: function (t) {
            return this.touchId = m, t = v(t, m), m--, c.off("selectstart", r).off("dblclick", this.end), f ? this.target.off("losecapture", this.end) : u.off("blur", this.end), l && this.target[0].releaseCapture(), c.off(p.move, this.move).off(p.end, this.end), this.onend(t), !1
        }
    }, i.create = function (t, e, n) {
        var o, r, a, d, h, f, l, p, m, v, x = s(t), y = this, T = new i;
        "undefined" == typeof n && (n = !!g), this.GPU = n, T.onstart = function (e) {
            var n = "BODY" === t.parentNode.nodeName ? c : x.offsetParent(), i = "fixed" === x.css("position"), s = x.position(), g = u.width(), T = u.height(), w = n.scrollLeft(), A = n.scrollTop(), M = n.width(), b = n.height(), P = x.outerWidth(), U = x.outerHeight(), k = s.left, E = s.top;
            y.GPU ? (a = i ? -k : -k - w, d = i ? -E : -E - A, h = i ? g - P - k : M - P - k, f = i ? T - U - E : b - U - E, o = 0, r = 0, l = k, p = E) : (a = 0, d = 0, h = i ? g - P + a : M - P, f = i ? T - U + d : b - U, o = l = k, r = p = E), m = e.clientX, v = e.clientY, y.onstart(e)
        }, T.onmove = function (e) {
            var n = t.style;
            y.GPU ? (o = e.clientX - m, r = e.clientY - v) : (o = e.clientX - m + l, r = e.clientY - v + p), y.GPU ? n[g] = "translate3d(" + o + "px, " + r + "px, 0px)" : (n.left = o + "px", n.top = r + "px"), y.onmove(e)
        }, T.onend = function (e) {
            var n = t.style;
            y.GPU ? (n[g] = "", n.left = o + l + "px", n.top = r + p + "px") : (n.left = o + "px", n.top = r + "px"), y.onend(e)
        }, e ? T.start(e) : (x.on(i.START, T.start), this.destroy = function () {
            x.off(i.START, T.start)
        })
    }, i.START = p.start, i.MOVE = p.move, i.END = p.end, i.create.prototype = {
        constructor: i.create,
        onstart: o,
        onmove: o,
        onend: o,
        destroy: o
    }, t.exports = i
}, function (t, e) {
    t.exports = angular
}, function (t, e) {
    t.exports = jQuery
}]);
//# sourceMappingURL=angular-drag.js.map