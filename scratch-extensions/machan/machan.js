// This file is covered by the GNU General Public License.
// See the file COPYING for more details.
// Copyright (C) 2016 Masataka Shinke
(function(ext){
  var status=1;
  var receive=null;
  var websocket=null;
  var url=null;
  var name='Test Extension';
  // descriptor
  var descriptor={
    blocks:[
      [' ','connect %s','connect','ws://localhost:50000/'],
      [' ','send %s','send','{}'],
      ['r','status','status'],
      ['r','receive','receive'],
      [' ','close','close'],
      ['r','JSON_parse %s %s','JSON_parse','{}',''],
      ['r','guid','guid'],
      ['r','command %s','command','{"hello world"}','command'],
      ['r','script %s','script','{return "hello world";}']
    ],
    menus:{script_mode:['command','function']},
    url: 'https://Siping20160616.github.io/scratch-blocks/test'
  };
  // shutdown
  ext._shutdown=function(){
    Close();
  };
  // status
  ext._getStatus=function(){
    switch(status){
      case 0:
        return {status:0,msg:'Error'};
      case 1:
        return {status:1,msg:'Not Ready'};
      case 2:
        return {status:2,msg:'Ready'};
      default:
        return {status:1,msg:'Not Ready'};
    };
  };
  // connect block
  ext.connect=function(str){
    Connect(str);
  };
  // send block
  ext.send=function(str){
    Send(str);
  };
  // stataus block
  ext.status=function(){
    return status;
  };
  // receive block
  ext.receive=function(){
    return receive;
  };
  // close block
  ext.close=function(){
    Close();
  };
  // JSON_parse block
  ext.JSON_parse=function(str,item){
    try{
      return JSON.parse(str)[item];
    }
    catch(e){
      return null;
    };
  }
  // GUID
  ext.guid=function(){
    return guid();
  };
  // command block
  ext.command = function(str) {
    return eval(str);
  };
  // script block
  ext.script = function(str) {
    var script;
    eval('script=function(){'+str+'}');
    return script();
  };
  // Connect
  function Connect(str){
    if((url==str)&&(status==2))return;
    url=str;
    result=null;
    status=1;
    websocket=null;
    try {
      websocket=new WebSocket(str);
      websocket.onopen=onOpen;
      websocket.onclose=onClose;
      websocket.onerror=onError;
      websocket.onmessage=onMessage;
    }
    catch(e) {
      status=0;
    };
  };
  function onOpen(event){
    status=2;
  };
  function onClose(event){
    status=1;
    if(url!=null)Connect(url);
  };
  function onError(event){
    status=0;
    Connect(url);
  };
  function onMessage(event){
    if (event&&event.data){
      try{
        receive=event.data;
      }
      catch(e){
        receive='{"Error":"'+e+'"}';
      };
    };
  };
  // send
  function Send(str){
    if (status==2){
      try {
        websocket.send(str);
      }
      catch(e){
        return false;
      };
    };
    return true;
  };
  // clode
  function Close(){
    url=null;
    recive=null;
    websocket.close();
  };
  // guid
  function guid(){
    function s4(){
      return Math.floor((1+Math.random())*0x10000).toString(16).substring(1);
    };
    return s4()+s4()+'-'+s4()+'-'+s4()+'-'+s4()+'-'+s4()+s4()+s4();
  };
  // Register ScratchExtension
  ScratchExtensions.register(name,descriptor,ext);
})({});
