const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext("2d");

const canvas2 = document.getElementById("canvas2");
const ctx2 = canvas2.getContext("2d");

const width = canvas.width;
const height = canvas.height;

const window_width = 12;
const window_height = 16;

const shapes = [
  [[1,1,0],
   [0,1,1],
   [0,0,0]],
  [[0,1,1],
   [1,1,0],
   [0,0,0]],
  [[1,1,0],
   [1,1,0],
   [0,0,0]]
];
const long = [
  [1,0,0,0],
  [1,0,0,0],
  [1,0,0,0],
  [1,0,0,0]
]

let mino;

const image = new Image();
image.src = 'chip.png';

const array = [
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1]
];

window.onload = main;
//赤色のMinoブロック
class Mino{
  constructor(_x,_y,num){
    this.x = _x;
    this.y = _y;
    this.type = num;
    this.shape;
    this.width;
    this.height;
    this.vital = true;

    this.init();
    this.tmpshape = this.copyMino();

    this.setThisMinoToArray();
    printArray();

    document.body.addEventListener('keydown',
    event => {
        if (event.key === 'd' && this.vital) {
          if(this.canMoveRight()){
            this.removeThisMinoFromArray();
            this.x += 1;
            this.setThisMinoToArray();
            drawField();
          }
        }

        if (event.key === 'a' && this.vital){
          if(this.canMoveLeft()){
            this.removeThisMinoFromArray();
            this.x -= 1;
            this.setThisMinoToArray();
            drawField();
          }
        }

        if(event.key === 'e' && this.vital){
          this.removeThisMinoFromArray();
          this.rotateR();
          this.setThisMinoToArray();
          drawField();
        }

        if(event.key === 'q' && this.vital){
          this.removeThisMinoFromArray();
          this.rotateL();
          this.setThisMinoToArray();
          drawField();
        }

        if (event.key === 's' && this.vital){
          while(this.canMoveDown()){
            this.removeThisMinoFromArray();
            this.y += 1;
            this.setThisMinoToArray();
            drawField();
            this.vital = false;
          }
        }
    });
    this.THandle = setInterval(() => {
      this.moveDownAutomatically()
    }, 1000)
  }

  init(){
    if(0 <= this.type && this.type <= 2){
      this.width = 3;
      this.height = 3;
      this.shape = new Array(this.width);
      for(let i = 0;i < this.width;i++){
        this.shape[i] = new Array(this.width).fill(0);
        console.log(this.type);
        this.shape[i] = shapes[this.type][i].concat();
      }
    }else{
      this.width = 4;
      this.height = 4;
      this.shape = new Array(this.width);
      for(let i = 0;i < this.width;i++){
        this.shape[i] = new Array(this.width).fill(0);
        this.shape[i] = long[i].concat();
      }
    }
  }

  copyMino(){
    let arr = new Array(this.height);
    for(let i = 0; i < this.height;i++){
      arr[i] = new Array(this.width);
    }
    for(let i = 0; i < this.height;i++){
      for(let j = 0;j < this.width;j++){
        arr[i][j] = this.shape[i][j];
      }
    }
    return arr;
  }

  incThisY(){
    this.y++;
  }

  rotateR(){
    for(let i = 0; i < this.height;i++){
      for(let j = 0; j < this.width;j++){
        this.shape[i][j] = this.tmpshape[this.width - 1 -j][i];
      }
    }
    this.tmpshape = this.copyMino();
  }

  rotateL(){
    this.rotateR();
    this.rotateR();
    this.rotateR();
  }

  moveDownAutomatically(){
    console.log("O");
    if(this.canMoveDown()){
      this.removeThisMinoFromArray();
      this.y += 1;
      this.setThisMinoToArray();
      drawField();
    }else{
      this.vital = false;
      clearInterval(this.THandle);
    }
  }

  //右に動かせるか
  canMoveRight(){
    for(let i = 0;i < this.height;i++){
      for(let j = 0 ;j < this.width;j++){
        if(this.getThisShape(j,i) == 1 && this.getThisShape(j+1,i) == 0){
          if(getArray(this.x + j + 1,this.y + i) != 0){
            return false;
          }
        }
      }
    }
    return true;
  }

  //左に動かせるか
  canMoveLeft(){
    for(let i = 0;i < this.height;i++){
      for(let j = this.width-1 ;j >= 0;j--){
        if(this.getThisShape(j,i) == 1 && this.getThisShape(j-1,i) == 0){
          if(getArray(this.x + (j-1),this.y + i) != 0){
            return false;
          }
        }
      }
    }
    return true;
  }
  //下方向の移動ができるか.
  canMoveDown(){
    for(let i = 0; i < this.width;i++){
      for(let j = 0;j < this.height;j++){
        if(this.getThisShape(i,j) == 1 && this.getThisShape(i,j+1) == 0){
          if(getArray(this.x+i,this.y+j+1) != 0){
            return false;
          }
        }
      }
    }
    return true;
  }

  getThisShape(_x,_y){
    if(_x < 0 || _x >= this.width || _y < 0 || _y >= this.height){
      return 0;
    }
    return this.shape[_y][_x];
  }

  removeThisMinoFromArray(){
    for(let i = 0; i < this.height;i++){
      for(let j = 0; j < this.width;j++){
        if(this.shape[i][j] == 1){
          setArray(this.x+j,this.y+i,0);
        }
      }
    }
  }

  setThisMinoToArray(){
    for(let i = 0; i < this.height;i++){
      for(let j = 0; j < this.width;j++){
        console.log(this.shape[i][j] + "OK");
        if(this.shape[i][j] === 1){
          setArray(this.x+j,this.y+i,2+this.type);
        }
      }
    }
  }
}

function printArray(){
    for(let j = 0; j < 16;j++){
      console.log(array[j]);
    }
}

function setArray(_x,_y,_num){
  array[_y][_x] = _num;
}

function getArray(_x,_y){
  if(_x < 0 || _x >= window_width || _y < 0 || _y >= window_height){
    return 1;
  }
  return array[_y][_x];
}

function deleteLine(num){
  var tmparray = new Array(window_width);
  for(let i = 0;i < window_height;i++){
    tmparray[i] = new Array(window_width);
    tmparray[i] = array[i].concat();
  }
  for(let i = num;i > 0;i--){
    array[i] = tmparray[i-1].concat();
  }
  for(let i = 0; i < window_height;i++){
    console.log(array[i]);
  }
  array[0] = [1,0,0,0,0,0,0,0,0,0,0,1];
  mino.incThisY();
  drawField();
}

function detectFullLine(){
  var tmp;
  for(let i = 0; i < window_height-1;i++){
    tmp = 0;
    for(let j = 0; j < window_width;j++){
      if(array[i][j] == 0){
        tmp += 1;
        continue;
      }
    }
    if(tmp == 0){
      deleteLine(i);
    }
  }
}

function main(){
  mino = new Mino(5,0,4);
  drawField();
  setInterval(function(){
    if(!mino.vital){
      mino = new Mino(5,0,Math.ceil(Math.random() * 10) % 5);

    }
    detectFullLine();
  },10)
}

function drawField(){
  for(let i = 0; i < 16;i++){
    for(let j = 0; j < 12;j++){
      if(array[i][j] > 0){
        drawChip(j,i,array[i][j] - 1);
      }else{
        drawChip(j,i,7);
      }
    }
  }
}

function drawChip(_x,_y,num){
  ctx.drawImage(image,32*num,0,32,32,_x*32,_y*32,32,32);
}
