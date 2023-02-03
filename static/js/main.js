let jsonResponse;
let ede = document.getElementById('eyedropperEnabled');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function sendApiRequest(r, g, b) {
    let url = 'https://handpickd.herokuapp.com/';
    fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        'r': Math.round(r),
        'g': Math.round(g),
        'b': Math.round(b)
    })
    })
    .then(response => response.json())
    .then(json => jsonResponse = json)
    .catch(err => console.log(err));
}

async function updatePageContent(stage, r=color[0], g=color[1], b=color[2]) {
    sendApiRequest(r, g, b);

    while (!jsonResponse) {
        if (stage == 1) {
            document.getElementById('productCatalog1').innerHTML = '<h5 style="display: flex; justify-content: center; align-items: center; height: 100%; color: gray">Loading...</h5>';
            $('.pcr-button').css('cursor', 'not-allowed');
            $('.pcr-button').prop('disabled', true);
        } else {
            document.getElementById('productCatalog2').innerHTML = '<h5 style="display: flex; justify-content: center; align-items: center; height: 100%; color: gray">Loading...</h5>';
            $('#canvas').css('cursor', 'not-allowed');
            $('#canvas').prop('disabled', true);
        }
    await sleep(50);
    }

    // Restore pickr button
    $('.pcr-button').css('cursor', 'pointer');
    $('.pcr-button').prop('disabled', false);

    // Restore canvas
    $('#canvas').css('cursor', 'crosshair');
    $('#canvas').prop('disabled', false);

    let html = '<ul class="list-group-flush">';
    for (key in jsonResponse) {
    html += `<li class="list-group-item w-100 py-4">`;
    html += `<a target="_blank" href="${jsonResponse[key].product_url}">`
    html += `<img src="${jsonResponse[key].shade_url}" alt="shade" width="50px" style="float: left;"></a>`;
    html += `<a target="_blank" href="${jsonResponse[key].product_url}" style="color:#CE428A;">`;
    if (jsonResponse[key].name.length > 40) {
        html += `<p style="margin-left: 80px;"><b>${jsonResponse[key].name.substring(0,40) + '...'}</b></p>`;
    } else {
        html += `<p style="margin-left: 80px;"><b>${jsonResponse[key].name}</b></p>`;
    }
    html += `</a>`;
    html += `<p style="margin-left: 80px;">Brand: ${jsonResponse[key].brand}</p>`;
    html += `<p style="margin-left: 80px;">Shade: ${jsonResponse[key].shade}</p>`;
    html += `<p style="margin-left: 80px;">Price: ${jsonResponse[key].price}</p>`;
    html += `</li>`;
    }
    html += '</ul>';

    if (stage == 1) {
        document.getElementById('productCatalog1').innerHTML = html;
    } else {
        document.getElementById('productCatalog2').innerHTML = html;
    }

    jsonResponse = '';
}

$('#getStarted').click(function() {
    $('#stageZero').fadeOut('fast');
    $('#stageOne').fadeIn(1000);
});

$('#btnPicker').click(function() {
    updatePageContent(1);
    $('#stageOne').fadeOut('fast');
    if (window.getComputedStyle(ede).display !== "none") {
        $('#switchToImage').css('display', 'inherit');

    }
    $('#stageTwoPicker').fadeIn(1000);
});

$('#btnImage').click(function() {
    if (window.getComputedStyle(ede).display === "none") { return; }
    $('#logo1').hide();
    $('#logo2').show();
    $('#stageOne').fadeOut('fast');
    $('#switchToPicker').css('display', 'inherit');
    $('#stageTwoImage').fadeIn(1700);
});

$('#switchToPicker').click(function() {
    $('#logo2').hide();
    $('#logo1').show();
    pickr_color = pickr._color.toRGBA();
    updatePageContent(1, pickr_color[0], pickr_color[1], pickr_color[2]);
    $('#stageTwoImage').fadeOut('fast');
    $('#stageTwoPicker').fadeIn(1000);
    $('#switchToPicker').hide();
    $('#switchToImage').show();
});

$('#switchToImage').click(function() {
    $('#logo1').hide();
    $('#logo2').show();
    $('#stageTwoPicker').fadeOut('fast');
    $('#stageTwoImage').fadeIn(1700);
    $('#switchToImage').hide();
    $('#switchToPicker').show();
});


$(document).ready(function () {
    $('#productCatalog2').html('<h5 style="display: flex; justify-content: center; align-items: center; height: 100%; color: gray">Upload an image to select a color!</h5>');
});