// elements
const btn = document.getElementById('btn');
const form = document.getElementById('form');
const errorText = document.getElementById('error-text');
const ip_text =  document.getElementById('ip_text');
const locationn = document.getElementById('location');
const timezonee = document.getElementById('tim');
const isp = document.getElementById('isp');
const input_ip = document.getElementById('input_ip')

// values
let current_ip = '' ;
let current_city = '';
let current_country_code = '';
let current_timezone_abbreviation = '';
let current_time = '';
let current_isp_name = '';
let latitude = 0.00 ;
let longitude = 0.00 ;

// logic properties
let isButtonDisabled = false;
let isLoading = false; 

// config
const api_key = '1e15d3d7a81f43eaab37ab477be05b84';
const IP_API_LINK = `https://ipgeolocation.abstractapi.com/v1/?api_key=${api_key}`;


// this call start application
InitGlobalLisenters()

function InitGlobalLisenters(){
  window.addEventListener('load' , () =>{
    callApi()
})

form.addEventListener('submit' , (event) =>{
 event.preventDefault()
  callApiSubmit()
})
}

async function callApi(){

  try {

    toggleLoading()
    const response = await fetch(IP_API_LINK);
    const data = await response.json();
    toggleLoading()

    InitResponseData(data)
    setNewMap()

  } catch (err) {
    handleNetworkError()
  }
 
}

async function callApiSubmit(){

  let current_ip_submit = document.getElementById('input_ip').value;

 if (isValidIp(current_ip_submit)){
    hideIpValidationError()
  } else {
    showIpValidationError()
    return;
  }

  const IP_API_LINK_SUBMIT = `https://ipgeolocation.abstractapi.com/v1/?api_key=${api_key}&ip_address=${current_ip_submit}`; 

try{
  toggleLoading()
  const response = await fetch(IP_API_LINK_SUBMIT);
  const data = await response.json();
  toggleLoading()

  InitResponseData(data)
  setNewMap();

} catch (err) {
   handleNetworkError()
}

}

function setNewMap(){

  clearAndEmptyMap()
  initMap()

}

function InitResponseData(data){
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
}

function clearAndEmptyMap(){
  const map_container = document.getElementById('map_container');
  const map_div = document.createElement('div');
  map_div.id = "mapid" ;
  $('#map_container').empty();
  map_container.appendChild(map_div);
}

function initMap(){
  var map = L.map('mapid').setView([latitude,longitude], 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  L.marker([latitude,longitude]).addTo(map)
}

function isValidIp(ip){
  const regexIp = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  return regexIp.test(ip);
}

function hideIpValidationError(){
  errorText.style.display = 'none';
}

function showIpValidationError(){
  errorText.style.display = 'block';
  promptUser("You have entered an invalid IP address!");
}

function promptUser(errorText){
  alert(errorText)
}

function handleNetworkError(){
  const errorText = "Error occurred , sorry for inconvenience";
  promptUser(errorText);
}

// start or stop loading animation
function toggleLoading(){
  isButtonDisabled = !isButtonDisabled;
  isLoading = !isLoading; 
  updateFormComponents()
}

function updateFormComponents(){
  btn.disabled = isButtonDisabled;
  input_ip.disabled = isButtonDisabled;
  // todo add max request timer validator
}