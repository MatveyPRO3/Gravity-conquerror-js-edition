function animate() {
    requestAnimationFrame(animate);
    //rotation
    if (Math.abs(spaceship_rotation_speed) < 0.12) {
        spaceship_rotation_speed += spaceship_rotation_acceleration;
    }
    spaceship.rotateZ(spaceship_rotation_speed);

    //Planets rotation
    for (let i of planets) {
        i.rotateZ(0.01);
    }
    for (let i of gravity_radiuses) {
        i.rotateZ(-0.01);
    }
    //planets gravity
    for (let i of planets) {
        deltaX = Math.abs(spaceship.position.x - i.position.x) ;
        deltaY = Math.abs(spaceship.position.y - i.position.y) ;

        distance = Math.sqrt((deltaX ** 2) + (deltaY ** 2));
        if (distance < i.gravity_radius) {//under gravity
            gravity_vector_len = CalculateGravityForce(spaceship.mass, i.mass, distance);
            // gravity_vector_angle = CalculateAngleBetweenPoints(deltaX, deltaY);
            // gravity_vector_projections = CalculatingVectorProjections(gravity_vector_angle, gravity_vector_len);
            gravity_vector_projections = [
                (deltaX / distance) * gravity_vector_len,
                (deltaY / distance) * gravity_vector_len
            ];
            x_acceleration -= gravity_vector_projections[0];
            y_acceleration -= gravity_vector_projections[1];
            under_gravity = 1;
            was_under_gravity = 1;



        }
    }
    if (under_gravity === 0) {
        under_gravity = 0;
        x_acceleration = 0;
        y_acceleration = 0;
        under_gravity = undefined;
    }

    if (was_under_gravity === 1) {
        was_under_gravity = 0;
        under_gravity = 0;

    }
    //resistance 
    //Calculating coefficients
    if (Math.min(Math.abs(x_speed), Math.abs(y_speed)) == 0) {
        x_resistance_coef = 1;
        x_resistance_coef = 1;
    }
    else {
        if (Math.abs(x_speed) > Math.abs(y_speed)) {
            x_resistance_coef = 1;
            y_resistance_coef = Math.min(Math.abs(x_speed), Math.abs(y_speed)) / Math.max(Math.abs(x_speed), Math.abs(y_speed));
        }
        else {
            y_resistance_coef = 1;
            x_resistance_coef = Math.min(Math.abs(x_speed), Math.abs(y_speed)) / Math.max(Math.abs(x_speed), Math.abs(y_speed));
        }
    }
    //resistance itself
    //for x
    if (x_acceleration == 0 && x_speed != 0) {
        if ((x_speed > 0) && ((x_speed - substance_density * x_resistance_coef) < 0)) {
            x_speed = 0;
        }
        else if ((x_speed < 0) && ((x_speed + substance_density * x_resistance_coef) > 0)) {
            x_speed = 0;
        }

        else {
            if (x_speed > 0) {
                x_speed -= substance_density * x_resistance_coef;
            }
            else {
                x_speed += substance_density * x_resistance_coef;
            }
        }
    }
    //for y
    if (y_acceleration == 0 && y_speed != 0) {
        if ((y_speed > 0) && ((y_speed - substance_density * y_resistance_coef) < 0)) {
            y_speed = 0;
        }
        else if ((y_speed < 0) && ((y_speed + substance_density * y_resistance_coef) > 0)) {
            y_speed = 0;
        }
        else {
            if (y_speed > 0) {
                y_speed -= substance_density * y_resistance_coef;
            }
            else {
                y_speed += substance_density * y_resistance_coef;
            }
        }
    }
    //rotation resistance
    if (spaceship_rotation_acceleration == 0) {
        if (spaceship_rotation_speed > - (0.001 + substance_density) && spaceship_rotation_speed < (0.001 + substance_density)) {
            spaceship_rotation_speed = 0;
        }
        else if (spaceship_rotation_speed > 0) {
            spaceship_rotation_speed -= substance_density;
        }
        else if (spaceship_rotation_speed < 0) {
            spaceship_rotation_speed += substance_density;
        }
    }


    //camera position
    if (pinned_camera) {
        camera.position.set(spaceship.position.x, spaceship.position.y, camera.position.z);
    }

    //speed and acceleration
    x_speed += x_acceleration;
    y_speed += y_acceleration;

    spaceship.position.x += x_speed;
    spaceship.position.y += y_speed;

    //updating canvas 
    ctxDynamic.clearRect(0, 0, canvasDynamic.width, canvasDynamic.height);
    ctxDynamic.font = '24px Arial';
    ctxDynamic.textAlign = 'center';
    ctxDynamic.textBaseline = 'middle';
    ctxDynamic.fillStyle = 'black';

    spaceshippos = "Spaceship position: [X]:" + spaceship.position.x.toFixed(2) + ", [Y]:" + spaceship.position.y.toFixed(2);
    spaceshipspeed = "Spaceship speed: " + (Math.sqrt(Math.pow(x_speed, 2) + Math.pow(y_speed, 2))).toFixed(3);
    spaceshipacceleration = "Spaceship acceleration:" + (Math.sqrt(Math.pow(x_acceleration, 2) + Math.pow(y_acceleration, 2))).toFixed(5);
    camera_zoom = "Camera zoom:" + camera.position.z.toFixed(3);
    substance_density_text = "Substance density:" + substance_density;
    spaceship_rotation_text = "Spaceship rotation:" + calculate_degrees();
    spaceship_rotation_speed_text = "Spaceship rotation speed:" + Math.abs(spaceship_rotation_speed.toFixed(3));

    ctxDynamic.fillText(spaceshippos, 270, 60);
    ctxDynamic.fillText(spaceshipspeed, 200, 90);
    ctxDynamic.fillText(spaceshipacceleration, 260, 120);
    ctxDynamic.fillText(camera_zoom, 200, 150);
    ctxDynamic.fillText(spaceship_rotation_text, 200, 180);
    ctxDynamic.fillText(substance_density_text, 230, 30);
    ctxDynamic.fillText(spaceship_rotation_speed_text, 230, 10);

    if (x_speed != 0 || y_speed != 0) {
        DrawDot(spaceship.position.x, spaceship.position.y);
    }
    if (dots.length > 200) {
        scene.remove(dots.shift());
    }

    renderer.render(scene, camera);
}

animate();