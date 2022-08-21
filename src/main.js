class AppHelper {

  static isValidIp(ip) {
    const regexIp = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    return regexIp.test(ip);
  }

  static promptUser(message) {
    // todo make snackbar
    alert(message)
  }

}

class AppMapHelper {

  // config
  api_key = '1e15d3d7a81f43eaab37ab477be05b84';
  IP_API_LINK = `https://ipgeolocation.abstractapi.com/v1/?api_key=${this.api_key}`;

  // dependency for this class
  dataHelper = null;

  constructor(dataHelper) {
    this.dataHelper = dataHelper;
  }

  clearAndEmptyMap() {
    const map_container = document.getElementById('map_container');
    const map_div = document.createElement('div');
    map_div.id = "mapid";
    $('#map_container').empty();
    map_container.appendChild(map_div);
  }

  initMap() {
    var map = L.map('mapid').setView(this.dataHelper.getLatAndLng(), 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    L.marker(this.dataHelper.getLatAndLng()).addTo(map)
  }

  getIpApiLinkSubmit() {
    return `https://ipgeolocation.abstractapi.com/v1/?api_key=${this.api_key}&ip_address=${this.dataHelper.currentIp()}`;
  }
}

class AppDataHelper {

  // elements
  btn = document.getElementById('btn');
  form = document.getElementById('form');
  errorText = document.getElementById('error-text');
  ip_text = document.getElementById('ip_text');
  locationn = document.getElementById('location');
  timezonee = document.getElementById('tim');
  isp = document.getElementById('isp');
  input_ip = document.getElementById('input_ip')

  // data
  latitude = 0.00;
  longitude = 0.00;
  current_ip = '';
  current_city = '';
  current_country_code = '';
  current_timezone_abbreviation = '';
  current_time = '';
  current_isp_name = '';

  // logic properties
  isButtonDisabled = false;
  isLoading = false;

  // static data
  currentCityPlaceholder = '????';
  invalidIpMessage = "You have entered an invalid IP address!";
  unhandledErrorMessage = "Error occurred , sorry for inconvenience";

  currentIp() {
    return this.input_ip.value;
  }

  getLatAndLng() {
    return [this.latitude, this.longitude];
  }

  handleResponseData(response) {
    this.current_ip = response.ip_address;
    this.ip_text.innerText = this.current_ip;

    this.current_city = response.region;
    if (this.current_city == null) {
      this.current_city = this.currentCityPlaceholder
    } else {
      this.current_city = response.region;
    }
    this.current_country_code = response.country_code;
    this.locationn.innerText = `${this.current_city} , ${this.current_country_code}`

    this.current_timezone_abbreviation = response.timezone.abbreviation;
    this.current_time = response.timezone.current_time;
    this.timezonee.innerText = `${this.current_timezone_abbreviation} - ${this.current_time}`

    this.current_isp_name = response.connection.isp_name;
    this.isp.innerText = this.current_isp_name;

    this.latitude = response.latitude;
    this.longitude = response.longitude;
  }

  handleNetworkError() {
    AppHelper.promptUser(this.unhandledErrorMessage);
  }

  validateIpAddress() {
    if (AppHelper.isValidIp(this.currentIp())) {
      this.hideIpValidationError()
      return true;
    } else {
      this.showIpValidationError()
      return false;
    }
  }

  // start or stop loading animation
  toggleLoading() {
    this.isButtonDisabled = !this.isButtonDisabled;
    this.isLoading = !this.isLoading;
    this.updateFormComponents()
  }

  // todo add max request timer validator
  updateFormComponents() {
    this.btn.disabled = this.isButtonDisabled;
    this.input_ip.disabled = this.isButtonDisabled;
  }

  hideIpValidationError() {
    this.errorText.style.display = 'none';
  }

  showIpValidationError() {
    this.errorText.style.display = 'block';
    AppHelper.promptUser(this.invalidIpMessage);
  }
}


// All DE needed for app to run
const dataHolder = new AppDataHelper();
const mapHelper = new AppMapHelper(dataHolder);


// this call start application
InitGlobalLisenters()

function InitGlobalLisenters() {
  window.addEventListener('load', () => {
    initPage()
  })

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    initPageWithFormData()
  })
}

async function initPage() {
  this.refreshPage();
}

async function initPageWithFormData() {
  if (!dataHolder.validateIpAddress()) {
    return;
  }
  this.refreshPage(mapHelper.getIpApiLinkSubmit());
}

async function refreshPage(url) {
  const serverUrl = url || mapHelper.IP_API_LINK;
  try {
    dataHolder.toggleLoading()
    const data = await fetchNewData(serverUrl)
    dataHolder.toggleLoading()

    dataHolder.handleResponseData(data)
    setNewMap();

  } catch (err) {
    dataHolder.handleNetworkError()
  }
}


async function fetchNewData(URL_STRING) {
  const response = await fetch(URL_STRING);
  return response.json();
}

function setNewMap() {
  mapHelper.clearAndEmptyMap()
  mapHelper.initMap()
}