let nn = ml5.neuralNetwork({ task: 'regression', debug: true })
nn.load('./model/model.json', modelLoaded)

document.getElementById('predict').addEventListener('submit', submitHandler)

async function submitHandler(e) {
    e.preventDefault()

    let house = {
        Zipcode: document.getElementById('zipcode').value,
        LotLen: document.getElementById('lotlen').value,
        LotWidth: document.getElementById('lotwidth').value,
        LotArea: document.getElementById('lotarea').value,
        HouseArea: document.getElementById('housearea').value,
        GardenSize: document.getElementById('gardensize').value,
        Balcony: document.getElementById('balcony').value,
        Buildyear: document.getElementById('buildyear').value,
        bathrooms: document.getElementById('bathrooms').value,
        taxvalue: document.getElementById('taxvalue').value
        // xCoord: document.getElementById('xcoord').value,
        // yCoord: document.getElementById('ycoord').value
    }

    try {
        for (let key in house) {
            house[key] = parseInt(house[key])
        }

    } catch (error) {
        console.log(error)
    }

    predict(house)
}

async function predict(house) {
    const prediction = await nn.predict({ Zipcode: house.Zipcode, LotLen: house.LotLen, LotWidth: house.LotWidth, LotArea: house.LotArea, HouseArea: house.HouseArea, GardenSize: house.GardenSize, Balcony: house.Balcony, Buildyear: house.Buildyear, bathrooms: house.bathrooms, taxvalue: house.taxvalue })
    const result = prediction[0].retailvalue
    const fmt = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' })
    document.getElementById('result').innerHTML = fmt.format(result)
}


function modelLoaded() {
    console.log('model loaded')
}