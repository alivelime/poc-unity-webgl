using System.IO;
using UnityEngine;
using UnityEngine.Video;

public class HalfwayVideoPlayer : MonoBehaviour
{
    // VideoPlayerコンポーネント
    [SerializeField] private VideoPlayer _videoPlayer;

    // StreamingAssetsの動画ファイルへのパス
    [SerializeField] private string _streamingAssetsMoviePath;

    private bool isPrepared;
    private bool playing;

    private void Start()
    {
        // URL指定
        _videoPlayer.source = VideoSource.Url;

        // StreamingAssetsフォルダ配下のパスの動画をURLとして指定する
        _videoPlayer.url = Path.Combine(Application.streamingAssetsPath, _streamingAssetsMoviePath);

        // 読込完了時のコールバックを設定.
        _videoPlayer.prepareCompleted += PrepareCompleted;
        isPrepared = false;
        playing = false;
        _videoPlayer.Prepare();
    }
    public void WantPlay() {
      playing = true;
      // 読み込みが完了していなければ再生しない
      if (isPrepared) {
        Play();
      }
    }
    private void Play()
    {
      // 18分52秒から再生する
      //
      // *** 生成されるビデオタグが動画データを完全に読み込まないため、長いファイルでは動作しません。 ***
      // *** 代わりに MainScreen.VideoTest() にてJavaScriptにて制御する方法を参照ください
      //
        _videoPlayer.time = (8 * 60 + 52);
        _videoPlayer.Play();
    }

    // 読込完了時のコールバック.
    //
    // ただしメタデータしか読み込まないため、長いファイルの途中再生はできない。ブラウザにもよるが初めからもしくは1分程度。
    void PrepareCompleted(VideoPlayer _)
    {
        _videoPlayer.prepareCompleted -= PrepareCompleted;
        isPrepared = true;

        // 再生ボタンが押されていなければまだ再生はしない
        if (playing) {
          Play();
        }
    }
}
