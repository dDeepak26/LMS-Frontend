import { useEffect, useRef } from "react";
import cloudinary from "cloudinary-video-player";
import "cloudinary-video-player/cld-video-player.min.css";

const MyVideoPlayer = ({ videoUrl }: { videoUrl: string }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      const player = cloudinary.videoPlayer(videoRef.current, {
        cloud_name: "dyr2um5qc",
        public_id: videoUrl,
        controls: true,
      });

      if (videoUrl) {
        player.source(videoUrl);
      }

      return () => {
        player.dispose();
      };
    }
  }, [videoUrl]);

  return (
    <video
      ref={videoRef}
      id="my-video-player"
      className="cld-video-player"
    ></video>
  );
};

export default MyVideoPlayer;
