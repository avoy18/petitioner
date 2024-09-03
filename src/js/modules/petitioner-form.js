export default class PetitionerForm {
  constructor(theForm) {
    this.formEl = theForm;

    if (!this.formEl) return;

    this.actionPath = this.formEl?.action ?? "";

    this.formEl.addEventListener("submit", this.handleFormSubmit);
  }

  handleFormSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(this.formEl);

    fetch(this.actionPath, {
      method: "POST",
      body: formData,
      credentials: "same-origin",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Petition submitted successfully!");
        } else {
          alert(
            "There was an error submitting your petition. Please try again."
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An unexpected error occurred. Please try again later.");
      });

    // Clear form inputs
    this.formEl.reset();
  };
}
