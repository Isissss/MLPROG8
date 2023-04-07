import { createChart, updateChart } from "./scatterplot.js"
let trainingsData = []
let testData
let genres

document.getElementById("save").addEventListener("click", () => nn.save())
document.getElementById("train").addEventListener("click", trainData)

const options = {
    task: 'classification',
    inputs: ['bpm', 'nrgy', 'dnce', 'dB', 'live', 'val', 'acous', 'spch'],
    outputs: ['songName'],
    debug: true
}

const nn = ml5.neuralNetwork(options)


function loadData() {
    Papa.parse("./data/spotify.csv", {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => trainingsData.push(results.data)
    })

    Papa.parse("./data/top10s.csv", {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => {
            trainingsData.push(results.data)
            prepareData(trainingsData.flat())
        }
    })

}

function prepareData(data) {
    console.log(data)
    // get every top genre and remove the duplicates. give each genre a number
    genres = [...new Set(data.map(house => house.topGenre))].map((genre, index) => ({ genre, index }))

    console.log(genres)
    // data.sort(() => Math.random() > 0.5)
    trainingsData = data.slice(0, Math.floor(data.length * 0.8))
    testData = data.slice(Math.floor(data.length * 0.8) + 1)

    // showChart(data);
}

function showChart(data) {
    const chartdata = data.map(house => ({
        x: house.LotArea,
        y: house.retailvalue,
    }))

    createChart(chartdata, "Balcony", "Retailvalue")
}

function trainData() {
    document.getElementById("train").disabled = true

    // een voor een de data toevoegen aan het neural network
    for (let song of trainingsData) {
        if (song.bpm && song.nrgy && song.dnce && song.dB && song.live && song.val && song.acous && song.spch && song.title && song.topGenre) {
            //replace spaces 

            const namecleaned = song.title.toString().replace(`/ /g, "_"`)
            const genreToIndex = genres.find(genre => genre.genre === song.topGenre).index

            nn.addData({ bpm: song.bpm, nrgy: song.nrgy, dnce: song.dnce, dB: song.dB, live: song.live, val: song.val, acous: song.acous, spch: song.spch, genre: genreToIndex }, { songName: namecleaned })
        }

    }




    // normalize
    nn.normalizeData()

    const epochInput = 400
    console.log(epochInput)
    nn.train({ epochs: epochInput }, () => {
        console.log("training done")
        // finishedTraining()
        document.getElementById("save").disabled = false
        document.getElementById("train").disabled = false
    })
}

document.getElementById("predict").addEventListener("click", finishedTraining)
async function finishedTraining() {
    const index = document.getElementById("index").value
    const indexParsed = parseInt(index)
    const song = testData[indexParsed]
    if (song.bpm && song.nrgy && song.dnce && song.dB && song.live && song.val && song.dur && song.acous && song.spch && song.title) {
        const result = await nn.classify({ bpm: song.bpm, nrgy: song.nrgy, dnce: song.dnce, dB: song.dB, live: song.live, val: song.val, acous: song.acous, spch: song.spch })
        // filter 3 highest confidence
        const highest = result.sort((a, b) => b.confidence - a.confidence).slice(0, 3)
        console.log(highest)

    }
}


loadData() 