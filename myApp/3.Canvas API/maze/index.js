const { Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse } = Matter;

const width = 800;
const height = 600;

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

World.add(world, MouseConstraint.create(engine, {
  mouse: Mouse.create(render.canvas)
}));

//walls canvas (position X, position Y, width shape X, height shape Y)
const walls = [
  Bodies.rectangle(400, 0, 800, 40, { isStatic: true }),//x axis
  Bodies.rectangle(400, 600, 800, 40, { isStatic: true }),//x
  Bodies.rectangle(0, 300, 40, 600, { isStatic: true }),//y
  Bodies.rectangle(800,300, 40, 600, { isStatic: true })//y axis
];

World.add(world, walls);

//random shapes
for (let i=0; i<40; i++){
  if (Math.random() > 0.5){
    World.add(world, 
      Bodies.rectangle(Math.random() * width, Math.random() * height, 50, 50));//shape item
  } else {
    World.add(world, 
      Bodies.circle(Math.random() * width, Math.random() * height, 35, {
        render: {
          fillStyle: 'magenta'//custom color to shape
        }
      }));//shape item
  }
}
