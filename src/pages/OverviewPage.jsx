import React, { useState, useEffect } from "react";
import LoadData from "../components/LoadData";
import CalculateDistancePerMonth from "../components/CalculateDistancePerMonth";
import DistanceChart from "../components/DistanceChart";
import SpeedChart from "../components/SpeedChart";
import Map from "../components/Map";
import Button from 'react-bootstrap/Button';

const OverviewPage = () => {

    const [activities, setActivities] = useState();
    const [distancePerMonth, setDistancePerMonth] = useState();
    const [speedPerMonth, setSpeedPerMonth] = useState();
    let accessToken = localStorage.getItem("Strava_access_token");
    
    return (
        <div>
            <LoadData accessToken={accessToken} setActivities={setActivities} activities={activities}></LoadData>
            <DistanceChart distancePerMonth={distancePerMonth}></DistanceChart>
            <SpeedChart speedPerMonth={speedPerMonth}></SpeedChart>
            {/* <DisplayActivities activities={activities}></DisplayActivities> */}
            <CalculateDistancePerMonth activities={activities} setDistancePerMonth={setDistancePerMonth} setSpeedPerMonth={setSpeedPerMonth}></CalculateDistancePerMonth>
        </div>
    );
};

export default OverviewPage;