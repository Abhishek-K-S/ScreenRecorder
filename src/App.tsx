import React from 'react'
import './App.css'
import Recorder from './Recorder'

function App() {
  const [recordingState, setRecordingState] = React.useState(false)
  const [stream, setStream] = React.useState<null|MediaStream>(null);

  const handleStartRecording = ()=>{
    navigator.mediaDevices.getDisplayMedia({video: true, audio: true})
      .then(stream=>setStream(stream))
  }

  const handleStopRecording = () =>{
    stream?.getTracks().forEach(t=>t.stop())
    setStream(null);
    setRecordingState(false);
  }

  return (
    <>
    <nav>
      <h1>Screen Recorder</h1>
    </nav>
    <hr />
    <div className='placeCenter'>
      {!recordingState && <button  onClick={()=>{setRecordingState(true);handleStartRecording()}}>Start Recording Now</button>}
      {recordingState && stream && <Recorder stream={stream} signalStop={handleStopRecording}/>}
      {recordingState && !stream && 
        <>
          <p style={{textAlign: 'center'}}>Waiting for media permissons. Please allow video and audio permissons.</p>
          <p>Having trouble? Try refreshing the page.</p>
        </>
      }
    </div>
      
    </>
  )
}

export default App
