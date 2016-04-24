(function(){

  //Объект игра
  function Game (canvas) {

    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.canvas.height = 360;
    this.canvas.width = 360;
    this.cell = 20;
    this.speed = 2;
    this.score = 0;
    this.pause = true;
    this.direction = 'right';
    this.publishers = [];
  };

  Game.prototype.start = function () {
    if (this.pause) {
      this.pause = false;
      this.bindKey();
      this.loop();
    }
  };

  Game.prototype.stop = function () {
    this.pause = true;
  };

  Game.prototype.bindKey = function () {
    var self = this;

    var keys = {
      left: 37,
      up: 38,
      right: 39,
      down: 40,
      stop: 32,
      start: 13
    }

    document.onkeydown = function (e) {
      var keyCode = e.which || e.keyCode || 0;

      switch (keyCode) {
        case keys.left:
          if (self.direction !== 'right') {self.direction = 'left'};
          break;
        case keys.up:
          if (self.direction !== 'down') {self.direction = 'up'};
          break;
        case keys.right:
          if (self.direction !== 'left') {self.direction = 'right'};
          break;
        case keys.down:
          if (self.direction !== 'up') { self.direction = 'down'};
          break;
        case keys.stop:
          self.stop();
          break;
        case keys.start:
          self.start();
          break;
      }
    }
  };

  Game.prototype.addPublisher = function (publisher) {
    this.publishers.push(publisher);
  };

  Game.prototype.compare = function (f, s) {
    return f.x === s.x && f.y === s.y;
  };


  //
  Game.prototype.loop = function () {
    var self = this;

    if(this.pause) return;

    this.paint();

    var i = this.publishers.length;

    while(i--) {
      var publisher = this.publishers[i];
      if(publisher.move) publisher.move();
      if(publisher.paint) publisher.paint(this.context);
    };

    setTimeout(function(){
        self.loop()
    }, 1000 / this.speed);
  };

  Game.prototype.newGame = function () {
    this.direction = 'right';
    this.score = 0;
    this.speed = 2;
  };

  Game.prototype.paint = function () {
    var ctx = this.context;
    ctx.fillStyle = '#658C65';
    ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
    ctx.strokeStyle = '#222';
    ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = 'red';
    ctx.font = 'italic 16px Arial';
    ctx.fillText('Speed: ' + this.speed, 90, this.canvas.height);
    ctx.fillText('Scope:' + this.score, 0, this.canvas.height);
  };

  //Объект Еда
  function Food (game) {
    var self = this;

    this.x = Math.round(Math.random()*(game.canvas.width-game.cell)/game.cell);
    this.y = Math.round(Math.random()*(game.canvas.height-game.cell)/game.cell);

    this.paint = function(ctx){
      ctx.fillStyle = '#222';
      ctx.fillRect(this.x * game.cell, this.y * game.cell, game.cell, game.cell);
      ctx.strokeStyle = '#fff';
      ctx.strokeRect(this.x * game.cell, this.y * game.cell, game.cell, game.cell);
    };

    this.newPosition = function () {
      this.x = Math.round(Math.random()*(game.canvas.width-game.cell)/game.cell);
      this.y = Math.round(Math.random()*(game.canvas.height-game.cell)/game.cell);
    }
  };

  //Объект змейка
  function Snake (game, food) {
    var self = this;

    var snake = [];
    var cell = game.cell;
    var ctx = game.context;
    var position = {
      x: 0,
      y: 0
    };

    this.move = function () {
      if(game.direction === 'left') position.x--;
      if(game.direction === 'right') position.x++;
      if(game.direction === 'up') position.y--;
      if(game.direction === 'down') position.y++;

      //Проверка на столкновение со стенкой или со змейкой
      if (position.x === -1 || position.x * game.cell >= game.canvas.width ||
          position.y === -1 || position.y * game.cell >= game.canvas.height || collision(position)) {

        alert('Game Over!\nYour Score: ' + game.score);
        game.newGame();
        snake = [];
        position = {
          x: 0,
          y: 0
        };

      };

      //Проверка, столкновения с едой.
      if (game.compare(position, food)) {
        game.score++;
        game.speed++;

        food.newPosition();

        if (collision(food)) {
          food.newPosition();
        };

      } else {
        snake.pop();
      }

      snake.unshift({
        x: position.x,
        y: position.y
      });
    };

    this.paint = function (ctx) {
      var cell = game.cell;
      var i = snake.length;

      while(i--) {
        var item = snake[i];
        ctx.fillStyle = '#222';
        ctx.fillRect(item.x * cell, item.y * cell, cell, cell);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(item.x * cell, item.y * cell, cell, cell);
      }
    };

    function collision(position) {
      for(var i = 0; i < snake.length; i++)
        {
          if(snake[i].x  * game.cell === position.x  * game.cell && snake[i].y * game.cell == position.y  * game.cell)

          return true;
        }

        return false;
    };
  };

  //Создание элемента canvas
  var canvas = document.createElement('canvas');
  document.body.appendChild(canvas);

  //Создание объектов
  var game = new Game(canvas);
  var food = new Food(game);
  var snake = new Snake(game,food);

  game.addPublisher(snake);
  game.addPublisher(food);
  game.start();

})()