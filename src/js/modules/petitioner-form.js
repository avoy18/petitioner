export default class PetitionerForm {
  constructor(theForm) {
    this.formEl = theForm;

    if(!this.formEl) return;

    this.formEl.addEventListener('submit', this.handleFormSubmit);
  }

  handleFormSubmit = (e) => {
    e.preventDefault();

    // Perform form submission logic here
    alert('Form submitted!');

    // Clear form inputs
    this.formEl.reset();
  }
}
