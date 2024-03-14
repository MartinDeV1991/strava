import React, { useState } from "react";
import GetAccess from "../components/GetAccess";
import LoadData from "../components/LoadData";
import DisplayActivities from "../components/DisplayActivities";
import DisplayDistancePerMonth from "../components/DisplayDistancePerMonth";
import DistanceChart from "../components/DistanceChart";

const HomePage = () => {

    const [accessToken, setAccessToken] = useState();
    const [activities, setActivities] = useState();
    const [distancePerMonth, setDistancePerMonth] = useState();
    return (
        <div>
            <GetAccess setAccessToken={setAccessToken}></GetAccess>
            <LoadData accessToken={accessToken} setActivities={setActivities}></LoadData>
            <DistanceChart distancePerMonth={distancePerMonth}></DistanceChart>
            <DisplayActivities activities={activities}></DisplayActivities>
            <DisplayDistancePerMonth activities={activities} setDistancePerMonth={setDistancePerMonth}></DisplayDistancePerMonth>
            
        </div >
    );
};

export default HomePage;