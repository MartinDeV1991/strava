import React from 'react';

const DisplayActivities = ({ activities }) => {

    function displayActivities() {
        const activitiesDiv = document.getElementById("activities");
        activitiesDiv.innerHTML = ``;
        activities.forEach(activity => {
            const distance = (activity.distance / 1000).toFixed(2);
            const startDate = new Date(activity.start_date_local).toLocaleDateString();
            const avgSpeed = activity.average_speed;
            const maxSpeed = activity.max_speed;
            const time = (activity.moving_time / 60).toFixed(2);

            const activityHtml = `
                        <div class="activity-item" style="text-align: left;">
                            <p><strong>${activity.name}</strong></p>
                            <p>Distance: ${distance} km</p>
                            <p>Date: ${startDate}</p>
                            <p>Average Speed: ${avgSpeed}</p>
                            <p>Maximum Speed: ${maxSpeed}</p>
                            <p>Duration: ${time}</p>
                        </div>`;
            activitiesDiv.innerHTML += activityHtml;
        });
    }

    return (
        <div>
            <h1>Strava Activities</h1>
            <button id="displayActivities" onClick={displayActivities}>Display Activities</button>
            <div id="activities" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', paddingLeft: 100+'px' }}></div>
        </div>
    );
};

export default DisplayActivities;