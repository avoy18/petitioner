// main.js
import "../scss/style.scss";
import PetitionerForm from "./modules/petitioner-form";

const allPetitions = document.querySelectorAll(".petitioner");

for (const petition of allPetitions) {
  new PetitionerForm(petition);
}
