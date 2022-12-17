export const VoiceChatJoinPublish = async (roomId) => {
  if (!(await join(roomId))) {
    return false;
  }

  await publish(roomId);
};

export const VoiceChatJoinSubscribe = async (roomId) => {
  join(roomId);
};

export const VoiceChatPublish = async (roomId) => {
  await publish(roomId);
};

export const VoiceChatUnpublish = async (roomId) => {
  await unpublish(roomId);
};

export const VoiceChatLeave = async (roomId) => {
  await leave(roomId);
};


AgoraRTC.setArea({
  areaCode:"JAPAN"
})

// Agora.io AppID
let appId = "";
let rooms = {};
let callbackLastOne = () => {laert("no callbackLastOne().")};

export const VoiceChatInit = (id, callback) => {
  appId = id;
  callbackLastOne = callback;
};

async function join(roomId) {
  // 入室ずみチェック
  if (rooms.hasOwnProperty(roomId)) {
    console.log("already joined room. " + roomId);
    return false;
  }

  let client = AgoraRTC.createClient({
    mode: "rtc",
    codec: 'vp8',
  });

  const uid = Math.floor(Math.random() * 10000);
  let members = new Set();
  members.add(uid);
  rooms[roomId] = {
    client,
    members,
  };

  client.on("user-joined", (remoteUser) => {
    rooms[roomId].members.add(remoteUser.uid);
    console.log("User: " + remoteUser.uid + " joined local channel");
  });
  client.on("user-left", (remoteUser) => {
    rooms[roomId].members.delete(remoteUser.uid);
    console.log("User: " + remoteUser.uid + " left local channel");

    // 自分しか残っていない場合は部屋を閉じる
    if (rooms[roomId].members.size == 1) {
      try {
        callbackLastOne(roomId)
      } catch (e) {
        console.log(e);
      }
      leave(roomId);
    }
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

  await client.join(appId, roomId, null, uid)
  console.log(uid + " joined channel!");

  return true;
}

async function publish(roomId) {
  // 入室ずみチェック
  if (!rooms.hasOwnProperty(roomId)) {
    console.log("user not join room. " + roomId);
    return false;
  }
  const client = rooms[roomId].client;

  // 既にpublish済みかどうかのチェックは省く

  const track = await AgoraRTC.createMicrophoneAudioTrack()
  await client.publish(track)
  console.log("Audio track successfully published");
}

async function unpublish(roomId) {
  // 入室ずみチェック
  if (!rooms.hasOwnProperty(roomId)) {
    console.log("user not join room. " + roomId);
    return false;
  }
  const client = rooms[roomId].client;
  await client.unpublish();
}

async function leave(roomId) {
  // 入室ずみチェック
  if (!rooms.hasOwnProperty(roomId)) {
    console.log("user not join room. " + roomId);
    return false;
  }
  const client = rooms[roomId].client;
  await client.leave();
  delete rooms[roomId];
}

