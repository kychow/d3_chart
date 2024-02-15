import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
// Define data for the chart
const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [{
            label: 'My First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
};
// Chart configuration
const config = {
    type: 'line',
    data: data,
};
// Function to create the chart
function createChart() {
    const ctx = document.getElementById('myChart');
    if (ctx) {
        new Chart(ctx, config);
    }
}
// Call the function when the DOM content is loaded
document.addEventListener('DOMContentLoaded', createChart);
export { Chart, registerables };
