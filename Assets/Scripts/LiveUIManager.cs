using System;
using System.Collections;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using AOT;

using UnityEngine;
using UnityEngine.UI;

public class LiveUIManager : MonoBehaviour
{
    // UI Button (callbackから呼び出すため一部はstatic)
    public static GameObject screenshareButtonOn;
    public static GameObject screenshareButtonOff;
    public GameObject _screenshareButtonOn;
    public GameObject _screenshareButtonOff;
    public GameObject cameraButtonOn;
    public GameObject cameraButtonOff;
    public GameObject micButtonOn;
    public GameObject micButtonOff;

    [DllImport("__Internal")]
    private static extern void LiveHostJoin();
    [DllImport("__Internal")]
    private static extern void LiveHostLeave();

    [DllImport("__Internal")]
    private static extern void LiveScreenshareStart(Action onStopped);
    [DllImport("__Internal")]
    private static extern void LiveScreenshareStop();

    [DllImport("__Internal")]
    private static extern void LiveCameraStart();
    [DllImport("__Internal")]
    private static extern void LiveCameraStop();
    [DllImport("__Internal")]
    private static extern void LiveMicStart();
    [DllImport("__Internal")]
    private static extern void LiveMicStop();

    public void Awake()
    {
       screenshareButtonOn = _screenshareButtonOn;
       screenshareButtonOff = _screenshareButtonOff;
    }
    public void OnEnable() 
    {
      LiveHostJoin();
    }
    public void OnDisable()
    {
      // 今はこのホストの退出処理はどこからも読んでいませんが、ライブ配信を終了する場合にはこの処理を呼びます
      LiveHostLeave();
    }

    public void Start() 
    {
    }

    public void Update() 
    {
    }

    public void ScreenShareStart() 
    {
        LiveScreenshareStart(onScreenshareStopped);

        screenshareButtonOn.SetActive(false);
        screenshareButtonOff.SetActive(true);
    }
    public void ScreenShareStop() 
    {
        LiveScreenshareStop();

        screenshareButtonOn.SetActive(true);
        screenshareButtonOff.SetActive(false);
    }

    public void CameraStart()
    {
        LiveCameraStart();

        cameraButtonOn.SetActive(false);
        cameraButtonOff.SetActive(true);
    }
    public void CameraStop()
    {
        LiveCameraStop();

        cameraButtonOn.SetActive(true);
        cameraButtonOff.SetActive(false);
    }

    public void MicStart()
    {
        LiveMicStart();

        micButtonOn.SetActive(false);
        micButtonOff.SetActive(true);
    }
    public void MicStop()
    {
        LiveMicStop();

        micButtonOn.SetActive(true);
        micButtonOff.SetActive(false);
    }

    // ユーザがUnity外の操作で画面共有を停止した場合のコールバック、ボタン表示を切り替える
    [MonoPInvokeCallback(typeof(Action))]
    private static void onScreenshareStopped() {
        screenshareButtonOn.SetActive(true);
        screenshareButtonOff.SetActive(false);
    }
}

