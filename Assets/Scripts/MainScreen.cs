using System;
using System.Collections;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using AOT;

using UnityEngine;
using UnityEngine.UI;

public class MainScreen : MonoBehaviour
{
    public string screenRoomId = "live";

    [SerializeField]
    public Renderer obj3d;
    private Texture2D _texture;
    public Texture2D defaultTexture;

    private static bool playing;

    [DllImport("__Internal")]
    private static extern void UpdateMainScreenTexture(int texture);

    [DllImport("__Internal")]
    private static extern void LiveMainScreenInit(string appId, string roomId, Action onPublished, Action onStopped);
    [DllImport("__Internal")]
    private static extern void VideoScreenTest(Action onPublished, Action onStopped);

    public void Subscribe(string appId)
    {
      LiveMainScreenInit(appId, screenRoomId, onPublished, onStopped);
    }

    public void VideoTest()
    {
      VideoScreenTest(onPublished, onStopped);
    }

    void Start()
    {
    }

    void Update()
    {
      if (playing) {
        if (_texture)
        {
          Destroy(_texture);
        }
        _texture = new Texture2D(1, 1, TextureFormat.ARGB32, false); // jslib側で再生成されるので空で良い
        UpdateMainScreenTexture((int)_texture.GetNativeTexturePtr());
        obj3d.material.mainTexture = _texture;
      }
      else
      {
        obj3d.material.mainTexture = defaultTexture;
      }
    }

    [MonoPInvokeCallback(typeof(Action))]
    private static void onPublished() {
      playing = true;
    }

    [MonoPInvokeCallback(typeof(Action))]
    private static void onStopped() {
      playing = false;
    }
}
