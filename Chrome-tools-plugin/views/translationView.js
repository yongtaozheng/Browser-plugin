let translationInnerHtml = `
    <div style="width:100%;height:100%">
        <iframe style="width:100%;height:100%" src='${translationConfig.src}'></iframe>
    <div>
    `;

let initTranslation = () => {
    let translationDom = document.getElementById(translation.dialogId);
}
var translation = new Dialog(translationInnerHtml,{width:'80vw',height:"80vh",left:'10vw',top:'10vh'},initTranslation,2);
viewsList["translation"] = translation;
