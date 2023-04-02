import { createChart, updateChart } from "./scatterplot.js"
let trainingsData
let testData
const nn = ml5.neuralNetwork({ task: 'regression', debug: true })
//
// demo data
//
const data = [
        { horsepower: 130, mpg: 18 },
        { horsepower: 165, mpg: 15 },
        { horsepower: 225, mpg: 14 },
        { horsepower: 97, mpg: 18 },
        { horsepower: 88, mpg: 27 },
        { horsepower: 193, mpg: 9 },
        { horsepower: 80, mpg: 25 },
]

function loadData(){
    Papa.parse("./data/utrecht-houseprices.csv", {
        download:true,
        header:true, 
        dynamicTyping:true,
        complete: results => trainData(results.data)
    })
}

function checkData(data) {
    console.table(data)
}
function prepareData(data) {    data.sort(() => Math.random() > 0.5)   
     trainingsData = data.slice(0, Math.floor(data.length * 0.8))   
     testData  = data.slice(Math.floor(data.length * 0.8) + 1)
    }

function trainData(data){
    // shuffle
prepareData(data)

// een voor een de data toevoegen aan het neural network
 
for (let house of trainingsData) {
    nn.addData({ Zipcode: house.Zipcode, LotLen: house.LotLen, LotWidth: house.LotWidth, LotArea: house.LotArea, HouseArea: house.HouseArea, GardenSize: house.GardenSize, Balcony: house.Balcony, xCoor: house.xCoor, yCoor: house.yCoor, Buildyear: house.Buildyear, bathrooms: house.bathrooms, taxvalue: house.taxvalue }, { retailvalue: house.retailvalue })
}

// normalize
nn.normalizeData()

nn.train({ epochs: 13 }, () => predict()) 
 
nn.save()
}

async function predict(){ 

    for (let i = 0; i < testData.length; i++) {
    const result = await nn.predict({ Zipcode: testData[i].Zipcode, LotLen: testData[i].LotLen, LotWidth: testData[i].LotWidth, LotArea: testData[i].LotArea, HouseArea: testData[i].HouseArea, GardenSize: testData[i].GardenSize, Balcony: testData[i].Balcony, xCoor: testData[i].xCoor, yCoor: testData[i].yCoor, Buildyear: testData[i].Buildyear, bathrooms: testData[i].bathrooms, taxvalue: testData[i].taxvalue }) 
 console.log(result[0].retailvalue, testData[i].retailvalue)
    }
}

loadData()