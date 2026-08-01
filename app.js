const colors = ["Electricity", "Groceries", "Pigery", "Allowance", "Loans"];
const data_array = [230, 250, 2300, 1500, 1000];
const categoryColors = ["#F5C242", "#3ECF8E", "#F2784B", "#4C8BF5", "#E5566B"];
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
