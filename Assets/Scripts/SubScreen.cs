using System;
using System.Collections;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using AOT;

using UnityEngine;
using UnityEngine.UI;

public class SubScreen : MonoBehaviour
{
    public string screenRoomId = "live";

    [SerializeField]
    public Renderer obj3d;
    private Texture2D _texture;
    public Texture2D defaultTexture;

    private static bool playing;

    [DllImport("__Internal")]
    private static extern void UpdateSubScreenTexture(int texture);

    [DllImport("__Internal")]
    private static extern void LiveSubScreenInit(Action onPublished, Action onStopped);

    public void Subscribe()
    {
      LiveSubScreenInit(onPublished, onStopped);
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
        UpdateSubScreenTexture((int)_texture.GetNativeTexturePtr());
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

