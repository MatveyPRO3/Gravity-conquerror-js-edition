//random rgba
function random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgb(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ')';
}

//create rectangle
function create_rectangle(width, height, depth) {
    var geometry = new THREE.BoxGeometry(width, height, depth);

    for (var i = 0; i < geometry.faces.length; i++) {
        geometry.faces[i].color.setHex(Math.random() * 0xffffff);
    }
    var material = new THREE.MeshBasicMaterial({ color: 0xffffff, vertexColors: true, wireframe: true });
    var object = new THREE.Mesh(geometry, material);
    return object;

}

//create pyramid
function create_pyramid() {
    var geometry = new THREE.CylinderGeometry(1, 0.5 * 3, 0.5 * 3, 4);

    for (var i = 0; i < geometry.faces.length; i++) {
        geometry.faces[i].color.setHex(Math.random() * 0xffffff);
    }
    var material = new THREE.MeshBasicMaterial({ color: 0xffffff, vertexColors: true, wireframe: true });
    var pyramid = new THREE.Mesh(geometry, material);
    return pyramid;

}

//create planet
function createPlanet(radius, numradiuses, color) {
    const geometry = new THREE.CircleGeometry(radius, numradiuses);
    // const geometry = new THREE.SphereBufferGeometry(radius, numradiuses);
    const material = new THREE.MeshBasicMaterial({ color: color, wireframe: true }); //vertexColors: true, });//wireframe: true });
    const circle = new THREE.Mesh(geometry, material);
    return circle
}

//create gravity radius
function creategravityradius(planet, planetradius, step = 17.5) {
    let rs = [];
    for (var i = planetradius; i < planetradius * 30; i += step) {
        var gravity_radius = createPlanet(i, 20, 0x9294ef);
        rs.push(gravity_radius);
    }
    planet.gravity_radius = i;
    let mesh = create_group(rs);
    mesh.position.set(planet.position.x, planet.position.y, planet.position.z);
    scene.add(mesh);
    gravity_radiuses.push(mesh);
}

//creating group
function create_group(objects) {
    const group = new THREE.Group();
    for (let i of objects) {
        group.add(i);
    }
    return group;
}


function reset() {
    //reset normal view
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(devicePixelRatio);
    camera.updateProjectionMatrix();
    //reset position
    spaceship.position.set(0, 0, 0);
    //reset rotation
    spaceship.rotation.set(300, Math.PI / 180 * 90, Math.PI / 180 * 90);
    //reset acceleration
    x_acceleration = 0;
    y_acceleration = 0;
    //reset speed
    x_speed = 0;
    y_speed = 0;
    //reset rotation animation
    spaceship_rotation_acceleration = 0;
    spaceship_rotation_speed = 0;
    spaceship.rotation.z = 300;
    //pick random background color
    bgcolor = random_rgba();
    console.log("New scene color setted:" + bgcolor);
    scene.background = new THREE.Color(bgcolor);
    // resetting spaceship
    scene.remove(spaceship);
    cube = create_rectangle(1, 3, 1);
    pyramid = create_pyramid();
    pyramid.position.y = 2;
    spaceship = create_group([cube, pyramid]);
    spaceship.mass = 1;
    scene.add(spaceship);
    //reset camera position
    camera.position.set(0, 0, 50);
    camera.lookAt(0, 0, 0);
    //reset dots
    for (let i of dots) {
        scene.remove(i);
    }
    dots = [];
}

function CalculatingVectorProjections(angle, len) {
    x_projection = Math.sin((90 - angle) * Math.PI / 180) * len;
    y_projection = Math.sin(angle * Math.PI / 180) * len;
    return [x_projection, y_projection];
}

function eulerToDegree(euler) {
    return ((euler) / (2 * Math.PI)) * 360;
}

function calculate_degrees() {
    var degrees = (eulerToDegree(spaceship.rotation.z) + 90).toFixed(2);
    if (degrees > 180) {
        degrees = (-(180 - (degrees - 180))).toFixed(2);
    }
    return degrees;
}
//calculate gravity force
function CalculateGravityForce(m1, m2, dst) {
    return (GravityConstant * m1 * m2) / (dst.toFixed(3) ** 2);
}

function CalculateAngleBetweenPoints(deltaX, deltaY) {
    var angleInRadians = Math.atan2(deltaY, deltaX);
    var angleInDegrees = angleInRadians * (180 / Math.PI);
    
    // Normalize the angle to be between 0 and 360
    // if (angleInDegrees < 0) {
    //     angleInDegrees = 360 + angleInDegrees;
    // }
    
    return angleInDegrees;
}
function DrawDot(x, y) {
    if (Math.floor(Math.random() * 10) < 3) {
        var dotGeometry = new THREE.Geometry();
        dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
        var dotMaterial = new THREE.PointsMaterial({ size: 3, sizeAttenuation: false });
        var dot = new THREE.Points(dotGeometry, dotMaterial);
        dot.position.set(x, y, 0);
        scene.add(dot);
        dots.push(dot);
    }
}