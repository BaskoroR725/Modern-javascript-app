const { Engine, Render, Runner, World, Bodies } = Matter;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: 800,
    height: 600
  }
});
Render.run(render);
Runner.run(Runner.create(), engine);

//walls canvas (position X, position Y, width shape X, height shape Y)
const walls = [
  Bodies.rectangle(400, 0, 800, 40, { isStatic: true }),//x axis
  Bodies.rectangle(400, 600, 800, 40, { isStatic: true }),//x
  Bodies.rectangle(0, 300, 40, 600, { isStatic: true }),//y
  Bodies.rectangle(800,300, 40, 600, { isStatic: true })//y axis
];

World.add(world, walls);

World.add(world, Bodies.rectangle(200, 200, 50, 50));//shape item