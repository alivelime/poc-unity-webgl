using System.Collections;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using UnityEngine;
using UnityEngine.UI;

public class UIManager : MonoBehaviour
{
    public string appId;

    [SerializeField] GameObject menuPanel;

    // Start is called before the first frame update
    void Start()
    {
        ShowMenu();
    }

    public void ShowMenu()
    {
        menuPanel.SetActive(true);
    }

    [DllImport("__Internal")]
    private static extern void JoinChat(string str);

    public void OnClick() {
        JoinChat(appId);
        menuPanel.SetActive(false);
    }
}
