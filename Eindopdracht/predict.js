let nn = ml5.neuralNetwork({ task: 'classification', debug: true })
nn.load('./model/model.json', modelLoaded)

const form = document.getElementById('predict')
form.addEventListener('submit', submitHandler)


async function submitHandler(e) {
    e.preventDefault()

    const record = {
        age: document.getElementById('age').value,
        anaemia: document.getElementById('anaemia').options[document.getElementById('anaemia').selectedIndex].value,
        creatininePhosphokinase: document.getElementById('creatininePhosphokinase').value,
        diabetes: document.getElementById('diabetes').options[document.getElementById('diabetes').selectedIndex].value,
        ejectionFraction: document.getElementById('ejectionFraction').value,
        highBloodPressure: document.getElementById('highBloodPressure').options[document.getElementById('highBloodPressure').selectedIndex].value,
        platelets: document.getElementById('platelets').value,
        serumCreatinin: document.getElementById('serumCreatinin').value,
        SerumSodium: document.getElementById('SerumSodium').value,
        sex: document.getElementById('sex').options[document.getElementById('sex').selectedIndex].value,
        smoking: document.getElementById('sex').options[document.getElementById('smoking').selectedIndex].value,
    }

    // check for undefined values and parse for integers.
    for (let key in record) {
        if (record[key] === undefined) {
            alert('Fields cannot be empty!')
            return
        }

        let value = parseInt(record[key])
        if (isNaN(value)) {
            alert('Fields cannot be empty!')
            return
        } else {
            record[key] = value
        }
    }

    predict(record)

}

async function predict(record) {
    const results = await nn.classify({ age: record.age, anaemia: record.anaemia, creatininePhosphokinase: record.creatininePhosphokinase, diabetes: record.diabetes, ejectionFraction: record.ejectionFraction, highBloodPressure: record.highBloodPressure, platelets: record.platelets, serumCreatinin: record.serumCreatinin, SerumSodium: record.SerumSodium, sex: record.sex, smoking: record.smoking })
    document.getElementById('result').innerHTML = 'Loading...'

    if (results[0].label === '0') {
        document.getElementById('result').innerHTML = `The model predicts that the patient does not have a higher chance ${results[0].confidence < 0.75 ? `( ${parseFloat(results[0].confidence).toFixed(2) * 100} %)` : ''}) to die from heart failure <span id="disclaimer">*Disclaimer: This is not a medical diagnosis</span>`
    } else {
        document.getElementById('result').innerHTML = `The model predicts that the patient has a <strong>higher chance (${parseFloat(results[0].confidence).toFixed(2) * 100}%) </strong> to die from heart failure <span id="disclaimer">*Disclaimer: This is not a medical diagnosis</span>`
    }

}


function modelLoaded() {
    console.log('model loaded')
}