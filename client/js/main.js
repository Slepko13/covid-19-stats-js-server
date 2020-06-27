// fetch(`https://covid19-monitor-pro.p.rapidapi.com/coronavirus/cases_by_days_by_country.php?country=country`, {
// 		"method": "GET",
// 		"headers": {
// 			"x-rapidapi-host": "covid19-monitor-pro.p.rapidapi.com",
// 			"x-rapidapi-key": "7e269ec140msh8a5df9cfc21b4b4p1c1e3ejsn9aba26afc6e0"
// 		}
// 	})

//! Select elements

const country_name_element = document.querySelector('.country__name');
const total_cases_element = document.querySelector('.total-cases__value');
const new_cases_element = document.querySelector('.total-cases__new-value');
const recovered_element = document.querySelector('.recovered__value');
const new_recovered_element = document.querySelector('.recovered__new-value');
const deaths_element = document.querySelector('.deaths__value');
const new_deaths_element = document.querySelector('.deaths__new-value');
const ctx = document.getElementById('axes_line_chart').getContext('2d');

//! App variables

let app_data = [],
    cases_list = [],
    recovered_list = [],
    deaths_list = [],
    dates = [];
formattedDates = [];

//! Get users country code
let country_code = geoplugin_countryCode();
let user_country;

// country_list.forEach(country => {
//     if (country.code == country_code) {
//         user_country = country.name
//     }
// })
// fetchData(user_country);

function fetchData(country) {
    country_name_element.innerHTML = "Loading...";
    cases_list = [], recovered_list = [], deaths_list = [], dates = [], formattedDates = [];
    fetch(`https://covid19-monitor-pro.p.rapidapi.com/coronavirus/cases_by_days_by_country.php?country=${country}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "covid19-monitor-pro.p.rapidapi.com",
            "x-rapidapi-key": "7e269ec140msh8a5df9cfc21b4b4p1c1e3ejsn9aba26afc6e0"
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            dates = Object.keys(data);
            dates.forEach(date => {
                let DATA = data[date];
                formattedDates.push(formatDate(date));
                app_data.push(DATA);
                cases_list.push(parseInt(DATA.total_cases.replace(/,/g, "")));
                recovered_list.push(parseInt(DATA.total_recovered.replace(/,/g, "")));
                deaths_list.push(parseInt(DATA.total_deaths.replace(/,/g, "")));

            })

        })
        .then(() => {
            updateUI();
        })
        .catch(error => {
            console.log(error);
        })
}

//! Update UI

function updateUI() {
    updateStats();
    axesLinearChart();
}

function updateStats() {
    let last_entry = app_data[app_data.length - 1];
    let before_last_entry = app_data[app_data.length - 2];

    country_name_element.innerHTML = last_entry.country_name;

    total_cases_element.innerHTML = last_entry.total_cases;
    new_cases_element.innerHTML = `+${last_entry.new_cases || 0}`;

    recovered_element.innerHTML = last_entry.total_recovered;
    new_recovered_element.innerHTML = `+${(+last_entry.total_recovered.replace(/,/g, "")) - (+before_last_entry.total_recovered.replace(/,/g, ""))}`;

    deaths_element.innerHTML = last_entry.total_deaths;
    new_deaths_element.innerHTML = `+${last_entry.new_deaths || 0}`;

    console.log(+last_entry.total_recovered.replace(/,/g, ""));

}

//!update chart
let my_chart;
function axesLinearChart() {

    if (my_chart) {
        my_chart.destroy();
    }
    my_chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'cases',
                    data: cases_list,
                    fill: false,
                    borderColor: '#FFFfff',
                    backgroundColor: '#FFFFFF',
                    borderWidth: 1
                },
                {
                    label: 'recovered',
                    data: recovered_list,
                    fill: false,
                    borderColor: '#009688',
                    backgroundColor: '#009688',
                    borderWidth: 1

                },
                {
                    label: 'deaths',
                    data: deaths_list,
                    fill: false,
                    borderColor: '#f44336',
                    backgroundColor: '#f44336',
                    borderWidth: 1

                },
            ],
            labels: formattedDates
        },
        options: {
            response: true,
            maintainAspectRatio: false
        }
    });
}
//! Format dates
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function formatDate(dateString) {
    let date = new Date(dateString);

    return `${date.getDate()} ${monthNames[date.getMonth()]}`;
}
