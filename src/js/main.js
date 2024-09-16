import '../scss/style.scss';
import PetitionerForm from "./frontend/form";

const allPetitions = document.querySelectorAll(".petitioner");

for (const petition of allPetitions) {
  new PetitionerForm(petition);
}
