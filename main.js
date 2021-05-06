const btn = document.getElementById('btn');
const form = document.getElementById('form');
const alertt = document.getElementById('alert');

const ip_text =  document.getElementById('ip_text');
const locationn = document.getElementById('location');
const timezonee = document.getElementById('tim');
const isp = document.getElementById('isp');

let current_ip = '' ;
let current_city = '';
let current_country_code = '';
let current_timezone_abbreviation = '';
let current_time = '';
let current_isp_name = '';

let latitude = 0.00 ;
let longitude = 0.00 ;


window.addEventListener('load' , () =>{
 
  callApi()

})

form.addEventListener('submit' , (e) =>{

   e.preventDefault()


  callApiSubmit()

})

// initial API call url
const api_key = '1e15d3d7a81f43eaab37ab477be05b84';
const IP_API_LINK = `https://ipgeolocation.abstractapi.com/v1/?api_key=${api_key}` ;
// initial API call function 
async function callApi(){

 const response = await fetch(IP_API_LINK);
 const data = await response.json();
 

current_ip = data.ip_address ;


ip_text.innerText = current_ip ;

 current_city = data.region ;
 current_country_code = data.country_code ;
 locationn.innerText = `${current_city} , ${current_country_code}`

current_timezone_abbreviation = data.timezone.abbreviation ;
current_time = data.timezone.current_time ;
timezonee.innerText = `${current_timezone_abbreviation} - ${current_time}`

current_isp_name = data.connection.isp_name ;
isp.innerText = current_isp_name;

latitude = data.latitude ;
longitude = data.longitude ;

setMap()

}

//setting up our map
// this function is called in previos 2 functions
function setMap(){
const map_container = document.getElementById('map_container');
const map_div = document.createElement('div');
map_div.id = "mapid" ;
$('#map_container').empty();
map_container.appendChild(map_div);


var map = L.map('mapid').setView([latitude,longitude], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
L.marker([latitude,longitude]).addTo(map)
    // .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    // .openPopup();
}

//submit API CALL (call with diferent ip address)



async function callApiSubmit(){

  // storing what user submit
  let current_ip_submit = document.getElementById('input_ip').value;
//
 if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(current_ip_submit))
  {
    console.log('good ip');
    alertt.style.display = 'none';
  } else {
    alertt.style.display = 'block';
    alert("You have entered an invalid IP address!");
    return
  }



//
  console.log(current_ip_submit);
  const IP_API_LINK_SUBMIT = `https://ipgeolocation.abstractapi.com/v1/?api_key=${api_key}&ip_address=${current_ip_submit}` ; // url for second call

try{
  const response = await fetch(IP_API_LINK_SUBMIT);
  const data = await response.json();

  current_ip = data.ip_address ;
  ip_text.innerText = current_ip ;
  
   current_city = data.region ;
   if(current_city == null){
    current_city = '????'
   } else {
    current_city = data.region ;
   }
   current_country_code = data.country_code ;
   locationn.innerText = `${current_city} , ${current_country_code}`
  
  current_timezone_abbreviation = data.timezone.abbreviation ;
  current_time = data.timezone.current_time ;
  timezonee.innerText = `${current_timezone_abbreviation} - ${current_time}`
  
  current_isp_name = data.connection.isp_name ;
  isp.innerText = current_isp_name;

latitude = data.latitude ;
longitude = data.longitude ;

   setNewMap();

  console.log('succes' ,data)
} catch (err) {
console.log( "error" , err)
}

}

function setNewMap(){

  const map_container = document.getElementById('map_container');
const map_div = document.createElement('div');
map_div.id = "mapid" ;
$('#map_container').empty();
map_container.appendChild(map_div);


var map = L.map('mapid').setView([latitude,longitude], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
L.marker([latitude,longitude]).addTo(map)
    // .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    // .openPopup();

}