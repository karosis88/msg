import React from 'react';
import Header from "./header";
import LoginForm from "../components/loginForm";
import SignupForm from "../components/signupForm";

const Auth = () => {
    return (
        <div>
            <Header/>
            <div className="auth">
                <LoginForm />
                <SignupForm/>
            </div>
        </div>
    );
};

export default Auth;