// 1st step
const imageUpload = document.getElementById('imageUpload');

// 2nd step
Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(start);

//3rd start
async function start() {
    // document.body.append('Loaded');

    //6th step
    const container = document.createElement('div');
    container.style.position = 'relative';
    document.body.append(container);

    //11th step
    const labeledFaceDescriptors = await loadLabeledImages();
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);

    //13th step
    let image;
    let canvas;

    //6th step
    document.body.append('Loaded');

    //4th start
    imageUpload.addEventListener('change', async () => {

        //13th step
        if(image) image.remove();
        if(canvas) canvas.remove();

        //4th step
        image = await faceapi.bufferToImage(imageUpload.files[0]);

        //5th start
        image.style.width = '1200px';
        image.style.height = '750px';

        container.append(image);

        //7th step
        canvas = faceapi.createCanvasFromMedia(image);
        container.append(canvas);
        const displaySize = { width: image.width, height: image.height };
        faceapi.matchDimensions(canvas, displaySize);

        //4th start
        const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();

        // document.body.append(detections.length);

        //8th step
        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        //12th step
        const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));


        //8th step
        // resizedDetections.forEach(detection => {
        
        //12th step continue
        results.forEach((result, i) => {
            // const box = detection.detection.box;
            const box = resizedDetections[i].detection.box;
 
            // const drawBox = new faceapi.draw.DrawBox(box, { label: 'Face' });
            const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() });
            drawBox.draw(canvas);
        });

    })
}

//9th step to recognize faces in the image
function loadLabeledImages() {
    const labels = ['Antonio', 'Black Widow', 'Captain America', 'Captain Marvel', 'George',
     'Hawkeye', 'Henrick', 'Jim Rhodes', 'Thor', 'Tony Stark'];

     return Promise.all(
         labels.map(async label => {

            const descriptions = [];
             for (let i = 1; i <= 2; i++) {
                 const img =  await faceapi.fetchImage(`https://raw.githubusercontent.com/nabilgj/Face-Recognition-JavaScript/master/labeled_images/${label}/${i}.jpg`);
                //  const img =  await faceapi.fetchImage(`https://raw.githubusercontent.com/nabilgj/Face-Recognition-JavaScript/master/labeled_images/${label}/${i}.jpg`)
                 

                 const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
                 descriptions.push(detections.descriptor);
             }

             return new faceapi.LabeledFaceDescriptors(label, descriptions)
         })
     )
}




