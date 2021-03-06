/* globals Backbone */

(function() {
'use strict';

window.App = window.App || {};
window.App.Models = {};
window.App.options = {
  currency: localStorage.getItem('currency') || 'RON'
};

window.App.Models.Expense = Backbone.Model.extend({
  defaults: {
    value: 0,
    comment: '',
    className: 'positive-expense',
    date: (new Date()).toISOString(),
    currency: localStorage.getItem('currency') || 'RON',
    archived: false
  },

  validate: function (attrs) {
    if (isNaN(attrs.value) || !attrs.value) {
      return 'An expense must have a valid (number) value!';
    }
  },

  initialize: function(values) {
    this.on('invalid', function (model, error) {
      return error;
    });
  },

  itemAge: function itemAge() {
      var date = (new Date(this.get('date'))).getTime();
      var now = (new Date()).getTime();
      var diff = now - date;
      return diff / (60*60*24*1000);
  }

});

})();
