class Search {
    constructor(rootUrl) {
        this.rootUrl = rootUrl;
        this.list = document.querySelector('#search-results'); 
        this.input = document.querySelector('#search-input'); 
        this.searchAll = document.querySelector('#search-all');
        this.filter = document.querySelector("#filter-options");
    }

    renderSearch(search) {
        const li = document.createElement('li');
        li.setAttribute('class', 'list-group-item');
        li.innerHTML = search;
        this.list.append(li);
    }

    renderFilterOptions(text) {
        this.filter.innerHTML = '';
        const filters = ['All', 'Username', 'Post'];
        filters.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.setAttribute('class', 'filter-option');
            button.addEventListener('click', () => {
                this.list.innerHTML = '';
                if (option === 'Username') {
                    this.getUsers(text);
                } else if (option === 'Post') {
                    this.getTitles(text);
                } else {
                    this.getUsers(text);
                    this.getTitles(text);
                }
            });
            this.filter.append(button);
        });
    }

    async getUsers(text) {
        try {
            const response = await fetch(this.rootUrl + '/search/users/' + text);
            const json = await response.json();
            json.forEach(element => {
                this.renderSearch(element.user_name);
            });
        } catch (error) {
            alert("Error retrieving usernames" + error.message);
        }
    }

    async getTitles(text) {
        try {
            const response = await fetch(this.rootUrl + '/search/posts/' + text);
            const json = await response.json();
            json.forEach(element => {
                this.renderSearch(element.title + ' by ' + element.user_name + ' on ' + element.saved);
            });
        } catch (error) {
            alert("Error retrieving titles " + error.message);
        }
    }

    init() {
        this.searchAll.addEventListener('click', () => {
            const search = this.input.value.trim();
            if (search !== '') {
                this.list.innerHTML = '';
                this.getUsers(search);
                this.getTitles(search);
                this.renderFilterOptions(search);
            }
        });
    }
}

const search = new Search('http://localhost:3001');
search.init();