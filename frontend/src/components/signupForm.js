import React from 'react';
import InputLine from "./input-line";

const SignupForm = () => {
    return (
        <div>
            <h2 className="auth-title">register</h2>
            <InputLine rg="reg" placeholder="username"/>
            <InputLine rg="reg" type="password" placeholder="password"/>
            <InputLine rg="reg" type="password" placeholder="verify password"/>
            <InputLine type="submit" value="Sign Up" className="auth-input disabled-button"/>
        </div>
    );
};

export default SignupForm;