
const myCryptoJS = CryptoJS;

const key = myCryptoJS.enc.Utf8.parse(secretConfig.key); //十六位十六进制数作为密钥
const iv = myCryptoJS.enc.Utf8.parse(secretConfig.iv); //十六位十六进制数作为密钥偏移量
const keyDES = myCryptoJS.enc.Utf8.parse(secretConfig.keyDES);
const ivDES = myCryptoJS.enc.Utf8.parse(secretConfig.ivDES);

//AES解密方法
const decryptAES = function (word) {
    //先进行base64解密
    let base64string = myCryptoJS.enc.Base64.parse(word.replace(/[\r\n]/g, '')); //解密之前先移除换行
    let base64Word = base64string.toString();
    let encryptedHexStr = myCryptoJS.enc.Hex.parse(base64Word);
    let srcs = myCryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = myCryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: myCryptoJS.mode.CBC, padding: myCryptoJS.pad.Pkcs7 });
    let decryptedStr = decrypt.toString(myCryptoJS.enc.Utf8);
    return decryptedStr.toString();
};

//AES加密
function encryptAES(word) {
    let srcs = myCryptoJS.enc.Utf8.parse(word); 
    console.log('myCryptoJS.AES',myCryptoJS.AES);
    let encrypted = myCryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: myCryptoJS.mode.CBC, padding: myCryptoJS.pad.Pkcs7 });
    return encrypted.toString();
};

// DES加密 
function encryptDES(word) {
    let srcs = myCryptoJS.enc.Utf8.parse(word);
    let encrypted = myCryptoJS.DES.encrypt(srcs, keyDES, { iv: ivDES, mode: myCryptoJS.mode.CBC, padding: myCryptoJS.pad.Pkcs7 });
    return encrypted.toString();
};

// DES解密
const decryptDES = function (word) {
    let base64string = myCryptoJS.enc.Base64.parse(word.replace(/[\r\n]/g, '')); //解密之前先移除换行
    let base64Word = base64string.toString();
    let encryptedHexStr = myCryptoJS.enc.Hex.parse(base64Word);
    let srcs = myCryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = myCryptoJS.DES.decrypt(srcs, keyDES, {
        iv: ivDES,
        mode: myCryptoJS.mode.CBC,
        padding: myCryptoJS.pad.Pkcs7
    });
    let decryptedStr = decrypt.toString(myCryptoJS.enc.Utf8);
    return decryptedStr.toString();
};

class JYeontuB64Coder {


    static encode(input) {
        var str = myCryptoJS.enc.Utf8.parse(input);
        return myCryptoJS.enc.Base64.stringify(str);
    }

    // public method for decoding
    static decode(input) {
        var words = myCryptoJS.enc.Base64.parse(input);
        return words.toString(myCryptoJS.enc.Utf8);
    }

    static encodeM2(input) {

        var output = JYeontuB64Coder.encode(input);
        if (output.length > 3) {
            var partPos = Math.floor(output.length / 3);
            var part1 = output.substr(0, partPos);
            var part2 = output.substr(partPos);
            return 'M' + part1 + 'A' + part2 + 'D';
        }
        return output;
    }

    static decodeM2(input) {
        var encodeStr;
        if (input.length > 6 && input.charAt(0) == 'M') {
            var pos = Math.floor(input.length / 3) - 1;
            var part1 = input.substr(1, pos);
            var part2 = input.slice(pos + 2, -1);
            encodeStr = part1 + part2;
        } else {
            encodeStr = input;
        }

        return JYeontuB64Coder.decode(encodeStr);
    }

    // AES解密
    static decodeAes(input) {
        return decryptAES(input);
    }
    // AES加密
    static encodeAes(input) {
        return encryptAES(input);
    }



    // DES 加密
    static encodeDes(input) {
        return encryptDES(input);
    }

    static decodeDes(input) {
        return decryptDES(input);
    }
}
window.JYeontuB64Coder = JYeontuB64Coder;