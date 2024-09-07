export default class Petitioner_Submissions_Table {
    constructor() {
        this.total = 0; // Total will be updated dynamically
        this.perPage = 100;
        this.tableDiv = document.getElementById('petitioner_submissions');
        this.entriesDiv = this.tableDiv.querySelector('.petitioner-admin__entries');
        this.paginationDiv = this.tableDiv.querySelector('.petitioner-admin__pagination');

        this.currentPage = 1; // Track the current page
        this.formSettings = {};

        this.handleFormSettings();

        if (!this.formSettings.formID) {
            return;
        }

        // Initialize by fetching the first page of data
        this.fetch_data(this.currentPage);

        // Listen for pagination click events
        this.paginationDiv.addEventListener('click', (e) => {
            if (e.target.classList.contains('petitioner__paging-button')) {
                e.preventDefault();
                const page = parseInt(e.target.dataset.page);
                this.fetch_data(page);
            }
        });
    }

    handleFormSettings() {
        const settingsString = this.tableDiv.dataset.petitionerSubmissions;
        this.formSettings = JSON.parse(settingsString);
    }

    // Fetch data from the server for the given page
    fetch_data(page) {
        const finalAjaxURL = `${ajaxurl}?action=petitioner_fetch_submissions&page=${page}&form_id=${this.formSettings.formID}&per_page=${this.perPage}`
        console.log(finalAjaxURL);

        // Make AJAX request to fetch paginated data
        fetch(finalAjaxURL)
            .then(response => response.json())
            .then(response => {
                const { success, data } = response;

                if (!success) {
                    return;
                }

                this.total = data.total;
                this.submissions = data.submissions;
                this.render_table();
                // this.render_pagination();
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // Render the table with submissions
    render_table() {
        const rows = this.submissions?.map((item) => {
            return `<tr>
                        <td>${item.name}</td>
                        <td>${item.email}</td>
                    </tr>`;
        }).join('');

        this.entriesDiv.innerHTML = `
        <p>Total: ${this.total}</p>
        <table class="wp-list-table widefat fixed striped table-view-list posts">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
        `;
    }

    // Render the pagination
    render_pagination() {
        const prevPage = this.currentPage--;
        const nextPage = this.currentPage++;

        let paginationHTML = `<button class="petitioner__paging-button" data-page="${prevPage !== 0 ? prevPage : 1}"><</button>`;

        // Calculate the total number of pages, rounding up
        const countPages = Math.ceil(this.total / this.perPage);

        for (let i = 1; i <= countPages; i++) {
            paginationHTML += `<button class="petitioner__paging-button ${i === this.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }

        paginationHTML += `<button class="petitioner__paging-button" data-page="${nextPage <= countPages ? nextPage : countPages}">></button>`;

        this.paginationDiv.innerHTML = paginationHTML;
    }
}