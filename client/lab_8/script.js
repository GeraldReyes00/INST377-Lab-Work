function getRandomIntInclusive(min, max) {
  const newMin = Math.ceil(min);
  const newMax = Math.floor(max);
  // The maximum is inclusive and the minimum is inclusive
  return Math.floor(Math.random() * (newMax - newMin + 1) + newMin);
}

function dataHandler(dataArray) {
  console.table(dataArray); // this is called "dot notation"
  const range = [...Array(15).keys()];
  const listItems = range.map((item, index) => {
    const restNum = getRandomIntInclusive(0, dataArray.length - 1);
    return dataArray[restNum];
  });
    // console.log(listItems)
  return listItems;
}

function createHtmlList(collection) {
  console.table(collection);
  const targetList = document.querySelector('#resto-list');
  targetList.innerHTML = '';
  collection.forEach((item) => {
    const {name} = item;
    const displayName = name.toLowerCase();
    // const injectThisItem = `<li>${item.name}</li>`;
    const injectThisItem = `<li>${displayName}</li>`;
    targetList.innerHTML += injectThisItem;
  });
}

function initMap(name) {
  const latLong = [38.7849, -76.8721];
  const map = L.map(name).setView(latLong, 13);

  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
  }).addTo(map);

  return map;
}

function addMapMarkers(map, collection) {
  collection.forEach(item => {
    const point = item.geocoded_column_1?.coordinates;
    console.log(item.geocoded_column_1?.coordinates);
    L.marker([point[1], point[0]]).addTo(map);
  });
}


async function mainEvent() { // the async keyword means we can make API requests
  const form = document.querySelector('.main_form');

  // Select submit button
  const submit = document.querySelector('.submit_button');

  // Set submit button display to none
  submit.style.setProperty('display', 'none');

  const resto = document.querySelector('#resto_name');
  const zipcode = document.querySelector('#zipcode');
  const map = initMap('map');

  if (localStorage.getItem('restaurants') === null) {
    const results = await fetch('/api/foodServicesPG'); // This accesses some data from our API
    const arrayFromJson = await results.json(); // This changes it into data we can use - an object
    localStorage.setItem('restaurants', JSON.stringify(arrayFromJson));
  }
  

  const storedData = localStorage.getItem('restaurants');
  const storedDataArray = JSON.parse(storedData);


  //let arrayFromJson = {data: []}; //to-do: remove debug tool


  // If statement that wraps form listener
  // This if statement prevents a race condition on loading data
  if (storedDataArray.data.length > 0) {
    // Set submit button style to block
    submit.style.setProperty('display', 'block');

    let currentArray = [];

    resto.addEventListener('input', async (event) => {
      if (currentArray === undefined || currentArray.length < 1) {
        return;
      }
      console.log(event.target.value);

      const selectResto = currentArray.filter((item) => {
        const lowerName = item.name.toLowerCase();
        const lowerValue = event.target.value.toLowerCase();
        return lowerName.includes(lowerValue);
      });
      createHtmlList(selectResto);
      // console.log(matchResto);
    });

    zipcode.addEventListener('input', async (event) => {
      if (currentArray === undefined || currentArray.length < 1) {
        return;
      }
      console.log(event.target.value);

      const selectZip = currentArray.filter((item) => {
        // const lowerName = item.name.toLowerCase();
        // const lowerValue = event.target.value.toLowerCase();
        return item.zip.includes(event.target.value);
      });
      createHtmlList(selectZip);
      // console.log(matchResto);
    });


    form.addEventListener('submit', async (submitEvent) => { // async has to be declared all the way to get an await
      submitEvent.preventDefault(); // This prevents your page from refreshing!
      // console.log('form submission'); // this is substituting for a "breakpoint"
      // arrayFromJson.data - we're accessing a key called 'data' on the returned object
      // it contains all 1,000 records we need

      currentArray = dataHandler(storedDataArray.data);
      console.table(currentArray);
      createHtmlList(currentArray);
      addMapMarkers(map, currentArray);
    });
  }
}

// this actually runs first! It's calling the function above
document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests
