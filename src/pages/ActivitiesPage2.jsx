import React, { useState, useEffect } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import Map from "../components/Map";
import LoadData from "../components/LoadData";
import { FixedSizeList as List } from 'react-window';

const ActivitiesPage = () => {
    const [activities, setActivities] = useState();
    const [visibleActivities, setVisibleActivities] = useState(5);
    const [activitiesWithOptions, setActivitiesWithOptions] = useState([]);

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
                    polyline: activity.map.summary_polyline,
                    key: index
                }));
            setActivitiesWithOptions(filteredActivities);
        }
    }, [activities]);

    const Row = ({ index }) => {
        const activity = activitiesWithOptions[index];
        return (
            <div style={{ marginBottom: 100 }}>
                <Map activity={activity} />
            </div>
        );
    };

    return (
        <div>
            <LoadData setActivities={setActivities}></LoadData>
            {activitiesWithOptions.length > 0 && (
                <List
                    height={1000} // Height of the visible part of the list
                    itemCount={500} // Number of rows in the list
                    itemSize={400} // Height of each row
                    width={1000} // Width of the list container
                >
                    {Row}
                </List>
            )}
        </div>
    );
};

export default ActivitiesPage;