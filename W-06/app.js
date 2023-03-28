import { DecisionTree } from "./libraries/decisiontree.js"
import { VegaTree } from "./libraries/vegatree.js"

//
// DATA
//
const csvFile = "./data/airline-customer-satisfaction/train.csv"
const cvsFileTest = "./data/airline-customer-satisfaction/test.csv"
const trainingLabel = "Satisfaction"
const ignored = ["", "id", "Flight Distance", "Satisfaction", "Arrival Delay in Minutes", "Departure Delay in Minutes"]


let testData
let decisionTree

//
// laad csv data als json
//
function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => trainModel(results.data) // gebruik deze data om te trainen
    })

    Papa.parse(cvsFileTest, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => {
            testData = results.data
        } // gebruik deze data om te accuracy te meten
    })
}

//
// MACHINE LEARNING - Decision Tree
//
function trainModel(data) {
    // todo : splits data in traindata en validatiedata 80 / 20
    const trainData = data.slice(0, Math.floor(data.length * 0.8))
    const validationData = data.slice(Math.floor(data.length * 0.8), data.length)

    // maak het algoritme aan
   decisionTree = new DecisionTree({
        ignoredAttributes: ignored,
        trainingSet: trainData,
        categoryAttr: trainingLabel,
    })

    // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
    new VegaTree('#view', 800, 400, decisionTree.toJSON())

    // todo : bereken de accuracy met behulp van alle test data
    const { dissatisfiedCorrect, dissatisfiedIncorrect, satisfiedCorrect, satisfiedIncorrect, accuracy } = getPrediction(trainData)


    console.log(`Accuracy: ${accuracy}`)

    document.getElementById("accuracy").innerHTML = `Accuracy : ${accuracy.toFixed(3) * 100}% (${accuracy})`
    document.getElementById("satisfiedCorrect").innerHTML = satisfiedCorrect
    document.getElementById("satisfiedPredicted").innerHTML = satisfiedIncorrect
    document.getElementById("dissatisfiedCorrect").innerHTML = dissatisfiedCorrect
    document.getElementById("dissatisfiedPredicted").innerHTML = dissatisfiedIncorrect

}

function getPrediction( people) {
    let predicted = { satisfiedCorrect: 0, dissatisfiedCorrect: 0, satisfiedIncorrect: 0, dissatisfiedIncorrect: 0, accuracy: 0 }

    for (let person of people) {
        let prediction = testPerson(person)

        if (prediction.prediction === "satisfied") {
            if (prediction.actual === prediction.prediction) {
                predicted.satisfiedCorrect++
            } else {
            predicted.satisfiedIncorrect++
            }
        }
        if (prediction.prediction === "neutral or dissatisfied") {
            if (prediction.actual === prediction.prediction) {
                predicted.dissatisfiedCorrect++
            } else {
            predicted.dissatisfiedIncorrect++
            }
        }
    }
    predicted.accuracy = (predicted.satisfiedCorrect + predicted.dissatisfiedCorrect) / people.length
  
    return predicted
}

function testPerson(person) {
    const personWithoutSatisfaction = { ...person }
    delete personWithoutSatisfaction.Satisfaction

    const prediction = decisionTree.predict(personWithoutSatisfaction)
    return ({ prediction, actual: person.Satisfaction })
}


loadData()