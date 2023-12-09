var postDict

function getPosts(){
  var zArr;
  $.ajax({ 
    url: '/returning', 
    type: 'GET', 
    contentType: 'application/json', 
    success: function(result) {
      zArr = JSON.parse(result)
      var id = 0;

      for (var i = 0; i < zArr.length; i++) {
        id = zArr[i][0]
        postDict = zArr
        header = "header" + id
        deleter = "delete" + id
        $('.posts').append('<div id='+id+' class = "indiv"><div id='+header+'> </div><div id='+deleter+' class = "deleter"></div> <div id = "'+id+'content"></div> </div></br>');

        document.getElementById(id).style.position = "absolute"

        document.getElementById(header).style.width = "10px"
        document.getElementById(header).style.height = "10px"
        document.getElementById(header).style.cursor = "move"
        document.getElementById(header).style.zIndex = "102"
        document.getElementById(header).style.backgroundSize = "cover"
        document.getElementById(deleter).style.position = "absolute"

        document.getElementById(deleter).style.top = "0px"
        document.getElementById(deleter).style.right = "0px"
        document.getElementById(deleter).style.width = "20px"
        document.getElementById(deleter).style.height = "20px"
        document.getElementById(deleter).style.zIndex = "101"
        document.getElementById(deleter).style.display = "block"
        
        setElement(document.getElementById(id), zArr, i);
        dragElement(document.getElementById(id));
        
        
  
      }
    }
      
  });
  
}
getPosts()
dragPage()



function setElement(elmnt, pArr, i){
  var pos1 = 0, pos2 = 0;
 var num = i
 pos1 = pArr[num][1]
 pos2 = pArr[num][2]
 fileName = pArr[num][3]
 text = pArr[num][4]
 psize = pArr[num][5]
 pwidth = pArr[num][6]
 pheight = pArr[num][7]
 psize = 10 - psize
 var height;
 var width;
 var img = new Image()
 if (fileName){
  img.src = "static/images/"+fileName+"";
  height = Math.floor(parseInt(img.height)/2);
  width = Math.floor(parseInt(img.width)/2);
  elmnt.style.top = (pos1) + "px";
  elmnt.style.left = (pos2) + "px";
  $("#"+elmnt.id).css("background-image","url(static/images/"+fileName+")"); 
  $("#"+elmnt.id).css("background-size","cover"); 
  $("#"+elmnt.id).css("box-shadow","rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px"); 
  if (pwidth && pheight){
    elmnt.style.height = pheight
    elmnt.style.width = pwidth
    
  }else {
    elmnt.style.width = width+"px";
    elmnt.style.height = height+"px";
 }
 //document.getElementById(elmnt.id).addEventListener("click", popup(elmnt));
  elmnt.onmousedown = popup;

 document.getElementById("pop").onmousedown = close;

}else {
  document.getElementById(header).style.marginLeft = "-20px"
  document.getElementById(elmnt.id+"content").innerHTML = text;
  $("#"+elmnt.id).css("box-shadow","rgba(0, 0, 0, 0.16) 0px 1px 4px, rgb(51, 51, 51) 0px 0px 0px 2px");
  //elmnt.style.width = "fit-content"
  
  //elmnt.style.height = "auto"
  elmnt.style.padding = "0px 20px 20px 20px"
  //elmnt.style.maxWidth = "500px"
  elmnt.style.top = (pos1) + "px";
  elmnt.style.left = (pos2) + "px";
  if (pwidth && pheight){
    elmnt.style.height = pheight
    elmnt.style.width = pwidth
    
  }else {
    elmnt.style.width = "100px";
    elmnt.style.height = "100px";
 }
} 

  document.getElementById("delete" + elmnt.id).addEventListener("click", deletepost);
  

  function popup(){
    toppos = elmnt.offsetTop
    leftpos = elmnt.offsetLeft
    index = getArrayPos(elmnt)
    if (pArr[index][4]){
    
      document.getElementById("pop").innerHTML = pArr[index][4]
      document.getElementById("pop").style.display = "block";
      document.getElementById("pop").style.padding = "15px";
      document.getElementById("pop").style.width = "fit-content";
      document.getElementById("pop").style.maxWidth = "400px";
      document.getElementById("pop").style.height = "fit-content";
      document.getElementById("pop").style.marginTop = toppos + "px";
      document.getElementById("pop").style.marginLeft = leftpos + "px";
      document.getElementById("pop").style.position = "relative";
    }
  }

  function getArrayPos(elmnt){
  
    for (var i = 0; i < postDict.length; i++) {
      
      id = postDict[i][0]
      if (elmnt.id == id){
        return i;
      }
  }
}
  function close(){
    
    document.getElementById("pop").style.display = "none";
  }

  function deletepost(){
    $.ajax({ 
      url: '/deletepost', 
      type: 'POST', 
      contentType: 'application/json', 
      data: JSON.stringify({ 'pid': elmnt.id}), 
      success: function(){
      window.location.reload();
     }
      
    });
  }
  
}





function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0,  mousex = 0, mousey = 0, location1 = 0, location2 = 0; z = 0;
  if (document.getElementById("header" + elmnt.id)) {
    // if present, the header is where you move the DIV from:
    document.getElementById("header" + elmnt.id).onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    //elmnt.onmousedown = dragMouseDown;
  }

  //document.getElementById("saveBtn").addEventListener("click", closeDragElement);

  function dragMouseDown(e) {
    e = e || window.event;
    e.stopPropagation();
    e.preventDefault();
    
    // get the mouse cursor position at startup:
    mousex = e.clientX;
    mousey = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
    $("#"+elmnt.id).delay(3000).css("z-index", "1");
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    
    pos1 =  mousex - e.clientX;
    pos2 = mousey - e.clientY;
    mousex = e.clientX;
    mousey = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

    location1 = elmnt.offsetTop - pos2
    
    location2 = elmnt.offsetLeft - pos1
  }


  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
    $("#"+elmnt.id).delay(3000).css("z-index", "0");
    

    postId = parseInt(elmnt.id)
  
    $.ajax({ 
      url: '/process', 
      type: 'POST', 
      contentType: 'application/json', 
      data: JSON.stringify({ 'pid': postId ,'value1': location1, 'value2': location2, 'width': elmnt.style.width, 'height': elmnt.style.height}), 
      
    });
  
  }

} 








function zoom(event) {
  event.preventDefault();

  scale += event.deltaY * -0.01;

  // Restrict scale
  pixels = toString(scale) + 'px';

  // Apply scale transform
  getElementById('bodyid').style.zoom = pixels;
}

