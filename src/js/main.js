import PetitionerForm from './frontend/form';
import '../scss/style.scss';

const allPetitions = document.querySelectorAll('.petitioner');

// Initialize each form
allPetitions.forEach((petition) => {
	new PetitionerForm(petition);
});

if (window.location.search.includes('petitioner=confirmed')) {
	alert('Thank you for confirming your email!');
}

if (window.location.search.includes('petitioner=invalid')) {
	alert('Something went wrong - could not confirm your email');
}