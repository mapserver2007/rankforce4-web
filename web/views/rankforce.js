/**
 * rankforce.js
 *
 * Licensed under the MIT:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2011, Ryuichi TANAKA [mapserver2007@gmail.com]
 */
Mixjs.module("Twitter", {
    followButton: function() {
        !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
    }
});

Mixjs.module("RankForce", {
    include: [Http, Utils, Design],

    setBoards: function(boards) {
        this.boards = boards;
    },

    board_ja: function(board) {
        return this.boards[board];
    },

    events: function() {
        var self = this;
        $('a[data-toggle="tab"]').on('shown', function (e) {
            var board = e.target.href.split("#")[1].replace("tab_", "");
            self.render({board: board, board_ja: "dummy"})
        });
    },

    render: function(params) {
        var self = this,
            params = params || {},
            limit = Math.floor($(document).width() / 35);

        var graph = $("#" + params.board).html();
        if (this.isBlank(graph)) {
            this.get({
                board: params.board,
                board_ja: params.board_ja,
                limit: params.limit || limit,
                callback: self.renderGraph
            });
        }
    },

    renderGraph: function(json, params) {
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
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: params.board,
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

            chart.series[0].hide();
            chart.series[1].hide();
            chart.series[2].hide();
        });
    },

    plotClickEvent: function(receiver) {
        if (receiver["url"]) {
            open(receiver.url + "/&res=100");
        }
    },

    get: function(params) {
        var self = this;
        params.board_ja = this.board_ja(params.board);
        self.xhr({
            url: "/rest/" + params.board,
            params: {"limit": params.limit},
            args: {type: "get", dataType: "json", args: params},
            success: params.callback,
            before: function() {
                self.showFilter({
                    target: $("#tabbale"),
                    color: "#000000",
                    backgroundColor: "#ffffff",
                    img: "/loading.gif",
                    text: "now rendering..."
                });
            },
            after: function(url) {
                self.hideFilter();
            }
        });
    }
});

function rankforce_boot(boards) {
    var obj = RankForce.mix(Twitter);
    obj.setBoards(boards);
    obj.loadScript("/bootstrap/js/bootstrap.min.js", function() {
        obj.events();
        obj.hook("render", function() {
            this.followButton();
        });
        obj.render({board: "all"});
    });
}