import { useEffect, useRef, useState } from "react";
import Peer, { SignalData } from "simple-peer";
import "./styles.css";
import CopyToClipboard from "react-copy-to-clipboard";
import io from "socket.io-client";
import Input from "../../components/input";
import Button from "../../components/button";

const socket = io("http://localhost:4000");

interface FeedProps {}

const Feed: React.FC<FeedProps> = () => {
  const [me, setMe] = useState("");
  const [stream, setStream] = useState<MediaStream>();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState<string | SignalData>("");
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");

  const myVideo = useRef<any>();
  const userVideo = useRef<any>();
  const connectionRef = useRef<any>();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((steam) => {
        setStream(steam);
        myVideo.current.srcObject = steam;
      });

    socket.on("me", (id) => {
      setMe(id);
    });

    socket.on("callUser", (data) => {
      console.log("Calluser-->", data);
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, []);

  const callUser = (id: string) => {
    console.log("Entre", id);

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });
    peer.on("signal", (data) => {
      socket.emit("answerCall", {
        signal: data,
        to: caller,
      });
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current?.destroy();
  };

  return (
    <div className="content-scene-call">
      <span>streaming meet</span>

      <div className="container">
        <div className="video-container">
          <div className="video">
            {stream && (
              <video
                playsInline
                muted
                ref={myVideo}
                autoPlay
                style={{ width: "300px" }}
              />
            )}
          </div>
          <div className="video">
            {callAccepted && !callEnded ? (
              <video
                playsInline
                ref={userVideo}
                autoPlay
                style={{ width: "300px" }}
              />
            ) : null}
          </div>
        </div>

        <div className="panel-scene-call">
          <Input
            label="Nombre"
            placeholder="Nombre"
            value={name}
            onChange={({ target }: any) => setName(target.value)}
            style={{ marginBottom: "20px" }}
          />
          <CopyToClipboard text={me}>
            <Button label="Copiar" mode="primary" type="button" />
          </CopyToClipboard>

          <Input
            placeholder="Llamar A: "
            value={idToCall}
            onChange={({ target }: any) => setIdToCall(target.value)}
          />
          <div className="footer-panel-call">
            {true ? (
              <Button
                label="Finalizar Llamada"
                type="button"
                mode="secondary"
                onClick={leaveCall}
              />
            ) : (
              <Button
                label="Llamar"
                mode="primary"
                type="button"
                onClick={() => callUser(idToCall)}
              />
            )}
            {idToCall}
          </div>
        </div>
        <div>
          {receivingCall && !callAccepted ? (
            <div className="caller">
              <h1>{name} is calling...</h1>
              <Button
                label="Contestar"
                mode="primary"
                type="button"
                onClick={answerCall}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Feed;
