let model
let videoWidth, videoHeight
let ctx, canvas
const data = await fetch("src/data.json").then(res => res.json())
const poseInput = document.querySelector("#poseInput")
const addPoseButton = document.querySelector("#poseButton")
const classifyButton = document.querySelector("#classifyButton")
const clearTrainingButton = document.querySelector("#deleteTrainingButton")
const saveTrainingButton = document.querySelector("#saveTrainingButton")

saveTrainingButton.addEventListener("click", () => saveTraining())
document.getElementById("start").addEventListener("click", startGame)
clearTrainingButton.addEventListener("click", () => clearTraining())
addPoseButton.addEventListener("click", () => savePose(video))
classifyButton.addEventListener("click", () => classify(video))
 
const VIDEO_WIDTH = 720
const VIDEO_HEIGHT = 405
let video
let results
let getPick
let oldResults
const k = 3
const KNN = new kNear(k, data)

//
// start de applicatie
//
async function main() {
    model = await handpose.load()
    video = await setupCamera()
    video.play()
    startLandmarkDetection(video)
}

//
// start de webcam
//
async function setupCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
            "Webcam not available"
        )
    }

    const video = document.getElementById("video")
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            facingMode: "user",
            width: VIDEO_WIDTH,
            height: VIDEO_HEIGHT
        }
    })
    video.srcObject = stream

    return new Promise(resolve => {
        video.onloadedmetadata = () => {
            resolve(video)
        }
    })
}
async function predict(video) {

    const predictions = await model.estimateHands(video) // ,true voor flip
  
    if (predictions.length > 0) {
        const boundingBox = predictions[0].boundingBox
        const keypoints = predictions[0].landmarks
        const newPoints = keypoints.reduce((acc, curr) => {
            acc.push((curr[0] - boundingBox.topLeft[0] / boundingBox.bottomRight[0] - boundingBox.topLeft[0]), (curr[1] - boundingBox.topLeft[1] / boundingBox.bottomRight[1] - boundingBox.topLeft[1]))
            return acc

        }, [])
  
        return newPoints.flat()

    } else {
        console.log("no hand detected")
        return false 
    }
}

function savePose(video) {
    predict(video).then((keypoints) => {
 
    if (!keypoints) return 

    KNN.learn(keypoints, poseInput.value)
    console.log(`trained ${poseInput.value}`)
    })
}
//
// predict de vinger posities in de video stream
//
async function startLandmarkDetection(video) {

    videoWidth = video.videoWidth
    videoHeight = video.videoHeight

    canvas = document.getElementById("output")

    canvas.width = videoWidth
    canvas.height = videoHeight

    ctx = canvas.getContext("2d")

    video.width = videoWidth
    video.height = videoHeight

    ctx.clearRect(0, 0, videoWidth, videoHeight)
    ctx.strokeStyle = "red"
    ctx.fillStyle = "red"

    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1) // video omdraaien omdat webcam in spiegelbeeld is

    predictLandmarks()
   
}


function startGame() {
    document.getElementById("start").disabled = true
    document.getElementById("test").style.display = "flex"
    document.getElementById("results").innerHTML = "Pick scissors, rock or paper and hold the pose in front of the camera."
    document.querySelectorAll(".item").forEach(item => item.classList.remove("active"))
    getPick = setInterval(()=>getThing(), 2000)
}
 
function stopGame() {
    clearInterval(getPick)
    results = ""
    oldResults = ""
    document.getElementById("start").innerText = "Restart"
    document.getElementById("start").disabled = false
}

async function classify(video, test) {
        const points = await predict(video)

        if (!points) return 

        const results = KNN.classify(points)
        console.log(`results: ${results}`)
        return results
   
}

//
// predict de locatie van de vingers met het model
//

async function predictLandmarks() {
   
    ctx.drawImage(video, 0, 0, videoWidth, videoHeight, 0, 0, canvas.width, canvas.height)
    // prediction!
    // predict functie
    // 60 keer per seconde is veel, gebruik setTimeout om minder vaak te predicten
    requestAnimationFrame(predictLandmarks)
    // setTimeout(()=>predictLandmarks(), 1000)
 
}
let score = 0

async function getThing () {
    if (results) {
        oldResults = results
    }
    results = await classify(video, oldResults) 
    if (results !== oldResults) {
        document.querySelector("#results").innerText = `Identifying pose, hold on...`
    } else if (oldResults === results && results == "steen" || results == "papier" || results == "schaar") {
        let computerChoice
        if (results == "steen") {
            computerChoice = "papier"
            document.querySelector('.computer.papier').classList.add('active')
            document.querySelector('.player.steen').classList.add('active')
        } else if (results == "papier") {
            computerChoice = "schaar"
             document.querySelector('.computer.schaar').classList.add('active')
             document.querySelector('.player.papier').classList.add('active')
        } else if (results == "schaar") {
            computerChoice = "steen"
            document.querySelector('.player.schaar').classList.add('active')
            document.querySelector('.computer.steen').classList.add('active')
        }
        score--
        document.getElementById("score").innerHTML = " " + score
        document.querySelector("#results").innerText = `You picked ${results}! I've used my sixth sense to pick ${computerChoice}! Sorry. You lost. `
        stopGame()
    }
 
}

//
// teken hand en vingers met de x,y coordinaten. de z waarde tekenen we niet.
//
function drawHand(ctx, keypoints, annotations) {
    // toon alle x,y,z punten van de hele hand in het log venster
    // log.innerText = keypoints.flat()

    // punten op alle kootjes kan je rechtstreeks uit keypoints halen 
    for (let i = 0; i < keypoints.length; i++) {
        const y = keypoints[i][0]
        const x = keypoints[i][1]
        drawPoint(ctx, x - 2, y - 2, 3)
    }

    // palmbase als laatste punt toevoegen aan elke vinger
    let palmBase = annotations.palmBase[0]
    for (let key in annotations) {
        const finger = annotations[key]
        finger.unshift(palmBase)
        drawPath(ctx, finger, false)
    }
}

//
// teken een punt
//
function drawPoint(ctx, y, x, r) {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2 * Math.PI)
    ctx.fill()
}
//
// teken een lijn
//
function drawPath(ctx, points, closePath) {
    const region = new Path2D()
    region.moveTo(points[0][0], points[0][1])
    for (let i = 1; i < points.length; i++) {
        const point = points[i]
        region.lineTo(point[0], point[1])
    }

    if (closePath) {
        region.closePath()
    }
    ctx.stroke(region)
}


function saveTraining () {
    KNN.save()
    console.log("training saved")
}
// start
//
main()