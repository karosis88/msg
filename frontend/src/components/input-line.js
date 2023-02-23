import React, {useState} from 'react';
import checkmark from "../static/checkmark.png"
import close from "../static/close.png"
import loading from "../static/loading.png"
import "../static/auth.css"
import {validatePassword,
        validateUsername} from "../utils/validatiors"

let loadingEvents = {}

function setErrorIcon(element, type, err, seterr) {
    let loadingIcon = document.querySelector(
        `[placeholder="${element.placeholder}"][rg="${element.getAttribute('rg')}"]~div>img[ic="loading"]`)
        let elementId = `${element.getAttribute('rg')}${element.placeholder}`

    delete loadingEvents[elementId]
    if (!loadingIcon.classList.contains('dnone'))
        loadingIcon.classList.add('dnone')
    if (!element.value) {
    }
    else {
        let validator = element.placeholder === "username" ? validateUsername : validatePassword
        let errorMsg = validator(element)

        if (!errorMsg) {
            let checkmarkIcon = document.querySelector(
                `[placeholder="${element.placeholder}"][rg="${element.getAttribute('rg')}"]~div>img[ic="checkmark"]`
            )
            checkmarkIcon.classList.toggle('dnone')
            if (element.type === 'password' && element.getAttribute("rg") === "reg") {
                let siblingPassword = element.placeholder !== "password" ?
                    element.parentElement.previousSibling.firstChild : element.parentElement.nextSibling.firstChild
                if (!validator(siblingPassword)) {
                    let closeIcon = siblingPassword.nextSibling.lastChild.previousSibling

                    if (!closeIcon.classList.contains('dnone')) {
                        closeIcon.classList.toggle('dnone')
                    }
                    let checkmarkIcon = closeIcon.previousSibling
                    if (checkmarkIcon.classList.contains('dnone')) {
                        checkmarkIcon.classList.remove('dnone')
                    }
                }
            }
            let newMessages = {...err}
            delete newMessages[elementId]
            seterr(newMessages)
            enableButton(element)
        }
        else {
            let closeIcon = document.querySelector(
                `[placeholder="${element.placeholder}"][rg="${element.getAttribute('rg')}"]~div>img[ic="close"]`
            )

            if (element.type === 'password' && element.getAttribute("rg") === "reg") {
                let siblingPassword = element.placeholder !== "password" ?
                    element.parentElement.previousSibling.firstChild : element.parentElement.nextSibling.firstChild
                let errorMsg = validator(siblingPassword)
                let closeIcon = siblingPassword.nextSibling.lastChild.previousSibling

                if (!closeIcon.previousSibling.classList.contains('dnone')) {
                    closeIcon.previousSibling.classList.add('dnone')
                }
                if (closeIcon.classList.contains("dnone")) {
                    closeIcon.classList.remove("dnone")
                }
                let newMessages = {...err}
                newMessages[siblingPassword.getAttribute('rg')+siblingPassword.placeholder] = errorMsg
                seterr(newMessages)
            }


            closeIcon.classList.toggle('dnone')
            let newMessages = {...err}
            newMessages[elementId] = errorMsg
            seterr(newMessages)
            enableButton(element)
        }
        }

}

function inputHandler(element, type, err, seterr) {
    let elementId = `${element.getAttribute('rg')}${element.placeholder}`
    let allIcons = document.querySelectorAll(
        `[placeholder="${element.placeholder}"][rg="${element.getAttribute('rg')}"]~div>img`)

    allIcons.forEach(element => {
        if (!element.classList.contains('dnone'))
            element.classList.add('dnone')
    })

    if (!element.value)
        return

    if (loadingEvents[elementId])
        clearTimeout(loadingEvents[elementId])
    let loadingIcon = document.querySelector(
        `[placeholder="${element.placeholder}"][rg="${element.getAttribute('rg')}"]~div>img[ic="loading"]`)
    if (loadingIcon.classList.contains('dnone'))
        loadingIcon.classList.remove('dnone')
    loadingEvents[elementId] = setTimeout(() => setErrorIcon(element, type, err, seterr), 500)
}

function enableButton(input) {
    let button = input.parentElement.parentElement.lastChild.previousSibling.firstChild
    let all_inputs = document.querySelectorAll(`input[rg="${input.getAttribute('rg')}"]`)
    for (let i = 0; i < all_inputs.length; i++) {
        let element = all_inputs[i]
        if (element.nextSibling.lastChild.previousSibling.previousSibling.classList.contains('dnone')) {
             if (!button.classList.contains('disabled-button'))
                    button.classList.add('disabled-button')
            return
        }
    }
    if (button.classList.contains('disabled-button'))
        button.classList.remove('disabled-button')
}

const InputLine = (props) => {

    const [errorMessages, setErrorMessages] = useState({})
    return (
        <div reg={props.rg} className="input-line" error={props.error}>
            <input className="auth-input" {...props} onChange=
                {(event) => inputHandler(event.currentTarget, props.placeholder, errorMessages, setErrorMessages)}/>
            { props.type !== 'submit' &&
                (<div>
                        <img ic="loading" className="error-icon dnone loading" src={loading}/>
                        <img ic="checkmark" className="error-icon dnone" src={checkmark}/>
                        <img ic="close" className="error-icon dnone" src={close}/>
                        <p className="errMessage">{errorMessages[props.rg + props.placeholder] ? errorMessages[props.rg + props.placeholder] : ""
                        }</p>
                </div>
            )}
        </div>
    );
};

export default InputLine;