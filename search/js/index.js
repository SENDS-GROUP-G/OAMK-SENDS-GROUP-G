const BACKEND_ROOR_URL = 'http://localhost:3001'

const list = document.querySelector('ul');
const input = document.querySelector('input');
const searchAll = document.querySelector('#search-all');
const filter = document.querySelector("#filter-options")

//const renderResults = new Set()

const renderSearch = (search) => {
    //if (!renderResults.has(search)) {
        const li = document.createElement('li')
        li.setAttribute('class', 'list-group-item')
        li.innerHTML = search;
        list.append(li)
        // Add the result to the rendered set
       // renderResults.add(search);
    //}
}

const renderFilterOptions = (text) => {
    filter.innerHTML = ''; // Clear previous filter options

    const filters = ['All', 'Username', 'Post']; // Add filter options

    filters.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.setAttribute('class', 'filter-option');
        button.addEventListener('click', () => {
            // Get data based on filter option
            if (option === 'Username') {
                list.innerHTML =''
                // Handle 'Username' option
                getUsers(text);
            } else if (option === 'Post') {
                list.innerHTML = ''
                // Handle 'Post' option
                getTitles(text);
            } else {
                list.innerHTML = ''
                getUsers(text);
                getTitles(text)
            }
        });
        filter.append(button);
    });
};

const getUsers = async(text) => {
    try {
        const response = await fetch(BACKEND_ROOR_URL + '/search/users/' + text);
        const json = await response.json();
        json.forEach(element => {
            renderSearch(element.user_name);
        });
    } catch (error) {
        alert("Error retrieving usernames" + error.message)
    }
}

const getTitles = async (text) => {
    try {
        const response = await fetch(BACKEND_ROOR_URL + '/search/posts/' + text)
        const json = await response.json()
        console.log(json)
        json.forEach(element => {
            renderSearch(element.title + ' by ' + element.user_name + ' on ' + element.saved)         
        });
    } catch (error) {
        alert("Error retrieving titles " + error.message)
    }
}

searchAll.addEventListener('click', () => {
    const search = input.value.trim()
    if (search !== '') {
        list.innerHTML = ''
        getUsers(search)
        getTitles(search)
        renderFilterOptions(search)
        //input.value = ''
    }
})

