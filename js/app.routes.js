/* globals Backbone */

(function() {
'use strict';

window.App = window.App || {};
window.App.Routes = Backbone.Router.extend({

 routes: {
    '': 'index',
    'wallet': 'wallet',
    'currency': 'currency'
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
  }

});

})();