
const k = 3
const KNN = new kNear(k)
let trainingsData = []
let testData

function loadData() {


    Papa.parse("./src/heart_failure_clinical_records_dataset.csv", {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => prepareData(results.data)
    })



}



function prepareData(data) {
    // get all age groups and give them an index

    //randomize
    let newData = data.sort(() => Math.random() - 0.5);
    // // console.log(newData)

    trainingsData = newData.slice(0, Math.floor(newData.length * 0.8))
    testData = newData.slice(Math.floor(newData.length * 0.8) + 1)

    trainData(trainingsData)
}




function trainData(data) {
    // get all the age groups and give them an index


    for (let record of data) {
        const target = record.DeathEvent.toString()
        //age,anaemia,creatininePhosphokinase,diabetes,ejectionFraction,highBloodPressure,platelets,serumCreatinin,SerumSodium,sex,smoking,time,DeathEvent
        const points = [record.age, record.anaemia, record.diabetes, record.ejectionFraction, record.highBloodPressure, record.platelets, record.serumCreatinin, record.SerumSodium, record.sex, record.smoking, record.time]
        KNN.learn(points, target)
    }

    classify()
}
//
// predict de vinger posities in de video stream



async function classify() {
    let correct = 1
    for (let record of testData) {
        const results = await KNN.classify([record.age, record.anaemia, record.diabetes, record.ejectionFraction, record.highBloodPressure, record.platelets, record.serumCreatinin, record.SerumSodium, record.sex, record.smoking, record.time])
        if (results == record.DeathEvent.toString()) {
            correct++
        }
        // console.log(results, record.DeathEvent.toString())


    }
    console.log("accuracy: ", correct / testData.length)
}

//
// predict de locatie van de vingers met het model
//




function saveTraining() {
    KNN.save()
    console.log("training saved")
}
// start
//
loadData()