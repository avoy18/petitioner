export default class PetitionerForm {
  constructor(wrapper) {
    this.wrapper = wrapper;

    if (!this.wrapper) return;

    this.responseTitle = this.wrapper.querySelector('.petitioner__response > h3');
    this.responseText = this.wrapper.querySelector('.petitioner__response > p');
    this.formEl = this.wrapper.querySelector('form');

    // handling modal
    this.viewLetterBTN = this.wrapper.querySelector('.petitioner__btn--letter');
    this.petitionerModal = this.wrapper.querySelector('.petitioner-modal');
    this.modalClose = this.wrapper.querySelector('.petitioner-modal__close');
    this.backdrop = this.wrapper.querySelector('.petitioner-modal__backdrop');

    // ajax action path
    this.actionPath = this.formEl?.action ?? "";

    // event listeners
    this.formEl.addEventListener("submit", this.handleFormSubmit);

    this.viewLetterBTN.addEventListener('click', () => {
      this.toggleModal(true)
    });

    this.backdrop.addEventListener('click', () => {
      this.toggleModal(false)
    });

    this.modalClose.addEventListener('click', () => {
      this.toggleModal(false)
    });

  }

  showResponseMSG(title = 'Something went wrong', text = 'Please try again', isSuccess = false) {
    this.wrapper.classList.add('petitioner--submitted');
    this.responseTitle.innerText = title;
    this.responseText.innerText = text;
  }

  toggleModal(isShow = true) {
    this.petitionerModal.classList[isShow ? 'add' : 'remove']('petitioner-modal--visible');
  }

  handleFormSubmit = (e) => {
    e.preventDefault();
    this.wrapper.classList.add('petitioner--loading');
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
      .then((res) => {
        if (res.success) {
          this.showResponseMSG(
            'Thank you!',
            res.data
          )
        } else {
          this.showResponseMSG(
            'Could not submit the form.',
            res.data
          );
        }

        this.wrapper.classList.remove('petitioner--loading');
        this.formEl.reset();
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An unexpected error occurred. Please try again later.");
        this.wrapper.classList.remove('petitioner--loading');
        this.formEl.reset();
      });
  };
}
