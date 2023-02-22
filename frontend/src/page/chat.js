import React from 'react';
import Header from "./header";
import {useParams} from "react-router-dom";

const Chat = (props) => {
    const {username} = useParams()
    return (
        <div>
            <Header/>
            <h1>
                {username}
            </h1>
        </div>
    );
};

export default Chat;