
const knnClassifier = ml5.KNNClassifier();
const k = 3
const KNN = new kNear(k)
let trainingsData
let testData
//
// start de applicatie
//
async function main() {

}

function loadData() {
    Papa.parse("src/data/spotify.csv", {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => prepareData(results.data)
    })
}

async function prepareData(data) {
    // data.sort(() => Math.random() > 0.5)
    trainingsData = data.slice(0, Math.floor(data.length * 0.8))
    testData = data.slice(Math.floor(data.length * 0.8) + 1)

    for (let i = 0; i < 300; i++) {
        const song = trainingsData[i]
        const newSong = { ...song }
        delete newSong.title
        delete newSong.artist
        delete newSong.genre
        delete newSong.yearReleased
        delete newSong.added
        delete newSong.topYear
        delete newSong.artistType
        delete newSong.topGenre

        let songFlat = Object.values(newSong).flat()

        knnClassifier.addExample(songFlat, i)
        console.log(`trained ${song.title}`)
    }


    const newSong = testData[1]
    delete newSong.title
    delete newSong.artist
    delete newSong.genre
    delete newSong.yearReleased
    delete newSong.added
    delete newSong.topYear
    delete newSong.artistType
    delete newSong.topGenre

    let songFlat = Object.values(newSong).flat()
    await knnClassifier.classify(songFlat, (err, result) => {
        console.log(result); // result.label is the predicted label
    });


}

loadData()

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



async function classify(video, test) {
    const points = await predict(video)

    if (!points) return

    const results = KNN.classify(points)
    console.log(`results: ${results}`)
    return results

}



function saveTraining() {
    KNN.save()
    console.log("training saved")
}
// start
//
main()