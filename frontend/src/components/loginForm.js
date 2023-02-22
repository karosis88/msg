import React, {useState} from 'react';
import "../static/auth.css"
import InputLine from "./input-line";

const LoginForm = () => {

    return (
        <div>
            <h2 className="auth-title">Sign In</h2>
            <InputLine rg="log" placeholder="username"/>
            <InputLine rg="log" type="password" placeholder="password"/>
            <InputLine className="auth-input disabled-button" type="submit" value="Sign In"/>
        </div>
    );
};

export default LoginForm;