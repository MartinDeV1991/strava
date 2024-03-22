import React, { useState, useEffect } from "react";
import GetAccess from "../components/GetAccess";
import LoadData from "../components/LoadData";
import DisplayActivities from "../components/DisplayActivities";
import DisplayDistancePerMonth from "../components/DisplayDistancePerMonth";
import DistanceChart from "../components/DistanceChart";
import SpeedChart from "../components/SpeedChart";
import Map from "../components/Map";
import Button from 'react-bootstrap/Button';

const HomePage = () => {

    const [accessToken, setAccessToken] = useState();
    const [activities, setActivities] = useState();
    const [distancePerMonth, setDistancePerMonth] = useState();
    const [speedPerMonth, setSpeedPerMonth] = useState();

    const [selectedActivity, setSelectedActivity] = useState(null);
    const [activitiesWithOptions, setActivitiesWithOptions] = useState([]);

    const handleActivityChange = (event) => {
        setSelectedActivity(event.target.value);
    };

    useEffect(() => {
        if (activities !== undefined) {
            const filteredActivities = activities.filter(activity => activity.map && activity.map.summary_polyline)
                .map((activity, index) => ({
                    id: activity.id,
                    date: activity.start_date_local,
                    name: activity.name,
                    polyline: activity.map.summary_polyline,
                    key: index
                }));
            setActivitiesWithOptions(filteredActivities);
        }
    }, [activities]);

    return (
        <div>
            <GetAccess setAccessToken={setAccessToken}></GetAccess>
            <LoadData accessToken={accessToken} setActivities={setActivities} activities={activities}></LoadData>

            <label>Select Activity:</label>
            <select value={selectedActivity || ""} onChange={handleActivityChange}>
                <option value="">Select Activity</option>
                {activitiesWithOptions.map(activity => (
                    <option key={activity.key} value={activity.key}>
                        {`Activity ${activity.key + 1}`}
                    </option>
                ))}
            </select>

            {[...Array(5)].map((_, i) => {
                const activityIndex = +selectedActivity + i;
                return activitiesWithOptions[activityIndex] ? (
                    <Map key={i} activity={activitiesWithOptions[activityIndex]} />
                ) : null;
            })}


            <DistanceChart distancePerMonth={distancePerMonth}></DistanceChart>
            <SpeedChart speedPerMonth={speedPerMonth}></SpeedChart>
            <DisplayActivities activities={activities}></DisplayActivities>
            <DisplayDistancePerMonth activities={activities} setDistancePerMonth={setDistancePerMonth} setSpeedPerMonth={setSpeedPerMonth}></DisplayDistancePerMonth>
        </div>
    );
};

export default HomePage;