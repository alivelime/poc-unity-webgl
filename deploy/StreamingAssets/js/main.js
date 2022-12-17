import { VoiceChatInit, VoiceChatJoinPublish, VoiceChatJoinSubscribe, VoiceChatPublish, VoiceChatUnpublish, VoiceChatLeave } from "./voicechat.js";

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
