const plugin = {}
const methodNames = [
    "VoiceChatInit",
    "VoiceChatJoinPublish",
    "VoiceChatJoinSubscribe",
    "VoiceChatPublish",
    "VoiceChatUnpublish",
    "VoiceChatLeave",

    "VideoScreenInit",
    "VideoScreenStart",
    "VideoScreenStop",
    "VideoScreenTest",
]

const helperFunctionNames = [
    'lengthBytesUTF8',
    'stringToUTF8',
    'UTF8ToString',
]
const helperFunctions = '{' + helperFunctionNames.map(x => `${x}:${x}`).join(',') + '}'

for (var i = 0; i < methodNames.length; i++) {
  var methodName = methodNames[i];
  plugin[methodName] = function () { alert("no method"); }
  plugin[methodName+'__postset'] = `_${methodName} = __unity_getBinding(Module, ${helperFunctions}, '${methodName}')`
}

plugin.UpdateScreenTexture = function (tex) {
  // set texture
  GLctx.deleteTexture(GL.textures[tex]);
  var t = GLctx.createTexture();
  t.name = tex;
  GL.textures[tex] = t;

  var elem = document.querySelector("#agora_video_screen video");
  if (!elem) {
    elem = document.getElementById("video_screen");
  }

  // target, texture
  GLctx.bindTexture(GLctx.TEXTURE_2D, GL.textures[tex]);
  GLctx.pixelStorei(GLctx.UNPACK_FLIP_Y_WEBGL, true); // flip up down.
  GLctx.texParameteri(GLctx.TEXTURE_2D, GLctx.TEXTURE_WRAP_S, GLctx.CLAMP_TO_EDGE);
  GLctx.texParameteri(GLctx.TEXTURE_2D, GLctx.TEXTURE_WRAP_T, GLctx.CLAMP_TO_EDGE);
  GLctx.texParameteri(GLctx.TEXTURE_2D, GLctx.TEXTURE_MIN_FILTER, GLctx.LINEAR);
  GLctx.texImage2D(GLctx.TEXTURE_2D, 0, GLctx.RGBA, GLctx.RGBA, GLctx.UNSIGNED_BYTE, elem);
}

mergeInto(LibraryManager.library, plugin)
