var displayedPeople = [];
var sortBy = {};
//Utils
function drawTable(people) {
    // Prepare table HTML
    var tableHTML = '<th><button type="button" class="btn btn-link" onclick=sortPeople("name")>Name</button></th><th><button type="button" class="btn btn-link" onclick=sortPeople("birth_year")>DOB</button></th><th><button type="button" class="btn btn-link" onclick=sortPeople("gender")>Gender</button></th><th><button type="button" class="btn btn-link" onclick=sortPeople("url")>URL</button></th></tr></thead><tbody>';
    // // Loop thru all characters to generate rows of the table
    people.forEach(function (p) {
        tableHTML += "<tr><td>".concat(p.name, "</td><td>").concat(p.birth_year, "</td><td>").concat(p.gender, "</td><td>").concat(p.url, "</td></tr>");
    });
    // Close table body
    tableHTML += '</tbody>';
    // Grab table element to set its inner HTML
    document.querySelector('#tableElement').innerHTML = tableHTML;
}
//Handlers
function paginatePeople(page) {
    fetch('https://swapi.dev/api/people/?page=${page}')
        .then(function (res) { return res.json(); })
        .then(function (data) {
        displayedPeople = data.results;
        drawTable(data.results);
    });
}
function filterPeople(value) {
    var filteredPeople = displayedPeople.filter(function (p) { return p.name.toLowerCase().includes(value.toLowerCase())
        || p.birth_year.toLowerCase().includes(value.toLowerCase())
        || p.gender.toLowerCase().includes(value.toLowerCase())
        || p.url.toLowerCase().includes(value.toLowerCase()); });
    console.log('filteredPeople', filteredPeople);
    drawTable(filteredPeople);
}
function sortPeople(prop) {
    var _a;
    if (sortBy[prop]) {
        if (sortBy[prop] === 'asc') {
            sortBy[prop] = 'desc';
        }
        else if (sortBy[prop] === 'desc') {
            sortBy[prop] = null;
        }
    }
    else {
        sortBy = (_a = {}, _a[prop] = 'asc', _a);
    }
    var sortedPeople = displayedPeople.toSorted(function (a, b) {
        if (sortBy[prop] === 'asc') {
            return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0;
        }
        else if (sortBy[prop] === 'desc') {
            return a[prop] < b[prop] ? 1 : a[prop] > b[prop] ? -1 : 0;
        }
        else {
            return displayedPeople;
        }
    });
    drawTable(sortedPeople);
}
fetch('https://swapi.dev/api/people')
    .then(function (res) { return res.json(); })
    .then(function (data) {
    displayedPeople = data.results;
    // we invoke the draw table function with the 10 initials characters
    drawTable(data.results);
    var pages = Math.ceil(data.count / 10);
    var paginationElement = document.querySelector('#paginationElement');
    var pagesHTML = '';
    for (var index = 1; index <= pages; index++) {
        pagesHTML += "<li class=\"page-item\"><a class=\"page-link\" href=\"#\" onclick=\"paginateProducts(".concat(index, ")\">").concat(index, "</a></li>");
    }
    paginationElement.innerHTML = pagesHTML;
    // Hide spinner
    var spinnerElement = document.querySelector('#spinnerContainer');
    spinnerElement.style.display = 'none';
});
