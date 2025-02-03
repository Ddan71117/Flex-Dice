import React from "react";
import ReactPlayer from "react-player";

interface VideoPlayerProps {
  url: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
  return (
    <div className="flex justify-center">
      <ReactPlayer url={url} controls width="1000px" height="500px" />
    </div>
  );
};

export default VideoPlayer;
