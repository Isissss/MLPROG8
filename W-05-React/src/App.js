import React, {useCallback, useEffect, useRef, useState} from "react";
import Webcam from "react-webcam";
 
import "./App.css";
import { Pick } from "./components/Pick";
import { TrainingButtons } from "./components/TrainingButtons";
const types = ["steen", "papier", "schaar"]
 
export function App() {
    // global variables
    const k = 3
const KNN = new kNear(k, data)
    const modelRef = useRef(null);        // handpose
    const webcamRef = useRef(null);       // webcam
    const [score, setScore] = useState(0) // score
    const [resultText, setResultText] = useState("Press start to start a game") // result text
    const [playerChoice, setPlayerChoice] = useState("") // player choice
    const [computerChoice, setComputerChoice] = useState("") // computer choice
    const [gameStarted, setGameStarted] = useState(false) // game started
    let getPrediction
 
    // detect handpose (called by request annimationframe)
    const capture = useCallback(async () => {
        // only try to predict if handpose has been loaded and canvas is available
        if (webcamRef.current && modelRef.current && webcamRef.current.getCanvas()) {
            const predictions = await modelRef.current.estimateHands(
                webcamRef.current.getCanvas(),
                true
            );

            if (predictions && predictions.length > 0) {
                let currentLandmarks = predictions[0].landmarks.flat();

               
            }
        }

        requestAnimationFrame(capture);
    }, [webcamRef]);

    // init handpose, and start first capture
    useEffect(() => {
        const load = async () => {
            modelRef.current = await handpose.load();
            console.log("Handpose loaded")

            requestAnimationFrame(capture);
        };

 
        load();
    }, []);

 
    
    const startGame = () => {
        setGameStarted(true)
        setComputerChoice("")
        setPlayerChoice("")
        setResultText("Pick scissors, rock or paper and hold the pose in front of the camera.")
        getPrediction = setInterval(()=>getThing(), 2000)
    }
    
async function classify(video) {
    setResultText("Identifying pose...")
    const predictions = await modelRef.current.estimateHands(
        webcamRef.current.getCanvas(),
        true
    ); // ,true voor flip

    if (predictions.length > 0) {
        const keypoints = predictions[0].landmarks
        keypoints.reduce((acc, curr) => {
            acc.push(curr[0], curr[1])

            return acc

        }, [])

        const results = KNN.classify(keypoints.flat())
        console.log(`results: ${results}`)
        return results
    } else {
        return ""
     
    }
}

    let lastResult = ""
    let results = "" 
    
    async function getThing () {
        if (results ) {
            lastResult = results
        }
         results = await classify(webcamRef.current)

        if (results == lastResult && types.indexOf(results) > -1) {
            setPlayerChoice(results)

            if (results == "steen") {
              setComputerChoice("papier")
          
            } else if (results == "papier") {
             setComputerChoice("schaar")
             
                
            } else if (results == "schaar") {
                setComputerChoice("steen")
        
            }
            setScore(score - 1)
          
            stopGame()
        }
 
    }

    useEffect(() => {
        if (!playerChoice && !computerChoice) return 
  
        setResultText(`You picked ${playerChoice}! I've used my sixth sense to pick ${computerChoice}! Sorry. You lost. `)
        console.log("triggered")
    }, [playerChoice, computerChoice])
    
    function stopGame() {
        clearInterval(getPrediction)
        setGameStarted(false)
    }
    return (
        <>
      <div id="test">
        <div>
            <h1 style={{ padding: "0", color:"white", margin: "5px", letterSpacing: '2px' }}> ROCK PAPER SCISSORS</h1>
        </div>
            <div id="scoreDiv"> SCORE: <span id="score">{score}</span></div>
        </div>
        <TrainingButtons />
        <div>
        <Webcam
            width="640"
            height="405"
            mirrored
            id="webcam"
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
        />
        
</div>
<button id="start" disabled={gameStarted} onClick={startGame}>Start</button>
            <div id="grid">
            <div id="container2">
            <div className="picks">
               
                    YOUR PICK: </div>
              

                <div className="landmarks">
        {types.map((type, index) => {
            return (
                <Pick pick={type} key={`player-${index}`} picked={playerChoice == type} player={true} />
            )
        })
        }
        </div>
        </div>
        <div id="container2">
        <div className="picks">
               
               COMPUTER PICK: </div>
        <div className="landmarks">
        {types.map((type, index) => {
            return (
                <Pick pick={type} key={`computer-${index}`} picked={computerChoice == type}  player={false} />
            )
        })
        }
        </div>
        </div>
        </div>
        <div id="results">{resultText}</div> 
        </>
    );
}