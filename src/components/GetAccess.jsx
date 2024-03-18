
import Button from 'react-bootstrap/Button';

const GetAccess = ({setAccessToken}) => {
    function logData(arg) {
        let argName = Object.keys(arg)[0];
        let string = `"${argName}":`;
        console.log(string, arg)
    }

    const authorizeStrava = () => {
        window.location.href = "https://www.strava.com/oauth/authorize?client_id=25652&response_type=code&redirect_uri=http://localhost:3000&approval_prompt=force&scope=activity:read_all";
    }

    const exchangeCodeForToken = (code) => {
        const params = {
            "client_id": process.env.client_id,
            "client_secret": process.env.client_secret,
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
                setAccessToken(token);
                localStorage.setItem("Strava_access_token", token);
            })
            .catch(error => console.error("Error:", error));
    }

    const extractCodeFromUrl = () => {
        let urlParams = new URLSearchParams(window.location.search);
        let code = urlParams.get('code');
        logData({ urlParams })
        logData({ code })
        return code;
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button id="authorizeBtn" style={{ margin: '10px 10px' }} onClick={authorizeStrava}>Authorize Strava</Button>
            <Button id="exchangeBtn" style={{ margin: '10px 10px' }} onClick={() => exchangeCodeForToken(extractCodeFromUrl())}>Exchange code for token</Button>
        </div>
    );
};

export default GetAccess;