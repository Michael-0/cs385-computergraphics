function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT);
    cube.render();
}

function init()
{
    var canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");
    gl.clearColor(.25, .5, .75, 1);
    cube = new Cube(gl, 20);
    render();
}
window.onload = init;
