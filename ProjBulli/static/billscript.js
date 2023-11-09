


var zArr
$.ajax({ 
  async: false,
  url: '/postdata', 
  type: 'GET', 
  contentType: 'application/json', 
  success: function(result) {
    zArr = JSON.parse(result)
    
  }
    
});
var id = 0;
for (let i = 0; i <= Object.keys(zArr).length; i++) {
  id = id + 1
  dragElement(document.getElementById(id));
  setElement(document.getElementById(id));
}





function setElement(elmnt){
  var pos1 = 0, pos2 = 0;
  var pArr
  $.ajax({ 
    async: false,
    url: '/returning', 
    type: 'GET', 
    contentType: 'application/json', 
    success: function(result) {
    pArr = JSON.parse(result)

    }
      
  });

 num = parseInt(elmnt.id) - 1
 pos1 = pArr[num][1]
 pos2 = pArr[num][2]
 fileName = pArr[num][3]

 var height;
 var width;
 var img = new Image()
 
 img.src = "static/images/"+fileName+"";
 height = Math.floor(parseInt(img.height)/4);
 width = Math.floor(parseInt(img.width)/4);
  elmnt.style.top = (pos1) + "px";
  elmnt.style.left = (pos2) + "px";
  $("#"+elmnt.id).css("background-image","url(static/images/"+fileName+")"); 
  $("#"+elmnt.id).css("background-size","cover"); 
  elmnt.style.width = width+"px";
  elmnt.style.height = height+"px";
}

  






function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0,  mousex = 0, mousey = 0, location1 = 0, location2 = 0; z = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
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
      data: JSON.stringify({ 'pid': postId ,'value1': location1, 'value2': location2 }), 
      
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

