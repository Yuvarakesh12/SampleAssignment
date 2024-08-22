import React, { Component } from 'react';
import './index.css';
import SpotifyPlayer from '../SpotifyPlayer';
import { FaRandom } from "react-icons/fa";
import { FaRepeat } from "react-icons/fa6";

class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRandomClicked: false,
            isRepeatClicked: false
        };
    }

    handleRandomClick = () => {
        this.setState(prevState => ({
            isRandomClicked: !prevState.isRandomClicked
        }));
    };

    handleRepeatClick = () => {
        this.setState(prevState => ({
            isRepeatClicked: !prevState.isRepeatClicked
        }));
    };

    render() {
        const { song, onClose, showOnSmallScreen } = this.props;
        const { isRandomClicked, isRepeatClicked } = this.state;

        if (!song) return null;

        const modalClassName = showOnSmallScreen ? 'modal-overlay small-screen' : 'modal-overlay';

        return (
            <div className={modalClassName}>
                <div className="modal-content">
                    <button className="modal-close" onClick={onClose}>×</button>
                    <img
                        src={`https://cms.samespace.com/assets/${song.cover}`}
                        className="modal-image"
                        alt={song.name}
                    />
                    <h1 className="modal-device-name">Device</h1>
                    <p className="modal-song-title">Song Title - {song.name}</p>
                    <p className="modal-artist-name">Artist - {song.artist}</p>
                    <div className="modal-progress-bar">
                        <div className="progress-bar" />
                    </div>
                    <SpotifyPlayer url={song.url} />

                    <div className="below-icons">
                        <FaRandom
                            style={{ color: isRandomClicked ? 'grey' : 'inherit' }}
                            onClick={this.handleRandomClick}
                        />
                        <FaRepeat
                            style={{ color: isRepeatClicked ? 'grey' : 'inherit' }}
                            onClick={this.handleRepeatClick}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Modal;

