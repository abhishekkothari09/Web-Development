//send request to server
function sendreqfordemo(){
	var token = window.localStorage.getItem("token");
	// console.log(token);

	var xhr=new XMLHttpRequest();
	xhr.addEventListener("load",demo_response);
	xhr.response="json";
	// xhr.responseType = "json"; 
	// xhr.open("GET",'http://ec2-18-221-244-177.us-east-2.compute.amazonaws.com:3000/devices/temp/2b0032001147343438323536')
	xhr.open("GET",'/users/alluvinfo')
	xhr.setRequestHeader("x-auth", token);
	xhr.send();
}

//function for get response 
function demo_response(){
	var demobody=document.getElementById('demobody');
	var responseHTML;
	// console.log(this.response)
	// console.log(typeof(this.response))

	if (this.status===201){
		if(this.response===null){
			console.log("String is undefined")
		}
		else if(this.response===""){
			console.log("String is empty")
		}
		else{
			var new_response=JSON.parse(this.response);
			var length=new_response.message.length;
			console.log(this.response)
			for(var y=length-1;y>=0;y=y-1){
				var local_date = new Date(new_response.message[y].date).toString();
				new_response.message[y].date=local_date.replace("GMT-0800 (Pacific Standard Time)",'');
				// console.log(new_response);
				}
			responseHTML="<table>";
			responseHTML+="<tr>"+"<th>Device Id</th>"+"<th>Date</th>"+"<th>UV index</th>"+"<th>UV exposure</th>"+"</tr>";
			for(var x=length-1;x>=1;x=x-1){
				responseHTML+="<tr>"
				responseHTML+="<td>"+new_response.deviceId+"</td>"
				responseHTML+="<td>"+new_response.message[x].date+"</td>"
				responseHTML+="<td>"+new_response.message[x].uv+"</td>"
				responseHTML+="<td>"+new_response.message[x].exposure+"</td>"
			
				responseHTML+="</tr>"
				}
			responseHTML+="</table>"
			}
	}
	else {
		// Use a span with dark red text for errors
		responseHTML = "<span class='red-text text-darken-2'>";
		responseHTML += "Error: " + this.response.error;
		responseHTML += "</span>"
		}
demobody.innerHTML = responseHTML;
}

function set_active_alert(){
	var token = window.localStorage.getItem("token");
	var xhr=new XMLHttpRequest();
	xhr.addEventListener("load",set_active_alert_response);
	xhr.response="json";
	xhr.open("POST",'/users/activeAlert')
	xhr.setRequestHeader("x-auth", token);
	xhr.send();
}

function set_active_alert_response(){
	var demobody=document.getElementById('demobody');
	var responseHTML;
	if(this.status==201){
		responseHTML = "<span class='green'>";
		// responseHTML += this.response;
		responseHTML+="Alert activated successfully"
		responseHTML += "</span>"
		
	}
	else{
		responseHTML = "<span class='red-error>";
		responseHTML += "Error: " + this.response.error;
		responseHTML += "</span>"
	}
	demobody.innerHTML = responseHTML;
}

function set_cancel_alert(){
	var token = window.localStorage.getItem("token");
	var xhr=new XMLHttpRequest();
	xhr.addEventListener("load",set_cancel_alert_response);
	xhr.response="json";
	xhr.open("PUT",'/users/cancelAlert')
	xhr.setRequestHeader("x-auth", token);
	xhr.send();
}

function set_cancel_alert_response(){
	var demobody=document.getElementById('demobody');
	var responseHTML;
	if(this.status==201){
		responseHTML = "<span class='red'>";
		// responseHTML += this.response;
		responseHTML+="Alert canceled successfully"
		responseHTML += "</span>"
		
	}
	else{
		responseHTML = "<span class='red-error'>";
		responseHTML += "Error: " + this.response.error;
		responseHTML += "</span>"
	}
	demobody.innerHTML = responseHTML;
}



function view_UV_data_within_area(){
	var token = window.localStorage.getItem("token");
	var xhr=new XMLHttpRequest();
	xhr.addEventListener("load",view_UV_data_within_area_response);
	xhr.response="json";
	xhr.open("GET",'/users/weather/tucson')
	xhr.setRequestHeader("x-auth", token);
	xhr.send();

}

function view_UV_data_within_area_response(){
	var demobody=document.getElementById('demobody');
	var responseHTML;
	console.log(this.response)
	console.log(typeof(this.response))

	if (this.status===201){
		if(this.response===null){
			console.log("String is undefined")
		}
		else if(this.response===""){
			console.log("String is empty")
		}
		else{
			var new_response=JSON.parse(this.response);
			responseHTML="<p id=local_uv_index>The current UV index in your area is : "+new_response[0].uv+".</p><br><br>";
		
			responseHTML+='<img class="uvindex" src="images/uvindex.png" alt="uvindex">';
			}
	}
	else {
		// Use a span with dark red text for errors
		responseHTML = "<span class='red-error'>";
		responseHTML += "Error: " + this.response.error;
		responseHTML += "</span>"
		}
demobody.innerHTML = responseHTML;


}

function check_alert_and_send_alert_response(){
	// console.log("check_alert_and_send_alert_response complete")
	if(this.status==201){
		console.log("send check alert successful")
	}
	else{
		console.log(this.response.error);
	}

}
//send alert to server and may send email
function check_alert_and_send_alert(){
	var token = window.localStorage.getItem("token");

	var xhr=new XMLHttpRequest();

	xhr.addEventListener("load",check_alert_and_send_alert_response);

	xhr.response="json";

	xhr.open("GET",'/users/sendalertemail')
	xhr.setRequestHeader("x-auth", token);
	xhr.send();
	console.log("check_alert_and_send_alert complete")

}

function get_alert_state_response(){
	// console.log("get_alert_state_response complete")
	if(this.status==201){
		var new_response=JSON.parse(this.response);
		var ture_or_false=new_response.message;
		console.log(ture_or_false)
		if(ture_or_false==true){
			console.log("alert_state is true and send alert request")
			check_alert_and_send_alert();
		}
		else{
			console.log("alert_state is false")
		}
	}
}

//check the alert state
function get_alert_state(){
	var token = window.localStorage.getItem("token");

	var xhr=new XMLHttpRequest();

	xhr.addEventListener("load",get_alert_state_response);

	xhr.response="json";

	xhr.open("GET",'/users/getAlertStatus')
	xhr.setRequestHeader("x-auth", token);
	xhr.send();
	// console.log("get_alert_state complete")

}

$(document).ready(function(){
	setInterval(get_alert_state,5000);//5000 = 5seconds
	// console.log("ready complete")

});
