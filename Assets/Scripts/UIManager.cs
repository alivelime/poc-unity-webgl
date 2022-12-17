using System;
using System.Collections;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using AOT;

using UnityEngine;
using UnityEngine.UI;

public class UIManager : MonoBehaviour
{
    public string appId;
    public string roomId = "test1";

    // property
    public GameObject mainMenu;
    public Text mainMenuMessage;
    public GameObject subMenu;
    public GameObject publishButton;
    public GameObject unpublishButton;
    
    // static callbackから呼び出したいのでstatic変数にコピーする
    private static GameObject staticMainMenu;
    private static Text staticMainMenuMessage;
    private static GameObject staticSubMenu;

    [DllImport("__Internal")]
    private static extern void VoiceChatInit(string roomId, Action<string> callback);
    [DllImport("__Internal")]
    private static extern void VoiceChatJoinPublish(string roomId);
    [DllImport("__Internal")]
    private static extern void VoiceChatJoinSubscribe(string roomId);
    [DllImport("__Internal")]
    private static extern void VoiceChatPublish(string roomId);
    [DllImport("__Internal")]
    private static extern void VoiceChatUnpublish(string roomId);
    [DllImport("__Internal")]
    private static extern void VoiceChatLeave(string roomId);

    void Awake() {
      // プロパティをstatic変数にコピーしておく
      VoiceChatInit(appId, CallbackLastOne);
      staticMainMenu = mainMenu;
      staticMainMenuMessage = mainMenuMessage;
      staticSubMenu = subMenu;

      // メニュー初期化
      mainMenu.SetActive(true);
      subMenu.SetActive(false);
    }

    public void StartVoiceChat() {

      // TODO 8メートル以内に他の人がいるかどうかの判別はUnity側でお願いします。
      int[] memberIn8meter = new int[] { 1, 2, 3 };
      if (memberIn8meter.Length == 0) {
        // TODO 8メートル以内に誰もいないのでボイスチャットは開始しません
        return;
      }
      // TODO WebSocketにて部屋に入るようにします
      foreach (int member in memberIn8meter) {
        // ws_conn[member].send("enter-circle", roomId);
        // ws.on("enter-circle", (roomId) => {
        //   EnterChatCircle(roomId)
        // })
      }

      VoiceChatJoinPublish(roomId);

      // UI 切り替え
      mainMenu.SetActive(false);
      subMenu.SetActive(true);
      publishButton.SetActive(false);
      unpublishButton.SetActive(true);
    }
    public void EnterChatCircle() {
      VoiceChatJoinSubscribe(roomId);

      // UI 切り替え
      mainMenu.SetActive(false);
      subMenu.SetActive(true);
      publishButton.SetActive(true);
      unpublishButton.SetActive(false);
    }
    public void LeaveChatCircle() {
       VoiceChatLeave(roomId);
       // この結果、部屋に一人しか残っていない場合はAgora SDK経由のメッセージにて、対象者のCallbackLastOne() が呼び出されます。

      // UI 切り替え
      mainMenu.SetActive(true);
      subMenu.SetActive(false);
    }
    public void Publish() {
      // TODO 既にSubscribeしている前提とします。
      VoiceChatPublish(roomId);

      // UI 切り替え
      publishButton.SetActive(false);
      unpublishButton.SetActive(true);
    }
    public void Unpublish() {
      // TODO 既にpublishしている前提とします。
      VoiceChatUnpublish(roomId);

      // UI 切り替え
      publishButton.SetActive(true);
      unpublishButton.SetActive(false);
    }

    [MonoPInvokeCallback(typeof(Action<string>))]
    private static void CallbackLastOne(string roomId) {
      // 一人になった場合は自ら離脱して部屋を閉じる
      Debug.Log("最後の一人になったので部屋から離脱します。");

      // メニュー初期化
      staticMainMenu.SetActive(true);
      staticMainMenuMessage.text = "最後の一人になったので部屋から離脱します。";
      staticSubMenu.SetActive(false);

      // VoiceChatLeave(roomId); JS側で処理するのでここでは不要
    }
}
