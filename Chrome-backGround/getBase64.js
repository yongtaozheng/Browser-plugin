$(function(){
    var db;
    var dbName = "bgImgDb",tableName = "bgImgList";
    let dbOpen = openDB(dbName,tableName);
    var localListData;
    function dbGet(key = 'localList'){
        getDataByKey(db, tableName, key).then(res => {
            localListData = res.data;
            init();
        }).catch(err => {
            console.log("err",err);
        })
    };
    function dbUpdate(data,img = ''){
        updateDB(db, tableName, {
            id:'localList',
            data:data
        });
        localListData = data;
        init(img);
    };
    function dbAdd(data){
        addData(db, tableName, {
            id:'localList',
            data:data
        });
    };
    dbOpen.then(res => {
        db = res;
        dbAdd([]);
        dbGet();
    }).catch(err => {
        console.log('err',err);
    })
    //-----------------数据库操作结束-------------------------------

    //保存图片
    const saveImg = function(img){
        let localList = localListData;
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
        dbUpdate(localList,img);
    };
    //base64分片
    const splitImgData = function(img){
        return img;
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
            let localList = localListData;
            localList.splice(ind,1);
            document.getElementById('img-show-list').innerHTML = '';
            dbUpdate(localList);
        }else{
            console.log('取消')
        }
    };
    //与浏览器端通信，保存图片列表一致
    function send(){ 
        chrome.tabs.query({active:true, currentWindow:true}, function (tab) {
            var state = $('#state');
            let list = document.getElementById('img-show-list');
            let localList = localListData;
            chrome.tabs.sendMessage(tab[0].id, {  
                action: "sendData",
                data:JSON.stringify(localList)
            }, function (response) {
                if(localListData.length == 0 && JSON.parse(response.state).length > 0){
                    localListData = JSON.parse(response.state);
                    dbUpdate(localListData)
                }
                // state.html(response.state)
            });
        })
    };
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            console.log(sender.tab ?
                        "from a content script:" + sender.tab.url :
                        "from the extension");
            if (request.greeting == "hello")
            sendResponse({farewell: "goodbye"});
            send();
        });
    //初始化页面
    function init(img = ''){
        let list = document.getElementById('img-show-list');
        let localList = localListData;
        if(img !== ''){
            createImg(img,localList.length - 1);
        }else{
            localList.map((item,index) => {
                createImg(item,index);
            });
        }
        function createImg(item,index){
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
            img.setAttribute('data-ind',index);
            img.setAttribute('title','删除该照片？');
            list.appendChild(img);
            img.onclick = deleteImg;
        };
        send();
    };
    //保存图片
    $('#save-local').click(function(){
        // let localList = localStorage.getItem('localList');
        let localList = localListData;
        // localList = localList ? JSON.parse(localList) : [];
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
        // localStorage.setItem('localList',JSON.stringify(localList));
        // init(img);
        dbUpdate(localList);
    })
})