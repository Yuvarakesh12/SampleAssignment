import React, { Component } from 'react';
import { FaSpotify } from 'react-icons/fa';
import { CiSearch } from 'react-icons/ci';
import SpotifyPlayer from '../SpotifyPlayer';
import Modal from '../Model';
import './index.css';

const generateRandomTime = () => {
    const minutes = Math.floor(Math.random() * 5) + 1;
    const seconds = Math.floor(Math.random() * 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

class Spotify extends Component {
    constructor(props) {
        super(props);
        this.state = {
            songsData: [],
            selectedSong: null,
            activeSongId: null,
            loading: true,
            error: null,
            searchQuery: '',
            activeSection: 'forYou',
            isModalOpen: false,
            isSmallScreen: window.innerWidth <= 768 
        };
    }

    componentDidMount() {
        this.fetchSongs();
        window.addEventListener('resize', this.handleResize); 
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize); 
    }

    fetchSongs = async () => {
        this.setState({ loading: true, error: null });
        const url = 'https://cms.samespace.com/items/songs';
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                const songsWithRandomTime = data.data.map(song => ({
                    ...song,
                    time: generateRandomTime()
                }));
                this.setState({
                    songsData: songsWithRandomTime,
                    selectedSong: songsWithRandomTime.length > 0 ? songsWithRandomTime[0] : null,
                    activeSongId: songsWithRandomTime.length > 0 ? songsWithRandomTime[0].id : null,
                    loading: false
                });
            } else {
                this.setState({
                    error: 'Error fetching songs. Please try again later.',
                    loading: false
                });
            }
        } catch (error) {
            console.error('Error fetching songs:', error);
            this.setState({
                error: 'Error fetching songs. Please try again later.',
                loading: false
            });
        }
    };

    handleSongClick = (song) => {
        this.setState({
            selectedSong: song,
            activeSongId: song.id,
            isModalOpen: true
        });
    };

    handleSearchChange = (event) => {
        this.setState({ searchQuery: event.target.value });
    };

    handleSectionClick = (section) => {
        this.setState({ activeSection: section });
    };

    closeModal = () => {
        this.setState({ isModalOpen: false });
    };

    handleResize = () => {
        this.setState({ isSmallScreen: window.innerWidth <= 768 });
    };

    render() {
        const { songsData, selectedSong, activeSongId, loading, error, searchQuery, activeSection, isModalOpen, isSmallScreen } = this.state;

        if (loading) return <div>Loading...</div>;
        if (error) return <div>{error}</div>;

        const filteredSongs = songsData.filter(song =>
            song.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
            <div className="bg-container">
                <div className="flex-row">
                    <div className="logo-container">
                        <FaSpotify className="logo" />
                        <h1 className="main-heading">Spotify</h1>
                    </div>
                    <div className="middle-container">
                        <div className="middle-sub">
                            <h3
                                className={`section-title ${activeSection === 'forYou' ? 'active-section' : ''}`}
                                onClick={() => this.handleSectionClick('forYou')}
                            >
                                For You
                            </h3>
                            <h3
                                className={`section-title ${activeSection === 'topTracks' ? 'active-section' : ''}`}
                                onClick={() => this.handleSectionClick('topTracks')}
                            >
                                Top Tracks
                            </h3>
                        </div>
                        <div className="search">
                            <div className="search-input-container">
                                <input
                                    type="text"
                                    className="search__input"
                                    placeholder="Search Song, Artist"
                                    value={searchQuery}
                                    onChange={this.handleSearchChange}
                                />
                                <button className="search__button" aria-label="Search">
                                    <CiSearch />
                                </button>
                            </div>
                        </div>
                        <div>
                            <ul className="songsList">
                                {filteredSongs.map(song => (
                                    <li
                                        key={song.id}
                                        onClick={() => this.handleSongClick(song)}
                                        className={activeSongId === song.id ? 'active-song' : ''}
                                        aria-selected={activeSongId === song.id}
                                    >
                                        <div className="song-container">
                                            <div className="song-semi">
                                                <img
                                                    src={`https://cms.samespace.com/assets/${song.cover}`}
                                                    className="song-image"
                                                    alt={song.name}
                                                />
                                                <div className="song-details">
                                                    <p className="songname">{song.name}</p>
                                                    <p className="artistname">{song.artist}</p>
                                                </div>
                                            </div>
                                            <div className="song-time">
                                                <p>{song.time}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="last-container">
                        <div>
                            {selectedSong && (
                                <>
                                    <h2>{selectedSong.name}</h2>
                                    <p className="playrtist">{selectedSong.artist}</p>
                                    <img
                                        src={`https://cms.samespace.com/assets/${selectedSong.cover}`}
                                        className="player-image"
                                        alt={selectedSong.name}
                                    />
                                    <SpotifyPlayer url={selectedSong.url} />
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {isModalOpen && (
                    <Modal song={selectedSong} onClose={this.closeModal} showOnSmallScreen={isSmallScreen} />
                )}
            </div>
        );
    }
}

export default Spotify;
