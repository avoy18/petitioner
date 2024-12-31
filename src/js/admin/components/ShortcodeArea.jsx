import React from 'react';

export default function ShortCodeArea() {
    const formID = petitionerData?.form_id;

    if (!formID) return;

    return <p>
        <label for="petitioner_shortcode">Your petition shortcode:</label>

        <input disabled type="text" name="petitioner_shortcode" id="petitioner_shortcode" value={`[petitioner-form id="${formID}"]`} className="widefat" />
    </p>
}