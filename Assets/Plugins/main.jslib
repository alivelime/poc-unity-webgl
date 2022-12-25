const plugin = {}
const methodNames = [
    "VoiceChatInit",
    "VoiceChatJoinPublish",
    "VoiceChatJoinSubscribe",
    "VoiceChatPublish",
    "VoiceChatUnpublish",
    "VoiceChatLeave",

    "VideoScreenInit",
]
const glMethods = [
    "UpdateScreenTexture",
]

const helperFunctionNames = [
    'lengthBytesUTF8',
    'stringToUTF8',
    'UTF8ToString',
]
const helperFunctions = '{' + helperFunctionNames.map(x => `${x}:${x}`).join(',') + '}'

for (const methodName of methodNames) {
    plugin[methodName] = function () { alert("no method"); }
    plugin[methodName+'__postset'] = `_${methodName} = __unity_getBinding(Module, ${helperFunctions}, '${methodName}')`
}

plugin.UpdateScreenTexture = function (tex) {
  // テクスチャ関連
  GLctx.deleteTexture(GL.textures[tex]);
  var t = GLctx.createTexture();
  t.name = tex;
  GL.textures[tex] = t;

  // target, texture
  GLctx.bindTexture(GLctx.TEXTURE_2D, GL.textures[tex]);
  GLctx.pixelStorei(GLctx.UNPACK_FLIP_Y_WEBGL, true); // デフォルトだと上下逆さまになる
  GLctx.texParameteri(GLctx.TEXTURE_2D, GLctx.TEXTURE_WRAP_S, GLctx.CLAMP_TO_EDGE);
  GLctx.texParameteri(GLctx.TEXTURE_2D, GLctx.TEXTURE_WRAP_T, GLctx.CLAMP_TO_EDGE);
  GLctx.texParameteri(GLctx.TEXTURE_2D, GLctx.TEXTURE_MIN_FILTER, GLctx.LINEAR);
  GLctx.texImage2D(GLctx.TEXTURE_2D, 0, GLctx.RGBA, GLctx.RGBA, GLctx.UNSIGNED_BYTE, document.getElementById("video_screen"));
}

mergeInto(LibraryManager.library, plugin)
