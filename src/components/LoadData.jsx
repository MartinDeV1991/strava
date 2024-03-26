import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';

function getActivitiesFromLocalStorage(setActivities) {
    const jsonData = localStorage.getItem('activities');
    const activities = JSON.parse(jsonData);
    setActivities(activities);
}

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

    function getActivities(getAll) {
        let token = accessToken;
        if (accessToken === undefined) {
            token = localStorage.getItem('Strava_access_token');
        }
        let allActivities = [];
        console.log(token)
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
                        setActivities(allActivities);
                        saveActivitiesToLocalStorage(allActivities);
                        console.log("saving activities...")
                    }
                })
                .catch(error => console.error("Error:", error));
        }
        fetchActivities(1)
    }

    useEffect(() => {
        getActivitiesFromLocalStorage(setActivities);
    }, [setActivities]);

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button id="fetchActivitiesBtn" style={{ margin: '10px 10px' }} onClick={() => getActivities(true)}>Load newest activities</Button>
        </div>
    );
};

export default LoadData;
