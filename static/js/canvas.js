var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var imageLoader = document.getElementById('formFile');

imageLoader.addEventListener('change', handleImage, false);

if (canvas.getContext) { // check for canvas support
    var image = new Image();
    image.onload = function() {
        canvas.width
    }
}

function handleImage(e) {
    let ext = e.target.files[0].name.split('.').pop().toLowerCase();
    if (['png', 'jpg', 'jpeg'].indexOf(ext) < 0) {
        $('#filetypeAlert').fadeIn();
        $('#filetypeAlert').delay(5000).fadeOut();
        return;
    }
    // let canvas = document.getElementById('canvas');
    // let ctx = canvas.getContext('2d');
    let reader = new FileReader();

    let maxWidth = 430;
    let maxHeight = 400;
    let scaleFactor;

    // Show canvas
    canvas.style.display = 'inherit';

    // Show canvas caption
    document.getElementById('canvasCaption').style.display = 'inherit';

    // Hide text
    document.getElementById('stageTwoImageText').style.display = 'none';

    reader.onload = function(event) {
        let img = new Image();
        img.onload = function() {
            if (img.width > maxWidth && img.height <= maxHeight) {
                scaleFactor = maxWidth / img.width;
                canvas.width = maxWidth;
                canvas.height = img.height * scaleFactor;
                ctx.drawImage(img, 0, 0, (img.width * scaleFactor), (img.height * scaleFactor));
            } else if (img.width > maxWidth && img.height > maxHeight) {
                let distWidth = Math.round(img.width - maxWidth);
                let distHeight = Math.round(img.height - maxHeight);
                if (distWidth > distHeight) {
                    scaleFactor = maxWidth / img.width;
                } else {
                    scaleFactor = maxHeight / img.height;
                }
                canvas.width = img.width * scaleFactor;
                canvas.height = img.height * scaleFactor;
                ctx.drawImage(img, 0, 0, (img.width * scaleFactor), (img.height * scaleFactor));
            } else if (img.width < maxWidth && img.height > maxHeight) {
                scaleFactor = maxHeight / img.height;
                canvas.width = img.width * scaleFactor;
                canvas.height = maxHeight;
                ctx.drawImage(img, 0, 0, img.width, (img.width * scaleFactor));
            } else {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
            }
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);

}

function getPixel(e) {
    if (canvas.style.cursor == 'not-allowed') { return; }
    let x = 0, y = 0, o = canvas;

    do {
        x += o.offsetLeft;
        y += o.offsetTop;
    } while (o = o.offsetParent);

    x = e.pageX - x - 15; // 15 == border radius
    y = e.pageY - y - 15;
    let imageData = ctx.getImageData(x, y, 1, 1);
    color = [imageData.data[0], imageData.data[1], imageData.data[2]];
    let r = color[0], g = color[1], b = color[2];
    document.getElementById('canvas').style.borderColor = `rgb(${r}, ${g}, ${b})`;
    document.getElementById('logo2').style.color = `rgb(${r}, ${g}, ${b})`;
    document.getElementById('switchToPicker').style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

canvas.onmousedown = function(e) {
    if (canvas.style.cursor == 'not-allowed') { return; }
    canvas.onmousemove = getPixel;
    canvas.onclick = getPixel;
}

canvas.onmouseup = function() {
    if (canvas.style.cursor == 'not-allowed') { return; }
    canvas.onmousemove = null;
    updatePageContent(2);
}