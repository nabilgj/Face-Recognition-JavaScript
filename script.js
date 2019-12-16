// this is 1st step
const video = document.getElementById('video');

// this is 4th step
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
]).then(startVideo)

// this is 2nd step
function startVideo() {
    navigator.getUserMedia(
        { video: {}},
        stream => video.srcObject = stream, // here stream means whtas coming from our webcam
        err => console.error(err)
    )
}

// this is 3rd step
startVideo();

// this is 5th step
video.addEventListener('play', () => {

    // this is 7th step
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = { width: video.width, height: video.height };

    // this is 9th step
    faceapi.matchDimensions(canvas, displaySize);

    // this is 6th step
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, 
            new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()
                .withFaceExpressions()
                console.log(detections)

                // this is 8th step
                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                
                // this is 10th step
                canvas.getContext('2d').clearRect(0,0, canvas.width, canvas.height);
                faceapi.draw.drawDetections(canvas, resizedDetections);
                faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
                faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    }, 100)
})
