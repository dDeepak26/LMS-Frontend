import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import type { RootState } from "../store";
import type {
  courseType,
  enrolledCoursesType,
  lecture,
} from "../Types/courseType";
import { toSnakeCaseOnlyLetters } from "../utils/camelCaseText";
import { updateLectureProgressService } from "../Services/courseServices";

const LectureVideoPage = () => {
  const { lectureTitle } = useParams();
  const location = useLocation();

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // current course data
  const currentCourse: courseType = useSelector(
    (state: RootState) => state.currentCourse
  );

  // current enrolled course
  // let currentEnrolledCourse;
  // const enrolledCourses: enrolledCoursesType[] = useSelector((state:RootState) => state.enrolledCourses);
  // if(enrolledCourses && enrolledCourses.length > 0) {
  //   currentEnrolledCourse = enrolledCourses.filter((c) => c.user == )
  // }

  const [videoDuration, setVideoDuration] = useState<string>();
  const [watchedTime, setWatchedTime] = useState<number>();
  const [lastWatchedTime, setLastWatchedTime] = useState<number>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // current lecture url
  let currentLectureVideoUrl: lecture | undefined;
  if (currentCourse) {
    currentLectureVideoUrl = currentCourse.lectures.find(
      (lecture) => toSnakeCaseOnlyLetters(lecture.title) === lectureTitle
    );
  }

  // function to set the time stamp
  const handleSetTime = (time: number) => {
    let highestWatchedTime = 0;
    try {
      const data = JSON.parse(localStorage.getItem("Watched Time") ?? "{}");
      highestWatchedTime = data?.watchedTime ?? 0;
    } catch (err) {
      console.warn("Error parsing watched time from localStorage", err);
    }

    // Update state
    setLastWatchedTime(time);
    setWatchedTime((prevWatchedTime) =>
      Math.max(time, highestWatchedTime, prevWatchedTime ?? 0)
    );
  };

  // function to handle the update lecturer
  const handleUpdateLectureProgress = async (courseId: string, values: any) => {
    try {
      console.log("function called with data", values);

      const apiRes = await updateLectureProgressService(courseId, values);
      console.log("updated", apiRes);
    } catch (err) {
      console.error("error in updating the lecture progress", err);
    }
  };

  // Video event handlers
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleLoadedMetadata = () => {
      setVideoDuration(videoElement.duration.toFixed(0));

      const savedTimeline = localStorage.getItem("Watched Time");
      if (savedTimeline) {
        // getting the watched time from local storage
        const { lastWatchedTime } = JSON.parse(savedTimeline);

        // auto playing the video from last seen
        if (
          lastWatchedTime &&
          lastWatchedTime > 0 &&
          lastWatchedTime < videoElement.duration
        ) {
          videoElement.currentTime = Number(lastWatchedTime);
          videoElement.play().catch((err) => {
            console.warn(
              "Autoplay failed (likely due to browser policy):",
              err
            );
          });
        }
      }
    };
    const handleTimeUpdate = () => {
      let currentTime = Number(videoElement.currentTime.toFixed(0));
      handleSetTime(currentTime);
    };

    videoElement.addEventListener("play", handlePlay);
    videoElement.addEventListener("pause", handlePause);
    videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    videoElement.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      videoElement.removeEventListener("play", handlePlay);
      videoElement.removeEventListener("pause", handlePause);
      videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  // video mark as complete logic
  useEffect(() => {
    if (!videoDuration || !watchedTime || !lastWatchedTime) return;

    // calculating the watched %
    const watchedPercentage =
      (Number(watchedTime) / Number(videoDuration)) * 100;

    // if watched % is >= 75% then marking lecture video as watched/completed
    if (watchedPercentage >= 75 && !isCompleted) {
      console.log("Video watched over 75% — completed");
      setIsCompleted(true);

      localStorage.setItem(
        "Watched Time",
        JSON.stringify({ lastWatchedTime, watchedTime, videoDuration })
      );
    }
  }, [lastWatchedTime, watchedTime, videoDuration, isCompleted]);

  // Handling page/tab/browser close
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log("User is closing or refreshing the page");
      if (watchedTime && lastWatchedTime) {
        localStorage.setItem(
          "Watched Time",
          JSON.stringify({ lastWatchedTime, watchedTime, videoDuration })
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [lastWatchedTime, watchedTime, videoDuration]);

  // component unmount
  useEffect(() => {
    return () => {
      console.log("User navigated away from LectureVideoPage");
      if (watchedTime && lastWatchedTime) {
        // saving it in localstorage
        localStorage.setItem(
          "Watched Time",
          JSON.stringify({ lastWatchedTime, watchedTime, videoDuration })
        );
        handleUpdateLectureProgress(currentCourse._id, {
          lectureId: currentLectureVideoUrl?.order,
          lectureDuration: videoDuration,
          timeWatched: watchedTime,
        });
      }
    };
  }, [location]);

  return (
    <div>
      <h1>Lecture Video Page</h1>

      {currentLectureVideoUrl && (
        <video
          ref={videoRef}
          src={currentLectureVideoUrl.videoUrl}
          height="600"
          width="600"
          controls
          muted
        />
      )}

      <div style={{ marginTop: "1rem" }}>
        <p>Video Duration: {videoDuration} seconds</p>
        <p>Last Watch Time: {lastWatchedTime} seconds</p>
        <p>Watched Time: {watchedTime} seconds</p>
        <p>Status: {isPlaying ? "Playing" : "Paused"}</p>
        <p>Complete Status: {isCompleted ? "True" : "False"}</p>
      </div>
    </div>
  );
};

export default LectureVideoPage;
