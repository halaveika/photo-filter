const imgApp = document.querySelector('img');
viewBgImage(imgApp.src);
const imgInfo = {
  width: 1200,
  height: 750,
  blur: '0px',
  invert: '0%',
  sepia: '0%',
  saturate: '100%',
  hue: '0deg'
};

  



console.dir(imgInfo);



// filter changes handler;

const inputs = document.querySelectorAll('.filters input');
inputs.forEach( input => input.addEventListener('input',handleUpdate));

function handleUpdate () {
  let sizing = this.dataset.sizing;
  this.nextElementSibling.value = this.value;
  console.log(this.value + sizing);
  console.dir( this.nextElementSibling);
  document.documentElement.style.setProperty(`--${this.name}`, this.value + sizing);
  imgInfo[`${this.name}`] = this.value + sizing;
};

console.dir(inputs);

//fullscreenmod handler
document.querySelector('.fullscreen').addEventListener('click', (event)=>fullscreenFunction(event));

//fullscreenmod function
function fullscreenFunction(event){
  !document.fullscreenElement ? document.documentElement.requestFullscreen() : document.exitFullscreen()};

// next imagine 

  let base;
  const images = ['01.jpg', '02.jpg', '03.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
  let counter = 0;

  const btnNext = document.querySelector('.btn-next');
  const canvas = document.querySelector('canvas');
  btnNext.addEventListener('click', getImage);

  function viewBgImage(src) {  
     if ( src.match(/gif/)) {
        const imgNew = new Image();
        imgNew.setAttribute('crossOrigin', 'anonymous');
        imgNew.src = src;
        imgNew.onload = function() {
          imgInfo.width = imgNew.width;
          imgInfo.height = imgNew.height;
          imgApp.src = src;
        }
     } else { 
    const imgNew = new Image();
    imgNew.setAttribute('crossOrigin', 'anonymous');
    imgNew.src = src;
    imgNew.onload = function() {
      imgInfo.width = imgNew.width;
      imgInfo.height = imgNew.height;
      canvas.width = imgApp.width;
      canvas.height = imgApp.height;
      const ctx = canvas.getContext("2d");
      const wRatio = 830 / imgNew.width    ;
      const hRatio = 520 / imgNew.height  ;
      const ratio  = Math.min ( wRatio, hRatio );
      if (ratio * imgNew.height  > 520) {canvas.height = 520; canvas.width = imgNew.width * 520 /830;}
        else if (ratio * imgNew.width  > 830) {canvas.width = 830; canvas.height= imgNew.height * 830 /520;}
            else {canvas.width = imgNew.width * ratio; canvas.height = imgNew.height * ratio; }
      ctx.drawImage(imgNew , 0, 0 , imgNew.width, imgNew.height, 0, 0 ,  canvas.width, canvas.height );
      imgApp.src = canvas.toDataURL();
    }
    }; 
  }
  
  function getImage() {
    if ( counter===19) counter = 0;
    const date = new Date;
    const time = date.getHours();
    console.dir(date.getHours());
    if (time <= 5) base = 'night';
      else if (time <= 11) base = 'morning';
        else if (time <= 17) base = 'day';
          else base = 'evening';
          console.dir(base);
      const imageSrc = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${base}/${images[counter]}`;
    viewBgImage(imageSrc);
    counter++;
    btnNext.disabled = true;
    setTimeout(function() { btnNext.disabled = false }, 1000);
    document.querySelector('.btn-active').classList.remove('btn-active');
    document.querySelector('.btn-next').classList.add('btn-active');
  } 



  //reset handler
  const btnReset = document.querySelector('.btn-reset');
  btnReset.addEventListener('click', setReset);

  function setReset() {
    inputs.forEach( input => {
      input.value = input.defaultValue;
      let sizing = input.dataset.sizing;
      input.nextElementSibling.value = input.value;
      document.documentElement.style.setProperty(`--${input.name}`, input.value + sizing);
      imgInfo[`${input.name}`] = input.value + sizing;
    });
    document.querySelector('.btn-active').classList.remove('btn-active');
    document.querySelector('.btn-reset').classList.add('btn-active');
  }

//save img handler

const downloadFile = document.querySelector('.btn-save');
downloadFile.addEventListener('click', download, false);

function download() {
  canvas.width = imgInfo.width;
  canvas.height = imgInfo.height;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const re = new RegExp (/[0-9]/g)
    const k1 = imgInfo.width / imgApp.width;
    const k2 = imgInfo.height / imgApp.height;
    console.log(k1);
    console.log(k2);
    ctx.filter = `blur(${Number(imgInfo.blur.match(re).join('')) * Math.max(k1, k2) + 'px'}) invert(${imgInfo.invert}) sepia(${imgInfo.sepia}) saturate(${imgInfo.saturate}) hue-rotate(${imgInfo.hue})`;
    ctx.drawImage(imgApp, 0, 0, imgInfo.width, imgInfo.height );
  let link = document.createElement('a');
  link.download = 'download.png';
  link.href = canvas.toDataURL();
  link.click();
  link.delete;
  document.querySelector('.btn-active').classList.remove('btn-active');
  document.querySelector('.btn-save').classList.add('btn-active');
}

// load from computer handler

const fileInput = document.querySelector('.btn-load--input');
fileInput.addEventListener('change', function(e) {
  const file = fileInput.files[0];
  if (file.type === 'image/jpg' || file.type === 'image/jpeg' ||  file.type === 'image/png' ||  file.type === 'image/gif') {
  console.dir(file.type);
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.src = reader.result;
    viewBgImage(img.src);
    fileInput.value = null;
  }
  reader.readAsDataURL(file);
  } else { imgApp.src = null; console.log('invalid');}
  document.querySelector('.btn-active').classList.remove('btn-active');
  document.querySelector('.btn-load').classList.add('btn-active');
});