const video = document.getElementById('webcam')
const featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded)

const label = document.getElementById("label")
let classifier

const penbtn = document.querySelector("#pen")
const maskbtn = document.querySelector("#toiletpaper")
const forkbtn = document.querySelector("#fork")
const trainbtn = document.querySelector("#train")
const savebtn = document.querySelector("#save")

penbtn.addEventListener("click", () => addPen())
maskbtn.addEventListener("click", () => addToiletPaper())
forkbtn.addEventListener("click", () => addFork())
trainbtn.addEventListener("click", () => train())
savebtn.addEventListener("click", () => Save())

document.addEventListener("DOMContentLoaded", () => {
    featureExtractor.load('my_model/model.json');
    startClassifying()
})

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream
        })
        .catch((err) => {
            console.log("Something went wrong!");
        });
}

function modelLoaded(){
    console.log("The mobileNet model is loaded!")
    const options = { numLabels: 3 }
 
    classifier = featureExtractor.classification(video, options)
}

function videoReady(){
    console.log(classifier)
}

function addFork(){
    classifier.addImage(video, "Fork", addedImage)
}

function addPen() {
    classifier.addImage(video, "Pen", addedImage)
}

function addToiletPaper(){
    classifier.addImage(video, "Toiletpaper", addedImage)
}

 
function train(){
    console.log("start training...")
    classifier.train((lossValue) => {
        console.log(lossValue)
        if(lossValue == null){
            startClassifying()
        }
    })
}

function Save () {
    featureExtractor.save()
}
 
function predictImage(image){
   
    classifier.classify(tf.fromPixels(image), (err, result) => {
        if(err) console.log(err)
        console.log(result)
    })
}
function startClassifying(){
    setInterval(()=>{
        classifier.classify(video, (err, result)=>{
            if(err) console.log(err)
            console.log(result, result[0].confidence)
            label.innerHTML = `${result[0].label} - Ik ben er ${Math.round(result[0].confidence*100)}`
        })
    }, 1000)
}

function addedImage(){
    console.log("added image to network")
}