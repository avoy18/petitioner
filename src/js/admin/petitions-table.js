export default class AV_Petitioner_Submissions_Table {
    constructor() {
        this.total = 0; // Total will be updated dynamically
        this.perPage = 1000;
        this.tableDiv = document.getElementById('AV_Petitioner_Submissions');

        if (!this.tableDiv) return;

        this.entriesDiv = this.tableDiv.querySelector('.petitioner-admin__entries');
        this.paginationDiv = this.tableDiv.querySelector('.petitioner-admin__pagination');

        this.currentPage = 1;
        this.formSettings = {};
        this.handleFormSettings();

        if (!this.formSettings.formID) return;

        this.fetch_data(this.currentPage);

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
                        <td>${item.email}</td>
                        <td>${item.fname}</td>
                        <td>${item.lname}</td>
                        <td>${item.bcc_yourself ? 'yes' : 'no'}</td>
                        <td>${item.submitted_at}</td>
                    </tr>`;
        }).join('');

        this.entriesDiv.innerHTML = `
        <p>Total: ${this.total}</p>
        <table class="wp-list-table widefat fixed striped table-view-list posts">
            <thead>
                <tr>
                    <th>Email</th>
                    <th>First name</th>
                    <th>Last name</th>
                    <th>BCC</th>
                    <th>Submitted at</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
        `;
    }

    // Render the pagination
    // render_pagination() {
    //     const prevPage = this.currentPage--;
    //     const nextPage = this.currentPage++;

    //     let paginationHTML = `<button class="petitioner__paging-button" data-page="${prevPage > 0 ? prevPage : 1}"><</button>`;

    //     // // Calculate the total number of pages, rounding up
    //     const countPages = Math.ceil(this.total / this.perPage);

    //     // for (let i = 1; i <= countPages; i++) {
    //     //     paginationHTML += `<button class="petitioner__paging-button ${i === this.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    //     // }

    //     paginationHTML += `<button class="petitioner__paging-button" data-page="${nextPage <= countPages ? nextPage : countPages}">></button>`;

    //     this.paginationDiv.innerHTML = paginationHTML;
    // }
}