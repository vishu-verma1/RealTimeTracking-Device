const socket = io();




if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (postion) => {
      const { longitude, latitude } = postion.coords;
      socket.emit("send-location", { longitude, latitude }); // fetching sending location from frontend to backend
    },
    (error) => {
      console.error(error);
    },

    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}

// Leaflet

const map = L.map("map").setView([0, 0], 15); //00 is center cordinates and 10 is level of zoom on the map

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

const markers = {};

socket.on("receive-location", function (data) {
  const { id, longitude, latitude } = data;
  map.setView([latitude, longitude]);

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
