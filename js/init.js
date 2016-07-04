var app = {

    initialize: function () {
        console.info('init');

        var life = new app.Life(document.querySelector('.life'));
        var life2 = new app.Life(document.querySelector('.life2'));
        life.initialize({x:1});
        life2.initialize();
    }

};
