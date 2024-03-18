import React from 'react';
import Button from 'react-bootstrap/Button';

const DisplayDistancePerMonth = ({ activities, setDistancePerMonth, setSpeedPerMonth }) => {

    function calculateDistancePerMonth() {
        const distancePerMonth = {};
        const timePerMonth = {};
        const speedPerMonth = {};

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

                if (!timePerMonth[key]) {
                    timePerMonth[key] = 0;
                }
                timePerMonth[key] += activity.moving_time;
            }
        });

        for (const key in distancePerMonth) {
            speedPerMonth[key] = distancePerMonth[key] / timePerMonth[key] * 3.6;
            distancePerMonth[key] = parseFloat((distancePerMonth[key] / 1000).toFixed(2));
        }

        setDistancePerMonth(distancePerMonth);
        setSpeedPerMonth(speedPerMonth);
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
            <Button id="distancePerMonthBtn" style={{ margin: '10px 10px' }} onClick={display}>Distance Per Month</Button>
            <div id="distancePerMonth"></div>
        </div>
    );
};

export default DisplayDistancePerMonth;