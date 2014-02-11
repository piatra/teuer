(function() {
  'use strict';

  //var client = new Dropbox.Client({key: 'gzlqmsuqsyk0dvt'});
  //client.authenticate({ interactive: false });
  //if (!client.isAuthenticated()) client.authenticate();
  //Backbone.DropboxDatastore.client = client;

  window.App = {
    Models: {},
    Views: {},
    Collections: {},
    options: {
      currency: 'RON'
    }
  };

  Backbone.pubSub = _.extend({}, Backbone.Events);

  App.Models.Expense = Backbone.Model.extend({
    defaults: {
      value: 0,
      comment: '',
      className: 'positive-expense',
      date: (new Date()).toISOString(),
      currency: App.options.currency
    },

    validate: function (attrs) {
      if (isNaN(attrs.value) || !attrs.value) {
        return "An expense must have a valid (number) value!";
      }
    },

    initialize: function(values) {
      this.on('invalid', function (model, error) {
        console.log(error, model);
        return error;
      });
    },

  });

  App.Views.Expenses = Backbone.View.extend({

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
    },

    render: function() {
      this.collection.each(this.addOne, this);
      return this;
    },

    updateTotal: function() {
      this.expenseTotal = 0;
      this.collection.each(function(expense) {
        if (expense.get('className') == 'positive-expense') {
          this.expenseTotal += parseInt(expense.get('value'), 10);
        } else {
          this.expenseTotal -= parseInt(expense.get('value'), 10);
        }
      }, this);
      $('.expense-value').text(this.expenseTotal);
    },

    addOne: function(expense) {
      var expenseView = new App.Views.Expense({ model: expense });
      this.$el.append(expenseView.render().el);
      expenseView.$el.addClass(expense.get('className'));
      jQuery(".timeago").timeago();
      this.updateTotal();
    }

  });

  App.Collections.Expenses = Backbone.Collection.extend({
    model: App.Models.Expense,

    //localStorage: new Backbone.LocalStorage("teuer"),

    //dropboxDatastore: new Backbone.DropboxDatastore('teuer'),

    //initialize: function() {
      //this.dropboxDatastore.syncCollection(this);
    //}
  });

  App.Views.SettingsForm = Backbone.View.extend({
    el: $('#currency-selector'),

    events: {
      'click button': 'currencyUpdate'
    },

    currencyUpdate: function(e) {
      console.log('currency update clicked');
      App.options.currency = $('input', this.$el).val();
      this.collection.each(this.updateItem, this);
      Backbone.pubSub.trigger('currencyUpdate');
    },

    updateItem: function(item) {
      item.set('currency', App.options.currency);
    }
  });

  App.Views.ExpenseForm = Backbone.View.extend({
    el: $('#expense-form'),

    events: {
      'click .expense-button--expense': 'addExpense',
      'click .expense-button--income': 'addIncome'
    },

    addExpense: function(e) {
      e.preventDefault();
      var $input = $('input', this.$el);
      var value = $input.val();
      if (!value) return;
      var comment = $('textarea', this.$el).val();
      var expense = new App.Models.Expense({
        value: value,
        className: 'negative-expense',
        comment: comment
      });
      this.collection.add(expense);
      expense.save();
      $input.val('');
    },

    addIncome: function(e) {
      e.preventDefault();
      var $input = $('input', this.$el);
      var value = $input.val();
      if (!value) return;
      var comment = $('textarea', this.$el).val();
      var expense = new App.Models.Expense({
        value: value,
        className: 'positive-expense',
        comment: comment
      });
      this.collection.add(expense);
      expense.save();
      $input.val('');
    }
  });

  App.Views.Expense = Backbone.View.extend({
    tagName: 'li',

    className: 'expense-item',

    initialize: function() {
      this.model.on('change', this.render, this);
      this.model.on('destroy', this.removeExpense, this);
    },

    events: {
      'click': 'editExpense',
      'click .done': 'doneEditing',
      'click .delete': 'destroy'
    },

    editExpense: function(e) {
        this.$el.addClass('editing');
    },

    removeExpense: function() {
      this.$el.remove();
    },

    doneEditing: function(e) {
      var value = $('input', this.$el).val();
      this.model.set('value', value, {validate: true});
      this.$el.removeClass('editing');
      return false;
    },

    destroy: function() {
      this.model.destroy();
    },

    render: function() {
      var template = _.template($('#expenseTemplate').html());
      this.$el.html(template(this.model.toJSON()));
      return this;
    }

  });

  window.expenseCollection = new App.Collections.Expenses();
  //expenseCollection.fetch();

  //expenseCollection.dropboxDatastore.on('change:status', function(status, dropboxDatastore){
    //console.log('status changed');
  //});

  //$(window).bind('beforeunload', function () {
    //var currentStatus = expenseCollection.dropboxDatastore.getStatus();
    //if (currentStatus === 'uploading') {
      //console.log('uploading');
      //return 'You have pending changes that haven\'t been synchronized to the server.';
    //}
  //});

  window.expenseForm = new App.Views.ExpenseForm({ collection: expenseCollection });
  var settingsForm = new App.Views.SettingsForm({ collection: expenseCollection });

  //$('body').append(expenses.render().el);
  $('.js-handler--show-sidemenu').on('click', toggleSidemenu);
  $('.js-handler--change-currency').on('click', changeCurrency);
  window.expenses = new App.Views.Expenses({ collection: expenseCollection });

  function toggleSidemenu () {
    $('.container').toggleClass('slide-right--half');
    $('.sidemenu').toggleClass('slide-right--reset');
    setTimeout(function () {
      $('html').toggleClass('hidden-overflow');
      $('body').toggleClass('hidden-overflow');
    }, 300);
  }

  function changeCurrency () {
    $('#expense-wallet').toggleClass('hidden');
    $('#expense-settings').toggleClass('hidden');
    toggleSidemenu();
  }




})();
