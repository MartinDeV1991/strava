import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';

// function getActivitiesFromLocalStorage(setActivities) {
//     const jsonData = localStorage.getItem('activities');
//     const activities = JSON.parse(jsonData);
//     setActivities(activities);
// }

function getDataFromDatabase(userId, setActivities) {
    fetch(`${process.env.REACT_APP_MONGO_PATH}/mongodb/api/get/${userId}/data`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch data from backend');
            }
            return response.json();
        })
        .then(jsonData => {
            setActivities(jsonData)
        })
        .catch(error => console.error('Error:', error));
}

const LoadData = ({ accessToken, setActivities }) => {
    let userId = localStorage.getItem('userId');
    function logData(arg) {
        let argName = Object.keys(arg)[0];
        let string = `"${argName}":`;
        console.log(string, arg)
    }

    function sendActivitiesToBackend(activities) {
        fetch(`${process.env.REACT_APP_MONGO_PATH}/mongodb/api/post/${userId}/data`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(activities)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to save activities to backend');
                }
                console.log("Activities saved to backend");
            })
            .catch(error => console.error("Error:", error));
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
                        sendActivitiesToBackend(data);
                        fetchActivities(page + 1);
                    } else {
                        sendActivitiesToBackend(data);
                        // saveActivitiesToLocalStorage(allActivities);
                        console.log("saving activities...")
                        getDataFromDatabase(userId, setActivities);
                    }
                })
                .catch(error => console.error("Error:", error));
        }
        fetchActivities(1)
    }

    const [isChecked, setIsChecked] = useState(false);
    const toggleButton = () => {
        setIsChecked(!isChecked);
    };

    useEffect(() => {
        getDataFromDatabase(userId, setActivities);
    }, [setActivities, userId]);

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
                style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid #ccc',
                    backgroundColor: '#fff',
                    color: isChecked ? 'white' : 'inherit',
                    fontSize: '24px',
                    cursor: 'pointer',
                }}
                className="toggle-button"
                onClick={toggleButton}
            >
                {isChecked ? '✔' : ''}
            </button>
            <span style={{ marginLeft: '10px' }}>Reload all data</span>
            <Button id="fetchActivitiesBtn" style={{ margin: '10px 10px' }} onClick={() => getActivities(isChecked)}>Load newest activities</Button>
        </div>
    );
};

export default LoadData;
