import PetitionerForm from './frontend/form';
import '../scss/style.scss';

const allPetitions = document.querySelectorAll('.petitioner');

// window.onPetitionerHCaptchaSuccess = hCaptchaCallback;

// Initialize each form
allPetitions.forEach((petition) => {
	new PetitionerForm(petition);
});
