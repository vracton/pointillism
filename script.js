const video = document.querySelector("video");
const canvas = document.querySelector("canvas");
const screenshot = document.getElementById("take");
var stream = undefined;

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
      max: 1440,
    },
  },
};

window.onload = () => {
  if ("mediaDevices" in navigator && navigator.mediaDevices.getUserMedia) {
    startStream(constraints);
  }
};

function getElementPosition(obj) {
  var curleft = 0,
    curtop = 0;
  if (obj.offsetParent) {
    do {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
    } while ((obj = obj.offsetParent));
    return { x: curleft, y: curtop };
  }
  return undefined;
}

function getEventLocation(element, event) {
  var pos = getElementPosition(element);

  return {
    x: event.pageX - pos.x,
    y: event.pageY - pos.y,
  };
}

function rgbToHex(r, g, b) {
  if (r > 255 || g > 255 || b > 255) throw "Invalid color component";
  return ((r << 16) | (g << 8) | b).toString(16);
}
canvas.style.display = "block";
const startStream = async (constraints) => {
  stream = await navigator.mediaDevices.getUserMedia(constraints);
  video.srcObject = stream;
  document.getElementsByTagName("p")[0].remove();
  let inprogress = false
  setInterval(function () {
    if (!inprogress){
      inprogress = true
      canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    canvas.getContext("2d").drawImage(video, 0, 0);
    const size = document.getElementById("ptSize").value;
    const ctx = canvas.getContext("2d");
    for (j = 0; j <= canvas.height; j += size / 2) {
      for (let i = 0; i <= canvas.width; i += size / 2) {
        var eventLocation = getEventLocation(canvas, { pageX: i, pageY: j });
        // Get the data of the pixel according to the location generate by the getEventLocation function
        eventLocation.x = i;
        eventLocation.y = j;
        var pixelData = ctx.getImageData(i, j, 1, 1).data;
        ctx.beginPath(); // begin

        ctx.lineWidth = size;
        ctx.lineCap = "round";
        ctx.strokeStyle =
          document.getElementById("mode").value == "n"
            ? "#" +
              (
                "000000" + rgbToHex(pixelData[0], pixelData[1], pixelData[2])
              ).slice(-6)
            : "hsl(0 80% " +
              ((pixelData[0] / 255) * 0.299 +
                (pixelData[1] / 255) * 0.587 +
                (pixelData[2] / 255) * 0.114) *
                100 +
              "%)";

        ctx.moveTo(eventLocation.x, eventLocation.y); // from
        ctx.lineTo(eventLocation.x, eventLocation.y); // to

        ctx.stroke(); // draw it!
      }
    }
    inprogress = false
    }
  }, 1000 / 60);
};
