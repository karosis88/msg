import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter as Router,
        Route,
        Routes} from 'react-router-dom';
import Main from "./page/main";
import Chat from "./page/chat";
import Auth from "./page/auth";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
        <Routes>
            <Route path="/" element={<Main/>}/>
            <Route path="/auth" element={<Auth/>}/>
            <Route path="/chat/:username" element={<Chat/>}/>
        </Routes>
    </Router>
);

