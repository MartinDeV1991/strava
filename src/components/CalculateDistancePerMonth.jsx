import { useEffect } from 'react';

function calculateDistancePerMonth(activities, setDistancePerMonth, setSpeedPerMonth) {
    const monthlyDistance = {};
    const timePerMonth = {};
    const monthlySpeed = {};

    if (activities) {
        activities.forEach(activity => {
            if (activity.data.type === "Run") {
                const activityDate = new Date(activity.data.start_date_local);
                const year = activityDate.getFullYear();
                const month = activityDate.getMonth() + 1;

                const key = `${year}-${month}`;

                if (!monthlyDistance[key]) {
                    monthlyDistance[key] = 0;
                }
                monthlyDistance[key] += activity.data.distance;

                if (!timePerMonth[key]) {
                    timePerMonth[key] = 0;
                }
                timePerMonth[key] += activity.data.moving_time;
            }
        });

        for (const key in monthlyDistance) {
            monthlySpeed[key] = monthlyDistance[key] / timePerMonth[key] * 3.6;
            monthlyDistance[key] = parseFloat((monthlyDistance[key] / 1000).toFixed(2));
        }

        setDistancePerMonth(monthlyDistance);
        setSpeedPerMonth(monthlySpeed);
    }
};

const CalculateDistancePerMonth = ({ activities, setDistancePerMonth, setSpeedPerMonth }) => {

    useEffect(() => {
        calculateDistancePerMonth(activities, setDistancePerMonth, setSpeedPerMonth);
    }, [activities, setDistancePerMonth, setSpeedPerMonth])

    return;
};

export default CalculateDistancePerMonth;