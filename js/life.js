app.Life = (function (document, app) {

    let pattern = [
        [60, 47],[61,47],[62,47],
        [60, 48],[61,48],[62,48],
        [60, 49],[61,49],[62,49],
        [60, 51],[61,51],[62,51]
    ];

    let gosperGliderGun = [
        [1, 5],[1, 6],[2, 5],[2, 6],[11, 5],[11, 6],[11, 7],[12, 4],[12, 8],[13, 3],[13, 9],[14, 3],[14, 9],[15, 6],[16, 4],[16, 8],[17, 5],[17, 6],[17, 7],[18, 6],[21, 3],[21, 4],[21, 5],[22, 3],[22, 4],[22, 5],[23, 2],[23, 6],[25, 1],[25, 2],[25, 6],[25, 7],[35, 3],[35, 4],[36, 3],[36, 4]
    ];

    function Life(options) {
        options = options || this.defaults;

        this.defaults = {
            w: 70,
            h: 70,
            cellSize: 5,
            fillColor: '#1d1d1d',
            blankColor: '#ffffff',
            strokeColor: '#eeeeee'
        };

        this.generation = {
            cells: [],
            running: false,
            intervalId: 0
        };

        return this;
    }

    Life.prototype = {
        initialize: function() {
            this.findNodes();
            this.addHandlers();
            this.buildGrid();
            this.setPattern(pattern);

            this.nodes.life.width = this.defaults.w * this.defaults.cellSize;
            this.nodes.life.height = this.defaults.h * this.defaults.cellSize;

            this.renderGrid();
        },

        findNodes: function() {
            this.nodes = {
                canvas: document.querySelector('.life').getContext('2d'),
                life: document.querySelector('.life'),
                startButton: document.querySelector('.start'),
                nextGenButton: document.querySelector('.next-gen'),
                stopButton: document.querySelector('.stop'),
                resetButton: document.querySelector('.reset'),
                randomButton: document.querySelector('.random'),
                gggButton: document.querySelector('.ggg')
            }
        },

        addHandlers: function() {
            this.nodes.life.addEventListener('click', this.placeCell.bind(this));
            this.nodes.startButton.addEventListener('click', this.start.bind(this));
            this.nodes.nextGenButton.addEventListener('click', this.nextGen.bind(this));
            this.nodes.stopButton.addEventListener('click', this.stop.bind(this));
            this.nodes.resetButton.addEventListener('click', this.reset.bind(this));
            this.nodes.randomButton.addEventListener('click', this.random.bind(this));

            this.nodes.gggButton.addEventListener('click', this.ggg.bind(this));
        },

        placeCell: function(e) {
            let xCoord;
            let yCoord;
            let cellSize = this.defaults.cellSize;

            xCoord = Math.floor(e.offsetX / cellSize);
            yCoord = Math.floor(e.offsetY / cellSize);

            if(this.generation.cells[xCoord][yCoord]) {
                this.generation.cells[xCoord][yCoord] = 0;
                this.nodes.canvas.beginPath();
                this.nodes.canvas.rect(xCoord*cellSize, yCoord*cellSize, cellSize, cellSize);
                this.nodes.canvas.fillStyle = this.defaults.blankColor;
                this.nodes.canvas.strokeStyle = this.defaults.strokeColor;
                this.nodes.canvas.fill();
                this.nodes.canvas.stroke();
            } else {
                this.generation.cells[xCoord][yCoord] = 1;
                this.nodes.canvas.fillStyle = this.defaults.fillColor;
                this.nodes.canvas.fillRect(Math.floor(e.offsetX / cellSize) * cellSize,
                    Math.floor(e.offsetY / cellSize) * cellSize, cellSize, cellSize);
            }
        },

        buildGrid: function() {
            for (let i = 0; i < this.defaults.w; i++) {
                this.generation.cells[i] = [];
                for (let j = 0; j < this.defaults.h; j++) {
                    this.generation.cells[i][j] = 0;
                }
            }
        },

        setPattern: function(pattern) {
            pattern.forEach(function(cell) {
                this.generation.cells[cell[0]][cell[1]] = 1;
            }.bind(this));
        },

        renderGrid: function() {
            let cellSize = this.defaults.cellSize;
            let gridSize = this.defaults.w * this.defaults.cellSize;

            this.nodes.canvas.strokeStyle = this.defaults.strokeColor;
            this.nodes.canvas.fillStyle = this.defaults.fillColor;
            this.nodes.canvas.clearRect(0, 0, gridSize, gridSize);

            this.generation.cells.forEach(function(row, x) {
                row.forEach(function(cell, y) {
                    this.nodes.canvas.beginPath();
                    this.nodes.canvas.rect(x*cellSize, y*cellSize, cellSize, cellSize);
                    if (cell) {
                        this.nodes.canvas.fill();
                    } else {
                        this.nodes.canvas.stroke();
                    }
                }.bind(this));
            }.bind(this));
        },

        isFilled: function(x, y) {
            return this.generation.cells[x] && this.generation.cells[x][y];
        },

        countNeighbours: function(x, y) {
            let neighbours = 0;

            if (this.isFilled(x-1, y-1)) {
                neighbours++;
            }
            if (this.isFilled(x,   y-1)) {
                neighbours++;
            }
            if (this.isFilled(x+1, y-1)) {
                neighbours++;
            }
            if (this.isFilled(x-1, y  )) {
                neighbours++;
            }
            if (this.isFilled(x+1, y  )) {
                neighbours++;
            }
            if (this.isFilled(x-1, y+1)) {
                neighbours++;
            }
            if (this.isFilled(x,   y+1)) {
                neighbours++;
            }
            if (this.isFilled(x+1, y+1)) {
                neighbours++;
            }

            return neighbours;
        },

        update: function() {
            let nextGenCells = [];

            this.generation.cells.forEach(function(row, x) {
                nextGenCells[x] = [];
                row.forEach(function(cell, y) {
                    let alive = 0;
                    let count = this.countNeighbours(x, y);

                    if (cell > 0) {
                        alive = count === 2 || count === 3 ? 1 : 0;
                    } else {
                        alive = count === 3 ? 1 : 0;
                    }

                    nextGenCells[x][y] = alive;
                }.bind(this));
            }.bind(this));

            this.generation.cells = nextGenCells;

            this.renderGrid();
        },

        start: function() {
            if(this.generation.running == false) {
                this.generation.intervalId = setInterval(function() {
                    this.update();
                }.bind(this), 100);
            }

            this.generation.running = true;
        },

        stop: function() {
            clearInterval(this.generation.intervalId);

            this.generation.running = false;
        },

        nextGen: function() {
            if(this.generation.running == false) {
                this.update();
            }
        },

        reset: function() {
            this.setPattern(pattern);

            this.buildGrid();
            this.renderGrid();
            this.stop();
        },

        random: function() {
            for (let i = 0; i < this.defaults.w; i++) {
                this.generation.cells[i] = [];
                for (let j = 0; j < this.defaults.h; j++) {
                    this.generation.cells[i][j] = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
                }
            }

            this.stop();
            this.renderGrid();
        },

        ggg: function() {
            this.reset();
            this.setPattern(gosperGliderGun);
            this.renderGrid();
        }
    };

    return Life;

}(document, app));