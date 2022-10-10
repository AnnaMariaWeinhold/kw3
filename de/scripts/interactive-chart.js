function sliceDataFrom(data, startYear) {
  return data.slice(data.findIndex((row) => row[0].endsWith(startYear)));
}

function calculateStrategy(data, startMoney = 10000, startYear = "1998") {
  basis = sliceDataFrom(data, startYear);
  const output = [];

  let previousMoney = startMoney;
  for (const [date, change, invested] of basis) {
    if (invested === "X") {
      const newMoney = previousMoney * (1 + change / 100);
      output.push(newMoney);
      previousMoney = newMoney;
    } else {
      output.push(previousMoney);
    }
  }
  return output;
}

function calculateSP(data, startMoney = 10000, startYear = "1998") {
  const basis = sliceDataFrom(data, startYear);
  // echart needs the money values of the y-axis of type number[]
  const output = [];
  let previousMoney = startMoney;
  for (const [date, change] of basis) {
    const newMoney = previousMoney * (1 + change / 100);
    output.push(newMoney);
    previousMoney = newMoney;
  }
  return output;
}

function debounce(delay = 500, handler) {
  let timeout;

  return (event) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => handler(event), delay);
  };
}

window.addEventListener("DOMContentLoaded", async function () {
  const chart = echarts.init(document.getElementById("interactive-chart"));

  const data = await fetch("/de/data/sp-basis.json").then((res) => res.json());

  const dataDescription = data.shift();
  const dates = data.map((row) => row[0]);

  const strategyName = "S&P Strategie";

  const options = {
    title: {
      text: "S&P Strategy vs Buy-and-Hold",
    },
    xAxis: {
      type: "category",
      data: dates,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: strategyName,
        type: "line",
        data: calculateStrategy(data),
      },
      {
        name: "Buy and Hold",
        type: "line",
        data: calculateSP(data),
      },
    ],
  };
  const modal = document.getElementById("chart-dialog");
  const modalCloseButton = document.querySelector("#chart-dialog button");
  const startMoneyControl = document.getElementById("start-money");

  startMoneyControl.addEventListener("change", (event) => {
    const newStartMoney = Number(event.target.value);
    // TODO: check if it is NaN
    const newOptions = {
      ...options,
      xAxis: {
        type: "category",
        data: sliceDataFrom(data, startYearControl.value).map((row) => row[0]),
      },
      series: [
        {
          name: strategyName,
          type: "line",
          data: calculateStrategy(
            data,
            newStartMoney || undefined,
            startYearControl.value || undefined
          ),
        },
        {
          name: "Buy and Hold",
          type: "line",
          data: calculateSP(
            data,
            newStartMoney || undefined,
            startYearControl.value || undefined
          ),
        },
      ],
    };
    chart.setOption(newOptions);
  });

  const yearPicker = document.getElementById("year-picker");

  yearPicker.addEventListener("click", function (event) {
    startYearControl.value = event.target.dataset.value;
    startYearControl.dispatchEvent(new Event("change"));
  });

  const startYearControl = document.getElementById("start-year");

  startYearControl.addEventListener(
    "change",
    debounce(600, (event) => {
      // hide year-picker list
      startYearControl.blur();
      const year = event.target.value;
      const startIndex = data.findIndex((row) => row[0].endsWith(year));

      if (startIndex > -1) {
        const newOptions = {
          ...options,
          xAxis: {
            type: "category",
            data: sliceDataFrom(data, year).map((row) => row[0]),
          },
          series: [
            {
              name: strategyName,
              type: "line",
              data: calculateStrategy(
                data,
                Number(startMoneyControl.value) || undefined,
                year
              ),
            },
            {
              name: "Buy and Hold",
              type: "line",
              data: calculateSP(
                data,
                Number(startMoneyControl.value) || undefined,
                year
              ),
            },
          ],
        };
        chart.setOption(newOptions);
      } else {
        // requested start date is likey a weekend
        // debounce properly and/or disallow weekends entirey
        modal.style.display = "block";
        modalCloseButton.addEventListener("click", (event) => {
          modal.style.display = "none";
        });
      }
    })
  );

  chart.setOption(options);
});
