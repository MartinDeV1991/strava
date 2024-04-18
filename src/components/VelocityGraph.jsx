import React, { useEffect, useState } from 'react';
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
Chart.register(CategoryScale);

const VelocityGraph = ({ activityId }) => {

    const [timestamps, setTimestamps] = useState([])
    const [velocitySmoothData, setVelocitySmoothData] = useState([])
    let userId = localStorage.getItem('userId');
    if (userId === null) {
        userId = "default";
    }

    useEffect(() => {
        async function getStreams() {
            // console.log(process.env.REACT_APP_MONGO_PATH)
            const accessToken = localStorage.getItem('Strava_access_token');
            const streamTypes = 'time,velocity_smooth';
            const cachedStreams = await fetch(`${process.env.REACT_APP_MONGO_PATH}/mongodb/api/findone/${userId}/${activityId}`);

            let responseData;
            if (cachedStreams.status === 404) {
                console.log("not found")
            } else {
                responseData = await cachedStreams.json();
                setTimestamps(responseData.timestamps);
                setVelocitySmoothData(responseData.velocitySmoothData);
                return;
            }

            fetch(`https://www.strava.com/api/v3/activities/${activityId}/streams/${streamTypes}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then(response => response.json())
                .then(data => {
                    const timeStream = data.find(stream => stream.type === 'time');
                    const velocitySmoothStream = data.find(stream => stream.type === 'velocity_smooth');
                    if (timeStream && velocitySmoothStream) {
                        setTimestamps(timeStream.data);
                        setVelocitySmoothData(velocitySmoothStream.data);
                        cachedStreams[activityId] = { timestamps: timeStream.data, velocitySmoothData: velocitySmoothStream.data };

                        fetch(`${process.env.REACT_APP_MONGO_PATH}/mongodb/api/post/${userId}/${activityId}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(cachedStreams[activityId])
                        })
                            .then(
                                console.log("posted data")
                            );

                    }
                    console.log("getting activity ", activityId, " from API");
                })
                .catch(error => {
                    console.error(`Error fetching velocity_smooth data for activity ${activityId}:`, error);
                });
        }
        getStreams();
    }, [activityId, userId]);

    useEffect(() => {
        const velocity = [];
        const time = [];
        let vel = 0;
        let interval = 10;
        for (let i = 0; i < velocitySmoothData.length; i++) {
            vel += velocitySmoothData[i];
            if (i % interval === 0) {
                velocity.push(vel * 3.6 / interval);
                time.push((timestamps[i] / 60).toFixed(0));
                vel = 0;
            }
        }

        // for (let i = 0; i < velocitySmoothData.length; i += interval) {
        //     velocity.push(velocitySmoothData[i] * 3.6);
        //     time.push(timestamps[i]);
        // }

        setChartData({
            labels: time,
            datasets: [
                {
                    label: 'Velocity (km/h)',
                    data: velocity,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
            ],
        });
    }, [velocitySmoothData, timestamps]);

    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Velocity (km/h)',
                data: [],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            },
        ],
    });

    const chartOptions = {
        maintainAspectRatio: false
    };

    return (
        <div>
            <div style={{ width: '800px', height: '300px' }}>
                <Line data={chartData} options={chartOptions} id="velocityGraph"></Line>
                {/* <Bar data={chartData} options={chartOptions} id="velocityGraph"></Bar> */}
            </div>
        </div>
    );
};

export default VelocityGraph;
