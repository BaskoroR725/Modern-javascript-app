const { Engine, Render, Runner, World, Bodies } = Matter;

const width = 600;
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

//walls canvas (position X, position Y, width shape X, height shape Y)
const walls = [
  Bodies.rectangle(width / 2, 0, width, 40, { isStatic: true }),//x axis
  Bodies.rectangle(width / 2, height, width, 40, { isStatic: true }),//x
  Bodies.rectangle(0, height / 2, 40, height, { isStatic: true }),//y
  Bodies.rectangle(width, height / 2, 40, height, { isStatic: true })//y axis
];

World.add(world, walls);


