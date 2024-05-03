import { useState } from "react";
import "./App.css";
import { Progress } from "antd";

function App() {
  const [isAudible, setIsAudible] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  let animationFrameId;

  const checkMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const analyzer = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);

      microphone.connect(analyzer);

      const dataArray = new Uint8Array(analyzer.frequencyBinCount);

      const analyzeAudio = () => {
        analyzer.getByteFrequencyData(dataArray);
        const average =
          dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
        setAudioLevel(average);
        setIsAudible(average > 0); // Adjust threshold as needed
        animationFrameId = requestAnimationFrame(analyzeAudio);
      };

      analyzeAudio();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  return (
    <>
      <h1>hello</h1>
      <div style={{ height: "10px", width: "200px", background: "lightgray" }}>
        <div
          style={{
            height: "100%",
            width: `${(audioLevel / 255) * 200}%`,
            background: isAudible ? "green" : "red",
          }}
        ></div>
      </div>
      {/* <Progress
        percent={(audioLevel / 255) * 100}
        status="active"
        style={{ backgroundColor: isAudible ? "green" : "red" }}
      /> */}
      <button onClick={checkMicrophone}>Check Microphone</button>
      {isAudible ? <p>You are audible!</p> : <p>Not audible.</p>}
    </>
  );
}

export default App;
