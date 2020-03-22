var dataText;

function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                dataText = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
}

readTextFile("train.csv");

var ctx = document.getElementById('myChart');
var myChart = new Chart(ctx, {
    type: 'scatter',
    data: {
        labels: ['Infected', 'Deaths'],
        datasets: [{
            label: 'Number of people',
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});