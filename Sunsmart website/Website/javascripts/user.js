
function sendReqForStatus() {
    $.ajax({
        url: '/users/status',
        type: 'GET',
        headers: { 'x-auth': window.localStorage.getItem("token") },    
        responseType: 'json',
        success: statusResponse,
        error: function(jqXHR, status, error) {
          if (status === 401) {
              window.localStorage.removeItem("token");
              window.location = "../login.html";
          }
          else {
             $("#error").html("Error: " + error);
             $("#error").show();
          }
        }
    }); 
}

// Update page to display user's account information and list of devices with apikeys
function statusResponse(data,status,xhr) {
  // console.log(data);
    $("#main").show();
    $("#email").html(data.useremail);
    $("#fullName").html(data.username);
    $("deviceList").html("<h5>Devices</h5>");

for (var device of data.userDevices) {
      $("#addDeviceForm").before("<li class='collection-item'>ID: " +
         device + "</li>")
    }
}

// Registers the specified device with the server.
function registerDevice() {
    $.ajax({
        url: '/devices/register',
        type: 'POST',
        headers: { 'x-auth': window.localStorage.getItem("token") },   
        data: { useremail: $("#email").val(), deviceId: $("#deviceId").val() }, 
        responseType: 'json',
        success: deviceRegistered,
        error: function(jqXHR, status, error) {
            var response = JSON.parse(jqXHR.responseText);
            $("#error").html("Error: " + response.message);
            $("#error").show();

        }
    }); 
}

// Device successfully register. Update the list of devices and hide the add device form
function deviceRegistered(data, status, xhr) {
    // Add new device to the device list
    $("#addDeviceForm").before("<li class='collection-item'>ID: " +
    $("#deviceId").val() + ", APIKEY: " + data["apiKey"] + "</li>")
    hideAddDeviceForm();
}

function replaceDevice(){ 
    $.ajax({
        url: '/devices/register',
        type: 'POST',
        headers: { 'x-auth': window.localStorage.getItem("token") },   
        data: { useremail: $("#email").val(), deviceId: $("#newDeviceId").val() }, 
        responseType: 'json',
        success: newdeviceRegistered,
        error: function(jqXHR, status, error) {
            var response = JSON.parse(jqXHR.responseText);
            $("#error").html("Error: " + response.message);
            $("#error").show();
          }
        });

}

function newdeviceRegistered(data, status, xhr){
   $("#addDeviceForm").before("<li class='collection-item'>ID: " +
         $("#newDeviceId").val() + ", APIKEY: " + data["apiKey"] + "</li>")

    hideAddDeviceForm();

    var deldevice = $("#oldDeviceId").val();
    var tempurl = '/users/delete/device/' + deldevice;
    $.ajax({
        url: tempurl,
        type: 'DELETE',
        headers: { 'x-auth': window.localStorage.getItem("token") },   
        data: { useremail: $("#email").val(), deviceId: $("#newDeviceId").val() }, 
        responseType: 'json',
        success: newdeviceDeleted,
        error: function(jqXHR, status, error) {
            var response = JSON.parse(jqXHR.responseText);
            $("#error").html("Error: " + response.message);
            $("#error").show();
          }
        });
    location.reload();
    alert("Device id :" + $("#newDeviceId").val() + ", APIKEY: " + data["apiKey"]);
}

function newdeviceDeleted(data,status,xhr){
    $("#success").html("Success: " + data.message);
}


function updateData(){
   var updt = {
    username: $("#first_name").val(), 
    password: $("#password").val() 
   };
    $.ajax({
        url: '/users/updateinfo',
        type: 'PUT',
        headers: { 'x-auth': window.localStorage.getItem("token") },   
        data: JSON.stringify(updt), 
        contentType: 'application/json',
         }).done(function(data) {
        // Successfully updated
            $("#updateSuccess").html("Success: " + data.message);
            $("#updateSuccess").show();
                $.ajax({
                url: '/users/status',
                type: 'GET',
                headers: { 'x-auth': window.localStorage.getItem("token") },   
                responseType: 'json',
                }).done(function(data){
                      $("#email").html(data.useremail);
                      $("#fullName").html(data.username);
                })
    }).fail(function(jqXHR) {
        $("updateError").show();
        $("#updateError").html("Could not be updated.");
    });
}

function checkSpf() {
    $.ajax({
        url: '/users/viewIndex',
        type: 'GET',
        headers: {'x-auth': window.localStorage.getItem("token")},    
        responseType: 'json',
        success: spfResponse,
        error: function(jqXHR, status, error) {
          if (status === 401) {
              window.localStorage.removeItem("token");
              window.location = "../login.html";
          }
          else {
             $("#error").html("Error: " + error);
             $("#error").show();
          }
        }
    }); 
}

function spfResponse(data,status,xhr) {
  console.log(data);
  var skinType = $("#skinType").val();
  var uv = data.uv;
  var max_time;
  if (skinType==1){
    max_time = 67/uv; 
  }
    if (skinType==2){
    max_time = 100/uv; 
  }
    if (skinType==3){
    max_time = 200/uv; 
  }
    if (skinType==4){
    max_time = 300/uv; 
  }
    if (skinType==5){
    max_time = 400/uv; 
  }
  if (skinType==6){
    max_time = 500/uv; 
  }
  timeWithSpf = max_time* $("#spf").val();
  $("#skinResponse1").show();
  $("#skinResponse1").html(" Maximum time you can stay in the sun witout sun screen: " + max_time + " min");
  $("#skinResponse2").show();
  $("#skinResponse2").html(" Maximum time you can stay in the sun with sun screen: " + timeWithSpf + " min");
  // alert(" Maximum time you can stay in the sun witout sun screen: " + max_time + " min");
  // alert(" Maximum time you can stay in the sun with sun screen: " + timeWithSpf + " min");

}

function setActive() {
    $.ajax({
        url: '/users/setActive',
        type: 'POST',
        headers: { 'x-auth': window.localStorage.getItem("token") },   
        data: { deviceId: $("#activeDeviceId").val() }, 
        responseType: 'json',
        success: deviceActivated,
        error: function(jqXHR, status, error) {
            var response = JSON.parse(jqXHR.responseText);
            $("#error").html("Error: " + response.message);
            $("#error").show();

        }
    }); 
}

function idDelete(){
var deldevice = $("#deldeviceId").val();
    var tempurl = '/users/delete/device/' + deldevice;
    $.ajax({
        url: tempurl,
        type: 'DELETE',
        headers: { 'x-auth': window.localStorage.getItem("token") },   
        data: { useremail: $("#email").val(), deviceId: $("#deldeviceId").val() }, 
        responseType: 'json',
        success: deviceDeleted,
        error: function(jqXHR, status, error) {
            var response = JSON.parse(jqXHR.responseText);
            $("#error").html("Error: " + response.message);
            $("#error").show();
          }
        });
}

function deviceDeleted(data,status,xhr){
    location.reload();
    $("#success").html("Success: " + data.message);
}

function deviceActivated(data, status, xhr) {
    $("#success").html("Success: " + data.deviceId  + " has been set as active." );
}


function showDelForm() {
   $("#deldeviceId").val("");           // Clear the input for the device ID
   $("#delDevice").hide();    // Hide the add device link
   $("#delDeviceForm").slideDown();  // Show the add device form
}

// Show add device form and hide the add device button (really a link)
function showAddDeviceForm() {
   $("#deviceId").val("");           // Clear the input for the device ID
   $("#addDeviceControl").hide();    // Hide the add device link
   $("#addDeviceForm").slideDown();  // Show the add device form
}

function showActiveForm() {
   $("#activeDeviceId").val("");           // Clear the input for the device ID
   $("#activeDeviceBtn").hide();    // Hide the add device link
   $("#activeDeviceForm").slideDown();  // Show the add device form
}


// Hides the add device form and shows the add device button (link)
function hideAddDeviceForm() {
   $("#addDeviceControl").show();  // Show the add device link
   $("#addDeviceForm").slideUp();  // Show the add device form
   $("#error").hide();
}

function cancelDelete() {
   $("#delDevice").show();  // Show the add device link
   $("#delDeviceForm").slideUp();  // Show the add device form
   $("#error").hide();
}

// Show replace device form and hide the replace device button (really a link)
function showReplaceDeviceForm() {
   $("#oldDeviceId").val("");        // Clear the input for the old device ID
   $("#newDeviceId").val("");        // Clear the input for the new device ID
   $("#replaceDeviceControl").hide();    // Hide the add device link
   $("#replaceDeviceForm").slideDown();  // Show the add device form
}

function hideReplaceDeviceForm() {
   $("#replaceDeviceControl").show();  // Show the add device link
   $("#replaceDeviceForm").slideUp();  // Show the add device form
   $("#error").hide();
}

function cancelSpf() {
   // $("#replaceDeviceControl").show();
   $("#uvExposure").slideUp();
   $("#error").hide();
}

function cancelActive() {
   $("#activeDeviceBtn").show();
   $("#activeDeviceForm").slideUp();
   $("#error").hide();
}

// Handle authentication on page load
$(function() {
  if( !window.localStorage.getItem('token') ) {
    window.location = "../login.html";
  }
  else {
    sendReqForStatus();
  }
  
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
  
  // Register event listeners
  $("#addDevice").click(showAddDeviceForm);
  $("#registerDevice").click(registerDevice);   
  $("#cancel").click(hideAddDeviceForm);
  $("#replaceDevice").click(replaceDevice);   
  $("#replaceDeviceBtn").click(showReplaceDeviceForm);   
  $("#replaceCancel").click(hideReplaceDeviceForm);
  $("#update").click(updateData);
  $("#check").click(checkSpf);
  $("#uvCancel").click(cancelSpf);
  $("#setActive").click(showActiveForm);
  $("#setActiveBtn").click(setActive);
  $("#activeCancel").click(cancelActive);
  $("#delDevice").click(showDelForm);
  $("#delDeviceBtn").click(idDelete);
  $("#delCancel").click(cancelDelete);
});
