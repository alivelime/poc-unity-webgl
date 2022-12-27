
// Agora AppID
let appId = "";
let channelId = "";
let clientHost = null;
let clientAudience = null;
let onPublished = () => console.log("not set callback VideoScreen onPublished");
let onStopped = () => console.log("not set callback VideoScreen onStopped");
var localTracks = {
  screenVideoTrack: null,
  audioTrack: null,
  screenAudioTrack: null
};

export const VideoScreenInit = async (id, chid, _onPublished, _onStopped) => {
  appId = id;
  channelId = chid;
  onPublished = _onPublished;
  onStopped = _onStopped;

  // join screen share room.
  clientAudience = AgoraRTC.createClient({
    mode: "live",
    codec: "h264"
  });
  clientAudience.setClientRole("audience", {
    level: 1,
  });
  clientAudience.on("user-published", async (user, mediaType) => {
    await clientAudience.subscribe(user, mediaType);
    if (mediaType === 'video') {
      user.videoTrack.play("agora_video_screen", {
        fit: "contain"
      });
    }
    // ホストの場合は音声は受信しない
    if (mediaType === 'audio' && !clientHost) {
      user.audioTrack.play();
    }
    onPublished();
  });
  clientAudience.on("user-unpublished", (user, mediaType) => {
    onStopped();
  });
  const uid = await clientAudience.join(appId, channelId, null, null);
};

export const VideoScreenStart = async (id, _onPublished, _onStopped) => {
  clientHost = AgoraRTC.createClient({
    mode: "live",
    codec: "h264"
  });
  clientHost.setClientRole("host", {});

  let uid, screenTrack;
  [uid, localTracks.audioTrack, screenTrack] = await Promise.all([
    clientHost.join(appId, channelId, null, null),
    AgoraRTC.createMicrophoneAudioTrack(),
    AgoraRTC.createScreenVideoTrack({
      encoderConfig: "720p_2"
    }, "auto")
  ]);
  if (screenTrack instanceof Array) {
    localTracks.screenVideoTrack = screenTrack[0];
    localTracks.screenAudioTrack = screenTrack[1];
  } else {
    localTracks.screenVideoTrack = screenTrack;
  }
  localTracks.screenVideoTrack.play("video_screen_local");
  
  //bind "track-ended" event, and when screensharing is stopped.
  localTracks.screenVideoTrack.on("track-ended", () => {
    localTracks.screenVideoTrack && localTracks.screenVideoTrack.close();
    localTracks.screenAudioTrack && localTracks.screenAudioTrack.close();
    localTracks.audioTrack && localTracks.audioTrack.close();
    clientHost.leave();
    clientHost = null;
  });

  // publish local tracks to channel
  if (localTracks.screenAudioTrack == null) {
    await clientHost.publish([localTracks.screenVideoTrack, localTracks.audioTrack]);
  } else {
    await clientHost.publish([localTracks.screenVideoTrack, localTracks.audioTrack, localTracks.screenAudioTrack]);
  }
};

export const VideoScreenStop = async (id, _onPublished, _onStopped) => {
  for (trackName in localTracks) {
    var track = localTracks[trackName];
    if (track) {
      track.stop();
      track.close();
      localTracks[trackName] = undefined;
    }
  }
  await clientHost.leave();
};

export const VideoScreenTest = async (id, _onPublished, _onStopped) => {
  const elem = document.getElementById("video_screen");
  elem.setAttribute("style", "display:none;");
  elem.setAttribute("playsinline", "");
  elem.setAttribute("src", "/StreamingAssets/bbb.mp4");
  if (!window.navigator.userAgent.toLowerCase().indexOf("safari")) {
    elem.muted = true;
  } else {
    elem.muted = false;
  }
  elem.play();

  elem.addEventListener('ended', (event) => {
    _onStopped();0
  });
};
