let trainingsData = []
let testData
let validatieData
document.getElementById("save").addEventListener("click", () => nn.save())
document.getElementById("train").addEventListener("click", trainData)

const options = {
    task: 'classification',
    debug: true
}

const nn = ml5.neuralNetwork(options)


function loadData() {

    Papa.parse("./data/heart_failure_clinical_records_dataset.csv", {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => prepareData(results.data)
    })

}

function prepareData(data) {
    console.log(data)
    //randomize
    let newData = data.sort(() => Math.random() - 0.5);


    trainingsData = newData.slice(0, Math.floor(newData.length * 0.8))
    validatieData = newData.slice(Math.floor(newData.length * 0.6), Math.floor(newData.length * 0.8) + 1)
    testData = newData.slice(Math.floor(newData.length * 0.8), newData.length + 1)



}


function trainData() {
    document.getElementById("train").disabled = true

    // een voor een de data toevoegen aan het neural network
    for (let record of trainingsData) {
        // age,anaemia,creatininePhosphokinase,diabetes,ejectionFraction,highBloodPressure,platelets,serumCreatinin,SerumSodium,sex,smoking,time,DeathEvent
        nn.addData({ age: record.age, anaemia: record.anaemia, creatininePhosphokinase: record.creatininePhosphokinase, diabetes: record.diabetes, ejectionFraction: record.ejectionFraction, highBloodPressure: record.highBloodPressure, platelets: record.platelets, serumCreatinin: record.serumCreatinin, SerumSodium: record.SerumSodium, sex: record.sex, smoking: record.smoking }, { DeathEvent: record.DeathEvent.toString() })
    }



    // normalize
    nn.normalizeData()

    const epochInput = 100
    console.log(epochInput)
    nn.train({ epochs: epochInput }, () => {
        console.log("training done")
        finishedTraining()
        document.getElementById("save").disabled = false
        document.getElementById("train").disabled = false
    })

}

document.getElementById("predict").addEventListener("click", finishedTraining)
async function finishedTraining() {
    let correct = 0

    for (let record of validatieData) {
        const results = await nn.classify({ age: record.age, anaemia: record.anaemia, creatininePhosphokinase: record.creatininePhosphokinase, diabetes: record.diabetes, ejectionFraction: record.ejectionFraction, highBloodPressure: record.highBloodPressure, platelets: record.platelets, serumCreatinin: record.serumCreatinin, SerumSodium: record.SerumSodium, sex: record.sex, smoking: record.smoking })
        if (results[0].label === record.DeathEvent.toString()) {
            correct++
        }

    }

    console.log(correct / validatieData.length)

    let liveCorr = 0
    let diedCorr = 0
    let liveWrong = 0
    let diedWrong = 0
    for (let record of testData) {
        const results = await nn.classify({ age: record.age, anaemia: record.anaemia, creatininePhosphokinase: record.creatininePhosphokinase, diabetes: record.diabetes, ejectionFraction: record.ejectionFraction, highBloodPressure: record.highBloodPressure, platelets: record.platelets, serumCreatinin: record.serumCreatinin, SerumSodium: record.SerumSodium, sex: record.sex, smoking: record.smoking, time: record.time })
        if (results[0].label === record.DeathEvent.toString()) {
            if (results[0].label === "1") {
                diedCorr++
                document.getElementById("diedCorr").innerHTML = diedCorr
            } else {

            }
            if (results[0].label === "0") {
                liveCorr++
                document.getElementById("liveCorr").innerHTML = liveCorr
            }

        } else {
            if (results[0].label === "1" || results[0].label === 1) {
                diedWrong++
                document.getElementById("diedPred").innerHTML = diedWrong
            } else {

            }
            if (results[0].label === "0" || results[0].label === 0) {
                liveWrong++
                document.getElementById("livePred").innerHTML = liveWrong
            } else {
                console.log(results[0].label, record.DeathEvent.toString())
            }

        }

    }
    console.log(liveCorr, liveWrong, diedCorr, diedWrong)
    console.log((liveCorr + diedCorr) / testData.length)

}


loadData() 