import React, { Component, createRef } from 'react';
import ReactPlayer from 'react-player';
import { FaForward, FaBackward, FaVolumeUp, FaVolumeMute, FaPlayCircle, FaPauseCircle } from 'react-icons/fa';
import { SlOptions } from 'react-icons/sl';
import './index.css';

class SpotifyPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPlaying: false,
            volume: 0.8,
            played: 0,
            muted: false,
        };
        this.playerRef = createRef();
    }

    handlePlayPause = () => {
        this.setState(prevState => ({
            isPlaying: !prevState.isPlaying
        }));
    };

    handleVolumeChange = (e) => {
        this.setState({
            volume: parseFloat(e.target.value)
        });
    };

    handleMuteToggle = () => {
        this.setState(prevState => ({
            muted: !prevState.muted
        }));
    };

    handleSeek = (e) => {
        const { value } = e.target;
        if (this.playerRef.current) {
            this.playerRef.current.seekTo(parseFloat(value), 'fraction');
        }
    };

    handleProgress = (state) => {
        this.setState({
            played: state.played
        });
    };

    render() {
        const { url } = this.props;
        const { isPlaying, volume, muted, played } = this.state;

        return (
            <div className="spotify-player">
                <ReactPlayer
                    ref={this.playerRef}
                    url={url}
                    playing={isPlaying}
                    volume={volume}
                    muted={muted}
                    onProgress={this.handleProgress}
                    width="0"
                    height="0"
                />
                <div className="progress-container">
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${played * 100}%` }}
                        />
                    </div>
                </div>
                <div className="player-controls">
                    <SlOptions className="options-icon" />
                    <button className="control-button" onClick={() => this.playerRef.current.seekTo(played - 0.1, 'fraction')}>
                        <FaBackward />
                    </button>
                    <button className="control-button1" onClick={this.handlePlayPause}>
                        {isPlaying ? <FaPauseCircle /> : <FaPlayCircle />}
                    </button>
                    <button className="control-button" onClick={() => this.playerRef.current.seekTo(played + 0.1, 'fraction')}>
                        <FaForward />
                    </button>
                    <div className="volume-controls">
                        <button className="volume-button" onClick={this.handleMuteToggle}>
                            {muted ? <FaVolumeMute /> : <FaVolumeUp />}
                        </button>
                       
                    </div>
                </div>
            </div>
        );
    }
}

export default SpotifyPlayer;
