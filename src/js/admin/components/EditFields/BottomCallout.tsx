import { Button } from '@wordpress/components';

export default function BottomCallout() {
	return (
		<>
			<hr />
			<section className="petitioner-callout-box">
				<h2>
					Thanks for using{' '}
					<span className="text-ptr-red">Petitioner!</span>
				</h2>
				<p>
					Hi! I’m Anton, the creator of this plugin. I truly
					appreciate you giving it a try and hope it makes your work
					easier. If you're enjoying it, I’d be super grateful if you
					left a review!
				</p>
				<p>
					Have questions or ideas for new features? Check out the
					documentation or feel free to reach out directly—I’d love to
					hear from you.
				</p>

				<p>Cheers!</p>
				<div className="ptr-action-buttons">
					<Button
						icon="star-empty"
						href="https://wordpress.org/support/plugin/petitioner/reviews/#new-post"
						variant="primary"
					>
						Leave a review
					</Button>
					<Button
						icon="book-alt"
						href="https://getpetitioner.com/docs/"
						variant="tertiary"
					>
						Documentation
					</Button>
					<Button
						icon="email"
						href="https://getpetitioner.com/contact/"
						variant="tertiary"
					>
						Get in touch
					</Button>
				</div>
			</section>
		</>
	);
}
