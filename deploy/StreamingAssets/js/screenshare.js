
// Agora AppID
let appId = "";
let onPublished = () => console.log("not set callback VideoScreen onPublished");
let onStopped = () => console.log("not set callback VideoScreen onStopped");

export const VideoScreenInit = (id, _onPublished, _onStopped) => {
  appId = id;
  onPublished = _onPublished;
  onStopped = _onStopped;

  const elem = document.getElementById("video_screen");
  elem.setAttribute("style", "width:64px; height: 36px;");
  elem.setAttribute("src", "/StreamingAssets/bbb.webm");
  elem.muted = false;
  elem.play();

  onPublished();
};
