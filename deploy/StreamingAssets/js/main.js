bindFunction('JoinChat', (appIdPointer) => {
  const appId = helperFunctions.UTF8ToString(appIdPointer)

  const uid = Math.floor(Math.random() * 1000);
  const channelId = "test";

  let client = AgoraRTC.createClient({
    mode: "rtc",
    codec: 'vp8',
  });

  client.on("user-joined", (remoteUser) => {
      console.log("User: " + remoteUser.uid + " joined local channel");
  });
  client.on("user-left", (remoteUser) => {
    console.log(    "User: " + remoteUser.uid + " left local channel");
  });
  client.on("user-published", (remoteUser) => {
    console.log(remoteUser);
    client
    .subscribe(remoteUser, "audio")
    .then((remoteAudioTrack) => {
      remoteAudioTrack.play();
    })
    .catch((e) => {
      console.log("Failed to play audio!", e);
    });
  });

  // publish
  AgoraRTC.createMicrophoneAudioTrack()
  .then(async (track) => {
    await client
      .join(appId, channelId, null, uid)
      .then((uid) => {
        console.log(uid + " joined channel!");
      })
      .catch((e) => {
        console.log("Failed to join channel!", e);
      })
    await client
      .publish(track)
      .then(() => {
        console.log("Audio track successfully published");
      })
      .catch((e) => {
        console.log("Failed to publish audio track", e);
      });
  })
  .catch((e) => {
    console.log("Failed to play audio!", e);
  });
})
