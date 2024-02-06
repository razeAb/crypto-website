// your-script.js

// Sample data
const data = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [{
      label: 'Monthly Sales',
      data: [10, 15, 7, 20, 25],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };
  
  // Configuration options
  const options = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  
  // Create a bar chart
  const ctx = document.getElementById('myChart').getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: options
  });
  