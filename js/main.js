(function() {
  'use strict';

  var client = new Dropbox.Client({key: 'gzlqmsuqsyk0dvt'});
  client.authenticate({ interactive: false });
  if (!client.isAuthenticated()) client.authenticate();
  Backbone.DropboxDatastore.client = client;

  window.App.Collections = {};

  var App = window.App;

  Backbone.pubSub = _.extend({}, Backbone.Events);

  App.Collections.Expenses = Backbone.Collection.extend({
    model: App.Models.Expense,

    dropboxDatastore: new Backbone.DropboxDatastore('teuer'),

    initialize: function() {
      this.dropboxDatastore.syncCollection(this);
    },

    comparator: function(a) {
      var val = -(new Date(a.get('date'))).getTime();
      return val;
    }
  });

  App.Router = new App.Routes;
  Backbone.history.start({pushState: true});

  var expenseCollection = new App.Collections.Expenses();
  expenseCollection.fetch();

  $(window).bind('beforeunload', function () {
    var currentStatus = expenseCollection.dropboxDatastore.getStatus();
    if (currentStatus === 'uploading') {
      return 'You have pending changes that haven\'t been synchronized to the server.';
    }
  });

  var expenseForm = new App.Views.ExpenseForm({ collection: expenseCollection });
  var settingsForm = new App.Views.SettingsForm({ collection: expenseCollection });
  var expenses = new App.Views.Expenses({ collection: expenseCollection });

  $('.js-handler--show-sidemenu').on('click', toggleSidemenu);
  $('.js-handler--change-currency').on('click', changeCurrency);
  $('.js-handler--view-wallet').on('click', viewWallet);

  function toggleSidemenu () {
    $('.container').toggleClass('slide-right--half');
    $('.sidemenu').toggleClass('slide-right--reset');
    setTimeout(function () {
      $('html').toggleClass('hidden-overflow');
      $('body').toggleClass('hidden-overflow');
    }, 300);
  }

  function viewWallet() {
    App.Router.navigate('/wallet', {trigger: true});
    toggleSidemenu();    
  }

  function changeCurrency () {
    App.Router.navigate('/currency', {trigger: true});
    toggleSidemenu();
  }

})();
