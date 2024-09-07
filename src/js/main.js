import PetitionerForm from "./frontend/petitioner-form";

const allPetitions = document.querySelectorAll(".petitioner");

for (const petition of allPetitions) {
  new PetitionerForm(petition);
}
