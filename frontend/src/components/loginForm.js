import React, {useState, useEffect} from 'react';
import "../static/auth.css"
import InputLine from "./input-line";

async function login(event, errors, setErrors) {
    let element = event.currentTarget
    let username = element.parentElement.previousSibling.previousSibling.previousSibling.firstChild.value
    let password = element.parentElement.previousSibling.firstChild.value
    let password1 = element.parentElement.previousSibling.previousSibling.firstChild.value
    let response = await fetch("http://127.0.0.1:8000/auth/token", {
        "method" : "POST",
        "headers" : {
            "Content-Type" : "Application/json"
        },
        "body" : JSON.stringify({
            "username" : username,
            "password" : password
        })
    })
    console.log(response)
    if (response.status !== 200) {
        setErrors((await response.json()).detail)
    }
    else {
        let id = await response.json()
        console.log("id", id)
        window.location = "http://127.0.0.1:3000/"
    }
}
const LoginForm = () => {
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
        let element = document.querySelector('[rg="log"][placeholder="username"]').parentElement
        element.setAttribute("error", username)
        if (!element.classList.contains('visible-error'))
            element.classList.add('visible-error')
        errorsExpire.username = setTimeout(() => {
            if (element.classList.contains('visible-error'))
                element.classList.remove('visible-error')
        }, 5000)
    }

    if (password) {
        let element = document.querySelector('[rg="log"][placeholder="password"]').parentElement
        element.setAttribute("error", username)
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
            <h2 className="auth-title">Sign In</h2>
            <InputLine rg="log" placeholder="username"/>
            <InputLine rg="log" type="password" placeholder="password"/>
            <InputLine onClick={login} className="auth-input disabled-button" type="submit" value="Sign In"/>
        </div>
    );
}

export default LoginForm;
