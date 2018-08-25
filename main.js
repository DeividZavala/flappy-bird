var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d")
var frames = 0;
var interval;
var gravity = 2 ;
var pipes = [];


class Flappy{

    constructor(){
        this.x = 120;
        this.y = 200;
        this.width = 30;
        this.height = 30;
        this.image = new Image();
        this.image.src = "./images/flappy.png"
    }

    rise(){
        this.y -= 60
    }

    collision(item){
        return  (this.x < item.x + item.width) &&
                (this.x + this.width > item.x) &&
                (this.y < item.y + item.height) &&
                (this.y + this.height > item.y);
    }

    draw(){
        if(this.y < canvas.height - 20) this.y += gravity;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

}

class Pipe{
    constructor(pos, y,  height){
        this.x = canvas.width;
        this.y = y;
        this.width = 60;
        this.height = height;
        this.image = new Image();
        this.image.src = pos === "top" ? "./images/obstacle_top.png" : "./images/obstacle_bottom.png";
    }

    draw(){
        this.x -= 2;
        ctx.globalCompositeOperation='source-over';
        ctx.drawImage(this.image, this.x, this.y, this.width ,this.height);
    }

}

class Background{

    constructor(){
        this.x = 0;
        this.y = 0;
        this.width = canvas.width;
        this.height = canvas.height;
        this.image = new Image();
        this.image.src = "./images/bg.png"
    }

    gameOver(){
        ctx.font = "80px Avenir";
        ctx.fillText("Game Over", 20,100);
        ctx.font = "20px Serif";
        ctx.fillStyle = 'peru';
        ctx.fillText("Press 'Esc' to reset", 20,150);
    }

    draw(){
        this.x--;
        if(this.x < -canvas.width) this.x = 0;
        ctx.drawImage(this.image, this.x, this.y, this.width,this.height);
        ctx.drawImage(this.image, this.x + canvas.width , this.y, this.width, this.height)
        ctx.font = "40px Roboto"
        ctx.fillText(Math.round(frames/60), 650, 50);
    }
    
}


var fondo = new Background();
var flappy = new Flappy();


function update(){
    frames++
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    fondo.draw();
    flappy.draw();
    generatePipes();
    drawPipes();
}

function start(){

    interval = setInterval(update, 1000/60);

}

function generatePipes(){
    if(!(frames%120===0) ) return;
    var height = Math.floor((Math.random() * canvas.height * .6 ) + 30 );
    var pipe1 = new Pipe('top', 0, height);
    var pipe2 = new Pipe(null, pipe1.height + 120, canvas.height - 120)
    pipes.push(pipe1);
    pipes.push(pipe2);
}


function drawPipes(){
    pipes.forEach((pipe, index)=>{
        if(pipe.x < -canvas.width - 60) return pipes.splice(index, 2);
        pipe.draw();
        if(flappy.collision(pipe)){
            gameOver()
        }
    })
}


function gameOver(){
    clearInterval(interval);
    fondo.gameOver();
}

function restart(){
    frames = 0;
    interval = undefined;
    pipes = [];
    start();
}


addEventListener("keydown", function(e){
    if(e.keyCode === 32){
        flappy.rise();
    }
    if(e.keyCode === 27){
        restart();
    }
})

start();



