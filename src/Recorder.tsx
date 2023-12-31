import React from 'react'
import RecordRTC from 'recordrtc'

const Recorder = ({stream, signalStop}: {stream: MediaStream, signalStop: ()=>void}) => {
    const [intervalHolder, setIntervalHolder] = React.useState<null|number>(null);
    const [timer, setTimer] = React.useState<string>('00 : 00 : 00')
    const [rtc, setRtc] = React.useState<null|RecordRTC>(null)

    React.useEffect(()=>{
        const r = new RecordRTC(stream, {type: 'video'})
        r.startRecording()
        startRecording()
        setRtc(r)

        let scr = stream.getVideoTracks()
            .find(s=>{
                let n = s.label.toLowerCase()
                return n.includes('monitor') || n.includes('screen')
            })
        
        if(scr) scr.onended = ()=>{
            console.log('videostopped');
            stopRecording()
        }
        console.log(scr)

        const beforeUnloadHandler = (event:any) =>{
            const message = "Record is in progess, are you sure want to leave without saving it?"
            event.returnValue = message;
            return message
        }

        window.addEventListener('beforeunload', beforeUnloadHandler)

        return ()=>{
            if(intervalHolder) clearInterval(intervalHolder);
            if(rtc) rtc.destroy();
            window.removeEventListener('beforeunload', beforeUnloadHandler)
        }
    }, [])

    const startRecording = () =>{
        const startedAt = Date.now()
        setIntervalHolder(setInterval(()=>{
            setTimer(formatTime(startedAt));
        }, 1000));
    }

    const stopRecording = () =>{
        // console.log('RTC', rtc?.getBlob(), rtc?.blob)
        console.log(rtc)
        setRtc(prev=>{
            if(prev){
                prev.stopRecording(()=>{
                    let data = prev.getBlob()
                    alert(data.type);
                    let url = URL.createObjectURL(data)
                    let a = document.createElement('a')
                    a.href = url;
                    a.download = new Date().toLocaleString()
                    
                    a.click()
                });
            }
            setTimeout(signalStop, 1000);
            return null;
        })
    }

    return (
        <>
            <h3>Recording...</h3>
            <span className='timer fadeIn parent'>
                {timer}
            </span>
            <h3><button className='fadeIn' onClick={stopRecording}>Stop Recording</button></h3>
        </>
    )
}

export default Recorder

const formatTime = (startedAt: number): string => {
    let diff = (Date.now() - startedAt)/1000;

    const hr = appendZ(parseInt(String(diff/3600)));
    diff = diff%3600;

    const min = appendZ(parseInt(String(diff/60)));
    const sec = appendZ(parseInt(String(diff%60)))

    return `${hr} : ${min} : ${sec}`;
}

const appendZ = (n: number) =>{
    if(n<10) return `0${n}`
    return n;
}