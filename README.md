# これは何?

できること

# 作成したもの

Agora Web SDK を用いたボイスチャットが行える。
部屋は一つのみ固定。

# 設定

- Canvas -> Panel のインスペクタから Agora.io の AppID を設定する

# 開発方法

[WebGLのプラグインをモダンに書く方法](https://qiita.com/yaegaki/items/71cdebc7798784aa3464) こちらの記事を参考にJSを切り出しUnityの再ビルドを不要にした。

## ディレクトリ構造

```shell
Assets
├── Plugins
│   ├── main.jslib
├── Scenes
├── Scripts
│   ├── UIManager.cs
├── StreamingAssets
│   ├── js
│   │   ├── lib.js
│   │   ├── main.js
├── WebGLTemplates
│   ├── Audience
│   │   ├── index.html
│   │   ├── thumbnail.png

# build成果物
deploy
├── Build
│   ├── deploy.data.gz
│   ├── deploy.framework.js.gz
│   ├── deploy.loader.js
│   └── deploy.wasm.gz
├── StreamingAssets
│   ├── UnityServicesProjectConfiguration.json
│   └── js
│       ├── lib.js
│       └── main.js
├── index.html
```

## 手順

まず、Plugins/main.jslib に外部JSとの汎用的な繋ぎ込み処理を記載する。
連携する関数名を追加していく。

```javascript
const methodNames = [
    "JoinChat",
    ...
    // ここではメソッド名のみ記載
]
```

次に呼び出すUnity側の処理を記載する。
dllimportにて定義し、使う箇所で呼び出す

```cs
using System.Runtime.InteropServices;
using UnityEngine;

public class UIManager : MonoBehaviour
{
    // Agora の App ID
    public string appId;

    ...

    [DllImport("__Internal")]
    private static extern void JoinChat(string str);

    public void OnClick() {
        JoinChat(appId);
        ...
    }
}
```

最後に行いたい処理を `Assets/StreamingAssets/js/main.js` に記載する。
bind関数にてUnityから呼び出せるようにする。

```javascript
bindFunction('JoinChat', (appIdPointer) => {
  const appId = helperFunctions.UTF8ToString(appIdPointer)
  ...
})
```

処理が長くなる場合は別モジュールに切り分ける。
新たに各処理はES Moduleとするのが良さそうなものの、UnityやAgoro SDKなどのCDNにて読み込む場合は適さないことがある。
その場合は、WebGLTemplatesにテンプレートとなるindex.htmlにてグローバルに読み込ませる必要がある。

Unityのビルドを必要としないJSの修正方法を次に記載する。

# 動かし方

以下の方法にてローカルのままスマホなどから確認できるようになります。

0. Ngrokをインストールする

```shell
# Mac の場合
$ make prepare

# 詳細は参考リンク1を参照
# ngrokにてアカウントを作成する
```

1. Unity にて Build and Run を行う
2. ポート番号をコピーする
4. ngrokを起動する

```shell
$ make tunnel PORT=[ポート番号]
```

以下のような画面が出るのでhttpsのURLをコピーし、他の端末などからアクセスする

```shell
ngrok by @inconshreveable                                                                                                                                                                                                                                                                                 (Ctrl+C to quit)
Session Status                online
Account                       eto@tokishirazu.llc (Plan: Free)
Version                       2.3.40
Region                        United States (us)
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://6fe7-2404-7a81-d220-9700-1c56-8810-4561-15cf.ngrok.io -> http://localhost:61776
Forwarding                    https://6fe7-2404-7a81-d220-9700-1c56-8810-4561-15cf.ngrok.io -> http://localhost:61776

Connections                   ttl     opn     rt1     rt5     p50     p90
                              9       0       0.03    0.02    15.00   22.23
```

5. ボタンをクリックするとボイスチャットが行えます。

6. ブラウザのコンソールなどから動作を確認する

## エラーの修正方法

まず、ビルド出力先である `deploy/js/*.js` のファイルが読み込まれているためこれらを直接編集することができる。
修正あとはブラウザにてページをリロードすれば変更はすぐに反映される。

注意点として、編集したファイル話元の `Assets/StreamingAssets/js/*.js` に戻すのを忘れないようにする。
そのため修正が終わったら以下のコマンドにて変更を保存する。

```shell
# deploy/js/*.js をAssetsの方にコピーする
$ make modified
```

#### 参考URL
- [【Unity】WebGLプラットフォームの動作確認を手軽にモバイル端末で実施する](https://zenn.dev/aya/articles/43d5cac4c954b0)
- [Testing a Unity WebGL Build on Mobile]()https://simmer.io/articles/testing-a-unity-webgl-build-on-mobile/
