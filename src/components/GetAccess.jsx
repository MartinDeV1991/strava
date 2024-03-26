
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';

const GetAccess = () => {
    const [clientId, setClientId] = useState('');
    const [clientSecret, setClientSecret] = useState('');

    function logData(arg) {
        let argName = Object.keys(arg)[0];
        let string = `"${argName}":`;
        console.log(string, arg)
    }

    const authorizeStrava = () => {
        window.location.href = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=http://localhost:3000&approval_prompt=force&scope=activity:read_all`;
    }

    const exchangeCodeForToken = (code) => {
        const params = {
            "client_id": clientId,
            "client_secret": clientSecret,
            "code": code,
            "grant_type": "authorization_code"
        };

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
            })
            .catch(error => console.error("Error:", error));
    }

    const extractCodeFromUrl = () => {
        let urlParams = new URLSearchParams(window.location.search);
        let code = urlParams.get('code');
        logData({ code })
        return code;
    }

    const handleClientIdChange = (event) => {
        setClientId(event.target.value);
    };

    const handleClientSecretChange = (event) => {
        setClientSecret(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Client ID:', clientId);
        console.log('Client Secret:', clientSecret);
        exchangeCodeForToken(extractCodeFromUrl())
    };

    return (
        <div>
            <Button id="authorizeBtn" style={{ margin: '10px 10px' }} onClick={authorizeStrava}>Authorize Strava</Button>
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
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default GetAccess;