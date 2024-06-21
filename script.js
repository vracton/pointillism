const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const screenshot = document.getElementById("take");
var stream = undefined

const constraints = {
  video: {
    facingMode: "user",
    width: {
      min: 1280,
      ideal: 1920,
      max: 2560,
    },
    height: {
      min: 720,
      ideal: 1080,
      max: 1440
    },
  }
};

window.onload = () => {
  if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
    startStream(constraints);
  }
};

function getElementPosition(obj) {
  var curleft = 0, curtop = 0;
  if (obj.offsetParent) {
      do {
          curleft += obj.offsetLeft;
          curtop += obj.offsetTop;
      } while (obj = obj.offsetParent);
      return { x: curleft, y: curtop };
  }
  return undefined;
}

function getEventLocation(element,event){
  var pos = getElementPosition(element);
  
  return {
      x: (event.pageX - pos.x),
      y: (event.pageY - pos.y)
  };
}

function rgbToHex(r, g, b) {
  if (r > 255 || g > 255 || b > 255)
      throw "Invalid color component";
  return ((r << 16) | (g << 8) | b).toString(16);
}

const startStream = async (constraints) => {
  stream = await navigator.mediaDevices.getUserMedia(constraints);
  video.srcObject = stream;
  document.getElementsByTagName("p")[0].remove()
  setInterval(function(){
//screenshot.remove()
canvas.width = video.videoWidth;
canvas.height = video.videoHeight;
canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
canvas.getContext('2d').drawImage(video, 0, 0);
canvas.style.display = "block"
stream.getTracks().forEach(function(track) {
  //track.stop();
});
//video.remove()
const size = document.getElementById('ptSize').value
for (j=0;j<=canvas.height;j+=size/2){
  for (let i = 0; i<= canvas.width;i+=size/2){
  var eventLocation = getEventLocation(canvas,{pageX:i,pageY:j});
  // Get the data of the pixel according to the location generate by the getEventLocation function
eventLocation.x = i
  eventLocation.y = j
  var context = canvas.getContext('2d');
  var pixelData = context.getImageData(i, j, 1, 1).data;
  const hsl = "hsl(0 0 "+(Math.pow(pixelData[0]/255,2.2)*0.299+Math.pow(pixelData[1]/255,2.2)*0.587+Math.pow(pixelData[2]/255,2.2)*0.114)*100+"%)"
  const hex = "#" + ("000000" + rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);
  
const ctx = canvas.getContext("2d")
  ctx.beginPath(); // begin

ctx.lineWidth = size;
ctx.lineCap = 'round';
ctx.strokeStyle = document.getElementById('mode').value=="n"?hex:hsl;

ctx.moveTo(eventLocation.x, eventLocation.y); // from
ctx.lineTo(eventLocation.x, eventLocation.y); // to

ctx.stroke(); // draw it!
}
}

canvas.addEventListener("mousemove",function(e){
  
});
  },1000/60)
};