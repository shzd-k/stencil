
" Echoes of a stranger who was once known 🤍 "
" Thankyouhh for being part of the journey    "

const settings = {
    threshold : 125,
    primary_c : 0,
    secondary_c : 255
}


document.getElementById('toggle').addEventListener('click' , () => {
    let pri = document.getElementById('primary_c')
    let sec = document.getElementById('secondary_c')

    let tempt = settings.primary_c
    settings.primary_c = settings.secondary_c
    settings.secondary_c = tempt

    pri.style.backgroundColor = settings.primary_c == 0 ? "#000000" : "#FFFFFF"
    sec.style.backgroundColor = settings.secondary_c == 0 ? "#000000" : "#FFFFFF"
    applyThreshold(settings.threshold)

})

const slider = document.getElementById('threshold_input')
const slider_hint = document.getElementById('threshold_display')
slider.value = settings.threshold
slider_hint.innerHTML = settings.threshold
slider.addEventListener('input', () => {
    slider_hint.innerHTML= slider.value
    settings.threshold = slider.value
    applyThreshold( slider.value)
})






const display = document.getElementById('upload')
const imgInput = document.getElementById('input')
const canvas = document.getElementById('canvas')
const ctx  = canvas.getContext('2d')

var originalImage  =  null
display.addEventListener('click' , (e) => {
    imgInput.click()
})
imgInput.addEventListener('change' , (e) => {
    const img = imgInput.files[0]

    if(!img){ return }
    else{ fileInput(img , 100 )}
})

function fileInput( img , score ){
    console.log("I RAN ")
    const imageURL = URL.createObjectURL(img)
    const image = new Image()
    image.onload = () => {
        let width = image.width
        let height = image.height
        display.style.aspectRatio = `${width}/${height}`
        display.style.backgroundImage = `url(${imageURL})`
        display.style.color = 'trancparent'
        // if( height > width ){
        //     display.style.height = "90%"
        // } else { display.style.width = " 90%"}
        // canvas 
        canvas.width = image.width
        canvas.height = image.height
        ctx.drawImage(image , 0 , 0 )
        originalImage = ctx.getImageData(0 , 0 , canvas.width  , canvas.height)
        applyThreshold( settings.threshold )
    }
    image.src = imageURL
}
function applyThreshold(threshold) {
  const imageData = new ImageData(
    new Uint8ClampedArray(originalImage.data),
    originalImage.width,
    originalImage.height
  );
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i+1] + data[i+2]) / 3;
    const val = avg < threshold ?  settings.primary_c : settings.secondary_c ; // COLOR SCHEAMEING
    data[i] = data[i+1] = data[i+2] = val;
  }
  ctx.putImageData(imageData, 0, 0);
  const url = canvas.toDataURL();
  display.style.backgroundImage = `url(${url})`;
  display.textContent = '';
}
document.getElementById('download').addEventListener('click', () => {
    const canvas = document.getElementById('canvas'); 
    const imageURL = canvas.toDataURL('image/png');

    if (imageURL === canvas.toDataURL('image/png', 1.0) && isCanvasBlank(canvas)) {
        // should be replaced with a prompt indicating absence of requested resource 
        // peding , waiting for the release of TOASTclass By SHZD
        return;
    }

    const link = document.createElement('a');
    link.href = imageURL;
    link.download = `sh-${window.prompt("save as ?")}.png`;
    link.click();
});
function isCanvasBlank(canvas) {
    const ctx = canvas.getContext('2d');
    const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    for (let i = 0; i < pixelData.length; i += 4) {
        if (pixelData[i + 3] !== 0) { 
            return false;  
        }
    }
    return true;
}
