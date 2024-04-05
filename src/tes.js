// Menambahkan event listener ke dokumen
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi WebGL Context
    const canvas = document.getElementById('canvas');
    const gl = canvas.getContext('webgl');

    // Buat instance Renderer
    const renderer = new Renderer('#canvas', document);

    // Buat instance kelas Line dan Rectangle
    // const line1 = new Line(-0.9, 0, 0.9, 0, '#ff0000');
    // const line2 = new Line(0, -0.9, 0, 0.9, '#00ff00');
    // const line3 = new Line(-0.9, 0, 0.9, 0, '#CAB309');
    // line3.rotate(0, 0, 30)
    // const line4 = new Line(-0.9, 0, 0.9, 0, '#CAB309');
    // line4.scale(0.5)
    const line5 = new Line(-0.9, 0, 0.9, 0, '#802AE1');
    line5.changeLength(1);

    const polygon = new Polygon([
        -0.5, -0.2,   // Titik 1
        0.3, 0.5,     // Titik 2
        0.7, -0.3,    // Titik 3
        -0.1, -0.6    // Titik 4
    ], '#00ff00');


    // polygon.addVertex(1, 1);
    // polygon.removeVertex();

    // polygon.rotate(0, 0, 45);
    // polygon.shear(0.2, 0);
    // polygon.translate(0.1, 0.1);
    // polygon.scale(1.5);

    // Tambahkan shape ke renderer
    // renderer.addShape(line1);
    // renderer.addShape(line2);
    // renderer.addShape(line3);
    // renderer.addShape(line4);
    renderer.addShape(line5);
    // renderer.addShape(polygon)
});
