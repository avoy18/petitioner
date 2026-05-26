import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import PTRichText from '@admin/components/PTRichText';

describe('PTRichText', () => {
	let onChange: (value: string) => void;
	let mockEditor: any;
	let initCallback: Function | null;
	let blurCallback: Function | null;

	beforeEach(() => {
		onChange = vi.fn();
		initCallback = null;
		blurCallback = null;

		// Mock TinyMCE editor
		mockEditor = {
			on: vi.fn((event, callback) => {
				if (event === 'init') initCallback = callback;
				if (event === 'blur') blurCallback = callback;
			}),
			setContent: vi.fn(),
			getContent: vi.fn(() => '<p>editor content</p>'),
			remove: vi.fn(),
		};

		// Mock TinyMCE global
		// @ts-ignore
		global.tinymce = {
			init: vi.fn((config) => {
				if (config.setup) config.setup(mockEditor);
			}),
		};
	});

	afterEach(() => {
		// @ts-ignore
		delete global.tinymce;
		vi.clearAllMocks();
	});

	it('renders textarea with label', () => {
		render(
			<PTRichText
				id="my-editor"
				label="My Editor"
				value=""
				onChange={onChange}
			/>
		);

		expect(screen.getByText('My Editor')).toBeInTheDocument();
		expect(screen.getByRole('textbox')).toHaveAttribute('id', 'my-editor');
	});

	it('shows help text when provided', () => {
		render(
			<PTRichText
				id="test"
				label="Test"
				value=""
				help="Need help?"
				onChange={onChange}
			/>
		);

		expect(screen.getByText('Need help?')).toBeInTheDocument();
	});

	it('initializes TinyMCE with correct settings', () => {
		render(
			<PTRichText
				id="test"
				label="Test"
				value=""
				height={500}
				plugins="lists link"
				toolbar="bold italic"
				onChange={onChange}
			/>
		);

		// @ts-ignore
		expect(global.tinymce.init).toHaveBeenCalledWith(
			expect.objectContaining({
				selector: '#test',
				height: 500,
				plugins: 'lists link',
				toolbar: 'bold italic',
			})
		);
	});

	it('sets initial content when editor initializes', () => {
		render(
			<PTRichText
				id="test"
				label="Test"
				value="<p>Hello</p>"
				onChange={onChange}
			/>
		);

		// Trigger the init event
		if (initCallback) initCallback();

		expect(mockEditor.setContent).toHaveBeenCalledWith('<p>Hello</p>');
	});

	it('does not set content if value is empty', () => {
		render(
			<PTRichText id="test" label="Test" value="" onChange={onChange} />
		);

		if (initCallback) initCallback();

		expect(mockEditor.setContent).not.toHaveBeenCalled();
	});

	it('does NOT reinitialize when value prop changes (THE BUG FIX)', async () => {
		const { rerender } = render(
			<PTRichText
				id="test"
				label="Test"
				value="<p>First</p>"
				onChange={onChange}
			/>
		);

		// Editor initialized once
		// @ts-ignore
		expect(global.tinymce.init).toHaveBeenCalledTimes(1);

		// Change the value prop
		rerender(
			<PTRichText
				id="test"
				label="Test"
				value="<p>Second</p>"
				onChange={onChange}
			/>
		);

		// Wait a bit to make sure it doesn't reinit
		await new Promise((resolve) => setTimeout(resolve, 50));

		// Should still only be 1 init (not 2!)
		// @ts-ignore
		expect(global.tinymce.init).toHaveBeenCalledTimes(1);

		// Should update content instead
		expect(mockEditor.setContent).toHaveBeenCalledWith('<p>Second</p>');
	});

	it('updates content when value changes externally', () => {
		const { rerender } = render(
			<PTRichText
				id="test"
				label="Test"
				value="<p>One</p>"
				onChange={onChange}
			/>
		);

		if (initCallback) initCallback();
		vi.clearAllMocks();

		// Parent updates the value
		rerender(
			<PTRichText
				id="test"
				label="Test"
				value="<p>Two</p>"
				onChange={onChange}
			/>
		);

		expect(mockEditor.setContent).toHaveBeenCalledWith('<p>Two</p>');
	});

	it('calls onChange when user blurs the editor', () => {
		render(
			<PTRichText id="test" label="Test" value="" onChange={onChange} />
		);

		// User finishes editing and clicks away (blur event)
		if (blurCallback) blurCallback();

		expect(onChange).toHaveBeenCalledWith('<p>editor content</p>');
	});

	it('removes editor when component unmounts', () => {
		const { unmount } = render(
			<PTRichText id="test" label="Test" value="" onChange={onChange} />
		);

		unmount();

		expect(mockEditor.remove).toHaveBeenCalled();
	});

	it('handles cleanup errors without crashing', () => {
		const consoleWarn = vi
			.spyOn(console, 'warn')
			.mockImplementation(() => {});

		mockEditor.remove.mockImplementation(() => {
			throw new Error('Already removed');
		});

		const { unmount } = render(
			<PTRichText id="test" label="Test" value="" onChange={onChange} />
		);

		expect(() => unmount()).not.toThrow();
		expect(consoleWarn).toHaveBeenCalled();

		consoleWarn.mockRestore();
	});
});
