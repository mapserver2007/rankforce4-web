/**
 * rankforce.js
 *
 * Licensed under the MIT:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2011, Ryuichi TANAKA [mapserver2007@gmail.com]
 */
Mixjs.module("RankForce", {
    /** 依存モジュール */
    include: Http,

    run: function(params) {
        var self = this;
        if (!params.hasOwnProperty("board")) {
            params["board"] = "all";
        }
        this.get({
            board: params.board,
            callback: self.render_graph
        });
    },

    render_graph: function(json) {
        data = [];
        for (var i = 0; i < json.length; i++) {
            data[i] = {
                name: json[i].title,
                y: json[i].ikioi.average
            }
        }

        $(document).ready(function() {
            new Highcharts.Chart({
                chart: {
                    renderTo: "graph",
                    defaultSeriesType: "line"
                },
                title: {
                    text: "graph test"
                },
                subtitle: {
                    text: "subtitle"
                },
                xAxis: {
                    title: {
                        text: "日付"
                    }
                },
                yAxis: {
                    title: {
                        text: "勢い"
                    }
                },
                series: [{
                    name: "newsplus",
                    data: data
                }]
            });
        });





    },

    get: function(params) {
        var self = this;
        this.xhr({
            url: "/rest/" + params.board,
            params: {"limit": 50},
            args: {type: "get", dataType: "json"},
            success: params.callback

        })
    }


});