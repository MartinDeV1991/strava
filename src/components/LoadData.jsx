import React from 'react';

const LoadData = ({ accessToken, setActivities }) => {
    function logData(arg) {
        let argName = Object.keys(arg)[0];
        let string = `"${argName}":`;
        console.log(string, arg)
    }
    const saveActivitiesToLocalStorage = (activities) => {
        const jsonData = JSON.stringify(activities);
        localStorage.setItem('activities', jsonData);
    }

    function getActivitiesFromLocalStorage() {
        const jsonData = localStorage.getItem('activities');
        const activities = JSON.parse(jsonData);
        setActivities(activities);
    }

    function getActivities(getAll) {
        let token = accessToken;
        if (accessToken === undefined) {
            token = localStorage.getItem('Strava_access_token');
        }
        console.log("Requesting your activities: ...")
        let allActivities = [];
        function fetchActivities(page) {
            logData({ page })
            fetch(`https://www.strava.com/api/v3/athlete/activities?page=${page}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    allActivities = allActivities.concat(data);
                    if (data.length === 30 && getAll) {
                        fetchActivities(page + 1);
                    } else {
                        // displayActivities(allActivities);
                        setActivities(allActivities);
                        saveActivitiesToLocalStorage(allActivities);
                        console.log("saving activities...")
                    }
                })
                .catch(error => console.error("Error:", error));
        }
        fetchActivities(1)
    }

    return (
        <div>
            <div>Hello World</div>
            <button id="fetchActivitiesBtn" onClick={() => getActivities(true)}>Get Activities From API</button>
            <button id="loadActivitiesBtn" onClick={getActivitiesFromLocalStorage}>Get Activities From LocalStorage</button>
        </div>
    );
};

export default LoadData;
