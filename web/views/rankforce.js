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
                limit: params.limit || limit
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
            };
            // column
            columnData.min[i] = {
                name: data.title,
                y: data.ikioi.min
            };
            columnData.average[i] = {
                name: data.title,
                y: data.ikioi.average
            };
            columnData.max[i] = {
                name: data.title,
                y: data.ikioi.max
            };
            // idList
            idList[i] = data._id.$oid;
            // dateList
            if (i % 2 === 0) {
                var dateTime = data.date.created_at.split(" ");
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

        Highcharts.setOptions({
           colors: ["#DDDF0D", "#55BF3B", "#DF5353", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
              "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
           chart: {
              backgroundColor: '#000000',
              className: 'dark-container',
              plotBackgroundColor: 'rgba(255, 255, 255, .1)',
              plotBorderColor: '#CCCCCC',
              plotBorderWidth: 1
           },
           title: {
              style: {
                 color: '#C0C0C0',
                 font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
              }
           },
           subtitle: {
              style: {
                 color: '#666666',
                 font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
              }
           },
           xAxis: {
              gridLineColor: '#333333',
              gridLineWidth: 1,
              labels: {
                 style: {
                    color: '#A0A0A0'
                 }
              },
              lineColor: '#A0A0A0',
              tickColor: '#A0A0A0',
              title: {
                 style: {
                    color: '#CCC',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'

                 }
              }
           },
           yAxis: {
              gridLineColor: '#333333',
              labels: {
                 style: {
                    color: '#A0A0A0'
                 }
              },
              lineColor: '#A0A0A0',
              minorTickInterval: null,
              tickColor: '#A0A0A0',
              tickWidth: 1,
              title: {
                 style: {
                    color: '#CCC',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                 }
              }
           },
           tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              style: {
                 color: '#F0F0F0'
              }
           },
           toolbar: {
              itemStyle: {
                 color: 'silver'
              }
           },
           plotOptions: {
              line: {
                 dataLabels: {
                    color: '#CCC'
                 },
                 marker: {
                    lineColor: '#333'
                 }
              },
              spline: {
                 marker: {
                    lineColor: '#333'
                 }
              },
              scatter: {
                 marker: {
                    lineColor: '#333'
                 }
              },
              candlestick: {
                 lineColor: 'white'
              }
           },
           legend: {
              itemStyle: {
                 font: '9pt Trebuchet MS, Verdana, sans-serif',
                 color: '#A0A0A0'
              },
              itemHoverStyle: {
                 color: '#FFF'
              },
              itemHiddenStyle: {
                 color: '#444'
              }
           },
           credits: {
              style: {
                 color: '#666'
              }
           },
           labels: {
              style: {
                 color: '#CCC'
              }
           },

           navigation: {
              buttonOptions: {
                 backgroundColor: {
                    linearGradient: [0, 0, 0, 20],
                    stops: [
                       [0.4, '#606060'],
                       [0.6, '#333333']
                    ]
                 },
                 borderColor: '#000000',
                 symbolStroke: '#C0C0C0',
                 hoverSymbolStroke: '#FFFFFF'
              }
           },

           exporting: {
              buttons: {
                 exportButton: {
                    symbolFill: '#55BE3B'
                 },
                 printButton: {
                    symbolFill: '#7797BE'
                 }
              }
           },

           // scroll charts
           rangeSelector: {
              buttonTheme: {
                 fill: {
                    linearGradient: [0, 0, 0, 20],
                    stops: [
                       [0.4, '#888'],
                       [0.6, '#555']
                    ]
                 },
                 stroke: '#000000',
                 style: {
                    color: '#CCC',
                    fontWeight: 'bold'
                 },
                 states: {
                    hover: {
                       fill: {
                          linearGradient: [0, 0, 0, 20],
                          stops: [
                             [0.4, '#BBB'],
                             [0.6, '#888']
                          ]
                       },
                       stroke: '#000000',
                       style: {
                          color: 'white'
                       }
                    },
                    select: {
                       fill: {
                          linearGradient: [0, 0, 0, 20],
                          stops: [
                             [0.1, '#000'],
                             [0.3, '#333']
                          ]
                       },
                       stroke: '#000000',
                       style: {
                          color: 'yellow'
                       }
                    }
                 }
              },
              inputStyle: {
                 backgroundColor: '#333',
                 color: 'silver'
              },
              labelStyle: {
                 color: 'silver'
              }
           },

           navigator: {
              handles: {
                 backgroundColor: '#666',
                 borderColor: '#AAA'
              },
              outlineColor: '#CCC',
              maskFill: 'rgba(16, 16, 16, 0.5)',
              series: {
                 color: '#7798BF',
                 lineColor: '#A6C7ED'
              }
           },

           scrollbar: {
              barBackgroundColor: {
                    linearGradient: [0, 0, 0, 20],
                    stops: [
                       [0.4, '#888'],
                       [0.6, '#555']
                    ]
                 },
              barBorderColor: '#CCC',
              buttonArrowColor: '#CCC',
              buttonBackgroundColor: {
                    linearGradient: [0, 0, 0, 20],
                    stops: [
                       [0.4, '#888'],
                       [0.6, '#555']
                    ]
                 },
              buttonBorderColor: '#CCC',
              rifleColor: '#FFF',
              trackBackgroundColor: {
                 linearGradient: [0, 0, 0, 10],
                 stops: [
                    [0, '#000'],
                    [1, '#333']
                 ]
              },
              trackBorderColor: '#666'
           },

           // special colors for some of the
           legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
           legendBackgroundColorSolid: 'rgb(35, 35, 70)',
           dataLabelsColor: '#444',
           textColor: '#C0C0C0',
           maskColor: 'rgba(255,255,255,0.3)'
        });

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
                    },
                    line: {
                        dataLabels: {
                            enabled: true
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
        if (typeof receiver.url !== 'undefined') {
            open(receiver.url + "/&res=100");
        }
    },

    get: function(params) {
        var self = this;
        params.board_ja = this.board_ja(params.board);
        self.xhr({
            url: "/rest/" + params.board,
            params: {"limit": params.limit},
            args: {type: "get", dataType: "json"},
            success: function(response) {
                self.renderGraph(response, params);
            },
            before: function() {
                self.showFilter({
                    target: $("#tabbale"),
                    color: "#ffffff",
                    backgroundColor: "#000000",
                    img: "/loading2.gif",
                    transParency: "0.8"
                });
            },
            after: function() {
                self.hideFilter();
                self.followButton();
            }
        });
    }
});

function rankforce_boot(boards) {
    var obj = RankForce.mix(Twitter);
    obj.setBoards(boards);
    obj.loadScript("/bootstrap/js/bootstrap.min.js", function() {
        obj.events();
        obj.render({board: "all"});
    });
}