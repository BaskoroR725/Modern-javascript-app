const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const cellsHorizontal = 14;
const cellsVertical = 10;
const width = window.innerWidth;
const height = window.innerHeight;

const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

const engine = Engine.create();
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false, //make item shape solid and add random color
    width,
    height
  }
});
Render.run(render);
Runner.run(Runner.create(), engine);

//walls canvas (position X, position Y, width shape X, height shape Y)
const walls = [
  Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true }),//x axis
  Bodies.rectangle(width / 2, height, width, 2, { isStatic: true }),//x
  Bodies.rectangle(0, height / 2, 2, height, { isStatic: true }),//y
  Bodies.rectangle(width, height / 2, 2, height, { isStatic: true })//y axis
];

World.add(world, walls);

//Maze generation

const shuffle = arr =>{
  let counter = arr.length;

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);

    counter --;
    //swapping element
    const temp = arr[counter];
    arr[counter ] = arr[index];
    arr[index] = temp
  }
  return arr;
}

/* const grid = [];

for (let i = 0; i<3; i++){
  grid.push([]); // inner grid array
  for(let j = 0; j<3; j++){
    grid[i].push(false);
  }
}
 */
const grid = Array(cellsVertical)//array
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false));//element array

const verticals = Array(cellsVertical) //inner array vertical
  .fill(null)
  .map(() => Array(cellsHorizontal - 1).fill(false)); //inner element vertical

  const horizontals = Array(cellsVertical - 1) //inner array horizontal
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false)); //inner element horizontal

const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

const stepThroughCells = (row, column) =>{
  //if marking visited
  if (grid[row][column]){ // menghubungkan nilai di grid(false) ke nilai koordinat dari start row dan column
    return;
  }
  //mark this cell, Saat koordinat bergabung dengan nilai grid(false), Mengubah nilai cell jadi true
  grid[row][column] = true; 
  // contoh return [F,F,T],[T,F,F] dan lain lain.

  //assemble randomly ordered list of neighbor
  const neighbors = shuffle([
    [row - 1 , column, 'up'],
    [row, column + 1, 'right' ],
    [row + 1, column, 'down' ],
    [row, column - 1, 'left' ]
  ]);
  //for each neighbors...
  for(let neighbor of neighbors){
    const [nextRow, nextColumn, direction] = neighbor;
    
    //see if that neighbor is out of bounds 
    if(
      nextRow < 0 ||
      nextRow >= cellsVertical ||
      nextColumn < 0 || 
      nextColumn >= cellsHorizontal
    ){
        continue; // skip this from loop(not stopping it), sesuai fungsinya hanya sebagai pembatas 
    }
    //if we have visited that neighbor , contibue to the next neighbor
    if (grid[nextRow][nextColumn]){
      continue;
    }

    //remove a wall from either horizontal or vertical
    if (direction === 'left'){
      verticals[row][column - 1] = true;
    } else if (direction === 'right') {
      verticals[row][column] = true
    } else if (direction === 'up'){
      horizontals[row - 1][column] = true; 
    } else if(direction === 'down'){
      horizontals[row][column] = true;
    }

    stepThroughCells(nextRow, nextColumn);
  }
};

stepThroughCells(startRow, startColumn);

horizontals.forEach((row, rowIndex) =>{
  row.forEach((open, columnIndex) =>{
    if(open){
      return;
    }

    const wall = Bodies.rectangle(
      columnIndex * unitLengthX + unitLengthX / 2,
      rowIndex * unitLengthY + unitLengthY,
      unitLengthX,
      5,{
        label : 'wall',
        isStatic : true,
        render: {
          fillStyle: 'yellow'
        }
      }
    );
    World.add(world, wall);
  });
});

verticals.forEach((row, rowIndex) =>{
  row.forEach((open, columnIndex) =>{
    if (open){
      return;
    }
    const wall = Bodies.rectangle(
      columnIndex * unitLengthX + unitLengthX,
      rowIndex * unitLengthY + unitLengthY / 2,
      5,
      unitLengthY,{
        label : 'wall',
        isStatic: true,
        render: {
          fillStyle: 'yellow'
        }
      }
    );
    World.add(world, wall);
  })
});

//goal
const goal = Bodies.rectangle(
  width - unitLengthX / 2,
  height - unitLengthY / 2,
  unitLengthX * .7,
  unitLengthY * .7,
  {
    label: 'goal',
    isStatic : true,
    render: {
      fillStyle: 'green'
    }
  }
);
World.add(world, goal);

//Ball 
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(
  unitLengthX / 2,
  unitLengthY / 2,
  ballRadius,{
    label: 'ball',
    render: {
      fillStyle: 'skyBlue'
    }
  }
);
World.add(world, ball)

//Keydown event
document.addEventListener('keydown',event => {
  const {x, y} =ball.velocity;

  if (event.code === 'KeyW' || event.code === "ArrowUp" ){
    Body.setVelocity(ball, {x, y: y - 5});
  }
  if (event.code === 'KeyA' || event.code === "ArrowLeft"){
    Body.setVelocity(ball, {x : x - 5, y});
  }
  if (event.code === 'KeyS' || event.code === "ArrowDown"){
    Body.setVelocity(ball, {x, y: y + 5});
  }
  if (event.code === 'KeyD' || event.code === "ArrowRight"){
    Body.setVelocity(ball, {x: x + 5, y});
      }
  })

// win condition
Events.on(engine, 'collisionStart', event => {
  event.pairs.forEach(collision => {
    const labels = ['ball', 'goal'];
    if (
      labels.includes(collision.bodyA.label) &&
      labels.includes(collision.bodyB.label)
    ){
      docum
      world.gravity.y = 1;
      world.bodies.forEach(body =>{
        if (body.label === 'wall'){
          Body.setStatic(body, false);
        }
      });
    }
  });
})


