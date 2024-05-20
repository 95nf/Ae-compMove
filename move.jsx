var panelGlobal = this;
var dialog = (function () {
  // DIALOG
  // ======
  var dialog = (panelGlobal instanceof Panel) ? panelGlobal : new Window("palette"); 
      dialog.orientation = "column"; 
      dialog.alignChildren = ["center","top"]; 
      dialog.spacing = 10; 
      dialog.margins = 16; 

  var button1 = dialog.add("button", undefined, undefined, {name: "button1"}); 
      button1.text = "图层对齐"; 
      button1.alignment = ["center","top"];
      button1.onClick=layersAlign;

  var button2 = dialog.add("button", undefined, undefined, {name: "button2"}); 
      button2.text = "图层移动"; 
      button2.alignment = ["center","top"];
      button2.onClick=movecomp;

  var button3 = dialog.add("button", undefined, undefined, {name: "button3"}); 
      button3.text = "图层排列-顺序"; 
      button3.alignment = ["center","top"];
      button3.onClick=compIO1;

  var button4 = dialog.add("button", undefined, undefined, {name: "button4"}); 
      button4.text = "图层排列-倒序"; 
      button4.alignment = ["center","top"];
      button4.onClick=compIO2;

  dialog.layout.layout(true);
  dialog.layout.resize();
  dialog.onResizing = dialog.onResize = function () { this.layout.resize(); }

  if ( dialog instanceof Window ) dialog.show();

  return dialog;

}());

function compIO1(){
  var comp=app.project.activeItem;
  var layers=comp.selectedLayers;
  testComp(comp,layers);//检测是否合法
  
  var timeNow=comp.time;
  var firstSelLayer=layers[0];
  app.beginUndoGroup('图层排列-顺序')
  firstSelLayer.startTime=timeNow-firstSelLayer.inPoint+firstSelLayer.startTime;//第一图层对齐实现时间线
  for(var i=1;i<layers.length;i++){
      layers[i].inPoint=layers[i-1].outPoint;
  }
  app.endUndoGroup();
}

function compIO2(){//abandon
  var comp=app.project.activeItem;
  var layers=comp.selectedLayers;
  testComp(comp,layers);

  var timeNow=comp.time;
  var lastSelLayer=layers[layers.length-1];
  app.beginUndoGroup('图层排列-倒序');
  lastSelLayer.startTime=timeNow-lastSelLayer.inPoint+lastSelLayer.startTime;
  for(var i=layers.length-2;i>0;i--){
    layers[i].inPoint=layers[i+1].outPoint;
  }
  app.endUndoGroup();
}

function layersAlign() 
{
    var comp = app.project.activeItem;
    var layers=comp.selectedLayers;
    testComp(comp,layers);

    var timeNow = comp.time;
    app.beginUndoGroup('图层对齐');
    for (var i = 0,len=layers.length; i < len; i++)
    {
        var currentLayers=layers[i];
        var Inpoint=currentLayers.inPoint;
        var StartTime=currentLayers.startTime;
        currentLayers.startTime = timeNow - (Inpoint - StartTime);
    }
    app.endUndoGroup();
}

function movecomp()
{
  var comp=app.project.activeItem;
  var layers=comp.selectedLayers;
  testComp(comp,layers);

  var timeNow=comp.time;
  app.beginUndoGroup('图层移动')
  var layersStartSort=[];
  for(var i=0,len=layers.length;i<len;i++)
  {
    var currentLayers=layers[i];
    var inPoint=currentLayers.inPoint;
    layersStartSort.push(inPoint)
  }
  layersStartSort.sort(function(a,b)
  {
    if( a < b ) return -1;
    if( a > b ) return 1;
    return 0;
  })
  for(var i=0,len=layers.length;i<len;i++)
  {
    var currentLayers=layers[i];
    var startTime=currentLayers.startTime;
    layers[i].startTime=timeNow+startTime-layersStartSort[0];
  }
  app.endUndoGroup();
}
function testComp(comp,layers){
  if(!(comp&&comp instanceof CompItem)){
      alert("无效合成");
      return;
  }
  else if(!layers||layers.length===0){
      alert("无效图层");
      return;
  }
}
