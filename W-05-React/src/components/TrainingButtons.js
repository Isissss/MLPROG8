import React, {useCallback, useEffect, useRef, useState} from "react";
 
export function TrainingButtons(props) {
  return (<div style={{position: "absolute", top:0, left:0, width:"250px"}} >
  
    <input type="test" id="poseInput" placeholder="Name of pose..." />
    <button id="poseButton">Add pose</button>
    <button id="classifyButton">Classify</button>
    <button id="saveTrainingButton">Save training</button>
    <button id="deleteTrainingButton">Delete training</button>
</div>
    )
}
