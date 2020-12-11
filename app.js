var main= null;

class Main
{
  constructor(parentHtml)
  {
    this.parentHtml  = parentHtml;

    this.basePath    = "/api";

    this.serverStatus= null;
    this.subscriber  = [];
    this.callProfiles= [];
  }

  start()
  {
    this.fetchStatusServer();
    this.fetchSubscriber();
    this.fetchCallProfile();
  }

  send(req,data)
  {
    if ( authData && authData.session )
      req.setRequestHeader("Authorization",`Bearer ${authData.session.access_token}`)
      
    req.send(data);
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  fetchStatusServer()
  {
    var req= new HttpRequest("GET",`${this.basePath}/status/server`,this.onStatusServer,this);
    this.send(req,"");
  }

  onStatusServer(req)
  {
    if ( req.status == 200 )
    {
      document.body.appendChild(document.createTextNode(req.responseText));
      this.serverStatus= JSON.parse(req.responseText);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  fetchSubscriber(ref,category,rspFormat)
  {
    if ( !category )
      category= "status";

    if ( !rspFormat )
      rspFormat= "refs";

    var url= `${this.basePath}/${category}/subscribers`;
    
    if ( ref )
      url+= "/" + ref;

    var req= new HttpRequest("GET",url,this.onSubscriber,this);
    req.sbcrRef  = ref;
    req.category  = category;
    req.rspFormat= rspFormat;
    this.send(req,"");
  }

  onSubscriber(req)
  {
    if ( req.status != 200 )
    {
      console.error(`Fetching subscriber(s) failed: method=${req.method}, ref=${req.ref}, status=${req.status}`);
      return;
    }

    if ( req.ref )
    {
      var params= JSON.parse(req.responseText);
      this.updateSubscriber(params,req.ref,req.category,true);
    }
    else
    {
      var list= JSON.parse(req.responseText);

      for ( var i= 0; i < list.length; i++ )
      {
        if ( req.rspFormat == "refs" )
          this.fetchSubscriberParams(list[i],req.category);
        else
          this.updateSubscriber(list[i],req.ref,req.category);
      }

      this.invalidateSubscriber();
    }
  }

  updateSubscriber(params,ref,category,invalidate)
  {
    if ( !ref && params.data )
      ref= params.data.ref;

    if ( !ref )
    {
      console.error("Error updating subscriber: Reference is undefined!");
      return;
    }

    var subscriber= this.getSubscriber(ref);
        
    if ( !subscriber )
    {
      subscriber= new CSubscriber();
      this.subscriber.push(subscriber);
      document.body.appendChild(document.createTextNode(params));
    }

    if ( category == "data" )
      subscriber.setData(params);
    else
    if ( category == "status" )
      subscriber.setStatus(params);

    if ( invalidate )
      this.invalidateSubscriber(subscriber);
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  fetchCallProfile(ref,category,rspFormat)
  {
    if ( !category )
      category= "status";

    if ( !rspFormat )
      rspFormat= "refs";

    var url= `${this.basePath}/${category}/callProfiles`;
    
    if ( ref )
      url+= "/" + ref;

    var req= new HttpRequest("GET",url,this.onCallProfile,this);
    req.sbcrRef  = ref;
    req.category  = category;
    req.rspFormat= rspFormat;
    this.send(req,"");
  }

  onCallProfile(req)
  {
    if ( req.status != 200 )
    {
      console.error(`Fetching call profile(s) failed: method=${req.method}, ref=${req.ref}, status=${req.status}`);
      return;
    }

    if ( req.ref )
    {
      var params= JSON.parse(req.responseText);
      this.updateCallProfile(params,req.ref,req.category,true);
    }
    else
    {
      var list= JSON.parse(req.responseText);

      for ( var i= 0; i < list.length; i++ )
      {
        if ( req.rspFormat == "refs" )
          this.fetchCallProfile(list[i],req.category);
        else
          this.updateSubscriber(list[i],req.ref,req.category);
      }

      this.invalidateSubscriber();
    }
  }

  updateCallProfile(params,ref,category,invalidate)
  {
    if ( !ref && params.data )
      ref= params.data.ref;

    if ( !ref )
    {
      console.error("Error updating call profile: Reference is undefined!");
      return;
    }

    var callProfile= this.getCallProfile(ref);
        
    if ( !callProfile )
    {
      callProfile= new CCallProfile();
      this.callProfiles.push(callProfile);
      document.body.appendChild(document.createTextNode(params));
    }

    if ( category == "data" )
      callProfile.setData(params);
    else
    if ( category == "status" )
      callProfile.setStatus(params);

    if ( invalidate )
      this.invalidateCallProfile(callProfile);
  }

  fetchCallProfileRedirecton(ref)
  {
    var url= `${this.basePath}/status/callProfiles/${ref}/redirection`;
    var req= new HttpRequest("GET",url,this.onCallProfileRedirecton,this);
    req.cprfRef  = ref;
    this.send(req,"");
  }

  modifyCallProfileRedirection(ref,method,redirection)
  {
    var url = `${this.basePath}/status/callProfiles/${ref}/redirection`;
    var data= "";

    var req= new HttpRequest(method,url,this.onCallProfileRedirecton,this);
    req.cprfRef= ref;

    if ( redirection )
      data= JSON.stringify(redirection);
    
    this.send(req,data);
  }

  onCallProfileRedirecton(req)
  {
    if ( req.status != 200 )
    {
      console.error(`Fetching/Manipulating call profile redirection failed: method=${req.method}, ref=${req.ref}, status=${req.status}`);
      return;
    }

    var redirection= JSON.parse(req.responseText);

    if ( req.method == "GET" )
    {
      var callProfile= this.getCallProfile(req.cprfRef);
      callProfile.updateRedirection(redirection);
      this.invalidateCallProfile(callProfile);
    }
    else
      this.fetchCallProfileRedirecton(req.cprfRef);
  }

  invalidateSubscriber(subscriber)
  {

  }

  invalidateCallProfile(callProfile)
  {
    
  }
}

var authForm= document.querySelector("#authForm");       
document.body.removeChild(authForm);
main= new Main(document.body);
main.start();

