// Unityから呼び出せされるのでグローバル空間に定義する必要がある
let Module = null
var helperFunctions = null
const functionMap = new Map()
function __unity_getBinding(module, _helperFunctions, methodName) {
    Module = module
    helperFunctions = _helperFunctions
    return functionMap.get(methodName)
}
function bindFunction(methodName, func) {
    functionMap.set(methodName, func)
}
