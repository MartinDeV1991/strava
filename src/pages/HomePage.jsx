import React from 'react';
import GetAccess from "../components/GetAccess";

const HomePage = () => {

    const description = (
        <div>
            For this app you your strava client id and client secret. You can find these in your strava app. Go to 'Settings' and click on 'My API Application'.
            <br />
            <br />
            This will redirect you to the website of strava, where you will be requested to give the app your permission to retrieve data from the Strava API. After clicking on Authorize you will be redirected back to the app.
            <br />
            <br />
            You can now go to either the activities page or the overview page to see your data. Click on the 'Load newest data button' to retrieve your 30 most recent activities.
            <br/>
            If you want to load more activities, check the 'Reload all data' box.
            Strava only allows a limited number of requests per day, so don't press the load data button too often.
            <br/>
            <br/>
            For users that want to look around in the app without logging in there is a default dataset available. You can skip the login process and continue to the activities and overview pages.
        </div>
    );
    return (
        <div>
            <h1>Home Page</h1>
            <div style={{textAlign: 'center'}}>{description}</div>
            <GetAccess></GetAccess>
        </div>
    );
};

export default HomePage