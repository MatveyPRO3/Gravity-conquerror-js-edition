const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(devicePixelRatio);

const ambientlight1 = new THREE.AmbientLight(0xFFFFFF, 1);
scene.add(ambientlight1);

document.body.appendChild(renderer.domElement);

//dat-gui
const world = {
    grav_const: 0.00000099 * 10 ** 6,
    camera_zoom: 1000,
    acceleration: 0.01 * 10 ** 2,
    subst_dnst: 0.003 * 10 ** 3,
    planets: {
        mars: {
            mars_x: 0,
            mars_y: 0,
            mars_mass: 100000,
            mars_r: 7
        },
        jupiter: {
            jupiter_x: 0,
            jupiter_y: 0,
            jupiter_mass: 10000000,
            jupiter_r: 30
        }
    }
}
const gui = new dat.GUI();
gui.add(world, "grav_const", 0, 3).onChange(() => { GravityConstant = world.grav_const / 10 ** 6 });
gui.add(world.planets.mars, "mars_x", -500, 500).onChange(() => {
    Mars.position.x = world.planets.mars.mars_x;
    for (let i of gravity_radiuses) {
        scene.remove(i);
    }
    gravity_radiuses = [];
    for (let i of planets) {
        creategravityradius(i, i.geometry.parameters.radius);
    }
}
);
gui.add(world.planets.mars, "mars_y", -500, 500).onChange(() => {
    Mars.position.y = world.planets.mars.mars_y;
    for (let i of gravity_radiuses) {
        scene.remove(i);
    }
    gravity_radiuses = [];
    for (let i of planets) {
        creategravityradius(i, i.geometry.parameters.radius);
    }
}
);
gui.add(world.planets.mars, "mars_mass", 0, 1000000).onChange(() => {
    Mars.mass = world.planets.mars.mars_mass;
}
);
gui.add(world.planets.mars, "mars_r", 0, 20).onChange(() => {
    Mars.geometry.parameters.radius = world.planets.mars.mars_r;
    for (let i of gravity_radiuses) {
        scene.remove(i);
    }
    gravity_radiuses = [];
    for (let i of planets) {
        creategravityradius(i, i.geometry.parameters.radius);
    }
}
);
gui.add(world.planets.jupiter, "jupiter_x", -500, 500).onChange(() => {
    Jupiter.position.x = world.planets.jupiter.jupiter_x;
    for (let i of gravity_radiuses) {
        scene.remove(i);
    }
    gravity_radiuses = [];
    for (let i of planets) {
        creategravityradius(i, i.geometry.parameters.radius);
    }
}
);
gui.add(world.planets.jupiter, "jupiter_y", -500, 500).onChange(() => {
    Jupiter.position.y = world.planets.jupiter.jupiter_y;
    for (let i of gravity_radiuses) {
        scene.remove(i);
    }
    gravity_radiuses = [];
    for (let i of planets) {
        creategravityradius(i, i.geometry.parameters.radius);
    }
}
);
gui.add(world.planets.jupiter, "jupiter_mass", 0, 100000000).onChange(() => {
    Jupiter.mass = world.planets.jupiter.jupiter_mass;
}
);
gui.add(world.planets.jupiter, "jupiter_r", 0, 50).onChange(() => {
    Jupiter.geometry.parameters.radius = world.planets.jupiter.jupiter_r;
    for (let i of gravity_radiuses) {
        scene.remove(i);
    }
    gravity_radiuses = [];
    for (let i of planets) {
        creategravityradius(i, i.geometry.parameters.radius);
    }
}
);
gui.add(world, "camera_zoom", 0, 1000).onChange(() => {
    camera.position.z = world.camera_zoom;
}
);
gui.add(world, "acceleration", 0, 10).onChange(() => {
    acceleration = world.acceleration / 10 ** 2;
}
);
gui.add(world, "subst_dnst", 0, 30).onChange(() => {
    substance_density = world.subst_dnst / 10 ** 3;
}
);
gui.close();

//         creating objects
var cube = create_rectangle(1, 3, 1);
var pyramid = create_pyramid();
pyramid.position.y = 2;
var spaceship = create_group([cube, pyramid]);
spaceship.mass = 1;
scene.add(spaceship);

//         creating planets
var gravity_radiuses = [];
var planets = [];
//Mars
var Mars = createPlanet(7, 30, 0xff0000);
Mars.mass = 1000005;
Mars.position.y = 40;
Mars.position.x = 190;
scene.add(Mars);
creategravityradius(Mars, 7, 15);
planets.push(Mars);
//Jupiter
var Jupiter = createPlanet(30, 30, 0x7e2424);
Jupiter.mass = 10000000;
Jupiter.position.y = 213;
Jupiter.position.x = -705;
scene.add(Jupiter);
creategravityradius(Jupiter, 30, 20);
planets.push(Jupiter);
//------------------
var spaceshippos;
var spaceshipspeed;
var spaceshipacceleration;
var camera_zoom;
var substance_density_text;
var spaceship_rotation_text;
var substance_density = 0.003;
var spaceship_rotation_speed_text;
var acceleration = 0.01;
var x_projection = 0;
var y_projection = 0;
var deltaX;
var deltaY;
var distance;
var gravity_vector_angle;
var gravity_vector_len;
var GravityConstant = 0.00000099;
var camera_position = 0;
var gravity_vector_projections;
var projections;
var under_gravity = 0;
var was_under_gravity;
var x_resistance_coef = 1;
var y_resistance_coef = 1;
var pinned_camera = 0;
var dots = [];

camera.position.z = 50;
var bgcolor = random_rgba();
scene.background = new THREE.Color(bgcolor);

var canvas = document.getElementById('myCanvas');
canvas.width = 600;
canvas.height = 200;
canvas.style.left = "5px";
canvas.style.bottom = "10px";
canvas.style.position = "absolute";
var ctx = canvas.getContext('2d');
ctx.font = '24px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillStyle = 'black';
ctx.fillText('Reset - [r]', 70, 30);
ctx.fillText('Pause(freeze) - [f]', 113, 10);
ctx.fillText('Move - {Rotation - [A] [D]; Gas - [W or SPACE]}', 260, 55);
ctx.fillText('Zoom - [Mouse wheel]', 130, 80);

var x_speed = 0;
var y_speed = 0;
var x_acceleration = 0;
var y_acceleration = 0;
var spaceship_rotation_speed = 0;
var spaceship_rotation_acceleration = 0;

var canvasDynamic = document.getElementById('DynamicCanvas');
canvasDynamic.width = 500;
canvasDynamic.height = 250;
canvasDynamic.style.right = "5px";
canvasDynamic.style.bottom = "10px";
canvasDynamic.style.position = "absolute";
var ctxDynamic = canvasDynamic.getContext('2d');