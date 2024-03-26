import React, { useState, useEffect } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import Map from "../components/Map";
import LoadData from "../components/LoadData";
import VelocityGraph from "../components/VelocityGraph";

const ActivitiesPage = () => {
    const [activities, setActivities] = useState();
    const [visibleActivities, setVisibleActivities] = useState(5);
    const [activitiesWithOptions, setActivitiesWithOptions] = useState([]);

    const [timestamps, setTimestamps] = useState([])
    const [velocitySmoothData, setVelocitySmoothData] = useState([])

    console.log(timestamps)
    console.log(velocitySmoothData)

    const handleScroll = () => {
        setVisibleActivities(prevVisibleActivities => prevVisibleActivities + 5);
    };

    useEffect(() => {
        if (activities !== undefined) {
            const filteredActivities = activities.filter(activity => activity.map && activity.map.summary_polyline)
                .map((activity, index) => ({
                    id: activity.id,
                    date: activity.start_date_local,
                    name: activity.name,
                    time: formatTime(activity.moving_time),
                    distance: (activity.distance / 1000).toFixed(3),
                    velocity: (activity.distance / activity.moving_time * 3.6).toFixed(2),
                    elevation: activity.total_elevation_gain,
                    polyline: activity.map.summary_polyline,
                    key: index
                }));
            setActivitiesWithOptions(filteredActivities);
        }
    }, [activities]);

    function formatTime(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function formatPace(totalMinutes) {
        const minutes = Math.floor(totalMinutes);
        const seconds = Math.round((totalMinutes % 1) * 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    const containerStyle = {
        marginRight: '20px',
        textAlign: 'left',
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        columnGap: '10px'
    };

    // Define the style for the name divs
    const nameStyle = {
        fontWeight: 'bold'
    };

    return (
        <div>
            {/* {timestamps.length > 1 && <VelocityGraph timestamps={timestamps} velocitySmoothData={velocitySmoothData} />} */}
            <LoadData setActivities={setActivities} activities={activities} setTimestamps={setTimestamps} setVelocitySmoothData={setVelocitySmoothData}></LoadData>
            <InfiniteScroll
                dataLength={visibleActivities}
                next={handleScroll}
                hasMore={visibleActivities < activitiesWithOptions.length}
                loader={<h4>Loading...</h4>}
            >
                {[...Array(visibleActivities)].map((_, i) => {
                    const activity = activitiesWithOptions[i];
                    if (!activity) return null; // Skip rendering if activity is undefined

                    // Destructure activity data
                    const { name, date, distance, time, velocity, elevation, id } = activity;

                    return (
                        <div key={i} style={{ marginBottom: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={containerStyle}>
                                <div style={nameStyle}>Date:</div>
                                <div>{date.slice(0, 10)}</div>
                                <div style={nameStyle}>Distance:</div>
                                <div>{distance} km</div>
                                <div style={nameStyle}>Time:</div>
                                <div>{time}</div>
                                <div style={nameStyle}>Velocity:</div>
                                <div>{velocity} km/h</div>
                                <div style={nameStyle}>Pace:</div>
                                <div>{formatPace(60 / velocity)} minutes/km</div>
                                <div style={nameStyle}>Elevation:</div>
                                <div>{elevation} m</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '10px' }}>{name} - {date.slice(0, 10)}</div>
                                <Map activity={activity} />
                            </div>
                            <VelocityGraph activityId={id} />
                        </div>
                    );
                })}
            </InfiniteScroll>
        </div>
    );
};

export default ActivitiesPage;