import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 540,
  facingMode: "environment",
};

const Camera = ({ setFileImg2 }) => {
  const webcamRef = useRef(null);
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
    },
    [webcamRef]
  );

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
      <div
        style={{
          width: "50%",
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
          }}
        />
        <button
          className="bg-black text-white px-4 py-2 rounded-md"
          onClick={capturePhoto}
        >
          Capture
        </button>
        <button
          className="bg-black text-white px-4 py-2 rounded-md ml-2 my-2"
          onClick={(e) => {
            e.preventDefault();
            setUrl(null);
          }}
        >
          Refresh
        </button>
      </div>
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
          <span className="m-auto text-center">Your Pic will be below 👇</span>
        )}
      </div>
    </div>
  );
};

export default Camera;
