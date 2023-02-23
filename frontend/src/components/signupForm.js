import React, {useEffect, useState} from 'react';
import InputLine from "./input-line";

async function register(event, errors, setErrors) {
    let element = event.currentTarget

    if (element.classList.contains('disabled-button'))
        return

    let username = element.parentElement.previousSibling.previousSibling.previousSibling.firstChild.value
    let password = element.parentElement.previousSibling.firstChild.value
    let response = await fetch("http://127.0.0.1:8000/auth/create", {
        "method" : "POST",
        "headers" : {
            "Content-Type" : "Application/json"
        },
        "body" : JSON.stringify({
            "username" : username,
            "password" : password
        })
    })

    if (response.status !== 200) {
        let newerrors = await response.json()
        console.log(newerrors)
        setErrors(newerrors.detail)
    }
    else {
        let id = await response.json()
        console.log("id", id)
        let successMessage = document.querySelector('.acc-created')
        if (successMessage.classList.contains('dnone')) {
            successMessage.classList.remove('dnone')
            setTimeout(() => {
                if (!successMessage.classList.contains('dnone'))
                    successMessage.classList.add('dnone')
            }, 3000)
        }
    }
}
const SignupForm = () => {
    const [errors, setErrors] = useState({})
    const [errorsExpire, setErrorsExpire] = useState({})

    useEffect(() => {
        console.log(errors, 'errors')
        let username = errors.username;
        let password = errors.password;

        if (errorsExpire.username) {
            clearTimeout(errorsExpire.username)
        }
        if (errorsExpire.password) {
            clearTimeout(errorsExpire.password)
        }

        if (username) {
            let element = document.querySelector('[rg="reg"][placeholder="username"]').parentElement
            element.setAttribute("error", username)
            if (!element.classList.contains('visible-error'))
                element.classList.add('visible-error')
            errorsExpire.username = setTimeout(() => {
                if (element.classList.contains('visible-error'))
                    element.classList.remove('visible-error')
            }, 5000)
        }

        if (password) {
            let element = document.querySelector('[rg="reg"][placeholder="password"]').parentElement
            element.setAttribute("error", password)
            if (!element.classList.contains('visible-error'))
                element.classList.add('visible-error')
            errorsExpire.password = setTimeout(() => {
                if (element.classList.contains('visible-error'))
                    element.classList.remove('visible-error')
            }, 5000)
        }

    }, [errors])

    return (
        <div>
            <h2 className="auth-title">register</h2>
            <InputLine rg="reg" placeholder="username"/>

            <InputLine rg="reg" type="password" placeholder="password"/>
            <InputLine rg="reg" type="password" placeholder="verify password"/>
            <InputLine onClick={(event) => register(event, errors, setErrors)} type="submit" value="Sign Up" className="auth-input disabled-button"/>
            <h3 className="acc-created dnone">Account has been created</h3>
        </div>
    );
};

export default SignupForm;