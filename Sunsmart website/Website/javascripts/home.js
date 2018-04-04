// Calculate the scollbar width .
$(window).on("load resize ", function() {
  var scrollWidth = $('.tbl-content').width() - $('.tbl-content table').width();
  $('.tbl-header').css({'padding-right':scrollWidth});
}).resize();

// Embed google maps
var map;
      function initMap() {
        map = new google.maps.Map(document.getElementById('googleMap'), {
          center: {lat: 32.248814, lng: -110.987419},
          zoom: 12
        });
        var marker = new google.maps.Marker({
		    position: {lat: 32.230933, lng: -110.949380},
		  });
		marker.setMap(map);
      }

// Toggle between showing and hiding the sidebar when clicking the menu icon
var mySidebar = document.getElementById("mySidebar");

function w3_open() {
    if (mySidebar.style.display === 'block') {
        mySidebar.style.display = 'none';
    } else {
        mySidebar.style.display = 'block';
    }
}

// Close the sidebar with the close button
function w3_close() {
    mySidebar.style.display = "none";
}

function features_fcn(){

  document.getElementById("features").style.display='block';
}


function weatherForecast(){
    var city = $("#cityName").val();
    var tempurl = '/users/weather/' + city;
      $.ajax({
        url: tempurl,
        type: 'GET',
        headers: { 'x-auth': window.localStorage.getItem("token") },    
        responseType: 'json',
        success: cityResponse,
        error: function(jqXHR, status, error) {
          if (status === 401) {
              window.localStorage.removeItem("token");
              window.location = "../login.html";
          }
          else if(status===403){
              $("#cityMsg").html("Error: " + error);
              $("#cityMsg").show();
            }
          else {
             $("#cityMsg").html("Error: " + error);
             $("#cityMsg").show();
          }
        }
    }); 
}

function cityResponse(data,status,xhr){
    var inner = "";
    for(var i=0; i<=2; i++){
        inner +=  "<tr> <td>"+ data[i].datetime+ "</td>" +
                  "<td>"+ data[i].max_temp+ "</td>" +
                  "<td>"+ data[i].min_temp+ "</td>" +
                  "<td>"+ data[i].wind_spd+ "</td>" +
                  "<td>"+ data[i].snow+ "</td>" +
                  "<td>"+ data[i].uv+ "</td>" +
                  "<td>"+ data[i].vis+ "</td> </tr>" ;
    }

    $("#cityTable").html(inner);
 
}

$(function() {
     $('.modal').modal({"backdrop":"static"});

      $("#okWeather").click(weatherForecast); 

     });
