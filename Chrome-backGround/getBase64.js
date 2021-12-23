$(function(){
    document.getElementById("ImgFile").onchange = function () {
        var file = this.files[0];
        r = new FileReader();  //本地预览
        r.onload = function(){
            document.getElementById('ImgBase64').value = r.result;

        }
        r.readAsDataURL(file);    //Base64
    }
    const deleteImg = function(){
        let r = confirm("您确定是否删除吗？");
        if (r==true){
            let ind = parseInt(this.getAttribute('data-ind'));
            let list = document.getElementById('img-show-list');
            let localList = localStorage.getItem('localList');
            localList = localList ? JSON.parse(localList) : [];
            localList.splice(ind,1);
            localStorage.setItem('localList',JSON.stringify(localList));
            document.getElementById('img-show-list').innerHTML = '';
            init();
        }else{
            console.log('取消')
        }
    };
    
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
                state.html(response.state)
                console.log('response.state',response.state);
                localStorage.setItem('localList',response.state);
            });
        })
    };
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
            img.src = item;
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
        send();
    };
    init();
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