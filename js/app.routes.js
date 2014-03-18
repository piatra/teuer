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
