import PetitionerForm from './frontend/form';
import PetitionerSubmissions from './frontend/submissions';
import '../scss/style.scss';

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

if (window.location.search.includes('petitioner=confirmed')) {
	alert('Thank you for confirming your email!');
}

if (window.location.search.includes('petitioner=invalid')) {
	alert('Something went wrong - could not confirm your email');
}