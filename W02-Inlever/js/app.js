const featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded);
const objectiveDiv = document.getElementById("objective")
const objectives = ["Fork", "Pen", "Toiletpaper"]
let synth = window.speechSynthesis
let itemsLeft = objectives.length
let objective
let time = 0
let timer
const scoreDiv = document.getElementById("score")
const input = document.getElementById("file")
const inputLabel = document.getElementById("fileLabel")
const startButton = document.getElementById("startGame")
const resultDiv = document.getElementById("result")
const img = document.getElementById('output')
img.addEventListener('load', () => userImageUploaded())



const classifier = featureExtractor.classification(img, { numLabels: 3 })

startButton.addEventListener("click", () => {
    shuffleArray(objectives)
    startGame()
});

function userImageUploaded() {
    classify()
}

input.addEventListener("change", (event) => {
    img.style.display = "block"
    img.src = URL.createObjectURL(event.target.files[0])
})

function startGame() {
    announceNewObjective()
    startButton.remove()
    document.getElementById("info").remove()
    document.getElementById("time").style.display = "block"
    input.style.display = "inline-block"
    inputLabel.style.display = "inline-block"
    scoreDiv.innerHTML = `Items left: ${itemsLeft}`

    startTimer()
}

function startTimer() {
    timer = setInterval(function () {
        time++
        document.getElementById("time").innerHTML = `Time: ${time} seconds`

    }, 1000)
}

function restart() {
    img.style.display = "none"
    fileLabel.style.display = "inline-block"
    URL.revokeObjectURL(img.src)
    input.value = null
    input.style.display = "inline-block"
}


function classify() {
    classifier.classify(img, (err, result) => {
        if (err) console.log(err)

        if (result[0].label == objective && result[0].confidence > 0.9) {

            announceResult(`Correct! I am  ${Math.round(result[0].confidence * 100)}% positive that that is a ${result[0].label}. `, true)
            itemsLeft--
            scoreDiv.innerHTML = `Items left: ${itemsLeft}`

            if (itemsLeft == 0) {
                clearInterval(timer)
                input.disabled = true
                objectiveDiv.innerHTML = `You won! You completed the game in ${time} seconds. Refresh the page to play again.`
                speak(`You won!, you completed the game in ${time} seconds Refresh the page to play again.`)

                return
            }
            announceNewObjective()

            fileLabel.style.display = "inline-block"
            input.style.display = "inline-block"
            input.value = null

        }
        else {
            announceResult(`That is not a ${objective}. Try again.`, false)


        }
    })
}

function announceNewObjective() {
    let string
    objective = objectives[itemsLeft - 1]
    string = (itemsLeft == objectives.length) ? "Objective" : `Correct! New objective`
    objectiveDiv.innerHTML = `${string}: Take a picture of a ${objective}`
    speak(`${string}: Take a picture of a ${objective}`)
}

function announceResult(text, correct) {
    resultDiv.style.color = correct ? "green" : "red"
    resultDiv.innerHTML = text

    if (!correct) {
        speak (text)
    }

}

function speak(text) {
    if (synth.speaking) {
        synth.cancel()
        setTimeout(function () {
            synth.speak(text)
        }, 250);
    }
    if (text !== '') {
        let utterThis = new SpeechSynthesisUtterance(text)
        utterThis.name = "Google US English"
        utterThis.lang = "en-US"
        synth.speak(utterThis)
    }

}

function loadCustomModel() {
    featureExtractor.load('./my_model/model.json')
    console.log("Custom model loaded")
    document.getElementById("loading").remove()
    document.getElementById("main").style.display = "block"
}

function modelLoaded() {
    console.log('Model Loaded!');
    loadCustomModel()
}


function shuffleArray(array) {
    array.sort(() => Math.random() - 0.5);
}
