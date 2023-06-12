

window.addEventListener("keydown", function (event) {
    if (event.key == "a") {
        spaceship_rotation_acceleration = 0.002;
        return;
    }
    if (event.key == "d") {
        spaceship_rotation_acceleration = -0.002;
        return;

    }
    if (event.key == "w" || event.key == " ") {
        projections = CalculatingVectorProjections(calculate_degrees(), acceleration);
        x_acceleration = projections[0];
        y_acceleration = projections[1];
        
        return;

    }
    if (event.key == "r") { //reset func
        reset();

    }
    if (event.key == "f") {
        x_speed = 0;
        y_speed = 0;
        x_acceleration = 0;
        y_acceleration = 0;
        spaceship_rotation_acceleration = 0;
        spaceship_rotation_speed = 0;

        return;
    }
    if (event.key == "s") {
        pinned_camera = !pinned_camera;

        return;
    }

});

window.addEventListener("keyup", function (event) {
    if (event.key == "w" || event.key == " ") {
        y_acceleration = 0;
        x_acceleration = 0;
        return;

    }
    if (event.key == "a" || event.key == "d") {
        spaceship_rotation_acceleration = 0;
        return;
    }
});

window.addEventListener("wheel", function (event) {
    if (event.deltaY > 0) {
        camera.position.z += 8;
    }
    else if (camera.position.z > 3.5) {
        camera.position.z -= 8;
    }
});


window.addEventListener("resize", function () {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
var url, reaction, file;
window.onerror = function (message, source, lineno, colno, error) {

    file = source.substring(39, source.length);

    reaction = window.confirm(
        "I detected an error in " +
        file +
        " on " +
        lineno.toString() +
        " line. Would you like to continue or restart the website? (Error: " +
        error +
        ") Maybe you have an extension that blocks some necessary files. Disable it, for the normal work of the site. Also try to clear cache");


    if (reaction) {
        window.location.assign("/")
    }


}
