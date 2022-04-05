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

function initMap() {
  
}


async function mainEvent() { // the async keyword means we can make API requests
  const form = document.querySelector('.main_form');

  // Select submit button
  const submit = document.querySelector('.submit_button');

  // Set submit button display to none
  submit.style.setProperty('display', 'none');

  const resto = document.querySelector('#resto_name');
  const zipcode = document.querySelector('#zipcode');

  //const results = await fetch('/api/foodServicesPG'); // This accesses some data from our API
  //const arrayFromJson = await results.json(); // This changes it into data we can use - an object


  let arrayFromJson = {data: []}; //to-do: remove debug tool


  // If statement that wraps form listener
  // This if statement prevents a race condition on loading data
  if (arrayFromJson.data.length > 0) {
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

      currentArray = dataHandler(arrayFromJson.data);
      console.table(currentArray);
      createHtmlList(currentArray);
    });
  }
}

// this actually runs first! It's calling the function above
document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests
