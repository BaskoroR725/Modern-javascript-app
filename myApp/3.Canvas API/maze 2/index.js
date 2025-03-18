const { Engine, Render, Runner, World, Bodies } = Matter;

const cells = 3;
const width = 600;
const height = 600;

const unitLength = width / cells;

const engine = Engine.create();
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

const shuffle = (arr) =>{
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
const grid = Array(cells)//array
  .fill(null)
  .map(() => Array(cells).fill(false));//element array

const verticals = Array(cells) //inner array vertical
  .fill(null)
  .map(() => Array(cells - 1).fill(false)); //inner element vertical

  const horizontals = Array(cells - 1) //inner array horizontal
  .fill(null)
  .map(() => Array(cells).fill(false)); //inner element horizontal

const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

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
    if(nextRow < 0 || nextRow >= cells || nextColumn < 0 || nextColumn >= cells){
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

    horizontals.forEach((row, rowIndex) =>{
      row.forEach((open, columnIndex) =>{
        if(open){
          return;
        }

        const wall = Bodies.rectangle(
          columnIndex * unitLength + unitLength / 2,
          rowIndex * unitLength + unitLength,
          unitLength,
          10,{
            isStatic : true
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
          columnIndex * unitLength + unitLength,
          rowIndex * unitLength + unitLength / 2,
          10,
          unitLength,{
            isStatic: true
          }
        );
        World.add(world, wall);
      })
    });

    //goal
    const goal = Bodies.rectangle(
      width - unitLength / 2,
      height - unitLength / 2,
      unitLength * .7,
      unitLength * .7,
      {
        isStatic : true
      }
    );
    World.add(world, goal);

    //Ball 
    const ball = Bodies.circle(
      unitLength / 2,
      unitLength / 2,
      unitLength / 4
    );
    World.add(world, ball);
  }


}


stepThroughCells(startRow, startColumn);



