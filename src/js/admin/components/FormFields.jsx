import React from 'react';

import { TextControl } from '@wordpress/components';

import { useState } from 'react';

export default function FormFields(props) {
    const {
        title = '',
        send_to_representative = false,
        email = '',
        cc_emails = '',
        goal = 0,
        show_country = false,
        subject = '',
        require_approval = false,
    } = window.petitionerData;


    return <>
        <p>
            <TextControl
                style={{ width: '100%' }}
                required
                label="Petition Title *"
                defaultValue={title}
                name="petitioner_title"
                id="petitioner_title"
            />
        </p>

        <p>
            <input defaultChecked={send_to_representative} type="checkbox" name="petitioner_send_to_representative" id="petitioner_send_to_representative"
                className="widefat" />
            <label for="petitioner_send_to_representative">Send this email to representative?</label>
        </p>

        <p>
            <TextControl
                style={{ width: '100%' }}
                required
                type="email"
                label="Petition target email *"
                defaultValue={email}
                name="petitioner_email"
                id="petitioner_email"
            />
        </p>

        <p>
            <TextControl
                style={{ width: '100%' }}
                type="text"
                label="Petition CC emails"
                defaultValue={cc_emails}
                help="(can have multiple - separated by comma)"
                name="petitioner_cc_emails"
                id="petitioner_cc_emails"
            />
        </p>

        <p>
            <TextControl
                style={{ width: '100%' }}
                required
                type="number"
                label="Signature goal *"
                defaultValue={goal}
                name="petitioner_goal"
                id="petitioner_goal"
            />
        </p>


        <p>
            <input defaultChecked={show_country} type="checkbox" name="petitioner_show_country" id="petitioner_show_country"
                className="widefat" />
            <label for="petitioner_show_country">Show country field?</label>
        </p>


        <p>
            <TextControl
                style={{ width: '100%' }}
                type="text"
                required
                label="Petition subject *"
                defaultValue={subject}
                name="petitioner_subject"
                id="petitioner_subject"
            />
        </p>


        <p>
            <input defaultChecked={require_approval} type="checkbox" name="petitioner_require_approval" id="petitioner_require_approval"
                className="widefat" onChange={(val) => {
                    window.petitionerData.require_approval = val.target.checked;

                    const evt = new CustomEvent('onPtrApprovalChange');

                    window.dispatchEvent(evt);
                }} />
            <label for="petitioner_require_approval">Require approval for submissions?</label>
        </p>
    </>
}