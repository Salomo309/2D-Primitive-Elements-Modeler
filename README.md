# 2D Web Based CAD (Computer-Aided Design)
Disusun untuk memenuhi Tugas 1 IF3260 Grafika Komputer 2D Web Based CAD (Computer-Aided Design)

## Deskripsi
WebGL merupakan kakas dengan spesialisasi pada ranah grafika yang dapat dengan mudah diintegrasikan pada web. Mahasiswa ditugaskan menggunakan WebGL murni untuk mengimplementasikan web dengan fitur menggambar, mengedit, dan memvisualisasi sejumlah model pada kanvas.

Melalui website ini, pengguna dapat berinteraksi dan menggunakan berbagai tools yang tersedia di website ini. Pengguna dapat memilih objek yang akan digambar, melakukan rotasi, scaling, translasi dan pengubahan warna serta bentuk terhadap objek yang digambar. Pengguna juga dapat melakukan import dan export objek serta pembersihan canvas.

## How to Run
1. Bukan Folder `src`
2. Jalankan `index.html`

## Contributor
<table>
    <tr>
        <td colspan = 3 align = "center">
            KELOMPOK 17 APAYA - K01
        </td>
    </tr>
    <tr>
        <td align="center">No</td>
        <td align="center">Nama</td>
        <td align="center">NIM</td>
    </tr>
    <tr>
        <td align="center">1</td>
        <td align="center">Athif Nirwasito</td>
        <td align="center">13521053</td>
    </tr>
    <tr>
        <td align="center">2</td>
        <td align="center">Salomo Reinhart Gregory Manalu</td>
        <td align="center">13521063</td>
    </tr>
    <tr>
        <td align="center">3</td>
        <td align="center">Margaretha Olivia Haryono</td>
        <td align="center">13521071</td>
    </tr>
</table>

## Fungsi-Fungsi yang tidak Primitif
### I. Class Color
1. function fromHex(hex): mengubah bentuk string menjadi warna
2. function asArray(): mengembalikan warna dalam bentuk array
3. function normalize(): mengembalikan warna dalam range 0 - 1
4. function toHex(): mengembalikan ke bentuk hex (string)

### II. Class Orientation
Atribut = degree: Number
1. function rotate(degree): melakukan rotasi sebanyak degree
2. function createMatrix(): mengembalikan array yang berisi nilai matriks rotasi
3. function createInverseMatrix(): mengembalikan array yang berisi nilai inverse matriks rotasi

### III. Class Scaler
1. function resize(scale, shape): melakukan perubahan ukuran pada shape

### IV. Uniforms
Atribut = rotation: Orientation, midpoint: Point, shear: Shear
1. rotate(degree): melakukan rotasi sebesar degree

### V. Point
Atribut: coor: Number[2], color: String
1. function getVertex(): mengembalikan koordinat point
2. function getColor(): mengembalikan warna point
3. function setCoordinates(x, y): menetapkan nilai koordinat point yang baru
4. function move(x, y): melakukan perpindahan poin sebesar x ke arah sumbu-x dan sebesar y ke arah sumbu-y
5. function scale(x, y): mengalikan nilai koordinat poin dengan x dan y

### VI. Vertices
Atribut: vertices: Point[]
1. function asArray(): mengembalikan koordinat-koordinat point yang ada dalam satu vertex
2. function asArrayColor(): mengembalikan warna-warna point yang ada dalam satu vertex
3. function move(x, y): memindahkan setiap poin dalam vertex sebesar x ke arah sumbu-x dan y ke arah sumbu-y
4. function getPoint(i): mengembalikan point pada indeks ke-i

### VIII. Shape2D
Atribut: vertices: Vertices, numVertices: Number, indices: Integer[], uniform: Uniforms
1. function getVertices(): mengembalikan mengembalikan koordinat-koordinat point yang ada dalam satu shape
2. function getColors(): mengembalikan warna-warna point yang ada dalam satu shape
3. function getIndices(): mengembalikan array indeks (indices)
4. function drawElements(gl): melakukan proses penggambaran shape
5. function translate(deltaX, deltaY): melakukan translasi pada shape
6. function rotate(angle): melakukan rotasi pada shape
7. function scale(scale): melakukan scaling pada shape
8. function scaleByMous(): melakukan scaling pada shape
9. function changePointColor(pointIndex, newColorHex): melakukan perubahan warna pada salah satu point dalam shape
10. function updateMidPoint(): melakukan update mid point atau titik tengah dari shape

### IX. Renderer
Atribut: canvas: Canvas, shapeCounter: Integer, shapes: Shape2D, gl: WebGLRenderingContext, program: ProgramInfo, positionBuffer: WebGLBuffer, colorBuffer: WebGLBuffer, indexBuffer: WebGLBuffer
1. draw(): menggambar array dengan 1 program
2. createShader(): membuat shader
3. createProgram: membuat program
4. useProgram(program): menggunakan program dari parameter
5. addShape(shape): menambah shape baru  dan mengggambarnya
6. clearCanvas(): menghapus semua shape di canvas
7. getShapeById(id): mendapatkan shape dengan id "id" dari parameter
8. changePointColorShape: mengubah 1 warna point
9. addPoint(newPointX, newPointY, selectedObjectId): menambah 1 point baru pada shape
10. deletePoint(pointIndex, selectedObjectId): menghapus 1 point dari shape

### X. ProgramInfo
Atribut: program: WebGLProgram, positionAttrLoc: Number, colorAttrLoc: Number
1. createShader(gl, type, source): membuat shader
