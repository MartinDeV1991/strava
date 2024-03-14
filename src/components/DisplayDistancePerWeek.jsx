import React from 'react';

const DisplayDistancePerWeek = ({ activities, setDistancePerWeek }) => {

    function logData(arg) {
        let argName = Object.keys(arg)[0];
        let string = `"${argName}":`;
        console.log(string, arg)
    }

    function calculateDistancePerWeek() {
        const distancePerWeek = {};

        activities.forEach(activity => {
            if (activity.type === "Run") {
                const activityDate = new Date(activity.start_date_local);
                const year = activityDate.getFullYear();
                const month = activityDate.getMonth() + 1;
                const weekNumber = getWeekNumber(activityDate);

                const key = `${year}-${weekNumber}`;

                if (!distancePerWeek[key]) {
                    distancePerWeek[key] = 0;
                }

                distancePerWeek[key] += activity.distance;
            }
        });

        for (const key in distancePerWeek) {
            distancePerWeek[key] = parseFloat((distancePerWeek[key] / 1000).toFixed(2));
        }
        setDistancePerWeek(distancePerWeek);
        return distancePerWeek;
    }

    function getWeekNumber(date) {
        const onejan = new Date(date.getFullYear(), 0, 1);
        return Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    }

    const display = () => {
        let distancePerWeek = calculateDistancePerWeek();
        const activitesDiv = document.getElementById("distancePerWeek");
        let html = "<h2>Distance Per Week</h2>";
        for (const [weekNumber, distance] of Object.entries(distancePerWeek)) {
            html += `<div >Week ${weekNumber}: ${distance} km</div>`;
        }
        activitesDiv.innerHTML = html;
    }

    return (
        <div>
            <button id="distancePerWeekBtn" onClick={display}>Distance Per Week</button>
            <div id="distancePerWeek"></div>
            <div id="distancePerMonth"></div>
        </div>
    );
};

export default DisplayDistancePerWeek;