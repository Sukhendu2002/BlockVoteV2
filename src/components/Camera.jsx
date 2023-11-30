import { FaceMesh } from "@mediapipe/face_mesh";
import React, { useEffect, useRef, useState } from "react";
import * as Facemesh from "@mediapipe/face_mesh";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 540,
  facingMode: "user",
};

const Camera = ({ setFileImg2 }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const connect = window.drawConnectors;
  const [disabledCapture, setDisabledCapture] = useState(false);
  var camera = null;

  const [url, setUrl] = useState(null);
  const capturePhoto = React.useCallback(
    async (e) => {
      e.preventDefault();
      const imageSrc = webcamRef.current.getScreenshot();
      setUrl(imageSrc);

      // Convert the base64 image to a Blob
      const byteCharacters = atob(imageSrc.split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/jpeg" });

      setFileImg2(blob);
      //off the camera
      camera.stop();
      //stop the video
      webcamRef.current.video.pause();
      webcamRef.current.video.srcObject = null;
      webcamRef.current.video.src = null;
      setDisabledCapture(true);
    },
    [webcamRef]
  );

  const onResults = (results) => {
    // const video = webcamRef.current.video;
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    // Set canvas width
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    if (results.multiFaceLandmarks) {
      for (const landmarks of results.multiFaceLandmarks) {
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_TESSELATION, {
          color: "#C0C0C070",
          lineWidth: 1,
        });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYE, {
          color: "#E0E0E0 ",
        });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYEBROW, {
          color: "#E0E0E0",
        });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYE, {
          color: "#E0E0E0",
        });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYEBROW, {
          color: "#E0E0E0",
        });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_FACE_OVAL, {
          color: "#E0E0E0",
        });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_LIPS, {
          color: "#E0E0E0",
        });
      }
    }
    canvasCtx.restore();
  };
  useEffect(() => {
    const faceMesh = new FaceMesh({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      },
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults(onResults);

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          await faceMesh.send({ image: webcamRef.current.video });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  }, []);
  useEffect(() => {
    // setVoterData({
    //   ...voterData,
    //   current_picture: url,
    // });
    setFileImg2(url);
  }, [url]);
  const onUserMedia = (e) => {
    // console.log(e);
  };

  return (
    <div
      style={{
        width: "87%",
        display: "flex",
        justifyContent: "space-between",
        marginTop: "1rem",
      }}
    >
      {!disabledCapture && (
        <div
          style={{
            width: "50%",
            position: "relative",
            height: "auto",
            paddingTop: "48%",
          }}
        >
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            onUserMedia={onUserMedia}
            mirrored={false}
            style={{
              width: "100%",
              height: "auto",
              border: "1px solid #000",
              borderRadius: "5px",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
          <canvas
            ref={canvasRef}
            className="output_canvas"
            style={{
              width: "100%",
              height: "auto",
              border: "1px 0px 1px 1px solid #000",
              borderRadius: "5px",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          ></canvas>
          <div>
            <button
              className="bg-black text-white px-4 py-2 rounded-md"
              style={{
                position: "absolute",
                bottom: "1rem",
                left: "3rem",
                transform: "translate(-50%, -50%)",
              }}
              onClick={capturePhoto}
            >
              Capture
            </button>
            {/* <button
              className="bg-black text-white px-4 py-2 rounded-md ml-2 my-2"
              style={{
                position: "absolute",
                bottom: "0.5rem",
                left: "35%",
                transform: "translate(-50%, -50%)",
              }}
              onClick={(e) => {
                e.preventDefault();
                setUrl(null);
              }}
            >
              Refresh
            </button> */}
          </div>
        </div>
      )}
      <div>
        {url ? (
          <img
            src={url}
            alt="Screenshot"
            style={{
              width: "100%",
              height: "auto",
              border: "1px solid #000",
              borderRadius: "5px",
              marginLeft: "0.3rem",
            }}
          />
        ) : (
          // <span className="m-auto text-center">Your Pic will be below 👇</span>
          null
        )}
      </div>
    </div>
  );
};

export default Camera;
