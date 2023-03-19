import React, {useCallback, useEffect, useRef, useState} from "react";
import steen from "../img/icon-rock.svg";
import schaar from "../img/icon-scissors.svg";
import papier from "../img/icon-paper.svg";

export function Pick(props) {
    let src
    if (props.pick === "steen") {
        src = steen
    } else if (props.pick === "papier") {
        src = papier
    } else if (props.pick === "schaar") {
        src = schaar
    }
    return (
        <div className={`item ${props.player ? "player" : "computer" } ${props.pick} ${props.picked ? "active" : ""}`}  >
        <div className="item-img" >
            <img   src={src} alt={props.pick} />
        </div>
    </div>
)}
