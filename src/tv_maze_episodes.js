import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import axios from 'axios';

const TvMazeEpisodes = ({ showId }) => {
    const [seasons, setSeasons] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSeasonsAndEpisodes = async () => {
            try {
                // Fetch season and episode data
                const [seasonResponse, episodeResponse] = await Promise.all([
                    axios.get(`https://api.tvmaze.com/shows/${showId}/seasons`),
                    axios.get(`https://api.tvmaze.com/shows/${showId}/episodes`),
                ]);

                const seasonData = seasonResponse.data;
                const episodeData = episodeResponse.data;

                // Merge episodes into their respective seasons
                const mergedData = seasonData.map((season) => ({
                    ...season,
                    episodes: episodeData.filter((ep) => ep.season === season.number),
                }));

                setSeasons(mergedData);
                setError('');
            } catch (err) {
                setError('Error fetching season or episode data. Please try again later.');
            }
        };

        fetchSeasonsAndEpisodes();
    }, [showId]);

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    if (!seasons.length) {
        return <p>Loading...</p>;
    }

    return (
        <div className="tvmaze-episodes-container">
            <h2>Episodes by Season</h2>
            <Tabs>
                <TabList>
                    {seasons.map((season) => (
                        <Tab key={season.id}>Season {season.number}</Tab>
                    ))}
                </TabList>

                {seasons.map((season) => (
                    <TabPanel key={season.id}>
                        <div className="season-header">
                            {season.image ? (
                                <img
                                    src={season.image.medium}
                                    alt={`Season ${season.number}`}
                                    className="season-image"
                                />
                            ) : (
                                <p>No image available</p>
                            )}
                            <p><strong>Season {season.number}</strong></p>
                            <p>Premiere Date: {season.premiereDate || 'Unknown'}</p>
                            <p>End Date: {season.endDate || 'Unknown'}</p>
                            <p>
                                <a href={season.url} target="_blank" rel="noopener noreferrer">
                                    View Season on TVMaze
                                </a>
                            </p>
                        </div>
                        <table className="episodes-table">
                            <thead>
                                <tr>
                                    <th>Episode</th>
                                    <th>Number</th>
                                    <th>Air Date</th>
                                    <th>Summary</th>
                                    <th>Episode Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {season.episodes.map((episode) => (
                                    <tr key={episode.id}>
                                        <td>{episode.name}</td>
                                        <td>{episode.number}</td>
                                        <td>{episode.airdate || 'Unknown'}</td>
                                        <td
                                            dangerouslySetInnerHTML={{
                                                __html: episode.summary || 'No summary available.',
                                            }}
                                        />
                                        <td>
                                            <a href={episode.url} target="_blank" rel="noopener noreferrer">
                                                View Episode on TVMaze
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </TabPanel>
                ))}
            </Tabs>
        </div>
    );
};

export default TvMazeEpisodes;