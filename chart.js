/* ------PIE CHART------ */
const colors = ["Electricity", "Groceries", "Pigery", "Allowance", "Loans"];
const data_array = [230, 250, 2300, 1500, 1000];
const categoryColors = ["#199e70", "#3987e5", "#d62b22", "#d55181", "#c98500"];
const myChart = new Chart("myChart", {
  type: "pie",
  data: {
    labels: colors,
    datasets: [
      {
        data: data_array,
        borderColor: "none",
        backgroundColor: categoryColors,
        borderWidth: 0,
      },
    ],
  },
  options: {
    layout: {
      padding: 30,
    },
    radius: "100%",
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: window.devicePixelRatio || 1,
  },
});
