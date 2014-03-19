/* globals Backbone, $, _ */

(function(){
'use strict';

window.App = window.App || {};
window.App.Views = {};

window.App.Views.Expenses = Backbone.View.extend({

  expenseTotal: 0,

  el: $('.expenses-list'),

  refreshList: function() {
    this.$el.empty();
    this.render();
  },

  initialize: function() {
    this.collection.on('add', this.addOne, this);
    this.collection.on('remove', this.updateTotal, this);
    Backbone.pubSub.on('currencyUpdate', this.refreshList, this);
    this.collection.on('sort', this.refreshList, this);
  },

  render: function() {
    $('#loading').remove();
    this.collection.each(this.addOne, this);
    // FIXME
    $('.expense-value').text(this.expenseTotal/2);
    this.expenseTotal /= 2;
    return this;
  },

  updateTotal: function(value) {
    this.expenseTotal += value | 0;
    $('.expense-value').text(this.expenseTotal);
    $('.expense-currency').text(window.App.options.currency);
  },

  addOne: function(expense) {
    if (expense.get('archived') || itemAge(expense) > 7) { // skip it
        return;
    }

    var expenseView = new window.App.Views.Expense({ model: expense });
    this.$el.append(expenseView.render().el);
    expenseView.$el.addClass(expense.get('className'));
    $('.timeago', expenseView.$el).timeago();
    var value = expense.get('value');
    if (expense.get('className') !== 'positive-expense') {
      value = -value;
    }
    this.updateTotal(value);
  },


});

  function itemAge(item) {
    var date = (new Date(item.get('date'))).getTime();
    var now = (new Date()).getTime();
    var diff = now - date;
    return diff / (60*60*24*1000);
  }

window.App.Views.SettingsForm = Backbone.View.extend({
  el: $('#currency-selector'),

  events: {
    'click button': 'currencyUpdate'
  },

  currencyUpdate: function(e) {
    e.preventDefault();
    window.App.options.currency = $('input', this.$el).val();
    localStorage.setItem('currency', window.App.options.currency);
    this.collection.each(this.updateItem, this);
    Backbone.pubSub.trigger('currencyUpdate');
  },

  updateItem: function(item) {
    item.set('currency', window.App.options.currency);
  }
});

window.App.Views.ExpenseForm = Backbone.View.extend({
  el: $('#expense-form'),

  events: {
    'click button': 'addExpense'
  },

  addExpense: function(e) {
    var className;
    if ($(e.currentTarget).hasClass('expense-button--expense')) {
      className = 'negative-expense';
    } else {
      className = 'positive-expense';
    }
    e.preventDefault();
    var $input = $('input', this.$el);
    var value = $input.val();
    if (!value) return;
    var expense = new window.App.Models.Expense({
      value: value,
      className: className,
      comment: $('textarea', this.$el).val(),
      currency: window.App.options.currency
    });
    this.collection.add(expense);
    expense.save();
    $input.val('');
    $('textarea').val('');
  }

});

window.App.Views.Expense = Backbone.View.extend({
  tagName: 'li',

  className: 'expense-item',

  initialize: function() {
    this.model.on('change', this.render, this);
    this.model.on('destroy', this.removeExpense, this);
    this.model.on('sort reset', this.render, this);
  },

  events: {
    'click': 'editExpense',
    'click .done': 'doneEditing',
    'click .delete': 'destroy',
    'click .archive': 'archive'
  },

  editExpense: function() {
      this.$el.addClass('editing');
  },

  removeExpense: function() {
    this.$el.remove();
  },

  doneEditing: function() {
    var value = $('input', this.$el).val();
    this.model.set('value', value, {validate: true});
    this.$el.removeClass('editing');
    return false;
  },

  destroy: function() {
    this.model.destroy();
  },

  archive: function() {
    this.model.set('archived', true);
    this.model.save();
    Backbone.pubSub.trigger('currencyUpdate');
    return false;
  },

  render: function() {
    var template = _.template($('#expenseTemplate').html());
    this.$el.html(template(this.model.toJSON()));
    return this;
  }

});

window.App.Views.PieGraph = Backbone.View.extend({
    el: $('#pie-graph'),

    data: [],

    totalExpense: 0,

    initialize: function () {
        this.data = [];
        this.collection.each(this.filterExpenses, this);
        var sum = this.data.reduce(function(a, b) {
            a += b[1] | 0;
            return a;
        }, 0);
        this.data = this.data.map(function(e) {
            var value = e[1] | 0;
            e[1] = (value * 100) / sum;
            return e;
        });

        var chart = this;

        this.$el.highcharts({
            chart: {
                plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false
            },
        title: {
            text: 'Weekly expenses'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
            enabled: false
        },
        showInLegend: true
            }
        },
        series: [{
            type: 'pie',
            name: 'Browser share',
            data: chart.data
        }]
        });
    },

    filterExpenses: function(expense) {
        
        if (itemAge(expense) < 7 && expense.get('className') !== 'positive-expense') {
            this.data.push([expense.get('comment'), expense.get('value')]);
        }
    
    }
});


})();
