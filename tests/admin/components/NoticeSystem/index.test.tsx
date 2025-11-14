import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderHook, act } from '@testing-library/react';
import NoticeSystem, { useNoticeSystem } from '@admin/components/NoticeSystem';

describe('NoticeSystem Component', () => {
	it('renders notice with success status', () => {
		const mockHideNotice = vi.fn();

		render(
			<NoticeSystem
				noticeStatus="success"
				noticeText="Operation successful!"
				hideNotice={mockHideNotice}
			/>
		);

		// Use getAllByText and check the notice content div specifically
		const elements = screen.getAllByText('Operation successful!');
		const noticeContent = elements.find(
			(el) => el.className === 'components-notice__content'
		);
		expect(noticeContent).toBeInTheDocument();
	});

	it('renders notice with error status', () => {
		const mockHideNotice = vi.fn();

		render(
			<NoticeSystem
				noticeStatus="error"
				noticeText="Operation failed!"
				hideNotice={mockHideNotice}
			/>
		);

		// Use getAllByText and check the notice content div specifically
		const elements = screen.getAllByText('Operation failed!');
		const noticeContent = elements.find(
			(el) => el.className === 'components-notice__content'
		);
		expect(noticeContent).toBeInTheDocument();
	});

	it('returns null when noticeStatus is undefined', () => {
		const mockHideNotice = vi.fn();

		const { container } = render(
			<NoticeSystem
				noticeStatus={undefined}
				noticeText="Some text"
				hideNotice={mockHideNotice}
			/>
		);

		expect(container.firstChild).toBeNull();
	});

	it('returns null when noticeText is undefined', () => {
		const mockHideNotice = vi.fn();

		const { container } = render(
			<NoticeSystem
				noticeStatus="success"
				noticeText={undefined}
				hideNotice={mockHideNotice}
			/>
		);

		expect(container.firstChild).toBeNull();
	});

	it('returns null when both status and text are undefined', () => {
		const mockHideNotice = vi.fn();

		const { container } = render(
			<NoticeSystem
				noticeStatus={undefined}
				noticeText={undefined}
				hideNotice={mockHideNotice}
			/>
		);

		expect(container.firstChild).toBeNull();
	});

	it('calls hideNotice when dismiss button is clicked', async () => {
		const user = userEvent.setup();
		const mockHideNotice = vi.fn();

		render(
			<NoticeSystem
				noticeStatus="success"
				noticeText="Test message"
				hideNotice={mockHideNotice}
			/>
		);

		// WordPress Notice component renders a dismiss button with aria-label="Close"
		const dismissButton = screen.getByRole('button', { name: /close/i });
		await user.click(dismissButton);

		expect(mockHideNotice).toHaveBeenCalledTimes(1);
	});
});

describe('useNoticeSystem Hook', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	it('initializes with undefined status and text', () => {
		const { result } = renderHook(() => useNoticeSystem());

		expect(result.current.noticeStatus).toBeUndefined();
		expect(result.current.noticeText).toBeUndefined();
	});

	it('showNotice updates status and text', () => {
		const { result } = renderHook(() => useNoticeSystem());

		act(() => {
			result.current.showNotice('success', 'Test success message');
		});

		expect(result.current.noticeStatus).toBe('success');
		expect(result.current.noticeText).toBe('Test success message');
	});

	it('hideNotice clears status and text', () => {
		const { result } = renderHook(() => useNoticeSystem());

		act(() => {
			result.current.showNotice('success', 'Test message');
		});

		expect(result.current.noticeStatus).toBe('success');
		expect(result.current.noticeText).toBe('Test message');

		act(() => {
			result.current.hideNotice();
		});

		expect(result.current.noticeStatus).toBeUndefined();
		expect(result.current.noticeText).toBeUndefined();
	});

	it('auto-dismisses notice after default timeout (3000ms)', () => {
		const { result } = renderHook(() => useNoticeSystem());

		act(() => {
			result.current.showNotice('success', 'Auto dismiss test');
		});

		expect(result.current.noticeStatus).toBe('success');
		expect(result.current.noticeText).toBe('Auto dismiss test');

		// Fast-forward time by 3000ms
		act(() => {
			vi.advanceTimersByTime(3000);
		});

		expect(result.current.noticeStatus).toBeUndefined();
		expect(result.current.noticeText).toBeUndefined();
	});

	it('respects custom timeout duration', () => {
		const { result } = renderHook(() =>
			useNoticeSystem({ timeoutDuration: 5000 })
		);

		act(() => {
			result.current.showNotice('success', 'Custom timeout test');
		});

		expect(result.current.noticeText).toBe('Custom timeout test');

		// Not dismissed after 3000ms
		act(() => {
			vi.advanceTimersByTime(3000);
		});
		expect(result.current.noticeText).toBe('Custom timeout test');

		// Dismissed after 5000ms
		act(() => {
			vi.advanceTimersByTime(2000);
		});
		expect(result.current.noticeText).toBeUndefined();
	});

	it('clears previous timeout when new notice is shown', () => {
		const { result } = renderHook(() =>
			useNoticeSystem({ timeoutDuration: 3000 })
		);

		// Show first notice
		act(() => {
			result.current.showNotice('success', 'First message');
		});

		// Wait 2 seconds (not enough to dismiss)
		act(() => {
			vi.advanceTimersByTime(2000);
		});

		expect(result.current.noticeText).toBe('First message');

		// Show second notice (should reset timer)
		act(() => {
			result.current.showNotice('error', 'Second message');
		});

		expect(result.current.noticeText).toBe('Second message');

		// Wait another 2 seconds (total 4s from first, but only 2s from second)
		act(() => {
			vi.advanceTimersByTime(2000);
		});

		// Should still be visible (only 2s elapsed for second message)
		expect(result.current.noticeText).toBe('Second message');

		// Wait remaining time
		act(() => {
			vi.advanceTimersByTime(1000);
		});

		// Now dismissed
		expect(result.current.noticeText).toBeUndefined();
	});

	it('can show multiple different notice types', () => {
		const { result } = renderHook(() => useNoticeSystem());

		act(() => {
			result.current.showNotice('success', 'Success message');
		});
		expect(result.current.noticeStatus).toBe('success');

		act(() => {
			result.current.hideNotice();
		});

		act(() => {
			result.current.showNotice('error', 'Error message');
		});
		expect(result.current.noticeStatus).toBe('error');
		expect(result.current.noticeText).toBe('Error message');
	});

	it('manual hideNotice cancels auto-dismiss timeout', () => {
		const { result } = renderHook(() =>
			useNoticeSystem({ timeoutDuration: 3000 })
		);

		act(() => {
			result.current.showNotice('success', 'Test message');
		});

		expect(result.current.noticeText).toBe('Test message');

		// Manually hide before timeout
		act(() => {
			vi.advanceTimersByTime(1000);
			result.current.hideNotice();
		});

		expect(result.current.noticeText).toBeUndefined();

		// Continue advancing time - should stay undefined
		act(() => {
			vi.advanceTimersByTime(3000);
		});

		expect(result.current.noticeText).toBeUndefined();
	});
});
