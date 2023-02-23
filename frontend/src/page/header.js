import React, {useEffect, useState} from 'react';
import searchicon from "../static/search.png"
import profileicon from "../static/profile-icon.png"
import notificationicon from "../static/notification-icon.png"
import "../static/header.css"

const URI = "http://127.0.0.1:8000"
var lastChange;

function refreshUsers(value, setResults) {

    fetch(URI + "/auth/find?" + new URLSearchParams({
                "username": value}))
            .then(response => response.json())
            .then(value => setResults(value))
}
const Header = () => {
    const [results, setResults] = useState([])
    const [value, setValue] = useState('')

    useEffect(() => {
        if (lastChange) {
            clearTimeout(lastChange)
            lastChange = NaN
        }
        if (value.length) {
            lastChange = setTimeout(() => refreshUsers(value, setResults), 300)
        }
        else {
            setResults([])
        }
    }, [value])

    let credentials = JSON.parse(localStorage.getItem("credentials"))
    return (
        <div className="header">
            <div className="search-bar-wrapper">
                <div className="search-bar">
                    <img src={searchicon} alt="Search icon" className="search-icon"/>
                    <input type="text" className="search-bar-input" placeholder="Search new friends"
                           onChange={(event) => setValue(event.target.value)}/>
                </div>
                <div className="all-results">
                    {results.map((value, index) => (
                        <a href={"/chat/" + value.username} className="search-bar-result">
                            <span className="search-bar-result-text">{value.username}</span></a>
                    ))}
                </div>

            </div>

            <div className="element-wrapper">
                <div className="notification header-element">
                    <a href="">
                        <img className="notification-icon header-icon icon" src={notificationicon}/>
                    </a>
                </div>

                <div className="profile-picture header-element">

                    <a href="">
                        <img className="profile-icon icon" src={profileicon}/>
                    </a>
                    { !credentials ?
                    <div className="dropmenu">
                          <a href="/auth" className="dropdown-field">
                                Sign Up
                          </a>
                          <a href="/auth" className="dropdown-field">
                                Log In
                          </a>
                    </div> :
                        <div className="dropmenu">
                          <a href="/me" className="dropdown-field">
                              {credentials.username}
                          </a>
                          <a onClick={() => {
                            localStorage.removeItem('credentials')
                          }
                          } href="/" className="dropdown-field">
                                Log Out
                          </a>
                    </div>

                    }
                </div>
            </div>

        </div>

    );
};

export default Header;
