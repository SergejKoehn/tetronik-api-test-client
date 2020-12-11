function HttpRequest(method,url,callback,scope,type)
{
  this.AJAX    = null;
  this.method  = method;
  this.url     = url;
  this.callback= callback;
  this.scope   = scope;

  var that= this;

  if (window.XMLHttpRequest) 
    that.AJAX= new XMLHttpRequest();              
  else
    that.AJAX= new ActiveXObject("Microsoft.XMLHTTP");

  that.AJAX.onreadystatechange = function() 
  {  
    if ( that.AJAX.readyState == 4 ) 
    {    
      if ( that.callback != undefined )
        that.callback.call(that.scope,that.AJAX);
    }                                                      
  }     

  that.setRequestHeader= function(name,value)
  {
    that.AJAX.setRequestHeader(name,value);
  }

  that.send= function(data)
  {
    that.AJAX.send(data);
  }
  
  that.AJAX.open(that.method,that.url,true);

  if ( type )
    that.AJAX.setRequestHeader("Content-Type",type)
  else
    that.AJAX.setRequestHeader("Content-Type","application/json")
}