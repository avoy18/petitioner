import PetitionerForm from "./frontend/form";
import "../scss/style.scss"
const allPetitions = document.querySelectorAll(".petitioner");

for (const petition of allPetitions) {
  new PetitionerForm(petition);
}
