
var sp500DatenObject = document.getElementById('sp500Daten');

var chart = new Chart(sp500DatenObject, {

  type: 'line',
  data: {
    labels: ["1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007"],
    datasets: [{
      label: "S&P500 Strategie³",
      data: [2,4,5,6,7,8,9]
    }]
  }

  
  
});
