$(function(){
    //保存图片
    const saveImg = function(img){
        let localList = localStorage.getItem('localList');
        localList = localList ? JSON.parse(localList) : [];
        console.log('saveImg',img);
        for(let i = 0; i < localList.length; i++){
            let src = localList[i];
            if(Array.isArray(src)){
                src = src.join('');
            }
            let imgSrc = img;
            Array.isArray(imgSrc) ? imgSrc = imgSrc.join('') : '';
            if(src == imgSrc){
                alert("请不要上传重复照片！");
                return;
            }
        }
        localList.push(img);
        localStorage.setItem('localList',JSON.stringify(localList));
        init(img);
    };
    var db;
    const initDb = function(){
        let openRequest = window.indexedDB.open('imgDb', 2);
        openRequest.onupgradeneeded = function (event) {
            db = event.target.result;
            var objectStore;
            if (!db.objectStoreNames.contains('bgImgList')) {
              objectStore = db.createObjectStore('bgImgList', { keyPath: 'id' });
            }
            // dbAdd();
          }
          
          openRequest.onsuccess = function (e) {
            console.log('Success!');
            db = openRequest.result;
          }
          
          openRequest.onerror = function (e) {
            console.log('Error');
            console.log(e);
          }
    };
    // initDb();
    let dbAdd = function() {
        var request = db.transaction(['imgDb'], 'readwrite')
          .objectStore('bgImgList')
          .add({ id: 1, name: '张三', age: 24, email: 'zhangsan@example.com' });
      
        request.onsuccess = function (event) {
          console.log('数据写入成功');
        };
      
        request.onerror = function (event) {
          console.log('数据写入失败');
        }
      }
    //base64分片
    const splitImgData = function(img){
        let res = [];
        if(img.length > 999999){
            let i = 0;
            while(i < img.length){
                let r = Math.min(i + 999999,img.length)
                res.push(img.slice(i,r));
                i = r;
            }
            return res;
        }
        return img;
    };
    //监听图片上传
    document.getElementById("ImgFile").onchange = function () {
        var file = this.files[0];
        r = new FileReader();  //本地预览
        r.onload = function(){
            // document.getElementById('ImgBase64').value = r.result;
            console.log(r.result.length);
            let img = splitImgData(r.result);
            saveImg(img);
        }
        r.readAsDataURL(file);    //Base64
    }
    //删除图片
    const deleteImg = function(){
        let r = confirm("您确定是否删除吗？");
        if (r==true){
            let ind = parseInt(this.getAttribute('data-ind'));
            let list = document.getElementById('img-show-list');
            let localList = localStorage.getItem('localList');
            localList = localList ? JSON.parse(localList) : [];
            doDelete(localList[ind]);
            localList.splice(ind,1);
            localStorage.setItem('localList',JSON.stringify(localList));
            document.getElementById('img-show-list').innerHTML = '';
            init();
        }else{
            console.log('取消')
        }
    };
    //与浏览器端通信，保存图片列表一致
    const send = function(){ 
        chrome.tabs.query({active:true, currentWindow:true}, function (tab) {
            var state = $('#state');
            let list = document.getElementById('img-show-list');
            let localList = localStorage.getItem('localList');
            localList = localList ? JSON.parse(localList) : [];
            chrome.tabs.sendMessage(tab[0].id, {  
            action: "sendData",
            data:JSON.stringify(localList)
            }, function (response) {
                // state.html(response.state)
                localStorage.setItem('localList',response.state);
            });
        })
    };
    const addImg = function(img){ 
        chrome.tabs.query({active:true, currentWindow:true}, function (tab) {
            var state = $('#state');
            let list = document.getElementById('img-show-list');
            let localList = localStorage.getItem('localList');
            localList = localList ? JSON.parse(localList) : [];
            chrome.tabs.sendMessage(tab[0].id, {  
            action: "addImg",
            data:JSON.stringify(img)
            }, function (response) {
                state.html(response.state)
                localStorage.setItem('localList',response.state);
            });
        })
    };
    //与浏览器端通信，删除图片
    const doDelete = function(img){ 
        chrome.tabs.query({active:true, currentWindow:true}, function (tab) {
            var state = $('#state');
            chrome.tabs.sendMessage(tab[0].id, {  
            action: "deleteData",
            data:img
            }, function (response) {
                state.html(response.state)
            });
        })
    };
    //初始化页面
    const init = function(img = ''){
        let list = document.getElementById('img-show-list');
        let localList = localStorage.getItem('localList');
        localList = localList ? JSON.parse(localList) : [];
        let ind = 0;
        if(img !== ''){
            localList = [img];
            ind = localList.length;
        }
        localList.map((item,index) => {
            let img = document.createElement('img');
            let src = item;
            if(Array.isArray(src)){
                src = src.join('');
            }
            img.src = src;
            img.style.width = "30%";
            img.style.height = "auto";
            img.style.opacity = "0.6";
            img.style.marginLeft = "2%";
            img.style.marginBottom = "5px";
            img.setAttribute('data-ind',index + ind);
            img.setAttribute('title','删除该照片？');
            list.appendChild(img);
            img.onclick = deleteImg;
        });
        console.log(img == '');
        if(img == '') send();
        else addImg(img);
    };
    send();
    init();
    //保存图片
    $('#save-local').click(function(){
        let localList = localStorage.getItem('localList');
        localList = localList ? JSON.parse(localList) : [];
        let img = document.getElementById('ImgBase64').value;
        if(img.trim().length == 0){
            alert("请先选择图片");
            return;
        }else{
            for(let i = 0; i < localList.length; i++){
                if(localList[i] == img){
                    alert("请不要上传重复照片！");
                    return;
                }
            }
            localList.push(img);
        }
        localStorage.setItem('localList',JSON.stringify(localList));
        init(img);
    })
})