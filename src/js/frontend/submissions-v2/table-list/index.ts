import { SubmissionItem } from '@js/frontend/submissions/consts';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('table-list')
export class TableList extends LitElement {
    @property({ type: Array }) submissions: SubmissionItem[] = [];
    @property({ type: Object }) labels: { [key: string]: string } = {};

	render() {
		return html`
        Table List
			<div>${JSON.stringify(this.submissions)}</div>
		`;
	}
}