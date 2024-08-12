// Global Variables
const errorMessage = document.getElementById('error-message');
const totalFound = document.getElementById('total-found');
const searchResult = document.getElementById('search-result');

// Function to display or hide the loading spinner
const loadingDisplay = (display) => {
    document.getElementById('loading').style.display = display;
}

// Function to display or hide the search results
const searchResultDisplay = (display) => {
    document.getElementById('search-result').style.display = display;
}

// Function to load data when the search button is clicked
const loadData = () => {
    // Get input value
    const inputValue = document.getElementById('search-field').value.trim();

    // Clear previous results
    errorMessage.innerHTML = '';
    searchResult.innerHTML = '';
    totalFound.innerHTML = '';

    // Validate input
    if (inputValue === '') {
        errorMessage.innerHTML = `Please, Input a Valid Book Name..!`;
    } else {
        // Display spinner and hide results
        loadingDisplay('block');
        searchResultDisplay('none');

        // Fetch data from the OpenLibrary API
        const url = `https://openlibrary.org/search.json?q=${inputValue}`;
        fetch(url)
            .then(res => res.json())
            .then(data => displayData(data))
            .catch(error => {
                errorMessage.innerHTML = `Couldn't Get Data - API Error`;
                loadingDisplay('none');
                console.error('Error fetching data:', error); // Log error to the console
            });

        // Clear input value
        document.getElementById('search-field').value = '';
    }
}

// Function to display the fetched data
const displayData = (books) => {
    // Check if books are returned
    if (!books || !books.docs || books.docs.length === 0) {
        errorMessage.innerText = `No Results Found!`;
        loadingDisplay('none');
        totalFound.innerHTML = '';
        return;
    }

    // Display total found results
    totalFound.innerHTML = `About ${books.numFound} Results Found for '${books.q}'`;

    // Display each book
    const minBooks = books.docs;
    searchResult.innerHTML = ''; // Clear previous search results
    minBooks.forEach(book => {
        const div = document.createElement('div');
        div.classList.add('col', 'book-card');

        // Getting Details 
        let cover = book.cover_i;
        let title = book.title;
        let author = book.author_name;
        let publisher = book.publisher;
        let publishYear = book.first_publish_year;

        div.innerHTML = `
            <div class="card mb-3 shadow rounded">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img
                            class="card-img-top w-100 h-100"
                            src="https://covers.openlibrary.org/b/id/${cover === undefined ? '10675600' : book.cover_i}-M.jpg"
                            alt="${title ? title : "Unknown"}"
                        />
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title text-success">${title === undefined ? 'Unknown' : title}</h5>
                            <hr />
                            <p class="lead"><span class="fw-bold">Author: </span>${author === undefined ? 'Unknown' : author[0]}</p>
                            <p class="lead"><span class="fw-bold">Publisher: </span>${publisher === undefined ? 'Unknown' : publisher[0]}</p>
                            <p class="card-text">
                                <small class="text-muted">First Published: ${publishYear === undefined ? 'Unknown' : publishYear}</small>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        searchResult.appendChild(div);
    });

    // Hide spinner and show results
    loadingDisplay('none');
    searchResultDisplay('flex');
}
