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
        var self = this,
            limit = Math.floor($(document).width() / 35);
        if (!params.hasOwnProperty("board")) {
            params["board"] = "all";
        }

        this.get({
            board: params.board,
            board_ja: params.board_ja,
            limit: params.limit || limit,
            callback: self.render_graph
        });
    },

    render_graph: function(json, params) {
        var self = this;
        var lineData = [],
            columnData = {
                average: [],
                max: [],
                min: []
            },
            idList = [],
            dateList = [];
        
        for (var i = 0; i < json.length; i++) {
            var data = json[i];
            // line
            lineData[i] = {
                name: data.title,
                url: data.url,
                y: data.ikioi.average
            }
            // column
            columnData["min"][i] = {
                name: data.title,
                y: data.ikioi.min
            };
            columnData["average"][i] = {
                name: data.title,
                y: data.ikioi.average
            };
            columnData["max"][i] = {
                name: data.title,
                y: data.ikioi.max
            };
            // idList
            idList[i] = data["_id"]["$oid"];
            // dateList
            if (i % 2 == 0) {
                var dateTime = data["date"]["created_at"].split(" ");
                var day = dateTime[0].split("-");
                day = day[1] + "/" + day[2];
                var time = dateTime[1].split(":");
                time = time[0] + ":" + time[1];
                dateList[i] = day + " " + time;
            }
            else {
                dateList[i] = "";
            }
        }
        
        $(document).ready(function() {
            new Highcharts.Chart({
                chart: {
                    renderTo: "graph",
                    defaultSeriesType: "line"
                },
                title: {
                    text: params.board_ja
                },
                xAxis: [{
                    categories: dateList
                }],
                yAxis: {
                    title: {
                        text: "勢い"
                    }
                },
                plotOptions: {
                    series: {
                        cursor: "pointer",
                        point: {
                            events: {
                                click: function(e) {
                                    self.plotClickEvent(this);
                                }
                            }
                        }
                    }
                },
                series: [{
                    name: "最小値",
                    type: "column",
                    data: columnData.min
                },{
                    name: "平均値",
                    type: "column",
                    data: columnData.average
                },{
                    name: "最大値",
                    type: "column",
                    data: columnData.max
                },{
                    name: params.board_ja,
                    data: lineData,
                    id: idList
                }]
            });
        });
    },

    plotClickEvent: function(receiver) {
        if (receiver["url"]) {
            open(receiver.url + "/&res=100");
        }
    },

    get: function(params) {
        var self = this;
        this.xhr({
            url: "/rest/" + params.board,
            params: {"limit": params.limit},
            args: {type: "get", dataType: "json", args: params},
            success: params.callback
        });
    }
});