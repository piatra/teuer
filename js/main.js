(function() {
  'use strict';

  window.App.Collections = {};

  var App = window.App;
  App.AUTH = false;
  App.FirebaseURL = "https://vivid-fire-3778.firebaseio.com";

  var chatRef = new Firebase(App.FirebaseURL);
  window.auth = new FirebaseSimpleLogin(chatRef, function(error, user) {
      if (error) {
          // an error occurred while attempting login
          console.log(error);
      } else if (user) {
          // user authenticated with Firebase
          console.log('User ID: ' + user.id + ', Provider: ' + user.provider);
          console.log(user);
          App.AUTH = {
            user: user.id,
            uid: user.uid
          };
          initApp();
      } else {
          // user is logged out
          console.log('Logged out');
          $('.tab').addClass('hidden');
          $('#login-screen').removeClass('hidden');
      }
  });

  var expenseCollection;

  Backbone.pubSub = _.extend({}, Backbone.Events);

  function initApp() {
      App.Collections.Expenses = Backbone.Collection.extend({
        model: App.Models.Expense,

        firebase: new Backbone.Firebase(App.FirebaseURL + '/user/' + App.AUTH.uid),

        comparator: function(a) {
          var val = -(new Date(a.get('date'))).getTime();
          return val;
        },

        ageFilter: function oldItems(age) {
            return this.filter(function(exp) { return exp.itemAge() > 7; });
        },

        recentExpenses: function() {
            return this.without.apply(this, this.ageFilter());
        }
      });
      expenseCollection = new App.Collections.Expenses();
      var expenseForm = new App.Views.ExpenseForm({ collection: expenseCollection });
      var settingsForm = new App.Views.SettingsForm({ collection: expenseCollection });
      var expenses = new App.Views.Expenses({ collection: expenseCollection });
      var currenciesSelector = new App.Views.CurencySelector();

      $('.tab').addClass('hidden');
      $('#expense-wallet').removeClass('hidden');
      $('.expense-total').removeClass('hidden');

      setTimeout(function(){
        expenseCollection.fetch();
      }, 1000);
  }

  $('.js-handler--show-sidemenu').on('click', toggleSidemenu);
  $('.js-handler--change-currency').on('click', changeCurrency);
  $('.js-handler--view-wallet').on('click', viewWallet);
  $('.js-handler--expense-graph').on('click', viewGraph);
  $('.js-handler--login').on('click', function() {
    auth.login('persona');
  });

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

  function viewGraph() {
    App.Router.navigate('/graph', {trigger : true});
    toggleSidemenu();
    var pieGraph = new App.Views.PieGraph({collection: expenseCollection});
  }

})();
