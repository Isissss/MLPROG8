import { createChart, updateChart } from "./scatterplot.js"
let trainingsData
let testData

document.getElementById("save").addEventListener("click", () => nn.save())
document.getElementById("train").addEventListener("click", trainData)

const nn = ml5.neuralNetwork({ task: 'regression', debug: true })

function loadData() {
    Papa.parse("./data/utrecht-houseprices.csv", {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => prepareData(results.data)
    })
}

function prepareData(data) {
    data.sort(() => Math.random() > 0.5)
    trainingsData = data.slice(0, Math.floor(data.length * 0.8))
    testData = data.slice(Math.floor(data.length * 0.8) + 1)

    showChart(data);
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
    for (let house of trainingsData) {
        nn.addData({ LotLen: house.LotLen, LotArea: house.LotArea, HouseArea: house.HouseArea, bathrooms: house.bathrooms, Balcony: house.Balcony, GardenSize: house.GardenSize, taxvalue: house.taxvalue }, { retailvalue: house.retailvalue })
    }

    // normalize
    nn.normalizeData()

    const epochInput = parseInt(document.getElementById("epochs").value) || 10
    console.log(epochInput)
    nn.train({ epochs: epochInput }, () => {
        console.log("training done")
        finishedTraining()
        document.getElementById("save").disabled = false
        document.getElementById("train").disabled = false
    })

}

async function finishedTraining() {
    for (let i = 0; i < testData.length; i++) {
        const result = await nn.predict({ LotLen: testData[i].LotLen, LotArea: testData[i].LotArea, HouseArea: testData[i].HouseArea, GardenSize: testData[i].GardenSize, Balcony: testData[i].Balcony, bathrooms: testData[i].bathrooms, taxvalue: testData[i].taxvalue })
        console.log(result[0].retailvalue, testData[i].retailvalue)
    }
}


loadData()