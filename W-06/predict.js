document.getElementById('predict').addEventListener('submit', predict)
document.querySelector('select').addEventListener('change', (e) => setValue(e.target))
import { DecisionTree } from "./libraries/decisiontree.js"
import { VegaTree } from "./libraries/vegatree.js"
let decisionTree

function loadSavedModel() {
    fetch("./model/model.json")
        .then((response) => response.json())
        .then((model) => modelLoaded(model))
}

function modelLoaded(model) {
    decisionTree = new DecisionTree(model)
    let visual = new VegaTree('#view', 500, 400, decisionTree.toJSON())
    // test om te zien of het werkt

    let passenger = {
        "Class": "Business",
        "Inflight wifi service": 5,
        "Departure/Arrival time convenient": 5,
        "Ease of Online booking": 5,
        "Food and drink": 5,
        "Online boarding": 5,
        "Seat comfort": 5,
        "Inflight entertainment": 4,
        "On-board service": 5,
        "Leg room service": 5,
        "Baggage handling": 5,
        "Checkin service": 5,
        "Inflight service": 5,
        "Cleanliness": 5,
    }
    let prediction = decisionTree.predict(passenger)
    console.log("predicted " + prediction)
}


function setValue(target) {
    console.log('triggered')
    // return when its a select or number input 
    if (target.type == "select-one" || target.type == "number") {
        return
    }

    let value = target.id

    document.getElementById(`${value}-value`).innerHTML = target.value
    if (target.value < 3) {
        document.getElementById(`${value}-value`).style.color = "red"
    } else if (target.value == 3) {
        document.getElementById(`${value}-value`).style.color = "orange"
    } else {
        document.getElementById(`${value}-value`).style.color = "green"
    }

}
document.getElementById('sliders').addEventListener('input', (e) => setValue(e.target))

function predict(e) {
    e.preventDefault()

    if (!decisionTree) {
        alert("Model not loaded yet")
        return
    }


    if (document.getElementById('class').options[document.getElementById('class').selectedIndex].text == "Pick an option" || document.getElementById('travel').options[document.getElementById('travel').selectedIndex].text == "Pick an option" || document.getElementById('gender').options[document.getElementById('gender').selectedIndex].text == "Pick an option" || document.getElementById('customer').options[document.getElementById('customer').selectedIndex].text == "Pick an option") { alert("Please fill in all the fields"); return }
    let passenger = {
        "Class": document.getElementById('class').options[document.getElementById('class').selectedIndex].text,
        "Type of Travel": document.getElementById('travel').options[document.getElementById('travel').selectedIndex].text,
        "Customer Type": document.getElementById('customer').options[document.getElementById('customer').selectedIndex].text,
        "Gender": document.getElementById('gender').options[document.getElementById('gender').selectedIndex].text,
        "Inflight wifi service": document.getElementById('wifi').value,
        "Departure/Arrival time convenient": document.getElementById('time').value,
        "Ease of Online booking": document.getElementById('booking').value,
        "Food and drink": document.getElementById('food').value,
        "Online boarding": document.getElementById('boarding').value,
        "Gate location": document.getElementById('gate').value,
        "Seat comfort": document.getElementById('seat').value,
        "Inflight entertainment": document.getElementById('entertainment').value,
        "On-board service": document.getElementById('service').value,
        "Leg room service": document.getElementById('legroom').value,
        "Baggage handling": document.getElementById('baggage').value,
        "Checkin service": document.getElementById('checkin').value,
        "Inflight service": document.getElementById('inflight').value,
        "Cleanliness": document.getElementById('cleanliness').value,
        "Age": document.getElementById('age').value
    }
    console.log(passenger)
    let prediction = decisionTree.predict(passenger)
    console.log("predicted " + prediction)
    document.getElementById('result').innerHTML = `Prediction: ${prediction}`
}
loadSavedModel()