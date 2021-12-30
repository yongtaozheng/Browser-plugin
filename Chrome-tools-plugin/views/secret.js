let secretInnerHTML = `
    <div id="mainContent" class="wrapper" style="font-size: large;">
        <div class="toolUsing clearfix">
            <div class="leftBar">
                <div class="title">明文:</div>
                <textarea name="message" id="msg_source" value="" class="text_source"></textarea>
            </div>

            <div class="operateLR" style="width:160px;margin: 100px 5px 0px;">
                <div class="OptDetail">
                    <label>加密算法:</label>
                    <ul>
                        <li style="width:150px;"><label for="aes" class="radio"><input type="radio" name="encrypt_type" value="aes" checked="checked" id="aes">AES(app后台)</label></li>
                        <li style="width:150px;"><label for="des" class="radio"><input type="radio" name="encrypt_type" value="des" checked="" id="des">DES(网优之家)</label></li>
                        <li style="width:150px;"><label for="base64" class="radio"><input type="radio" name="encrypt_type" value="base64" checked="" id="base64">Base64编/解码</label></li>
                        <li style="width:150px;"><label for="m2" class="radio"><input type="radio" name="encrypt_type" value="m2" checked="" id="m2">M2(密码加密)</label></li>
                        <li style="width:150px;"><label for="url" class="radio"><input type="radio" name="encrypt_type" value="url" checked="" id="url">URL解码</label></li>
                    </ul>
                </div>
                <div class="OptDetail Button">
                    <ul>
                        <li><button class="btn btn-primary encrypt-btn">加密 &gt;&gt; </button></li>
                        <li><button class="btn btn-primary decrypt-btn">&lt;&lt; 解密 </button></li>
                    </ul>
                </div>
            </div>

            <div class="rightBar">
                <div class="title">密文:</div>
                <textarea name="cipher" id="encrypt_result"></textarea>
            </div>
        </div>
    </div>
`
let secretPanelConfig = {
    height:'95vh',
    width:'95vw',
    left:'2vw',
    top:'2vh',
    backgroundImg:'https://i.loli.net/2021/08/17/J8G3sZNvcEP25XA.gif',
};
var secretPanel = new Dialog(secretInnerHTML,secretPanelConfig);
let secretPanelDom = document.getElementById(secretPanel.dialogId);
viewsList["secret"] = secretPanel;

let encryptBtn = secretPanelDom.getElementsByClassName('encrypt-btn')[0];
let decryptBtn = secretPanelDom.getElementsByClassName('decrypt-btn')[0];

encryptBtn.onclick = ()=>{
    encrypt();
};
decryptBtn.onclick = ()=>{
    decrypt();
};

//加密
function encrypt() {
    var type = $('input[name="encrypt_type"]:checked').val();
    var funcsMap = {
        'aes': value => MTB64Coder.encodeAes(value),
        'des': value => MTB64Coder.encodeDes(value),
        'base64': value => MTB64Coder.encode(value),
        'm2': value => MTB64Coder.encodeM2(value),
        'url':value => encodeURI(value),

    };
    var func = funcsMap[type];
    var soure = $("#msg_source").val();
    if (!func) {
        alert(`不存在${type}的加密方法`);
        return;
    }
    try {
        var result = func(soure);
        $("#encrypt_result").val(result);

    } catch (error) {
        alert(`加密失败：${error}`);
    }
}
//解密
function decrypt() {
    var type = $('input[name="encrypt_type"]:checked').val();
    var funcsMap = {
        'aes': value => MTB64Coder.decodeAes(value),
        'des': value => MTB64Coder.decodeDes(value),
        'base64': value => MTB64Coder.decode(value),
        'm2': value => MTB64Coder.decodeM2(value),
        'url':value => decodeURI(value),

    };
    var func = funcsMap[type];
    var decodeSoure = $('#encrypt_result').val();

    if (!func) {
        alert(`不存在${type}的解密方法`);
        return;
    }
    try {

        var decrptValue = func && func(decodeSoure);
        $("#msg_source").val(decrptValue);

    } catch (error) {
        alert(`解密失败：${error}`);
    }
}