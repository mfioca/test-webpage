import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Chart, CategoryScale, LinearScale, LineController, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import loadDataForGraphs from '../dataloader'; // Import your data loader function


Chart.register(CategoryScale, LinearScale, LineController, LineElement, Title, Tooltip, Legend);

const Graph = () => {
    const dispatch = useDispatch();
    const graphData = useSelector((state) => state.graphData.graph1); // Adjust as needed
    const [isLoading, setIsLoading] = useState(true); // Initialize loading state

    const options = useMemo(() => ({
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Month-Year',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Total Duration (Hours)',
                },
                beginAtZero: true,
            },
        },
        plugins: {
            datalabels: {
                display: false, // Hide data labels
            },
        },
    }), []);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true); // Set loading to true
            await loadDataForGraphs(dispatch, 'graph1'); // Load data for graphs
            setIsLoading(false); // Set loading to false
        };

        fetchData();
    }, [dispatch]);

    if (isLoading) {
        return <div className="loading-overlay"><p>Loading...</p></div>; // Display loading message
    }

    if (!graphData || !graphData.labels || !graphData.datasets) {
        return <p>No data available</p>; // or handle the loading state
    }

    console.log('Graph Data:', graphData); // Log the graph data to verify
    
    return (
        <div className="chart-container">
            <h2>Application Usage Over Time by Month</h2>
            <Line data={graphData} options={options} />
        </div>
    );
};

export default Graph;