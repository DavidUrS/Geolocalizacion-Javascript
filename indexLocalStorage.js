
$(document).ready(function(){
  // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
  $('.modal-trigger').leanModal();
  $('.modalM').click()
});


var map, infoWindow, pos, marker

if ( navigator.geolocation ) {
  navigator.geolocation.getCurrentPosition(function (position) {
    pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    }
    initMap()
  })
} else {
  alert('Tu Navegador no soporta la Geolocalización')
}

function initMap() {
  var mapContainer = document.getElementById('map')
  var config = {
    center: {lat: -25, lng: -68},
    zoom: 5
  }
  map = new google.maps.Map(mapContainer, config)
  infoWindow = new google.maps.InfoWindow({ map: map })
  Agenda.init();
}

var button = document.getElementById('btn-geo')
button.addEventListener('click', function() {
  map.setCenter(pos)
  map.setZoom(15)
  // infoWindow.setPosition(pos)
  // infoWindow.setContent('Ubicación Encontrada')
  var markerOpts = {
    position: pos,
    map: map
  }
  marker = new google.maps.Marker(markerOpts)

})

///////////////////////////////////////////////////////////////////////

var Agenda = {
  init: function(){
    this.listenMapClick();
    this.sitiosGuardados = [];
    sessionStorage.setItem("sitios",JSON.stringify(this.sitiosGuardados));  //para guardar la session local
    this.loadSite();
	
  },
  listenMapClick: function(){
    var self = this;
    google.maps.event.addListener(map, 'click', function(ev){
      var position = ev.latLng;
      var modalInfo = document.getElementsByClassName('modalInfo')[0].click();
      var btnGuardar = document.getElementsByClassName('guardaInfo')[0];

      btnGuardar.onclick = function(e){
        e.preventDefault();
        var nombre = document.getElementsByClassName('nombre')[0];
        var descripcion = document.getElementsByClassName('descripcion')[0];
        var site = {
          nombre: nombre.value,
          descripcion: descripcion.value,
          latitud: position.lat(),
          longitud: position.lng()
        }

        self.saveAndPlaceMarker(site);
        nombre.value = '';
        descripcion.value = '';
        $('#modalCapture').closeModal();
      }
    })
  },

  saveAndPlaceMarker: function(site){
    if(localStorage.sitios){
      this.sitiosGuardados = JSON.parse(localStorage.getItem('sitios'));
    }

    this.sitiosGuardados.push(site);
    localStorage.setItem('sitios', JSON.stringify(this.sitiosGuardados));
	
    this.renderSite(site);
  },

  renderSite: function(site){
    var htmlInfo = '<li class="collection-item avatar">' +
    '<i class="material-icons circle blue">thumb_up</i>' +
    '<span class="title"> :nombre: </span>' +
    '<p> Latitud: :latitud: <br> Longitud: :longitud: <br> Descripcion: :descripcion:</p>'+
    '<a href="#!" class="secondary-content"><i class="material-icons">grade</i></a>'+
    '</li>';
    var newSite = htmlInfo;
    var result = newSite.replace(':nombre:', site.nombre)
                        .replace(':latitud:', site.latitud)
                        .replace(':longitud:', site.longitud)
                        .replace(':descripcion:', site.descripcion);
    var allSites = document.getElementsByClassName('guardados')[0];
    var markerOpts = {
      position: {
        lat: site.latitud,
        lng: site.longitud
      },
      map:map
    }
    var newMarker = new google.maps.Marker(markerOpts);
    allSites.innerHTML = allSites.innerHTML + result
  },

  loadSite: function(){
    if(localStorage.sitios){
      var sitios = JSON.parse(localStorage.getItem('sitios'));
      var self = this;
      sitios.map(function(site){
        self.renderSite(site);
		
      })
    }
	
  }
}
