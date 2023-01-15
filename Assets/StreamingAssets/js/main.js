import { VoiceChatInit, VoiceChatJoinPublish, VoiceChatJoinSubscribe, VoiceChatPublish, VoiceChatUnpublish, VoiceChatLeave } from "./voicechat.js";
import { 
  LiveHostJoin,
  LiveHostLeave,

  LiveMainScreenInit,
  LiveSubScreenInit,
  LiveScreenshareStart,
  LiveScreenshareStop,
  LiveCameraStart,
  LiveCameraStop,
  LiveMicStart,
  LiveMicStop,
  VideoScreenTest,
} from "./live.js";

bindFunction('VoiceChatInit', (appIdPtr, callbackPtr) => {
  const appId = helperFunctions.UTF8ToString(appIdPtr)
  VoiceChatInit(appId, (str) => {
    // ヒープを確保してそれを渡す
    const bufferSize = helperFunctions.lengthBytesUTF8(str) + 1
    const buffer = Module._malloc(bufferSize)
    helperFunctions.stringToUTF8(str, buffer, bufferSize)

    // メソッドを実行する
    // viの部分はメソッドの引数や戻り値に応じて変更する
    Module.dynCall_vi(callbackPtr, buffer)

    // ヒープを解放する
    Module._free(buffer)
  });
});

bindFunction('VoiceChatJoinPublish', (roomIdPtr) => {
  const roomId = helperFunctions.UTF8ToString(roomIdPtr)
  VoiceChatJoinPublish(roomId);
});

bindFunction('VoiceChatJoinSubscribe', (roomIdPtr) => {
  const roomId = helperFunctions.UTF8ToString(roomIdPtr)
  VoiceChatJoinSubscribe(roomId);
})

bindFunction('VoiceChatPublish', (roomIdPtr) => {
  const roomId = helperFunctions.UTF8ToString(roomIdPtr)
  VoiceChatPublish(roomId);
})

bindFunction('VoiceChatUnpublish', (roomIdPtr) => {
  const roomId = helperFunctions.UTF8ToString(roomIdPtr)
  VoiceChatUnpublish(roomId);
})

bindFunction('VoiceChatLeave', (roomIdPtr) => {
  const roomId = helperFunctions.UTF8ToString(roomIdPtr)
  VoiceChatLeave(roomId);
})

bindFunction('LiveMainScreenInit', (appIdPtr, channelIdPtr, onPublishedPtr, onStoppedPtr) => {
  const appId = helperFunctions.UTF8ToString(appIdPtr)
  const channelId = helperFunctions.UTF8ToString(channelIdPtr)
  LiveMainScreenInit(appId, channelId, () => {
    Module.dynCall_v(onPublishedPtr)
  }, () => {
    Module.dynCall_v(onStoppedPtr)
  });
});

bindFunction('LiveSubScreenInit', (onPublishedPtr, onStoppedPtr) => {
  LiveSubScreenInit(() => {
    Module.dynCall_v(onPublishedPtr)
  }, () => {
    Module.dynCall_v(onStoppedPtr)
  });
});

bindFunction('LiveHostJoin', () => {
  LiveHostJoin();
});

bindFunction('LiveHostLeave', () => {
  LiveHostLeave();
});

bindFunction('LiveScreenshareStart', (onStoppedPtr) => {
  LiveScreenshareStart(() => {
    Module.dynCall_v(onStoppedPtr);
  });
});

bindFunction('LiveScreenshareStop', () => {
  LiveScreenshareStop();
});

bindFunction('LiveCameraStart', () => {
  LiveCameraStart();
});

bindFunction('LiveCameraStop', () => {
  LiveCameraStop();
});

bindFunction('LiveMicStart', () => {
  LiveMicStart();
});

bindFunction('LiveMicStop', () => {
  LiveMicStop();
});

bindFunction('VideoScreenTest', (filePtr, time, onPublishedPtr, onStoppedPtr) => {
  const file = helperFunctions.UTF8ToString(filePtr)
  VideoScreenTest(
    file,
    time,
    () => {
    Module.dynCall_v(onPublishedPtr)
  }, () => {
    Module.dynCall_v(onStoppedPtr)
  });
});
