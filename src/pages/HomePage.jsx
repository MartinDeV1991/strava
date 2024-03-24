import React, { useState, useEffect } from 'react';

const HomePage = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("fetching")
                const response = await fetch('/mongodb/api/endpoint');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const responseData = await response.json();
                setData(responseData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Home Page</h1>
            <ul>
                {/* {data.map((item, index) => (
                    <li key={index}>item: {JSON.stringify(item)}</li>
                ))} */}
            </ul>
        </div>
    );
};

export default HomePage