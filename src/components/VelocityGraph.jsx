import React, { useEffect, useState } from 'react';
import { Bar, Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
Chart.register(CategoryScale);

const VelocityGraph = ({ activityId }) => {

    const [timestamps, setTimestamps] = useState([])
    const [velocitySmoothData, setVelocitySmoothData] = useState([])

    useEffect(() => {
        getStreams();
    }, [activityId]);

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

    function getStreams() {
        const accessToken = '923e2c2bf2169e3d036fb2220ac5ffbebc13dd33';
        const streamTypes = 'time,velocity_smooth';

        const cachedStreams = JSON.parse(localStorage.getItem('stravaStreams')) || {};

        if (cachedStreams[activityId]) {
            const { timestamps, velocitySmoothData } = cachedStreams[activityId];
            setTimestamps(timestamps);
            setVelocitySmoothData(velocitySmoothData);
            console.log("getting activity ", activityId, " from localstorage");
            console.log(cachedStreams)
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
                    localStorage.setItem('stravaStreams', JSON.stringify(cachedStreams));
                }
                console.log("getting activity ", activityId, " from API");
            })
            .catch(error => {
                console.error(`Error fetching velocity_smooth data for activity ${activityId}:`, error);
            });
    }

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
