let movies = [];
let currentSortField = null;
let sortDirection = 1; // 1 = ascending, -1 = descending

// load the data
async function loadData() {
    try {
        const response = await fetch('data/films.json');
        movies = await response.json();
        renderTable(movies);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// format the box_office values (transforms '1123000000' to '$1.123.000.000')
function formatCurrency(value) {
    const number = parseInt(value, 10);
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(number).replace('USD', '').trim();
}

function renderTable(data) {
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = '';

    // create the table
    data.forEach(movie => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${movie.title}</td>
            <td>${movie.release_year}</td>
            <td>${movie.director}</td>
            <td>${formatCurrency(movie.box_office)}</td>
            <td>${movie.country}</td>`;
        tbody.appendChild(row);
    });
}

// enable sorting
function sortTable(field) {
    if (currentSortField === field) {
        sortDirection *= -1;
    } else {
        currentSortField = field;
        sortDirection = 1;
    }
        
    movies.sort((a, b) => {
        const numA = parseInt(a[field], 10);
        const numB = parseInt(b[field], 10);
        return (numA - numB) * sortDirection;
    });
    
    // Update visual sorting indicators
    document.querySelectorAll('[data-sort]').forEach(th => {
        th.classList.remove('sort-asc', 'sort-desc');
        if (th.dataset.sort === field) {
            th.classList.add(sortDirection === 1 ? 'sort-asc' : 'sort-desc');
        }
    });
        
    renderTable(movies);
}

// Initialize table sorting
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('[data-sort]').forEach(th => {
        th.addEventListener('click', () => sortTable(th.dataset.sort));
    });
    loadData();
});

// Handle real-time search input
document.getElementById('search').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = movies.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm) ||
        movie.director.toLowerCase().includes(searchTerm) ||
        movie.country.toLowerCase().includes(searchTerm)
    );
    renderTable(filtered);
});
