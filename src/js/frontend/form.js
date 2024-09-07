export default class PetitionerForm {
  constructor(wrapper) {
    this.wrapper = wrapper;
    this.responseTitle = this.wrapper.querySelector('.petitioner__response > h3');
    this.responseText = this.wrapper.querySelector('.petitioner__response > p');
    this.formEl = this.wrapper.querySelector('form');

    if (!this.formEl) return;

    this.actionPath = this.formEl?.action ?? "";

    this.formEl.addEventListener("submit", this.handleFormSubmit);
  }

  showResponseMSG(title = 'Something went wrong', text = 'Please try again', isSuccess = false) {
    this.wrapper.classList.add('petitioner--submitted');
    this.responseTitle.innerText = title;
    this.responseText.innerText = text;
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
          this.showResponseMSG(
            'Thank you!',
            'Your signature has been added!'
          )
        } else {
          this.showResponseMSG(
            'Something went wrong',
            'There was an error submitting your petition. Please try again.'
          )
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
