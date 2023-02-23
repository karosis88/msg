import React, {useEffect, useState} from 'react';
import Header from "./header";
import {useParams} from "react-router-dom";
import "../static/chat.css"
import useWebSocket from "react-use-websocket"
const sendMessage = (event, messages, setMessages, sendJson, username) => {
    let element = event.currentTarget
    let credentials = JSON.parse(localStorage.getItem('credentials'))
    let input = document.querySelector(".txt-area")

    if (!input.value.length) {
        console.log(input.value.length)
        return
    }
    let newMessage = {
        "content" : input.value,
        "owner_username" : credentials.username
    }
    setMessages([...messages, newMessage])
    sendJson(JSON.stringify(
        {"for" : username,
        "content" : input.value}
    ))
    input.value =''
}

async function get_messages(username, setMessages) {
    let access_token = JSON.parse(localStorage.getItem("credentials")).access_token
    let response = await fetch(`http://127.0.0.1:8000/chat/messages?username=${username}`,
        {"method": "GET",
              "headers": {"Content-Type": "application-json",
                        "Authorization" : "Bearer " + access_token}})

    if (response.status === 200) {
        setMessages(await response.json())
    }
}

function receiveMessage(msg, messages, setMessages) {

    console.log(msg)
    let message = JSON.parse(msg.data)
    console.log(message)
    setMessages([...messages, {"content" : message.content,
        "owner_username": message.from}])
}

const Chat = (props) => {
    const [messages, setMessages] = useState([])
    const {username} = useParams()
    const [credentials, setCredentials] = useState(JSON.parse(localStorage.getItem('credentials')))

    const {sendJsonMessage, getWebSocket} = useWebSocket(`ws://127.0.0.1:8000/chat/ws/${credentials.username}`, {
        onOpen: () => {
            sendJsonMessage({"access_token" : credentials.access_token})
            console.log('websocket opened')
        },
        onMessage: (e) => receiveMessage(e, messages, setMessages)
    })


    useEffect(() => {
        get_messages(username, setMessages).then(r => console.log(r))
    }, [])

    useEffect(() => {
        document.querySelector('.messages').scrollTop=document.querySelector('.messages').scrollHeight
    }, [messages])

    return (
        <div>
            <Header/>

            <div className="chat">
                <div className="messages">

                    <div className="message-size">
                         {messages.map((element) => {
                             return <div className={
                                credentials.username === element.owner_username?
                                    "message-row-wrapper self-message" : "message-row-wrapper"
                             }>
                                                              <div className="message">
                                <div className="message-username">
                                    {element.owner_username}
                                </div>
                                <p className="message-text">{element.content}</p>
                            </div>
                             </div>

                         })}
                    </div>
                </div>
                <div className="area-size">
                          <div className="area-wrapper">
                    <textarea className="txt-area"></textarea>
                    <button onClick={(event) => sendMessage(event, messages, setMessages, sendJsonMessage, username)} className="send-button">Send</button>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default Chat;