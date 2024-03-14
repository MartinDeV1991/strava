import React, { useEffect, useState } from 'react';
import { Bar } from "react-chartjs-2";

const DistanceChart = ({ distancePerMonth }) => {

    const [startDate, setStartDate] = useState('2000-01');
    const [endDate, setEndDate] = useState('2100-12');

    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Distance per Month (km)',
                data: [],
            },
        ],
    });

    useEffect(() => {
        let distance = distancePerMonth;
        if (distance === undefined) distance = [];

        distance = Object.keys(distance).reduce((obj, key) => {
            const [year, month] = key.split('-');
            const paddedMonth = month.length === 1 ? '0' + month : month;
            const paddedKey = year + '-' + paddedMonth;
            obj[paddedKey] = distance[key];
            return obj;
        }, {});

        const filteredData = Object.keys(distance)
            .filter(date => (date >= startDate) && (date <= endDate))
            .reduce((obj, key) => {
                obj[key] = distance[key];
                return obj;
            }, {});

        const sortedKeys = Object.keys(filteredData).sort();
        const sortedFilteredData = sortedKeys.reduce((obj, key) => {
            obj[key] = filteredData[key];
            return obj;
        }, {});

        const labels = Object.keys(sortedFilteredData);
        const data = Object.values(sortedFilteredData);

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: 'Distance per Month (km)',
                    data: data,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
            ],
        });

    }, [distancePerMonth, startDate, endDate]);

    const handleStartDateChange = (event) => {
        const selectedDate = event.target.value.slice(0, 7);
        setStartDate(selectedDate);
    };

    const handleEndDateChange = (event) => {
        const selectedDate = event.target.value.slice(0, 7);
        setEndDate(selectedDate);
    };

    const chartOptions = {
        maintainAspectRatio: false
    };

    return (
        <div>
            <div>
                <label>Start Date:</label>
                <input type="month" value={startDate} onChange={handleStartDateChange} />
            </div>
            <div>
                <label>End Date:</label>
                <input type="month" value={endDate} onChange={handleEndDateChange} />
            </div>
            <div style={{ width: '1000px', height: '300px' }}>
                <Bar data={chartData} options={chartOptions} id="distanceChart"></Bar>
            </div>
        </div>
    );
};

export default DistanceChart;
