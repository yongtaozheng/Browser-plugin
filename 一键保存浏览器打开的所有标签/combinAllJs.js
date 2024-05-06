function obj2Style(e){var t=[];for(const n in e)t.push(n+":"+e[n]);return t.join(";")}function addBtn(e,t,n,i=document,o=!1,r={cursor:"pointer",color:"#068ec5","margin-left":"2em",border:"solid 1px",padding:"0.2em","border-radius":"0.5em"}){let s=e;(s="string"==typeof s?i.querySelector(e):s)&&!s.getElementsByClassName(t).length&&((e=i.createElement("span")).id=t,e.classList.add(t),i=obj2Style(r),e.style=i,e.innerText=t,e.onclick=n,o?s.parentNode.insertBefore(e,s):s.appendChild(e))}function getUrlParams(){let e=location.href.split("?");if(e.length<2)return{};var t={};for(const i of e=e[1].split("&")){var n=i.split("=");t[n[0]]=n[1]}return t}function getUrl(e,t){var n=[];for(const i in t)n.push(i+"="+t[i]);return e+"?"+n.join("&")}function getInnerText(e,t=document){t=t.querySelector(e);return t?t.innerText:""}function domObserver(e,t){new MutationObserver(function(e){e.forEach(function(e){"childList"===e.type&&0<e.addedNodes.length&&t&&t()})}).observe(e,{childList:!0})}if(!window.ExpandJY){class E{constructor(e={}){this.config=e,this.isOpen=!0,this.init()}init(){}obj2Style(e){var t=[];for(const n in e)t.push(n+":"+e[n]);return t.join(";")}generateBtn(e,t,n={margin:"auto",cursor:"pointer",color:"#5598EF","text-decoration":"underline"}){var i=document.createElement("span");return i.style=this.obj2Style(n),i.innerText=e,i.onclick=t,i}generate(e=this.config){var t=document.createElement("div"),n=(t.classList.add("ExpandJY"),this.generateHeader(e)),e=this.generateBody(e);return t.appendChild(n),t.appendChild(e),t}generateHeader(e=this.config){var t=document.createElement("div");t.classList.add("ExpandJYHeader"),t.style=this.obj2Style({display:"flex",width:"100%","border-bottom":"1px solid #e5dada"});let n=e.title||"标题";"string"==typeof n&&((o=document.createElement("div")).innerText=n,n=o),n.style.padding="10px 0",n.style.margin="0 10px",n.style.flex=1;var i=document.createElement("div"),o=this.generateBtn(this.isOpen?"收起":"展开",()=>{this.isOpenChange()}),o=(this.expandBtn=o,i.style=this.obj2Style({display:"flex",padding:"10px"}),i.append(o),e.btns||[]);for(const s of o){var r=this.generateBtn(s.text,s.cb,s.styleObj);i.append(r)}return t.appendChild(n),t.appendChild(i),t}generateBody(e=this.config){var t=document.createElement("div");t.classList.add("ExpandJYBody");let n=e.body||"容器";return"string"==typeof n&&((e=document.createElement("div")).innerText=n,n=e),t.appendChild(n),this.body=t}isOpenChange(){this.isOpen=!this.isOpen,this.expandBtn.innerText=this.isOpen?"收起":"展开",this.body.style.display=this.isOpen?"block":"none"}}window.ExpandJY=E,window.expandJY=new E}if(!window.ToastJY){class ca{constructor(e={}){this.config=e,this.pDom=null,this.init(e.pDom)}init(e=null){let t=document.body;e&&(t=e),this.pDom=t;var n=document.createElement("div"),i=(n.id="toastContainer",{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%, -50%)",background:"rgba(0, 0, 0, 0.8)",color:"#ffffff",fontSize:"16px",opacity:.7,transition:"opacity 0.3s ease-in-out",padding:"10px","border-radius":"5px",display:"none",textAlign:"center"});for(const d in i)n.style[d]=i[d];t.appendChild(n);var o=document.createElement("div"),r=(o.id="toastLoader",{border:"4px solid #f3f3f3",borderTop:"4px solid #3498db",borderRadius:"50%",width:"20px",height:"20px",animation:"spin 1s linear infinite",margin:"0 auto 10px",display:"none"});for(const l in r)o.style[l]=r[l];n.appendChild(o);var s=document.createElement("div"),a=(s.id="toastText",{marginTop:"5px"});for(const p in a)s.style[p]=a[p];n.appendChild(s);e=document.createElement("style");e.innerHTML=`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `,document.head.appendChild(e)}showToast(e){this.pDom.querySelector("#toastText").innerText=e,this.show(),setTimeout(()=>this.hide(),3e3)}showLoading(e="加载中..."){var t=this.pDom.querySelector("#toastLoader");this.pDom.querySelector("#toastText").innerText=e,t.style.display="block",this.show()}show(){this.pDom.querySelector("#toastContainer").style.display="block"}hide(){try{var e=document.querySelector("#toastContainer"),t=document.querySelector("#toastLoader");e.style.display="none",t.style.display="none"}catch(e){}}}window.ToastJY=ca,window.toastJY=new ca}console.log("欢迎使用 vue-chrome-extension-quickstart");