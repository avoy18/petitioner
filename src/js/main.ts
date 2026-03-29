import PetitionerForm from '@js/frontend/form';
import PetitionerSubmissions from '@js/frontend/submissions';
import '../css/frontend/index.css';

const allPetitions = document.querySelectorAll('.petitioner');

// Initialize each form
allPetitions.forEach((petition) => {
	if(!(petition instanceof HTMLElement)) {
		return;
	}

	new PetitionerForm(petition);
});

const allSubmissions = document.querySelectorAll('.petitioner-submissions');

// Initialize each submissions list
allSubmissions.forEach((submissionsDiv) => {
	if(!(submissionsDiv instanceof HTMLElement)) {
		return;
	}

	new PetitionerSubmissions(submissionsDiv);
});

const settings = window.petitionerFormSettings || {};
const labels = settings.labels || {};

if (window.location.search.includes('petitioner=confirmed')) {
	alert(labels.emailConfirmedSuccess || 'Thank you for confirming your email!');
}

if (window.location.search.includes('petitioner=invalid')) {
	alert(labels.emailConfirmedError || 'Something went wrong, could not confirm the email. Perhaps you have already confirmed it');
}