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
      button1.text = "对齐"; 
      button1.alignment = ["left","top"];
      button1.onClick=movecomp;

  dialog.layout.layout(true);
  dialog.layout.resize();
  dialog.onResizing = dialog.onResize = function () { this.layout.resize(); }

  if ( dialog instanceof Window ) dialog.show();

  return dialog;

}());

function movecomp() 
{
    var comp = app.project.activeItem;
    if (!(comp && comp instanceof CompItem)) 
    {
      alert('无效合成');
      return;
    }
    var layers=comp.selectedLayers;
    if (!layers || layers.length===0) 
    {
      alert('选择图层');
      return;
    }
    var timeNow = comp.time;
    app.beginUndoGroup('图层移动');
    for (var i = 0,len=layers.length; i < len; i++)
    {
        var currentLayers=layers[i];
        var Inpoint=currentLayers.inPoint;
        var StartTime=currentLayers.startTime;
        currentLayers.startTime = timeNow - (Inpoint - StartTime);
    }
    app.endUndoGroup();
}