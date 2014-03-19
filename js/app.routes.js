/* globals Backbone */

(function() {
    'use strict';

    window.App = window.App || {};
    window.App.Routes = Backbone.Router.extend({

        routes: {
        '/'        : 'index',
        'wallet'   : 'wallet',
        'currency': 'currency',
        'graph'   : 'graph'
        },



    });

    App.Router = new App.Routes();

    App.Router.on('route:index', function() {
        console.log('index');
    });

    App.Router.on('route:wallet', function () {
        $('.tab').addClass('hidden');
        $('#expense-wallet').removeClass('hidden');
    });

    App.Router.on('route:currency', function () {
        $('.tab').addClass('hidden');
        $('#expense-settings').removeClass('hidden');
    });

    App.Router.on('route:graph', function() {
        $('.tab').addClass('hidden');
        $('#expense-graph').removeClass('hidden');
    });


  Backbone.history.start();

})();
