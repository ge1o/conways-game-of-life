var app = {

    initialize: function () {
        console.info('init');

        var life = new app.Life(document.querySelector('.life'));
        life.initialize();
    }

};
