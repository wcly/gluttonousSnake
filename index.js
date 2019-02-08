// 点击开始游戏 -> startPage消失 -> 游戏开始
// 随机出现食物，出现三节蛇开始运动
// 上下左右 ->  改变方向
// 判断是否吃到食物 -> 食物消失，蛇加一
// 判断游戏结束，弹出框

let content = document.getElementById('content');
let startPage = document.getElementById('startPage');
let score = document.getElementById('score');
let lose = document.getElementById('lose');
let loseScore = document.getElementById('loseScore');
let close = document.getElementById('close');
let startAndPauseBtn = document.getElementById('startAndPause');
let startBtn = document.getElementById('startBtn');
let wrapper = document.getElementById('wrapper');
let startGameBool = true;
let startPauseBool = true;
let snakeMoveTimer;
let speed = 200;

function init() {
    //地图
    this.mapW = parseInt(getComputedStyle(content).width);
    this.mapH = parseInt(getComputedStyle(content).height);
    this.mapDiv = content;
    //食物
    this.foodW = 20;
    this.foodH = 20;
    this.foodX = 0;
    this.foodY = 0;
    //蛇
    this.snakeW = 20;
    this.snakeH = 20;
    this.snakeBody = [
        [3, 1, 'head'],
        [2, 1, 'body'],
        [1, 1, 'body'],
    ];
    //游戏属性
    this.direct = 'right';
    this.left = false;
    this.right = false;
    this.up = true;
    this.down = true;

    this.score = 0;
}

bindEvent();

function startGame() {
    startPage.style.display = 'none';
    startAndPauseBtn.style.display = 'block';
    wrapper.style.display = 'block';
    init();
    food();
    snake();
}

// 生成食物
function food() {
    let food = document.createElement('div');
    food.style.width = this.foodW + 'px';
    food.style.height = this.foodH + 'px';
    food.style.position = 'absolute';
    this.foodX = Math.floor(Math.random() * (this.mapW / this.foodW));
    this.foodY = Math.floor(Math.random() * (this.mapH / this.foodH));
    food.style.left = this.foodX * this.foodW + 'px';
    food.style.top = this.foodY * this.foodH + 'px';
    this.mapDiv.appendChild(food).setAttribute('class', 'food');
}

//生成蛇
function snake() {
    for (let i = 0; i < this.snakeBody.length; i++) {
        let snake = document.createElement('div');
        snake.style.width = this.snakeW + 'px';
        snake.style.height = this.snakeH + 'px';
        snake.style.position = 'absolute';
        snake.style.left = this.snakeBody[i][0] * this.snakeW + 'px';
        snake.style.top = this.snakeBody[i][1] * this.snakeH + 'px';
        snake.classList.add(this.snakeBody[i][2]);
        this.mapDiv.appendChild(snake).classList.add('snake');
        switch (this.direct) {
            case 'right':
                break;
            case 'left':
                snake.style.transform = 'rotate(90deg)';
                break;
            case 'up':
                snake.style.transform = 'rotate(180deg)';
                break;
            case 'down':
                snake.style.transform = 'rotate(0deg)';
                break;
            default:
                break;
        }
    }
}

//移动
function move() {
    for (let i = this.snakeBody.length - 1; i > 0; i--) {
        this.snakeBody[i][0] = this.snakeBody[i - 1][0];
        this.snakeBody[i][1] = this.snakeBody[i - 1][1];
    }
    switch (this.direct) {
        case 'right':
            this.snakeBody[0][0] += 1;
            break;
        case 'left':
            this.snakeBody[0][0] -= 1;
            break;
        case 'up':
            this.snakeBody[0][1] -= 1;
            break;
        case 'down':
            this.snakeBody[0][1] += 1;
            break;
        default:
            break;
    }
    removeClass('snake');
    snake();
    //吃到食物
    if (this.snakeBody[0][0] == this.foodX && this.snakeBody[0][1] == this.foodY) {
        let snakeEndX = this.snakeBody[this.snakeBody.length - 1][0];
        let snakeEndY = this.snakeBody[this.snakeBody.length - 1][1];
        switch (this.direct) {
            case 'right':
                this.snakeBody.push([snakeEndX + 1, snakeEndY, 'body']);
                break;
            case 'left':
                this.snakeBody.push([snakeEndX + 1, snakeEndY, 'body']);
                break;
            case 'up':
                this.snakeBody.push([snakeEndX, snakeEndY - 1, 'body']);
                break;
            case 'down':
                this.snakeBody.push([snakeEndX, snakeEndY + 1, 'body']);
                break;
            default:
                break;
        }
        this.score++;
        score.innerHTML = this.score;
        removeClass('food');
        food();
    }
    //碰到左右边界
    if (this.snakeBody[0][0] < 0 || this.snakeBody[0][0] >= this.mapW / this.snakeW) {
        reloadGame();
    }
    //碰到上下边界
    if (this.snakeBody[0][1] < 0 || this.snakeBody[0][1] >= this.mapH / this.snakeH) {
        reloadGame();
    }
    let snakeHeadX = this.snakeBody[0][0];
    let snakeHeadY = this.snakeBody[0][1];
    //碰到自己
    for (let i = 1; i < this.snakeBody.length; i++) {
        if (snakeHeadX == snakeBody[i][0] && snakeHeadY == snakeBody[i][1]) {
            reloadGame();
        }
    }
}

function reloadGame() {
    removeClass('snake');
    removeClass('food');
    clearInterval(snakeMoveTimer);
    this.snakeBody = [
        [3, 1, 'head'],
        [2, 1, 'body'],
        [1, 1, 'body'],
    ];
    //游戏属性
    this.direct = 'right';
    this.left = false;
    this.right = false;
    this.up = true;
    this.down = true;

    loseScore.innerHTML = this.score;
    this.score = 0;

    lose.style.display = 'block';
    score.innerHTML = this.score;

    startGameBool = true;
    startPauseBool = true;
    startAndPauseBtn.setAttribute('src','./imgs/pause.png');
}

function removeClass(className) {
    let ele = document.getElementsByClassName(className);
    while (ele.length > 0) {
        ele[0].parentNode.removeChild(ele[0]);
    }
}

function setDirect(code) {
    switch (code) {
        case 37:
            if (this.left) {
                this.direct = 'left';
                this.left = false;
                this.right = false;
                this.up = true;
                this.down = true;
            }
            break;
        case 38:
            if (this.up) {
                this.direct = 'up';
                this.left = true;
                this.right = true;
                this.up = false;
                this.down = false;
            }
            break;
        case 39:
            if (this.right) {
                this.direct = 'right';
                this.left = false;
                this.right = false;
                this.up = true;
                this.down = true;
            }
            break;
        case 40:
            if (this.down) {
                this.direct = 'down';
                this.left = true;
                this.right = true;
                this.up = false;
                this.down = false;
            }
            break;
        default:
            break;
    }
}

function bindEvent() {
    close.onclick = () => {
        lose.style.display = 'none';
    }

    startBtn.onclick = () => {
        startAndPause();
    }

    startAndPauseBtn.onclick = () => {
        startAndPause();
    }
}

function startAndPause() {
    if (startPauseBool) {
        if (startGameBool) {
            startGame();
            startGameBool = false;
        }
        startAndPauseBtn.setAttribute('src', './imgs/play.png');
        document.onkeydown = (e) => {
            let code = e.keyCode;
            setDirect(code);
        }
        snakeMoveTimer = setInterval(() => {
            move();
        }, speed);
        startPauseBool = false;
    } else {
        startAndPauseBtn.setAttribute('src', './imgs/pause.png');
        clearInterval(snakeMoveTimer);
        document.onkeydown = e => {
            e.returnValue = false;
            return false;
        }
        startPauseBool = true;
    }
}