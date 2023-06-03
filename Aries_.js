let o; // mathmatical constnts 
let b; 
let p; //"you down with OBP (yeah you know me!)"

let num = 1500; //number of points
let numSlider;
const tsize = 100; //length of point tails
const waitTime = 35 * 30; //time between each shape (seconds * FPS)
let a = []; // array of points
let starts=[];
let font;
let font_peace;
let poof;
let starwalk;
let isOrbiting = true;
let mx;
let mv;
let stop=0;
let input;
let button;
let userInput = '지구에서 별까지 쉬운 길은 없다';
/*
let points = [
  [-110 / 100 * 20, 80 / 100 * 20, 100 / 100 * 20],
  [20 / 100 * 20,60 / 100 * 20, 100 / 100 * 20],
  [60 / 100 * 20, 40 / 100 * 20, 100 / 100 * 20],
  [70 / 100 * 20, 20 / 100 * 20, 100 / 100 * 20]

];*/
let points = [
  [83.3 / 100 * 70, 38.46 / 100 * 70, 93.24 / 100 * 70],
  [82.02 / 100 * 70, 37.88/ 100 * 70, 92.70 / 100 * 70],
  [41.14 / 100 * 70, 16.71 / 100 * 70, 82.67 / 100 * 70],
  [48.62 / 100 * 70, 33.32 / 100 * 70, 76.69 / 100 * 70]

];
/*
let points = [
  [83.3, 38.46, 93.24],
  [82.02, 37.88, 92.70],
  [41.14, 16.71, 82.67],
  [48.62, 33.32, 76.69]

];
*/
/*to add another shape to the system:
add another variable case to lorenz/constructor,
add another function case to lorenz/calculate,
add 1 to numShapes in newLorenz
add another if else case to newLorenz with the initail contitions s (randomness) and speed (runtime speed)
optional : add another text case to draw
*/


function preload(){
  font_peace = loadFont('PyeongChangPeace-Light.ttf');
  font_peace_B = loadFont('PyeongChangPeace-Bold.ttf');
  font_bit = loadFont('DungGeunMo.ttf');
  font = loadFont("MomcakeThin-9Y6aZ.otf");
  poof = loadImage("poof.png");
  starwalk = loadImage("starwalk.png");
}

/*****************************************************************************************************************
 * class that holds the position of each individual point, as well as the trail it leaves behind.
 * 
 * calculate function takes the current position, throws it into some funky math, then you get the delta V.
 * add the deltaV*timestep to the current position and you have the moving point.
 * 
 * the position is recorded to an array length "tsize" then a trail using those positions is drawn once per frame.
 * the trail uses the distance between the current point and the next point to decide how smooth to draw the line.
 * I wanted to make the trail fade to trasparent near the end, but I couldn't figure out an easy way to do that.
 ****************************************************************************************************************/
class lorenz{
  constructor(x,y,z,h,k){
    this.pos = createVector(x,y,z);
    this.dV = createVector(0,0,0);
    
    this.v1 = createVector(0,0,0);
    this.v2 = createVector(0,0,0);
    this.prev = [];
    this.prev.push(this.pos.array());
    this.prev.push(this.pos.array());
    this.c = h;
    this.avg = 0;
    

    this.k = k;

    //initailize variables (variable case)
    switch(k){
      case 0://lorenz attractor
        o = 10;
        p = 28; 
        b = 8/3;
      break;
      case 1://chen attractor
        o = 40;
        p = 3;
        b = 28;
      break;
      case 2://chua chaotic attractor
        o = 10.82;
        p = 14.286;
        this.h;
      break;
      case 3://"modified" rossler attractor
        o = 0.1;
        p = 0.1;
        b = 14;
      break;

    }
  }

  /*****************************************************************************
   * runs the functions that make the patterns
   * uses the above constants to control the shape
   * all are accurate to the original functions apart from the rossler attractor
   * that was modified to prevent numbers approacing infinity
   ****************************************************************************/
  calculate(t){
    switch (this.k) { //function cases
      case 0://lorenz
        this.dV.set(this.pos.x + t * o * (this.pos.y - this.pos.x),
          this.pos.y + t * (this.pos.x*(p-this.pos.z) - this.pos.y),
          this.pos.z + t * ((this.pos.x*this.pos.y)-(b*this.pos.z)));
        break;
      case 1://chen
        this.dV.set((this.pos.x + t * o * (this.pos.y - this.pos.x)),
          this.pos.y + t * ((b - o)* this.pos.x - this.pos.x*this.pos.z + b*this.pos.y),
          this.pos.z + t * ((this.pos.x*this.pos.y)-(p*this.pos.z)));
        break;
      case 2://chua
        this.h = -0.11 * sin((PI*this.pos.x)/2.6);
        this.dV.set((this.pos.x + t * (o * (this.pos.y - this.h))),
          this.pos.y + t *(this.pos.x - this.pos.y + this.pos.z),
          this.pos.z + t * (-p * this.pos.y));
        break;
      case 3://rossler
        this.dV.set(this.pos.x + t * ((-this.pos.y - pow(o * this.pos.z,2))),
          this.pos.y + t * (this.pos.x + (o * this.pos.y) ),
          this.pos.z + t * ( p + this.pos.z * (this.pos.x - b)));
        break;
    }
    this.pos.set(this.dV);
  }


  /****************************
   * draws the points and tails 
   ***************************/
  draw(){
    //yes the point at the front is a sphere
   
    push();
    translate(this.pos.x,this.pos.y, this.pos.z);
    //sphere(0.5,3,3);
    stroke(255,255,255);
    sphere(random(0.3,0.5));
   
    pop();
    
    
  }

}




let C;
/*******************************************
 * creates and sets up a new attractor shape
 ******************************************/
function newLorenz(A){
  let numShapes = 4;

  A = (A+1)%numShapes; //iterates next attractor

  let s = 1;//randomness
  let x = 1;//direction specific randomness
  let y = 1;
  let z = 1;

  //remove previous attractor
  while(a.length > 0){
    a.pop();
  }

  //setup initial variables
  if(A == 0){
    s = 200;
    sspeed = 0.0005;
  }else if(A == 1){
    s = 200;
    sspeed = 0.0005;
  }else if(A == 2){
    s = 200;
    sspeed = 0.01;
  }else if(A == 3){
    s =200;
    //x =20;
    //y = 20;
    //z = 0; 
    sspeed = 0.002;
  }
  
  //make new attractor with randomized colors
 C = random(0,100);
  for(let i = 0; i < num; i++){
    a.push(new lorenz(random(x *s,x *-s),random(y *s,y *-s),random(z *s,z *-s),abs(randomGaussian(C,5)) % 100,A));
  }

  return (A);
}


/*******************************************
 * controls the smooth rotation of the shape
 ******************************************/

function orbit() {
    if (mouseIsPressed) {
      mv.add((mouseX - pmouseX) / 1000, (pmouseY - mouseY) / 1000);
    }
    mv.mult(0.9); // 회전 속도를 천천히 감소시킴
    mx.add(mv);
    rotateX(mx.y);
    rotateY(mx.x);
}

function setup() {
  mx = createVector(0,0);
  mv = createVector(0,0);

  createCanvas(windowWidth, windowHeight, WEBGL);
  //createCanvas(displayWidth, displayHeight, WEBGL);
  strokeWeight(1);
  noFill();
  
  background(0);
  perspective(PI/4,width/height,1,1000);
  colorMode(HSL,100);
  blendMode(ADD);
  textFont(font_peace);
  textAlign(CENTER,CENTER);
  camera(0,0,150);
  
  numSlider = createSlider(0, 1500, 1500, 1);
  numSlider.position(50, 100);
  numSlider.style('background-color', 'gray');
  numSlider.style('border-radius', '30px');
  numSlider.style('height', '20px');
  numSlider.style('width', '200px');
  numSlider.style('appearance', 'none');
  numSlider.style('cursor', 'point');

  // 슬라이더의 min과 max 속성 설정
  numSlider.attribute('min', '0');
  numSlider.attribute('max', '1500');
  
  input = createInput();
  input.position(40, 200);
  input.style('background-color', 'gray');
  input.style('border-radius', '5px');
  
  button = createButton('입력');
  button.position(input.x + input.width + 10, 200);
  button.style('border-radius', '5px');
  button.style('font-family', 'font_peace');
  button.mousePressed(getUserInput);
  
}

let time = waitTime +1;
let aType = -1;
let sspeed;

function draw() {
  num = numSlider.value();
  if(time >waitTime){
    time = 0;
    aType = newLorenz(aType);
  }
  time ++;
  frameRate(30);
  
  background(0);
  fill(255,255,255);
  textSize(10);

  push();
  translate(0,0,-100);
  text("양자리",0,-90);
  textSize(4);
  text("*화면을 움직여 자유롭게 둘러보세요",0,-80);
  textFont(font_peace_B);
  textSize(10);
  text(userInput, 0,-50);
 // image(starwalk,0,0,30,14); //logo
 stroke(255,255,255);
 strokeWeight(8);
 fill(255,255,255,50);
 //rect(-180,-80,30,10,3);
  fill(255,255,255,30);
  stroke(255,255,255);
  strokeWeight(5);
  textFont(font_bit);
  
//  translate(0, 0, -30);
  rect(-190,-100,50,60,5);
  translate(0,0,0);
  fill(255,255,255);
  textSize(3);
  text("별의 개수를 조정해보세요", -165, -85);
  text("원하는 문구로 바꿔보세요", -165, -65);
      text('* 양자리 정보 *', -165,-55);
  text('3월21일(춘분)~4월19일(곡우)',-165,-50);
  text("수호성 ~ 화성",-165,-45);
  push(); // rect 내부 그리기 상태 저장
  translate(0,0,-100);
  fill(255,255,255); // 글씨 색상 설정
  textAlign(CENTER, CENTER);
  //textSize(10); // 글씨 크기 설정
  //text("화면저장", 155, -70);
  //text("'s'키", 155, -50);


  pop(); // rect 내부 그리기 상태 복원
  
  pop();
  orbit();

  //noFill();
  if(stop===0){
  mx.add(0.005);
  }
  mouseClicked();
  push();
  for(let x = 0; x < num; x++){
    a[x].calculate(0);
    a[x].draw();
    
  }


stroke(255,255,255);
translate(0,0,-100);
push();
    stroke(255, 255, 0);
    strokeWeight(20);
  for (let i = 0; i < points.length; i++) {
    let x = points[i][0];
    let y = points[i][1];
    let z = points[i][2];
    
    // 점의 색상 설정
    stroke(255,255,255);
    strokeWeight(20);
    // 점의 위치 설정
    point(x, y, z);
    
    // 이전 점과 다음 점을 잇는 선을 그림
    if (i > 0) {
      let prevX = points[i - 1][0];
      let prevY = points[i - 1][1];
      let prevZ = points[i - 1][2];
      
      // 선의 색상 설정
      stroke(255, 255, 255);
      strokeWeight(10);
      
      // 이전 점과 현재 점을 잇는 선을 그림
      line(prevX, prevY, prevZ, x, y, z);
    }
  }
pop();

}

function keyPressed(){
  time = waitTime;
}

function keyPressed() {
  if (key === "s" || key === "S") {
    saveCanvas("starwalk", "jpg");
  }
}
function mouseClicked() {
  if (mouseX >= -180 && mouseX <= -150 && mouseY >= -80 && mouseY <= -70) {
    stop = 1;
  }
}

function getUserInput() {
  userInput = input.value();
  input.value('');
}
