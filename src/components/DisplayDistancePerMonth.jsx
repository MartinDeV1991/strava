import React from 'react';

const DisplayDistancePerMonth = ({ activities, setDistancePerMonth }) => {

    function calculateDistancePerMonth() {
        const distancePerMonth = {};

        activities.forEach(activity => {
            if (activity.type === "Run") {
                const activityDate = new Date(activity.start_date_local);
                const year = activityDate.getFullYear();
                const month = activityDate.getMonth() + 1;

                const key = `${year}-${month}`;

                if (!distancePerMonth[key]) {
                    distancePerMonth[key] = 0;
                }

                distancePerMonth[key] += activity.distance;
            }
        });

        for (const key in distancePerMonth) {
            distancePerMonth[key] = parseFloat((distancePerMonth[key] / 1000).toFixed(2));
        }
        setDistancePerMonth(distancePerMonth);
        return distancePerMonth;
    }

    const display = () => {
        let distancePerMonth = calculateDistancePerMonth();
        const activitesDiv = document.getElementById("distancePerMonth");
        let html = "<h2>Distance Per Month</h2>";
        for (const [monthNumber, distance] of Object.entries(distancePerMonth)) {
            html += `<div>Month ${monthNumber}: ${distance} km</div>`;
        }
        activitesDiv.innerHTML = html;
    }

    return (
        <div>
            <button id="distancePerMonthBtn" onClick={display}>Distance Per Month</button>
            <div id="distancePerMonth"></div>
        </div>
    );
};

export default DisplayDistancePerMonth;