
// Agora AppID
let appId = "";
let channelId = "";
let clientHostScreen = null;
let clientHostCamera = null;
let clientAudienceScreen = null;
let clientAudienceCamera = null;
let onPublishedMain = () => console.log("not set callback MainScreen onPublished");
let onStoppedMain = () => console.log("not set callback MainScreen onStopped");
let onPublishedSub = () => console.log("not set callback SubScreen onPublished");
let onStoppedSub = () => console.log("not set callback SubScreen onStopped");
var localTracks = {
  screenVideo: null,
  screenAudio: null,
  camera: null,
  mic: null,
};
let remoteTracks = {
  mainVideo: null,
  subVideo: null,
};

async function audienceScreenSubscribe() {
  // join screen share room.
  clientAudienceScreen = AgoraRTC.createClient({
    mode: "live",
    codec: "h264"
  });
  clientAudienceScreen.setClientRole("audience", {
    level: 1,
  });
  clientAudienceScreen.on("user-published", async (user, mediaType) => {
    await clientAudienceScreen.subscribe(user, mediaType);
    if (mediaType === 'video') {
      // ここでは画面共有を優先的にメインスクリーンに写します。
      if (!remoteTracks.mainVideo) {
        user.videoTrack.play("agora_main_screen", {
          fit: "contain"
        });
        remoteTracks.mainVideo = user.videoTrack;
        onPublishedMain();
      } else {
        // カメラがメインにいる場合はカメラをサブスクリーンに移す
        remoteTracks.subVideo = remoteTracks.mainVideo;
        await remoteTracks.subVideo.play("agora_sub_screen");

        user.videoTrack.play("agora_main_screen", {
          fit: "contain"
        });
        remoteTracks.mainVideo = user.videoTrack;
        onPublishedSub();
      }
    }
    // ホストの場合は音声は受信しない
    if (mediaType === 'audio' && !clientHostScreen && !clientHostCamera) {
      user.audioTrack.play();
    }
  });
  clientAudienceScreen.on("user-unpublished", async (user, mediaType) => {
    if (mediaType === "video") {
      // こちらがメインスクリーンで、サブスクリーンには何も配信していない場合
      if (!remoteTracks.subVideo) {
        onStoppedMain();
        remoteTracks.mainVideo = null;
      } else {
        // こちらがメインで、別の映像がサブスクリーンに流れている場合、そちらをメインに昇格させる
        onStoppedSub();
        remoteTracks.mainVideo = remoteTracks.subVideo;
        remoteTracks.subVideo = null;
        // await remoteTracks.mainVideo.stop();
        await remoteTracks.mainVideo.play("agora_main_screen");
      }
    }
  });
  const uid = await clientAudienceScreen.join(appId, channelId + "_s", null, null);
}
async function audienceCameraSubscribe() {
  // join screen share room.
  clientAudienceCamera = AgoraRTC.createClient({
    mode: "live",
    codec: "h264"
  });
  clientAudienceCamera.setClientRole("audience", {
    level: 1,
  });
  clientAudienceCamera.on("user-published", async (user, mediaType) => {
    await clientAudienceCamera.subscribe(user, mediaType);
    if (mediaType === 'video') {
      // ここでは画面共有を優先的にメインスクリーンに写します。
      if (!remoteTracks.mainVideo) {
        user.videoTrack.play("agora_main_screen", {
          fit: "contain"
        });
        remoteTracks.mainVideo = user.videoTrack;
        onPublishedMain();
      } else {
        user.videoTrack.play("agora_sub_screen", {
          fit: "contain"
        });
        remoteTracks.subVideo = user.videoTrack;
        onPublishedSub();
      }
    }
    // ホストの場合は音声は受信しない
    if (mediaType === 'audio' && !clientHostCamera && !clientHostCamera) {
      user.audioTrack.play();
    }
  });
  clientAudienceCamera.on("user-unpublished", async (user, mediaType) => {
    if (mediaType === "video") {
      // こちらがメインスクリーンで、サブスクリーンには何も配信していない場合
      if (!remoteTracks.subVideo) {
        onStoppedMain();
        remoteTracks.mainVideo = null;
      } else {
        // こちらがメインで、別の映像がサブスクリーンに流れている場合、そちらをメインに昇格させる
        onStoppedSub();
        remoteTracks.mainVideo = remoteTracks.subVideo;
        remoteTracks.subVideo = null;
        // await remoteTracks.mainVideo.stop();
        await remoteTracks.mainVideo.play("agora_main_screen");
      }
    }
  });
  const uid = await clientAudienceCamera.join(appId, channelId + "_c", null, null);
}

export const LiveMainScreenInit = async (id, chid, _onPublished, _onStopped) => {
  appId = id;
  channelId = chid;
  onPublishedMain = _onPublished;
  onStoppedMain = _onStopped;

  audienceScreenSubscribe();
  audienceCameraSubscribe()
};

export const LiveSubScreenInit = async (_onPublished, _onStopped) => {
  onPublishedSub = _onPublished;
  onStoppedSub = _onStopped;
};

export const LiveHostJoin = async() => {
  clientHostScreen = AgoraRTC.createClient({
    mode: "live",
    codec: "h264"
  });
  clientHostScreen.setClientRole("host", {});
  await clientHostScreen.join(appId, channelId + "_s", null, null);


  clientHostCamera = AgoraRTC.createClient({
    mode: "live",
    codec: "h264"
  });
  clientHostCamera.setClientRole("host", {});
  await clientHostCamera.join(appId, channelId + "_c", null, null);
};

export const LiveHostLeave = async () => {
  for (trackName in localTracks) {
    var track = localTracks[trackName];
    if (track) {
      track.stop();
      track.close();
      localTracks[trackName] = undefined;
    }
  }
  await clientHostScreen.leave();
  await clientHostCamera.leave();
};

export const LiveScreenshareStart = async (_onStopped) => {
  const screenTrack = await AgoraRTC.createScreenVideoTrack({
    encoderConfig: "720p_2"
  }, "auto")
  if (screenTrack instanceof Array) {
    localTracks.screenVideo = screenTrack[0];
    localTracks.screenAudio = screenTrack[1];
  } else {
    localTracks.screenVideo = screenTrack;
  }
  console.log(localTracks.screenVideo);
  localTracks.screenVideo.play("video_screen_local");
  
  // 画面共有が停止されたら配信も停止する
  localTracks.screenVideo.on("track-ended", async () => {
    // Unityの外で画面共有を停止した場合、Unity側へ通知する。
    _onStopped();

    if (localTracks.screenAudio == null) {
      await clientHostScreen.unpublish([localTracks.screenVideo]);
    } else {
      await clientHostScreen.unpublish([localTracks.screenVideo, localTracks.screenAudio]);
    }

    localTracks.screenVideo && localTracks.screenVideo.close();
    localTracks.screenAudio && localTracks.screenAudio.close();
    localTracks.screenAudio = null;
  });

  // publish local tracks to channel
  if (localTracks.screenAudio == null) {
    await clientHostScreen.publish([localTracks.screenVideo]);
  } else {
    await clientHostScreen.publish([localTracks.screenVideo, localTracks.screenAudio]);
  }
};

export const LiveScreenshareStop = async () => {
  if (localTracks.screenAudio == null) {
    await clientHostScreen.unpublish([localTracks.screenVideo]);
  } else {
    await clientHostScreen.unpublish([localTracks.screenVideo, localTracks.screenAudio]);
    localTracks.screenAudio.close();
    localTracks.screenAudio = null;
  }

  localTracks.screenVideo.close();
  localTracks.screenVideo = null;
};

export const LiveCameraStart = async () => {
  localTracks.camera = await AgoraRTC.createCameraVideoTrack();
  localTracks.camera.play("video_screen_local");
  await clientHostCamera.publish(localTracks.camera);
};

export const LiveCameraStop = async () => {
  await clientHostCamera.unpublish(localTracks.camera);

  localTracks.camera.close();
  localTracks.camera = null;
};

export const LiveMicStart = async () => {
  localTracks.micTrack = await AgoraRTC.createMicrophoneAudioTrack();
  clientHostCamera.publish(localTracks.micTrack);
}
export const LiveMicStop = () => {
  clientHostCamera.unpublish(localTracks.micTrack);
  localTracks.micTrack.close();
  localTracks.micTrack = null;
}

export const VideoScreenTest = async (file, time, _onPublished, _onStopped) => {
  const elem = document.getElementById("video_screen");
  elem.setAttribute("style", "display:none;");
  elem.setAttribute("playsinline", "");
  elem.setAttribute("preload", "auto"); // これを設定しないとブラウザは先頭の一部のデータしか読み込みません。
  elem.setAttribute("src", `/StreamingAssets/${file}`);
  if (!window.navigator.userAgent.toLowerCase().indexOf("safari")) {
    elem.muted = true;
  } else {
    elem.muted = false;
  }

  // スマホ回線などでは全部ロードしないので、裏側でこっそり再生させつつバッファがたまったらシークする
  elem.addEventListener('canplay', () => {
    // for debug
    elem.setAttribute("style", "display:block;");
    // elem.muted = false;
    
    elem.muted = true;
    elem.play();
  });
  elem.addEventListener('canplaythrough', () => {
    // PCのみでよければ preload = auto でこのイベントを待てば良い
    /*
    console.log("video test loadeddata. " + elem.readyState);
    elem.currentTime = time;
    elem.play();

    _onPublished();
    */
  })
  // データが読み込まれるたびにシークできるかチェックする。できなければ一番後ろにシークする。
  // elem.addEventListener('progress', (event) => {
  //   // firefox だと発動が遅い
  // });
  const timer = setInterval(() => {
    const timerange = elem.seekable;
    let start;
    let end;
    for (let count = 0; count < timerange.length; count++) {
      start = timerange.start(count);
      end = timerange.end(count);
      console.log(`progress ${count}: ${start} - ${end}`);
      if (start <= time && time <= end) {
        clearInterval(timer);

        // Unityの方に表示する
        elem.currentTime = time;
        const unmute = () => {
          elem.muted = false;
        }
        document.body.addEventListener("click", unmute);
        alert("再生準備ができました。再生ボタンをクリックしてください");

        _onPublished();
        return;
      }
    }
    // シーク可能でなければ最後まで飛ばす
    end = parseInt(end, 10) - 10;
    if (end > 0) {
      elem.currentTime = end;
    }
  }, 1000);

  elem.addEventListener('ended', (event) => {
    _onStopped();
  });

  elem.load();
};
