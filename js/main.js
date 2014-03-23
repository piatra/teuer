/*globals Firebase, FirebaseSimpleLogin, console, $, Backbone, _*/

(function() {
  'use strict';

  window.App.Collections = {};

  var App = window.App;
  App.AUTH = false;
  App.FirebaseURL = 'https://vivid-fire-3778.firebaseio.com';

  var chatRef = new Firebase(App.FirebaseURL);
  var auth = new FirebaseSimpleLogin(chatRef, loginHandler);

  var expenseCollection;
  window.auth = auth;

  Backbone.pubSub = _.extend({}, Backbone.Events);

  function loginHandler (error, user) {
      if (error) {
          console.log(error);
      } else if (user) {
          App.AUTH = {
            user: user.id,
            uid: user.uid
          };
          initApp();
      } else {
          $('.tab').addClass('hidden');
          $('#login-screen').removeClass('hidden');
      }
  }

  function initApp() {
      App.Collections.Expenses = Backbone.Collection.extend({
        model: App.Models.Expense,

        firebase: new Backbone.Firebase(App.FirebaseURL + '/user/' + App.AUTH.uid),

        comparator: function(a) {
          var val = -(new Date(a.get('date'))).getTime();
          return val;
        },

        ageFilter: function oldItems() {
            return this.filter(function(exp) { return exp.itemAge() > 7; });
        },

        recentExpenses: function() {
            return this.without.apply(this, this.ageFilter());
        }
      });
      expenseCollection = new App.Collections.Expenses();
      new App.Views.ExpenseForm({ collection: expenseCollection });
      new App.Views.SettingsForm({ collection: expenseCollection });
      new App.Views.Expenses({ collection: expenseCollection });
      new App.Views.CurencySelector();

      $('.tab').addClass('hidden');
      $('#expense-wallet').removeClass('hidden');
      $('.expense-total').removeClass('hidden');

      setTimeout(function(){
        $('#loading').remove();
        expenseCollection.fetch();
      }, 1000);
  }

  $('.js-handler--show-sidemenu').on('click', toggleSidemenu);
  $('.js-handler--change-currency').on('click', changeCurrency);
  $('.js-handler--view-wallet').on('click', viewWallet);
  $('.js-handler--expense-graph').on('click', viewGraph);
  $('.js-handler--logout').on('click', logout);
  $('.js-handler--login').on('click', function() {
    auth.login('persona');
  });

  function logout() {
      auth.logout();
      location.href = location.origin;
  }

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
    new App.Views.PieGraph({collection: expenseCollection});
  }

})();
