function loadDetails() {
    const Http = new XMLHttpRequest();
    const url = window.location.href + '/places';
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = (e) => {
        if (Http.readyState == XMLHttpRequest.DONE) {
            createSelectWindows(Http.responseText);
        }
    };
}

function createSelectWindows(data) {
    var countriesSelect = document.getElementById('country');
    data = JSON.parse(data);
    for (var country in data) {
        var option = document.createElement('option');
        option.innerHTML = country;
        option.value = country;
        countriesSelect.appendChild(option);
    }
    $('#country').select2();
    countriesSelect.onchange = function () {
        var country = document.getElementById('country').value;
        var province = document.getElementById('province');
        province.innerHTML = "";
        if (data[country].length == 0) {
            province.style.display = "none";
        } else {
            province.style.display = "block";
            var optionProv = document.createElement('option');
            optionProv.innerHTML = "Select province/region";
            optionProv.value = "";
            optionProv.selected = true;
            province.appendChild(optionProv);
            for (var prov in data[country]) {
                optionProv = document.createElement('option');
                optionProv.innerHTML = data[country][prov];
                optionProv.value = data[country][prov];
                province.appendChild(optionProv);
            }
            $('#province').select2();
        }
    };
}

function loadPredictions() {
    const Http = new XMLHttpRequest();
    const url = window.location.href + '/predict?country=' + document.getElementById('country').value + "&province=" + document.getElementById('province').value;
    Http.open("GET", url);
    Http.send();

    chart.options.title.text = document.getElementById('country').value;
    if (document.getElementById('country').value == "") {
        chart.options.title.text = "Worldwide";
    }
    if (document.getElementById('province').value != "") {
        chart.options.title.text += " (" + document.getElementById('province').value + ")";
    }

    Http.onreadystatechange = (e) => {
        if (Http.readyState == XMLHttpRequest.DONE) {
            addData(Http.responseText);
        }
    };
}

var ctx = document.getElementById('myChart');
var chart = new Chart(ctx, {
    type: 'scatter',
    data: {
        datasets: []
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }],
            xAxes: [{
                type: 'time',
                time: {
                    displayFormats: {
                        day: 'DD/MM'
                    }
                }
            }]
        },
        title: {
            display: true,
            text: '-',
        }
    }
});

function formatData(data) {
    var new_data = [];

    for (var i = 0; i < data['date'].length; i++) {
        new_data.push({
            x: new Date(data['date'][i] / 1000000),
            y: data['y'][i]
        });
    }

    return new_data;
}

function addData(info) {
    info = JSON.parse(info);
    chart.data.datasets = [];

    chart.data.datasets.push({});
    chart.data.datasets[0].data = formatData(info['inf_data']);
    chart.data.datasets[0].label = "Confirmed cases";
    chart.data.datasets[0].backgroundColor = 'orange';

    chart.data.datasets.push({});
    chart.data.datasets[1].data = formatData(info['inf_pred']);
    chart.data.datasets[1].label = "Predicted cases";
    chart.data.datasets[1].backgroundColor = 'magenta';

    chart.data.datasets.push({});
    chart.data.datasets[2].data = formatData(info['death_data']);
    chart.data.datasets[2].label = "Confirmed deaths";
    chart.data.datasets[2].backgroundColor = 'red';

    chart.data.datasets.push({});
    chart.data.datasets[3].data = formatData(info['death_pred']);
    chart.data.datasets[3].label = "Predicted deaths";
    chart.data.datasets[3].backgroundColor = 'purple';

    chart.update();
}

$(document).ready(function () {
    loadDetails();
});