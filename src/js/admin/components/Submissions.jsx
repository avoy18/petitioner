import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup } from '@wordpress/components'

export default function Submissions() {

    const { form_id = null, export_url = '' } = window?.petitionerData;

    const [submissions, setSubmissions] = useState([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [showApproval, setShowApproval] = useState(false);
    const perPage = 100;


    useEffect(() => {
        if (!form_id) return;

        const fetchData = async () => {
            const finalAjaxURL = `${ajaxurl}?action=petitioner_fetch_submissions&page=${currentPage}&form_id=${form_id}&per_page=${perPage}`;
            console.log(finalAjaxURL);

            try {
                const response = await fetch(finalAjaxURL);
                const data = await response.json();

                if (data.success) {
                    console.log(data);
                    setTotal(data.data.total);
                    setSubmissions(data.data.submissions);
                } else {
                    console.error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [currentPage, form_id]);

    useEffect(() => {
        window.addEventListener('onPtrApprovalChange', () => {
            setShowApproval(window.petitionerData.require_approval);
        });
    }, []);


    // Handle pagination click
    const handlePaginationClick = (page) => {
        setCurrentPage(page);
    };


    const totalPages = Math.ceil(total / perPage);
    const buttons = [];

    for (let i = 1; i <= totalPages; i++) {
        buttons.push(
            <Button
                variant={currentPage !== i ? 'secondary' : 'primary'}
                key={i}
                onClick={() => handlePaginationClick(i)}
                data-page={i}
            >
                {i}
            </Button>
        );
    }

    console.log(submissions);

    return (
        <div id="AV_Petitioner_Submissions">
            <div className="petitioner-admin__entries">
                <p>Total: {total}</p>
                <table className="wp-list-table widefat fixed striped table-view-list posts">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Country</th>
                            <th>BCC</th>
                            <th>Submitted At</th>
                            {showApproval && <th>Status</th>}
                        </tr>
                    </thead>
                    <tbody>{submissions && submissions.map((item, index) => (
                        <tr key={index}>
                            <td>{item.email}</td>
                            <td>{item.fname}</td>
                            <td>{item.lname}</td>
                            <td>{item.country}</td>
                            <td>{item.bcc_yourself ? 'yes' : 'no'}</td>
                            <td>{item.submitted_at}</td>
                            {showApproval && <td>Approved</td>}
                        </tr>
                    ))}</tbody>
                </table>
            </div>
            <br />
            {buttons?.length > 1 && <ButtonGroup>{buttons}</ButtonGroup>}

        </div>
    );
};