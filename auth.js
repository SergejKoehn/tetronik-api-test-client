var authData= new Object();

authData.callback= function(isValid,token)
{
  if ( isValid )
  {
    authData.session= token;

    var htmlScript= document.createElement("script");
    htmlScript.src= `/client/app.js?access_token=${authData.session.access_token}`;
    document.body.appendChild(htmlScript);
  }
}

function authorize()
{
  authData.client_id    = document.querySelector("#clientId").value;       
  authData.client_secret= document.querySelector("#clientSecret").value;       
  authData.redirect_uri = "/client/redirect.html";
  authData.state        = Math.random();

  authUrl= `/oauth2/authorize?response_type=token&redirect_uri=${authData.redirect_uri}&client_id=${authData.client_id}&client_secret=${authData.client_secret}&state=${authData.state}`; 
  window.open(authUrl);
}

document.addEventListener("DOMContentLoaded", function(){
    document.querySelector("#btAuthorize").addEventListener("click",authorize);       
  }
); 