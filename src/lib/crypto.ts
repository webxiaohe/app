import bip39 from "bip39"
import crypto from "crypto-browserify"

//解密
function decrption(i, p) {
    try {
        var decipher = crypto.createDecipher("aes-256-cbc", p)
        var dec = decipher.update(i, "hex", "utf8")
        dec += decipher.final("utf8")
        return dec
    } catch (e) {
        return null
    }
}

//获取随机私钥
export function getPhaseKey() {
    const mnemonic = bip39.generateMnemonic()
    return mnemonic
}

export function validateMnemonic (phaseKey) {
    return bip39.validateMnemonic(phaseKey)
}

//加密（助记词，交易密码）
export function encryption(str, pwd) {
    var cipher = crypto.createCipher("aes-256-cbc", pwd)
    str = cipher.update(str, "utf8", "hex")
    str += cipher.final("hex")
    return str
}

//获取主秘钥（加密后字符串，交易密码）
export function getRawSeed(seed, pwd) {
    return decrption(seed, pwd)
}