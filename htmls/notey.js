var notey = {};
notey = 
        {
    sel:function sel(sel)
    {
        if(sel.charAt(0)==="#")
            {
        var ob = document.getElementById(sel.substring(1,sel.length));
            }
            this.click= function ()
            {
                alert(ob);
            }
    },
            /*
             *Notes get method returns https response object recieved for the URL para
             -meter pased, to the callback function defined
             *in the function call like notey.get('url.html',function(data){alert(data)}); 
             */
            post:function(url,data,callback)
    {
        var http = new XMLHttpRequest();
        var i=0;
        	var fd = new FormData();    
               var keyArray=Object.keys(data);
               while(typeof(keyArray[i])!=='undefined')
                   {
                       fd.append(keyArray[i],data[keyArray[i]]);
                       i++;
                   }
                   http.open("post",url,true);
                    http.send(fd);
                    http.onreadystatechange = function() {//Call a function when the state changes.
		if(http.readyState === 4) {callback(http);}
}
    },
            get:function(url,callback)
    {
        var http = new XMLHttpRequest();
http.open("GET", url, true);
http.onreadystatechange = function() {
if(http.readyState === 4) {callback(http);}}
http.send(null);
    },notify:function(url,config,callback)
    {
    
    var element=document.getElementById('uq');
                if(element)
                    {
                        element.remove();
                    }
                var windowHeight=window.innerHeight , windowWidth = window.innerWidth;
                var divHeight=windowHeight-200, divWidth=windowWidth-300;
      var ele=document.createElement("div");
                document.getElementsByTagName('body')[0].appendChild(ele);
                                 ele.setAttribute('class',"raid");
                   if(typeof(config.width)!=='undefined' && typeof(config.height)!=='undefined')
                {
                divHeight=config.height, divWidth=config.width;
                var ddivHeight=(75*divWidth)/100;
                ddivHeight=divWidth/1.7;
                ele.style.width=config.width+'px';
                ele.style.minHeight=ddivHeight+'px';
                    }else
                        {
                ele.style.width=divWidth+'px';
                ele.style.height=divHeight+'px';
                        }
                ele.setAttribute('id',"uq");
                var divPos = ele.getBoundingClientRect();
                if(typeof(config.posClone)==='undefined'){
                ele.style.left=(windowWidth/2)-(divPos.width/2)+'px';
                ele.style.top=(windowHeight/2)-(divPos.height/2)+'px';
                }
                else
                    {
        var call = (config.posClone).getBoundingClientRect();
                ele.style.left=(call.right)-10+'px';
                ele.style.top=(call.bottom)-10+'px';
                ele.style.position="absolute";
                    }
                notey.backSurround();
                var closeDiv =document.createElement('div');
                ele.appendChild(closeDiv);
                closeDiv.setAttribute('class','close');
                closeDiv.addEventListener('click',function(){
                    notey.eleRemove('uq');
                     notey.backSurround();

                });
                var title = document.createElement('div');
                ele.appendChild(title); title.innerHTML="Title";
                 if(typeof(config.title)==='undefined'){title.innerHTML=' ';}else{title.innerHTML=config.title}
                title.setAttribute('class','title');
                var contentDiv = document.createElement('div');
                ele.appendChild(contentDiv);
                contentDiv.setAttribute('class','content');
                contentDiv.setAttribute('id','uq_content');
                contentDiv.style.top='30px';
                contentDiv.style.height=ele.getBoundingClientRect().height-35+'px';
                if(config.confirm)
                    {
                        var buttonSpace = document.createElement('div');
                        ele.appendChild(buttonSpace);
                        buttonSpace.setAttribute('class','buttonSpace');
                        var yesButton  =document.createElement('button');
                        var noButton =document.createElement('button');
                        yesButton.setAttribute('id','notify_confirm_yes');
                        noButton.setAttribute('id','notify_confirm_no');
                        noButton.innerHTML="Cancel";yesButton.innerHTML="Proceed";
                        noButton.addEventListener('click',function(e)
                    {callback(false);notey.eleRemove('uq');notey.backSurround();});
                    yesButton.addEventListener('click',function(e)
                    {callback(true); notey.eleRemove('uq');notey.backSurround();});
                        buttonSpace.appendChild(yesButton);
                        buttonSpace.appendChild(noButton);
                    }
                 if(typeof(config.expand)!=='undefined')
                     {
                   ele.style.overflowY=config.expand;
                     }
                if(typeof(config.iframe)!=='undefined')
                    {
                if(config.iframe)
                    {
                        var iframe=document.createElement('iframe');
                        contentDiv.appendChild(iframe);
                        iframe.setAttribute('class','iframe');
                        iframe.setAttribute('frameborder','0');
                        iframe.setAttribute('src',url);
                        iframe.style.height=contentDiv.getBoundingClientRect().height+"px";
                       iframe.style.width=contentDiv.getBoundingClientRect().width+"px";  
                    }
                    else if(typeof(config.text)!=='undefined')
                    {
                   contentDiv.innerHTML=config.text;
                    }
                    else
                        {
                           notey.get(url,function(data){
                           contentDiv.innerHTML=data.responseText;}); 
                        }
  
            }
            else
                {
                                notey.get(url,function(data){
                                contentDiv.innerHTML=data.responseText;});
                }
    },eleRemove:function(id)
    {
        document.getElementById(id).remove();
    }
    ,backSurround:function()
    {
        if(!document.getElementById('bckSrnd'))
        {
        var bckSrnd = document.createElement('div');
                bckSrnd.setAttribute('class','bckSrnd');
                bckSrnd.setAttribute('id','bckSrnd');
                document.getElementsByTagName('body')[0].appendChild(bckSrnd);
        }
        else
        {
            notey.eleRemove('bckSrnd');
        }
    }
        };

 
