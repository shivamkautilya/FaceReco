 //Face-api models loading promise
 Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/Face-Detection-JavaScript-master/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/Face-Detection-JavaScript-master/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/Face-Detection-JavaScript-master/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/Face-Detection-JavaScript-master/models')
]).then(startVideo)


function triggerVideo() { //Webcam turns on when triggered

//Now code to access webcam
  var startVideo = { audio: false, video: { width: 360, height: 480 } }; 

  navigator.mediaDevices.getUserMedia(startVideo)
  .then(function(mediaStream) {
    var video = document.querySelector('video');
    video.srcObject = mediaStream;
    video.onloadedmetadata = function(e) {
      video.play();
    };
  })
  .catch(function(err) { console.log(err.name + ": " + err.message); }); 

  video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height}
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    console.log(detections)
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  },100)
})
}
