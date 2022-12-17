const plugin = {}
const methodNames = [
    "VoiceChatInit",
    "VoiceChatJoinPublish",
    "VoiceChatJoinSubscribe",
    "VoiceChatPublish",
    "VoiceChatUnpublish",
    "VoiceChatLeave",
]

const helperFunctionNames = [
    'lengthBytesUTF8',
    'stringToUTF8',
    'UTF8ToString',
]

const helperFunctions = '{' + helperFunctionNames.map(x => `${x}:${x}`).join(',') + '}'

for (let i = 0; i < methodNames.length; i++) {
    const methodName = methodNames[i]
    plugin[methodName] = function () { alert("no method"); }
    plugin[methodName+'__postset'] = `_${methodName} = __unity_getBinding(Module, ${helperFunctions}, '${methodName}')`
}

mergeInto(LibraryManager.library, plugin)
