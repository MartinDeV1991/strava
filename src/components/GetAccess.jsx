
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';

function logData(arg) {
    let argName = Object.keys(arg)[0];
    let string = `"${argName}":`;
    console.log(string, arg)
}

const extractCodeFromUrl = () => {
    let urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get('code');
    logData({ code })
    return code;
}

const exchangeCodeForToken = (code) => {
    const params = {
        "client_id": localStorage.getItem('clientId'),
        "client_secret": localStorage.getItem('clientSecret'),
        "code": code,
        "grant_type": "authorization_code"
    };

    console.log(params)
    console.log("Requesting your access token: ...")
    fetch("https://www.strava.com/oauth/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
        .then(response => response.json())
        .then(data => {
            let token = data.access_token
            console.log("token received")
            logData({ token })
            localStorage.setItem("Strava_access_token", token);
            localStorage.setItem('userId', localStorage.getItem('clientId'));
        })
        .catch(error => console.error("Error:", error));
}

const GetAccess = () => {
    const [clientId, setClientId] = useState('');
    const [clientSecret, setClientSecret] = useState('');

    const authorizeStrava = () => {
        const url = window.location.href;
        if (clientId) {
            window.location.href = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${url}&approval_prompt=force&scope=activity:read_all`;
        }
    }

    useEffect(() => {
        let code = extractCodeFromUrl();
        if (code) {
            exchangeCodeForToken(code)
        }
    }, []);

    const handleClientIdChange = (event) => {
        localStorage.setItem('clientId', event.target.value);
        setClientId(event.target.value);
    };

    const handleClientSecretChange = (event) => {
        localStorage.setItem('clientSecret', event.target.value);
        setClientSecret(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        authorizeStrava();
    };

    return (
        <div>
            {/* <Button id="authorizeBtn" style={{ margin: '10px 10px' }} onClick={authorizeStrava}>Authorize Strava</Button> */}
            <div>
                <h2>Enter Client ID and Client Secret</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="clientId">Client ID:</label>
                        <input
                            type="text"
                            id="clientId"
                            value={clientId}
                            onChange={handleClientIdChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="clientSecret">Client Secret:</label>
                        <input
                            type="text"
                            id="clientSecret"
                            value={clientSecret}
                            onChange={handleClientSecretChange}
                        />
                    </div>
                    <Button type="submit" style={{ margin: '10px 10px' }} >Submit</Button>
                </form>
            </div>
        </div>
    );
};

export default GetAccess;