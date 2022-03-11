function getRandomIntInclusive(min, max) {
  const newMin = Math.ceil(min);
  const newMax = Math.floor(max);
  // The maximum is inclusive and the minimum is inclusive
  return Math.floor(Math.random() * (newMax - newMin + 1) + newMin);
}

function dataHandler(dataArray) {
  console.table(dataArray); // this is called "dot notation"
  const range = [...Array(15).keys()];
  range.forEach((item) => {
    console.log('range item', item);
  });
}

async function mainEvent() { // the async keyword means we can make API requests
  const form = document.querySelector('.main_form');

  // Select submit button
  const submit = document.querySelector('.submit_button');

  // Set submit button display to none
  submit.style.setProperty('display', 'none');

  const results = await fetch('/api/foodServicesPG'); // This accesses some data from our API
  const arrayFromJson = await results.json(); // This changes it into data we can use - an object

  // If statement that wraps form listener
  if (arrayFromJson.data.length > 0) {
    // Set submit button style to block
    submit.style.setProperty('display', 'block');

    form.addEventListener('submit', async (submitEvent) => { // async has to be declared all the way to get an await
      submitEvent.preventDefault(); // This prevents your page from refreshing!
      console.log('form submission'); // this is substituting for a "breakpoint"
      // arrayFromJson.data - we're accessing a key called 'data' on the returned object
      // it contains all 1,000 records we need

      dataHandler(arrayFromJson.data);
    });
  }
}

// this actually runs first! It's calling the function above
document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests
