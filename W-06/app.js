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
    let decisionTree = new DecisionTree({
        ignoredAttributes: ignored,
        trainingSet: trainData,

        categoryAttr: trainingLabel,

    })

    // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
    let visual = new VegaTree('#view', 800, 400, decisionTree.toJSON())

    // todo : bereken de accuracy met behulp van alle test data
    const { dissatisfiedCorrect, dissatisfiedPredicted, satisfiedCorrect, satisfiedPredicted, accuracy } = getPrediction(decisionTree, testData)


    console.log(`Accuracy: ${accuracy}`)

    document.getElementById("accuracy").innerHTML = `Accuracy : ${accuracy.toFixed(3) * 100}% (${accuracy})`
    document.getElementById("satisfiedCorrect").innerHTML = satisfiedCorrect
    document.getElementById("satisfiedPredicted").innerHTML = satisfiedPredicted - satisfiedCorrect
    document.getElementById("dissatisfiedCorrect").innerHTML = dissatisfiedCorrect
    document.getElementById("dissatisfiedPredicted").innerHTML = dissatisfiedPredicted - dissatisfiedCorrect

}

function getPrediction(decisionTree, people) {
    let predicted = { satisfiedCorrect: 0, dissatisfiedCorrect: 0, satisfiedPredicted: 0, dissatisfiedPredicted: 0, accuracy: 0 }

    for (let person of people) {
        let prediction = testPerson(decisionTree, person)

        if (prediction.prediction === "satisfied") {
            if (prediction.actual === prediction.prediction) {
                predicted.satisfiedCorrect++
            }
            predicted.satisfiedPredicted++
        }
        if (prediction.prediction === "neutral or dissatisfied") {
            if (prediction.actual === prediction.prediction) {
                predicted.dissatisfiedCorrect++
            }
            predicted.dissatisfiedPredicted++
        }
    }
    predicted.accuracy = (predicted.satisfiedCorrect + predicted.dissatisfiedCorrect) / people.length
    console.log(people.length)
    return predicted
}

function testPerson(decisionTree, person) {
    const personWithoutSatisfaction = { ...person }
    delete personWithoutSatisfaction.Satisfaction

    const prediction = decisionTree.predict(personWithoutSatisfaction)
    return ({ prediction, actual: person.Satisfaction })
}


loadData()