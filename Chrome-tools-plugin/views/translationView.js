let translationInnerHtml = `
    <div style="width:100%;height:100%">
        <iframe style="width:100%;height:100%" src='${translationConfig.src}'></iframe>
    <div>
    `;

var translation = new Dialog(translationInnerHtml,{width:'80vw',height:"80vh",left:'10vw',top:'10vh'});
let translationDom = document.getElementById(translation.dialogId);
viewsList["translation"] = translation;
