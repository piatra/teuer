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
        $('#expense-wallet').removeClass('hidden');
        $('#expense-settings').addClass('hidden');
        $('#expense-graph').addClass('hidden');
    });

    App.Router.on('route:currency', function () {
        $('#expense-wallet').addClass('hidden');
        $('#expense-settings').removeClass('hidden');
        $('#expense-settings').addClass('hidden');
    });

    App.Router.on('route:graph', function() {
        $('#expense-wallet').addClass('hidden');
        $('#expense-settings').addClass('hidden');
        $('#expense-graph').removeClass('hidden');
    });


  Backbone.history.start();

})();
