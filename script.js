window.onload = function () {
  var canvas;
  canvasW = 900;
  canvasH = 460;
  var ctx;
  var delay = 200;
  var blockSize = 30;
  var snakee;
  var applee;
  var widthInBlocks = canvasW / blockSize;
  var heightInBlocks = canvasH / blockSize;
  var score;
  var timeout;

  Init();

  function Init() {
    canvas = document.createElement("canvas");
    canvas.width = canvasW;
    canvas.height = canvasH;
    canvas.style.border = "30px solid #893B19";
    canvas.style.display = "block";
    canvas.style.backgroundColor = "#ABE39B";
    canvas.style.margin = "0px auto";
    document.body.appendChild(canvas);
    // Créer un snake
    ctx = canvas.getContext("2d");
    snakee = new Snake(
      [
        [9, 4],
        [8, 4],
        [7, 4],
        [6, 4],
        [6, 4],
        [5, 4],
        [4, 4],
        [3, 4],
        [2, 4],
        [1, 4],
      ],
      "right"
    );
    applee = new Apple([10, 10]);
    score = 0;
    RefreshCanvas();
  }

  function RefreshCanvas() {
    snakee.advance();
    if (snakee.checkCollision()) {
      gameOver();
    } else {
      if (snakee.isEatingApple(applee)) {
        score++;
        if (delay > 70) {
          delay -= 10;
        }

        snakee.ateApple = true;
        do {
          applee.setNewPosition();
        } while (applee.isOnSnake(snakee));
      }
      ctx.clearRect(0, 0, canvasW, canvasH);
      drawScore();
      snakee.draw();
      applee.draw();
      timeout = setTimeout(RefreshCanvas, delay);
    }
  }

  // serpent constructor
  function Snake(body, direction) {
    this.body = body;
    this.ateApple = false;
    this.draw = function () {
      ctx.save();
      ctx.fillStyle = "#4AB02E";
      // dessiner chaque block du corps du serpent:
      for (var i = 0; i < this.body.length; i++) {
        drawBlock(ctx, this.body[i]);
      }
      ctx.restore();
    };
    this.direction = direction;
    // pour le faire avancer
    this.advance = function () {
      var nextPosition = this.body[0].slice();
      switch (this.direction) {
        case "left":
          nextPosition[0] -= 1;
          break;
        case "right":
          nextPosition[0] += 1;
          break;
        case "up":
          nextPosition[1] -= 1;
          break;
        case "down":
          nextPosition[1] += 1;
          break;
        default:
          throw "invalid Direction";
      }
      this.body.unshift(nextPosition);
      if (!this.ateApple) this.body.pop();
      else this.ateApple = false;
    };
    this.setDirection = function (newDirection) {
      var allowedDirections;
      switch (this.direction) {
        case "left":
        case "right":
          allowedDirections = ["up", "down"];
          break;
        case "up":
        case "down":
          allowedDirections = ["left", "right"];
          break;
        default:
          throw "invalid Direction";
      }
      if (allowedDirections.indexOf(newDirection) > -1) {
        this.direction = newDirection;
      }
    };
    this.checkCollision = function () {
      var wallCollision = false;
      var snakeCollision = false;
      var head = this.body[0];
      var rest = this.body.slice(1);
      var snakeX = head[0];
      var snakeY = head[1];
      var minX = 0;
      var minY = 0;
      var maxX = widthInBlocks - 1;
      var maxY = heightInBlocks - 1;
      var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
      var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

      if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
        wallCollision = true;

      for (var i = 0; i < rest.length; i++) {
        if (snakeX === rest[i][0] && snakeY === rest[i][1])
          snakeCollision = true;
      }

      return wallCollision || snakeCollision;
    };
    this.isEatingApple = function (appleToEat) {
      var head = this.body[0];
      if (
        head[0] === appleToEat.position[0] &&
        head[1] === appleToEat.position[1]
      )
        return true;
      else return false;
    };
  }

  function drawBlock(ctx, position) {
    var x = position[0] * blockSize; // position du block * la taille du block
    var y = position[1] * blockSize;
    ctx.fillRect(x, y, blockSize, blockSize); // remplir le block
    ctx.fillStyle = "#30D522";
  }

  document.onkeydown = function handleKeyDown(e) {
    var key = e.keyCode;
    var newDirection;
    switch (key) {
      case 37:
        newDirection = "left";
        break;
      case 38:
        newDirection = "up";
        break;
      case 39:
        newDirection = "right";
        break;
      case 40:
        newDirection = "down";
        break;
      case 32:
        restart();
        return;
      default:
        return;
    }
    snakee.setDirection(newDirection);
  };

  function Apple(position) {
    this.position = position;
    this.draw = function () {
      ctx.save();
      ctx.fillStyle = "#ff0000";
      ctx.beginPath();
      var radius = blockSize / 2;
      var x = this.position[0] * blockSize + radius;
      var y = this.position[1] * blockSize + radius;
      ctx.arc(x, y, radius, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.restore();
    };
    this.setNewPosition = function () {
      var newX = Math.round(Math.random() * (widthInBlocks - 1));
      var newY = Math.round(Math.random() * (heightInBlocks - 1));
      this.position = [newX, newY];
    };
    this.isOnSnake = function (snakeToCheck) {
      var isOnSnake = false;
      for (var i = 0; i < snakeToCheck.body.length; i++) {
        if (
          this.position[0] === snakeToCheck.body[i][0] &&
          this.position[1] === snakeToCheck.body[i][1]
        ) {
          isOnSnake = true;
        }
      }
      return isOnSnake;
    };
  }

  function drawScore() {
    ctx.save();
    ctx.font = "bold 50px sans-serif";
    ctx.fillStyle = "grey";
    ctx.fillText(score.toString(), canvasW / 2, 50);
    ctx.textBaseline = "middle"; // pour que les lettres du texte soit au milieu de l'alignement
    ctx.restore();
  }

  function gameOver() {
    ctx.save();

    ctx.font = "bold 70px sans-serif";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    var centreX = canvasW / 2;
    var centreY = canvasH / 2;
    ctx.strokeText("Game Over", centreX, centreY - 50);
    ctx.fillText("Game Over", centreX, centreY - 50);
    ctx.font = "bold 30px sans-serif";
    ctx.strokeText(
      "Appuyer sur la touche Espace pour rejouer",
      centreX,
      centreY + 10
    );
    ctx.fillText(
      "Appuyer sur la touche Espace pour rejouer !",
      centreX,
      centreY + 10
    );
    ctx.restore();
  }

  function restart() {
    snakee = new Snake(
      [
        [9, 4],
        [8, 4],
        [7, 4],
        [6, 4],
        [6, 4],
        [5, 4],
        [4, 4],
        [3, 4],
        [2, 4],
        [1, 4],
      ],
      "right"
    );
    applee = new Apple([10, 10]);
    score = 0;
    delay = 200;
    clearTimeout(timeout);
    RefreshCanvas();
  }
};
