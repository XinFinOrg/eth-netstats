! function(t) {
    "use strict";
    var a = function() {};
    a.prototype.createStackedChart = function(a, e, r, t, n, i) {
        Morris.Bar({
            element: a,
            data: e,
			xkey: r,
            ykeys: t,
			axes:false,
			//preUnits: "$",
            barSizeRatio: .5,
            stacked: !0,
            labels: n,
            hideHover: "auto",
            resize: !0,
            gridLineColor: "#eeeeee",
            barColors: i
        })
    }, a.prototype.createAreaChart = function(a, e, r, t, n, i, l, o) {
        Morris.Area({
            element: a,
            pointSize: 3,
            lineWidth: 2,
            data: t,
            xkey: n,
            ykeys: i,
            labels: l,
            resize: !0,
            hideHover: "auto",
            gridLineColor: "#29b348",
            lineColors: o,
            fillOpacity: .1,
            xLabelMargin: 10,
            yLabelMargin: 10,
            grid: !1,
            axes: !1,
            pointSize: 0
        })
    }, a.prototype.init = function() {
        if (t("#world-map-markers").vectorMap({
                map: "world_mill_en",
                scaleColors: ["#3263aa", "#3263aa"],
                normalizeFunction: "polynomial",
                hoverOpacity: .7,
                hoverColor: !1,
                regionStyle: {
                    initial: {
                        fill: "#b2c2da"
                    }
                },
                markerStyle: {
                    initial: {
                        r: 9,
                        fill: "#3263aa",
                        "fill-opacity": .9,
                        stroke: "#fff",
                        "stroke-width": 5,
                        "stroke-opacity": .4
                    },
                    hover: {
                        stroke: "#fff",
                        "fill-opacity": 1,
                        "stroke-width": 1.5
                    }
                },
                backgroundColor: "#FFFFFF",
                markers: [{
                    latLng: [7.11, 171.06],
                    name: "Marshall Islands"
                }, {
                    latLng: [17.3, -62.73],
                    name: "Saint Kitts and Nevis"
                }, {
                    latLng: [3.2, 73.22],
                    name: "Maldives"
                }, {
                    latLng: [35.88, 14.5],
                    name: "Malta"
                }, {
                    latLng: [12.05, -61.75],
                    name: "Grenada"
                }, {
                    latLng: [13.16, -61.23],
                    name: "Saint Vincent and the Grenadines"
                }, {
                    latLng: [13.16, -59.55],
                    name: "Barbados"
                }, {
                    latLng: [-4.61, 55.45],
                    name: "Seychelles"
                }, {
                    latLng: [14.01, -60.98],
                    name: "Saint Lucia"
                }, {
                    latLng: [1.3, 103.8],
                    name: "Singapore"
                }, {
                    latLng: [15.3, -61.38],
                    name: "Dominica"
                }, {
                    latLng: [26.02, 50.55],
                    name: "Bahrain"
                }]
            }),"undefined" != typeof Skycons) {
            var a, e = new Skycons({
                    color: "#f1ac57"
                }, {
                    resizeClear: !0
                }),
                r = ["clear-day", "clear-night", "partly-cloudy-day", "partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind", "fog"];
            for (a = r.length; a--;) e.set(r[a], r[a]);
            e.play()
        }
        this.createStackedChart("morris-bar-stacked", [{
            y: "",
            a: 45
        }, {
            y: "",
            a: 75
        }, {
            y: "",
            a: 100
        }, {
            y: "",
            a: 75
        }, {
            y: "",
            a: 100
        }, {
            y: "",
            a: 75
        }, {
            y: "",
            a: 50
        }, {
            y: "",
            a: 75
        }, {
            y: "",
            a: 50
        }, {
           y: "",
            a: 75
        }], "y", ["a"], ["Series A"], ["#f5b225"]);
		
		this.createStackedChart("morris-bar-stacked-1", [{
            y: "",
            a: 15
        }, {
            y: "",
            a: 35
        }, {
            y: "",
            a: 40
        }, {
            y: "",
            a: 35
        }, {
            y: "",
            a: 40
        }, {
            y: "",
            a: 35
        }, {
            y: "",
            a: 10
        }, {
            y: "",
            a: 25
        }, {
            y: "",
            a: 10
        }, {
           y: "",
           a: 25
        }], "y", ["a"], [""], ["#29b348"]);
		
		this.createStackedChart("morris-bar-stacked-2", [{
            y: "",
            a: 15
        }, {
            y: "",
            a: 35
        }, {
            y: "",
            a: 40
        }, {
            y: "",
            a: 35
        }, {
            y: "",
            a: 40
        }, {
            y: "",
            a: 35
        }, {
            y: "",
            a: 10
        }, {
            y: "",
            a: 25
        }, {
            y: "",
            a: 10
        }, {
           y: "",
           a: 25
        }], "y", ["a"], [""], ["#44a2d2"]);
		
		this.createStackedChart("morris-bar-stacked-3", [{
            y: "",
            a: 15
        }, {
            y: "",
            a: 35
        }, {
            y: "",
            a: 40
        }, {
            y: "",
            a: 35
        }, {
            y: "",
            a: 40
        }, {
            y: "",
            a: 35
        }, {
            y: "",
            a: 10
        }, {
            y: "",
            a: 25
        }, {
            y: "",
            a: 10
        }, {
           y: "",
           a: 25
        }], "y", ["a"], [""], ["#f74b4b"]);
		
    }, t.Dashboard = new a, t.Dashboard.Constructor = a
}(window.jQuery),
function(a) {
    "use strict";
    window.jQuery.Dashboard.init()
}();