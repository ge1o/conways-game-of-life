var app = {

    initialize: function () {
        console.info('init');

        var life = new app.Life(document.querySelector('.life'));
        var life2 = new app.Life(document.querySelector('.life2'));
        life.initialize();
        life2.initialize({
            w: 100,
            h: 100,
            cellSize: 10
        });
    }

};
