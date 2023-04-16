let nn = ml5.neuralNetwork({ task: 'classification', debug: true })
nn.load('./model/model.json', modelLoaded)

document.getElementById('predict').addEventListener('submit', submitHandler)
const index = document.getElementById('index')
let testData
let genres

async function submitHandler(e) {
    e.preventDefault()
    // age,anaemia,creatininePhosphokinase,diabetes,ejectionFraction,highBloodPressure,platelets,serumCreatinin,SerumSodium,sex,smoking,time,DeathEvent
    const record = {
        age: parseInt(document.getElementById('age').value),
        anaemia: parseInt(document.getElementById('anaemia').value),
        creatininePhosphokinase: parseInt(document.getElementById('creatininePhosphokinase').value),
        diabetes: parseInt(document.getElementById('diabetes').value),
        ejectionFraction: parseInt(document.getElementById('ejectionFraction').value),
        highBloodPressure: parseInt(document.getElementById('highBloodPressure').value),
        platelets: parseInt(document.getElementById('platelets').value),
        serumCreatinin: parseInt(document.getElementById('serumCreatinin').value),
        SerumSodium: parseInt(document.getElementById('SerumSodium').value),
        sex: parseInt
    }
    console.log(record)
    predict(record)
}

async function predict(record) {
    const results = await nn.classify({ age: record.age, anaemia: record.anaemia, creatininePhosphokinase: record.creatininePhosphokinase, diabetes: record.diabetes, ejectionFraction: record.ejectionFraction, highBloodPressure: record.highBloodPressure, platelets: record.platelets, serumCreatinin: record.serumCreatinin, SerumSodium: record.SerumSodium, sex: record.sex, smoking: record.smoking, time: record.time })
    console.log(results)

}



function modelLoaded() {
    loadData()
    console.log('model loaded')
}