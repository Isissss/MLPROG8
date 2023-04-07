let nn = ml5.neuralNetwork({ task: 'classification', debug: true })
nn.load('./model/model.json', modelLoaded)

document.getElementById('predict').addEventListener('submit', submitHandler)
const index = document.getElementById('index')
let testData
let genres

function loadData() {
    // Papa.parse("./data/spotify.csv", {
    //     download: true,
    //     header: true,
    //     dynamicTyping: true,
    //     complete: results => prepareData(results.data)
    // })

    Papa.parse("./data/top10s.csv", {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => prepareData(results.data)
    })



}


function prepareData(data) {

    testData = data.slice(Math.floor(data.length * 0.8) + 1)
    genres = [...new Set(data.map(house => house.topGenre))].map((genre, index) => ({ genre, index }))

}

async function submitHandler(e) {
    e.preventDefault()

    const parsedIndex = parseInt(index.value)
    let song = testData[parsedIndex]

    predict(song)
}

async function predict(song) {
    console.log(song.title)
    if (song.bpm && song.nrgy && song.dnce && song.dB && song.live && song.val && song.dur && song.acous && song.spch && song.title && song.topGenre) {

        const genreToIndex = genres.find(genre => genre.genre === song.topGenre).index
        const result = await nn.classify({ bpm: song.bpm, nrgy: song.nrgy, dnce: song.dnce, dB: song.dB, live: song.live, val: song.val, acous: song.acous, spch: song.spch, genre: genreToIndex })
        // filter 3 highest confidence
        const highest = result.sort((a, b) => b.confidence - a.confidence).slice(0, 3)
        console.log(highest)

    }
}


function modelLoaded() {
    loadData()
    console.log('model loaded')
}