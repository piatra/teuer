/* globals Backbone */

(function() {
'use strict';

window.App = window.App || {};
window.App.Routes = Backbone.Router.extend({

 routes: {
    ''        : 'index',
    'wallet'  : 'wallet',
    'currency': 'currency',
    'graph'   : 'graph'
  },

  index: function() {
  },

  wallet: function () {
    $('#expense-wallet').toggleClass('hidden');
    $('#expense-settings').toggleClass('hidden');
  },

  currency: function () {
    $('#expense-wallet').toggleClass('hidden');
    $('#expense-settings').toggleClass('hidden');
  },

  graph: function() {
    $('#expense-wallet').hide();
    $('#expense-settings').hide();
    $('#expense-graph').removeClass('hidden');
    plotChart();
  }


});

})();

    window.plotChart = function() {

        $('#container').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: 'Browser market shares at a specific website, 2010'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                    }
                }
            },
            series: [{
                type: 'pie',
                name: 'Browser share',
                data: [
                    ['Firefox',   45.0],
                    ['IE',       26.8],
                    {
                        name: 'Chrome',
                        y: 12.8,
                        sliced: true,
                        selected: true
                    },
                    ['Safari',    8.5],
                    ['Opera',     6.2],
                    ['Others',   0.7]
                ]
            }]
        });

    };


