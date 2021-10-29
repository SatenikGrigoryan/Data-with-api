async function getInfo(selectedDate = '') {
  let countries, shatInfo; 
  try {
    //get info part
    let generalUrl = await fetch("https://covid19.mathdro.id/api").then(
      (response) => response.json()
    );

    let countryNamesUrl = generalUrl.countries;
    
    let countryNames = await fetch(countryNamesUrl).then((response) =>
      response.json()
    );

    countries = [];
    countryNames.countries.forEach((item, i) => {
      countries.push({});
      countries[i].name = item.name;
      countries[i].confirmed = 0;
      countries[i].deaths = 0;
      countries[i].recovered = 0;
    });
    
    let shatInfoUrl = generalUrl.dailyTimeSeries.pattern;
    let urlWithDate = shatInfoUrl.replace('[dateString]', selectedDate);

    shatInfo = await fetch(urlWithDate).then((response) =>
      response.json()
    );
    

    
    let today = new Date().setHours(0, 0, 0, 0);
    selectedDate = new Date(selectedDate).setHours(0, 0, 0, 0);
    if (selectedDate >= today) {
      throw new Error(`Choose a past date!`);
    }

  } catch (err) {
    alert(err.message);
  }

  for (let i = 0; i < countries.length; i++) {
    for (let j = 0; j < shatInfo.length; j++) {
      if (shatInfo[j].countryRegion == countries[i].name) {
        countries[i].confirmed += +shatInfo[j].confirmed;
        countries[i].deaths += +shatInfo[j].deaths;
        countries[i].recovered += +shatInfo[i].recovered;
      }
    }
  }

  //make table part
  let myTableDiv = document.getElementById("myDynamicTable");
  myTableDiv.innerHTML = '';

  let table = document.createElement("table");
  table.border = 1;

  let tableBody = document.createElement("tbody");
  table.appendChild(tableBody);

  let heading1 = document.createElement("th");
  heading1.appendChild(document.createTextNode("Countries"));
  tableBody.appendChild(heading1);

  let heading2 = document.createElement("th");
  heading2.appendChild(document.createTextNode("Confirmed"));
  tableBody.appendChild(heading2);

  let heading3 = document.createElement("th");
  heading3.appendChild(document.createTextNode("Deaths"));
  tableBody.appendChild(heading3);

  let heading4 = document.createElement("th");
  heading4.appendChild(document.createTextNode("Recovered"));
  tableBody.appendChild(heading4);

  for (let i = 0; i < countries.length; i++) {
    let tr = document.createElement("tr");
    tableBody.appendChild(tr);
    for (let j = 0; j < 4; j++) {
      let td = document.createElement("td");
      td.width = 75;
      if (j == 0) {
        td.appendChild(document.createTextNode(countries[i].name));
      } else if (j == 1) {
        td.appendChild(document.createTextNode(countries[i].confirmed));
      } else if (j == 2) {
        td.appendChild(document.createTextNode(countries[i].deaths));
      } else if (j == 3) {
        td.appendChild(document.createTextNode(countries[i].recovered));
      }
      tr.appendChild(td);
    }
  }
  myTableDiv.appendChild(table);
}

$("#datepicker").datepicker({ dateFormat: "mm-dd-yy" });
$("#datepicker").on("change",function(){
  if ($(this).val() !== null) {
      selectedDate = $(this).val();
      getInfo(selectedDate);
  }
});

getInfo();