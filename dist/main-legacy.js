;
(function () {
  System.register(['./assets/utilities-legacy-Dzd-Bk5k.js'], function (exports, module) {
    'use strict';

    var safelyParseJSON;
    return {
      setters: [module => {
        safelyParseJSON = module.s;
      }],
      execute: function () {
        var __vite_style__ = document.createElement('style');
        __vite_style__.textContent = ".petitioner {\n  --ptr-color-primary: #e01a2b;\n  --ptr-color-dark: #000000;\n  --ptr-color-grey: #efefef;\n  --ptr-fs-sm: 14px;\n  --ptr-fs-md: 18px;\n  --ptr-spacing-x: 16px;\n  --ptr-spacing-y: 16px;\n  --ptr-wrapper-bg: white;\n  --ptr-wrapper-radius: 16px;\n  --ptr-input-border-width: 1px;\n  --ptr-input-border-color: #a1a1a1;\n  --ptr-input-border-color-active: #00000;\n  --ptr-input-border-radius: 8px;\n  --ptr-input-spacing-y: 0.7rem;\n  --ptr-input-spacing-x: 16px;\n  --ptr-input-line-height: 40px;\n  --ptr-label-font-size: var(--ptr-fs-sm);\n  --ptr-btn-font-size: var(--ptr-fs-md);\n  --ptr-btn-bg: var(--ptr-color-primary);\n  --ptr-btn-bg-hover: var(--ptr-color-dark);\n  --ptr-button-border-width: var(--ptr-input-border-width);\n  --ptr-button-border-color: transparent;\n  --ptr-button-border-color-active: var(--ptr-color-dark);\n  --ptr-button-border-radius: 8px;\n  --ptr-progress-height: 8px;\n  --ptr-progress-bg: var(--ptr-color-grey);\n  --ptr-progress-radius: 4px;\n  --ptr-progress-inner-bg: var(--ptr-color-primary);\n  --ptr-transition-duration: 0.2s;\n  padding: var(--ptr-spacing-y) var(--ptr-spacing-x);\n  background-color: var(--ptr-wrapper-bg);\n  border-radius: var(--ptr-wrapper-radius);\n  box-sizing: border-box;\n}\n.petitioner__input {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  margin-bottom: 8px;\n}\n.petitioner__input label {\n  font-size: var(--ptr-label-font-size);\n}\n.petitioner__input input:not([type=checkbox]), .petitioner__input textarea {\n  outline: none;\n  border-radius: var(--ptr-input-border-radius);\n  border-color: var(--ptr-input-border-color);\n  border-width: var(--ptr-input-border-width);\n  padding: var(--ptr-input-spacing-y) var(--ptr-input-spacing-x);\n  border-style: solid;\n  font-size: var(--ptr-label-font-size);\n  line-height: var(--ptr-input-line-height);\n}\n.petitioner__input input:not([type=checkbox]):focus, .petitioner__input textarea:focus {\n  border-color: var(--ptr-input-border-color-active);\n}\n.petitioner__input select {\n  outline: none;\n  border-radius: var(--ptr-input-border-radius);\n  border: var(--ptr-input-border-width) solid var(--ptr-input-border-color);\n  padding: var(--ptr-input-spacing-y) var(--ptr-input-spacing-x);\n  font-size: var(--ptr-label-font-size);\n  background-color: var(--ptr-wrapper-bg);\n  color: var(--ptr-color-dark);\n  appearance: none;\n  background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23000000'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E\");\n  background-repeat: no-repeat;\n  background-position: right var(--ptr-input-spacing-x) center;\n  background-size: 1rem;\n  cursor: pointer;\n  transition: border-color var(--ptr-transition-duration), background-color var(--ptr-transition-duration);\n  line-height: var(--ptr-input-line-height);\n}\n.petitioner__input select:focus {\n  border-color: var(--ptr-input-border-color-active);\n  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);\n}\n.petitioner__input select:hover {\n  background-color: var(--ptr-color-grey);\n}\n.petitioner__input select::placeholder {\n  color: #aaa;\n}\n.petitioner__input--checkbox {\n  flex-direction: row;\n  flex-wrap: nowrap;\n  align-items: flex-start;\n  margin-top: 16px;\n  margin-bottom: 16px;\n}\n.petitioner__input--checkbox label {\n  order: 1;\n  display: inline-block;\n  width: auto;\n  transform: translatey(-3%);\n}\n.petitioner__input--checkbox label:hover {\n  cursor: pointer;\n}\n.petitioner__input--checkbox input[type=checkbox] {\n  -webkit-appearance: none;\n  appearance: none;\n  width: var(--ptr-fs-md);\n  height: var(--ptr-fs-md);\n  border: var(--ptr-input-border-width) solid var(--ptr-input-border-color);\n  border-radius: 4px;\n  background-color: var(--ptr-wrapper-bg);\n  display: inline-block;\n  cursor: pointer;\n  transition: background-color var(--ptr-transition-duration), border-color var(--ptr-transition-duration);\n  padding: 0px;\n  flex-shrink: 0;\n}\n.petitioner__input--checkbox input[type=checkbox]:checked {\n  background-color: var(--ptr-color-primary);\n  border-color: var(--ptr-color-primary);\n  background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24'%3E%3Cpath d='M20.285 6.707l-1.413-1.414L9.5 14.664 5.128 10.293 3.714 11.707 9.5 17.5z'/%3E%3C/svg%3E\");\n  background-size: 70%;\n  background-position: center;\n  background-repeat: no-repeat;\n}\n.petitioner__input--checkbox input[type=checkbox]:focus {\n  outline: none;\n  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);\n}\n.petitioner__btn {\n  margin-top: 4px;\n  outline: none;\n  border-radius: var(--ptr-button-border-radius);\n  border-color: var(--ptr-button-border-color);\n  border-width: var(--ptr-button-border-width);\n  padding: var(--ptr-input-spacing-y) var(--ptr-input-spacing-x);\n  border-style: solid;\n  width: 100%;\n  background-color: var(--ptr-color-grey);\n  transition: 0.1s;\n  margin-bottom: 16px;\n}\n.petitioner__btn--submit {\n  font-size: var(--ptr-fs-md);\n  background-color: var(--ptr-color-primary);\n  color: white;\n}\n.petitioner__btn--submit:hover {\n  background-color: var(--ptr-color-dark);\n}\n.petitioner__btn--letter {\n  font-size: var(--ptr-fs-sm);\n  background-color: var(--ptr-color-grey);\n  color: var(--ptr-color-dark);\n}\n.petitioner__btn--letter:hover {\n  background-color: var(--ptr-color-dark);\n  color: white;\n}\n.petitioner__btn:active, .petitioner__btn:focus {\n  border-color: var(--ptr-button-border-color-active);\n}\n.petitioner__btn:hover {\n  cursor: pointer;\n}\n.petitioner__title {\n  padding: 0px;\n  margin: 0px 0px 16px 0px;\n  font-size: 24px;\n}\n.petitioner__goal {\n  width: 100%;\n  display: flex;\n  flex-wrap: wrap;\n  margin-top: 24px;\n  margin-bottom: 24px;\n}\n.petitioner__goal .petitioner__num {\n  font-size: 1rem;\n  display: block;\n  font-weight: bold;\n}\n.petitioner__goal .petitioner__numlabel {\n  font-size: 14px;\n}\n.petitioner__goal .petitioner__col {\n  width: 50%;\n  display: flex;\n  flex-direction: column;\n}\n.petitioner__goal .petitioner__col--end {\n  align-items: flex-end;\n}\n@media (min-width: 768px) {\n  .petitioner__goal .petitioner__num {\n    font-size: 1.5rem;\n  }\n  .petitioner__goal .petitioner__numlabel {\n    font-size: 16px;\n  }\n}\n.petitioner__progress {\n  display: block;\n  width: 100%;\n  height: var(--ptr-progress-height);\n  display: block;\n  background-color: var(--ptr-progress-bg);\n  border-radius: var(--ptr-progress-radius);\n  position: relative;\n}\n.petitioner__progress-bar {\n  flex-grow: 0;\n  border-radius: var(--ptr-progress-radius);\n  background-color: var(--ptr-progress-inner-bg);\n  height: 100%;\n  display: block;\n}\n.petitioner__progress-bar span {\n  position: absolute;\n  display: block;\n  left: 0;\n  right: 0;\n  margin: 0px auto;\n  top: calc(-100% - 8px);\n  font-size: 14px;\n  text-align: center;\n}\n.petitioner__response {\n  display: none;\n}\n.petitioner__response h3 {\n  margin: 0px;\n  padding: 0px;\n}\n.petitioner--submitted form {\n  display: none;\n}\n.petitioner--submitted .petitioner__response {\n  display: block;\n}\n.petitioner--loading form {\n  pointer-events: none;\n  opacity: 0.8;\n  cursor: progress;\n}\n.petitioner .petitioner-disclaimer-text {\n  font-size: 12px;\n}\n\n.grecaptcha-badge {\n  visibility: hidden;\n}\n\n.petitioner-modal {\n  position: fixed;\n  display: none;\n  justify-content: center;\n  align-items: center;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  z-index: 99;\n}\n.petitioner-modal--visible {\n  display: flex;\n}\n.petitioner-modal__backdrop {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(0, 0, 0, 0.5);\n}\n.petitioner-modal__close {\n  position: absolute;\n  right: 8px;\n  top: 8px;\n  z-index: 2;\n  background: transparent;\n  outline: none;\n  border: 1px solid #ccc;\n  padding: 8px;\n  border-radius: 4px;\n  line-height: 1;\n  width: 24px;\n  height: 24px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  transition: 0.1s;\n  color: var(--ptr-color-dark);\n}\n.petitioner-modal__close:hover {\n  cursor: pointer;\n  background: var(--ptr-color-dark);\n  color: white;\n}\n.petitioner-modal__close span {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  border: 0;\n}\n.petitioner-modal hr {\n  border: 0px;\n  height: 1px;\n  background: #ccc;\n  margin-top: 24px;\n  margin-bottom: 8px;\n}\n.petitioner-modal__letter {\n  position: relative;\n  max-width: 500px;\n  background-color: white;\n  border-radius: 16px;\n  padding: 24px;\n}\n.petitioner-modal__inner {\n  max-height: 40vh;\n  overflow-y: auto;\n}\n\n.petitioner-turnstile-container iframe {\n  width: 100%;\n}\n\n.petitioner-submissions .submissions__item {\n  display: inline;\n}\n.petitioner-submissions .ptr-pagination {\n  display: flex;\n  justify-content: flex-start;\n  align-items: center;\n  margin-top: 24px;\n  gap: 4px;\n  flex-wrap: wrap;\n}\n.petitioner-submissions .ptr-pagination button {\n  background-color: var(--ptr-color-grey);\n  border: none;\n  border-radius: var(--ptr-input-border-radius);\n  padding: var(--ptr-input-spacing-y) var(--ptr-input-spacing-x);\n  cursor: pointer;\n  font-size: var(--ptr-fs-sm);\n  color: var(--ptr-color-dark);\n  transition: background-color var(--ptr-transition-duration);\n}\n.petitioner-submissions .ptr-pagination button.active {\n  background-color: var(--ptr-color-primary);\n  color: white;\n}\n.petitioner-submissions .ptr-pagination button:hover {\n  background-color: var(--ptr-color-dark);\n  color: white;\n}\n.petitioner-submissions .ptr-pagination button[disabled] {\n  background-color: var(--ptr-color-grey);\n  color: var(--ptr-color-dark);\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.petitioner-submissions--simple {\n  border: 1px solid var(--ptr-color-grey);\n}\n.petitioner-submissions--table {\n  --ptr-submission-columns: 4;\n  padding-inline: 0;\n}\n.petitioner-submissions--table .submissions__list {\n  display: grid;\n  grid-auto-rows: minmax(40px, auto);\n}\n.petitioner-submissions--table .submissions__item {\n  display: contents;\n}\n.petitioner-submissions--table .submissions__item--heading div {\n  font-weight: bold;\n}\n.petitioner-submissions--table .submissions__item > div {\n  display: block;\n  padding: 4px 8px;\n  border-bottom: 1px solid var(--ptr-color-grey);\n  font-size: var(--ptr-fs-sm);\n  word-break: break-word;\n}\n.petitioner-submissions--table .submissions__list {\n  grid-template-columns: repeat(var(--ptr-submission-columns), 1fr);\n}\n.petitioner-submissions--table .submissions__item__inner strong {\n  display: none;\n}\n@media (max-width: 768px) {\n  .petitioner-submissions--table .submissions__item {\n    position: relative;\n  }\n  .petitioner-submissions--table .submissions__item__inner {\n    display: flex;\n    justify-content: space-between;\n    gap: 4px;\n  }\n  .petitioner-submissions--table .submissions__item:after {\n    content: \"\";\n    display: block;\n    position: absolute;\n    left: 0;\n    right: 0;\n    top: 100%;\n    width: 100%;\n    height: 1px;\n    background-color: var(--ptr-color-grey);\n    margin-top: 8px;\n  }\n  .petitioner-submissions--table .submissions__item:last-of-type:after {\n    display: none;\n  }\n  .petitioner-submissions--table .submissions__item__inner strong {\n    display: inline;\n  }\n  .petitioner-submissions--table .submissions__item.submissions__item--heading {\n    display: none;\n  }\n  .petitioner-submissions--table .submissions__list {\n    display: flex;\n    flex-direction: column;\n    gap: 24px;\n  }\n  .petitioner-submissions--table .submissions__item {\n    display: flex;\n    flex-direction: column;\n  }\n  .petitioner-submissions--table .submissions__item > div {\n    border-bottom: none;\n    padding: 4px 0;\n  }\n}/*$vite$:1*/";
        document.head.appendChild(__vite_style__);
        class ReCaptcha {
          constructor(petitionForm) {
            if (typeof window.petitionerCaptcha !== "undefined" && window.petitionerCaptcha.recaptchaSiteKey) {
              const recaptchaField = petitionForm.querySelector('[name="petitioner-g-recaptcha-response"]');
              petitionForm.addEventListener("focusin", function () {
                if (recaptchaField && recaptchaField.value) {
                  return;
                }
                if (typeof grecaptcha === "undefined" || typeof grecaptcha?.ready === "undefined") {
                  return;
                }
                grecaptcha.ready(function () {
                  grecaptcha.execute(window.petitionerCaptcha.recaptchaSiteKey, {
                    // action: 'submit',
                  }).then(token => {
                    if (recaptchaField) {
                      recaptchaField.value = token;
                    }
                  });
                });
              }, {
                once: true
              });
            } else {
              console.error("petitioner - reCAPTCHA site key is missing or reCAPTCHA failed to load.");
            }
          }
        }
        class HCaptcha {
          constructor(currentForm) {
            this.widgetId = null;
            this.callbackFunction = null;
            this.form = currentForm;
            this.hcaptchaField = this.form.querySelector('[name="petitioner-h-captcha-response"]');
            this.hcaptchaContainer = this.form.querySelector(".petitioner-h-captcha-container");
            if (!this.isHCaptchaReady()) {
              return;
            }
            this.initHCaptcha();
          }
          isHCaptchaReady() {
            return !!(typeof hcaptcha !== "undefined" && window.petitionerCaptcha?.enableHcaptcha && window.petitionerCaptcha?.hcaptchaSiteKey && this.hcaptchaContainer);
          }
          initHCaptcha() {
            if (!hcaptcha || !window.petitionerCaptcha?.hcaptchaSiteKey || !this.hcaptchaContainer) {
              return;
            }
            this.widgetId = hcaptcha.render(this.hcaptchaContainer, {
              sitekey: window.petitionerCaptcha.hcaptchaSiteKey,
              size: "invisible",
              callback: this.handleSuccess.bind(this)
            });
          }
          handleSuccess(token) {
            if (!token) {
              console.warn("❌ petitioner - hCaptcha token missing.");
              return;
            }
            if (!this.hcaptchaField) {
              console.error("❌ petitioner - hCaptcha input field not found.");
              return;
            }
            this.hcaptchaField.value = token;
            if (typeof this.callbackFunction === "function") {
              this.callbackFunction();
            }
          }
          validate(callback) {
            if (!this.hcaptchaField || this.hcaptchaField.value) {
              callback();
              return;
            }
            this.callbackFunction = callback;
            if (hcaptcha && this.widgetId) {
              hcaptcha.execute(this.widgetId);
            }
          }
        }
        class Turnstile {
          constructor(petitionForm) {
            this.widgetId = null;
            this.callbackFunction = null;
            this.form = petitionForm;
            this.turnstileField = this.form.querySelector('[name="petitioner-turnstile-response"]');
            this.turnstileContainer = this.form.querySelector(".petitioner-turnstile-container");
            if (typeof turnstile === "undefined" || !window.petitionerCaptcha?.turnstileSiteKey || !this.turnstileContainer) {
              return;
            }
            this.initTurnstile();
          }
          initTurnstile() {
            this.widgetId = turnstile.render(this.turnstileContainer, {
              sitekey: petitionerCaptcha.turnstileSiteKey,
              callback: this.handleSuccess.bind(this),
              theme: "light",
              "error-callback": this.handleError.bind(this)
            });
          }
          handleSuccess(token) {
            if (!token) {
              console.warn("❌ petitioner - Turnstile token missing.");
              return;
            }
            if (!this.turnstileField) {
              console.error("❌ petitioner - Turnstile input field not found.");
              return;
            }
            this.turnstileField.value = token;
            if (typeof this.callbackFunction === "function") {
              this.callbackFunction();
            }
          }
          handleError() {
            console.error("❌ petitioner - Turnstile encountered an error.");
          }
          validate(callback) {
            if (!this.turnstileField || this.turnstileField.value) {
              callback();
              return;
            }
            this.callbackFunction = callback;
            turnstile.execute(this.widgetId);
          }
        }
        class PetitionerForm {
          constructor(wrapper) {
            this.captchaValidated = false;
            this.hcaptcha = null;
            this.turnstile = null;
            this._escListener = null;
            this.wrapper = wrapper;
            this.responseTitle = null;
            this.responseText = null;
            this.formEl = null;
            this.viewLetterBTN = null;
            this.petitionerModal = null;
            this.modalClose = null;
            this.backdrop = null;
            const settings = window?.petitionerFormSettings || {};
            const {
              actionPath = "",
              nonce = ""
            } = settings;
            this.actionPath = actionPath || "";
            this.nonce = nonce;
            if (!this.wrapper) return;
            this.responseTitle = this.wrapper.querySelector(".petitioner__response > h3");
            this.responseText = this.wrapper.querySelector(".petitioner__response > p");
            this.formEl = this.wrapper.querySelector("form");
            this.viewLetterBTN = this.wrapper.querySelector(".petitioner__btn--letter");
            this.petitionerModal = this.wrapper.querySelector(".petitioner-modal");
            this.modalClose = this.wrapper.querySelector(".petitioner-modal__close");
            this.backdrop = this.wrapper.querySelector(".petitioner-modal__backdrop");
            this.initializeCaptcha();
            this.setupEventListeners();
          }
          initializeCaptcha() {
            if (typeof window.petitionerCaptcha === "undefined") return;
            if (window.petitionerCaptcha.enableRecaptcha && this.formEl) {
              new ReCaptcha(this.formEl);
            }
            if (window.petitionerCaptcha.enableHcaptcha && this.formEl) {
              this.hcaptcha = new HCaptcha(this.formEl);
            }
            if (window.petitionerCaptcha.enableTurnstile && this.formEl) {
              this.turnstile = new Turnstile(this.formEl);
            }
          }
          setupEventListeners() {
            if (this.formEl) {
              this.formEl.addEventListener("submit", this.handleFormSubmit.bind(this));
            }
            if (this.viewLetterBTN) {
              this.viewLetterBTN.addEventListener("click", () => this.toggleModal(true));
            }
            if (this.backdrop) {
              this.backdrop.addEventListener("click", () => this.toggleModal(false));
            }
            if (this.modalClose) {
              this.modalClose.addEventListener("click", () => this.toggleModal(false));
            }
          }
          showResponseMSG(messaging, isSuccess = false) {
            this.wrapper.classList.add("petitioner--submitted");
            const {
              title,
              message
            } = messaging || {
              title: "",
              message: ""
            };
            if (this.responseTitle) this.responseTitle.innerText = title;
            if (this.responseText) this.responseText.innerHTML = message;
          }
          toggleModal(isShow = true) {
            if (!this.petitionerModal) return;
            this.petitionerModal.classList[isShow ? "add" : "remove"]("petitioner-modal--visible");
            if (isShow) {
              this._escListener = e => {
                if (e.key === "Escape") this.toggleModal(false);
              };
              document.addEventListener("keydown", this._escListener);
            } else if (this._escListener) {
              document.removeEventListener("keydown", this._escListener);
              this._escListener = null;
            }
          }
          handleFormSubmit(e) {
            e.preventDefault();
            if (this.shouldValidateHCaptcha()) {
              this.hcaptcha.validate(() => {
                this.captchaValidated = true;
                this.submitForm();
              });
              return;
            }
            if (this.shouldValidateTurnstile()) {
              this.turnstile.validate(() => {
                this.captchaValidated = true;
                this.submitForm();
              });
              return;
            }
            this.submitForm();
          }
          shouldValidateHCaptcha() {
            return !!(petitionerCaptcha?.enableHcaptcha && this.hcaptcha && !this.captchaValidated);
          }
          shouldValidateTurnstile() {
            return !!(petitionerCaptcha?.enableTurnstile && this.turnstile && !this.captchaValidated);
          }
          submitForm() {
            if (!this.formEl) return;
            this.wrapper.classList.add("petitioner--loading");
            const formData = new FormData(this.formEl);
            formData.append("petitioner_nonce", this.nonce);
            fetch(this.actionPath, {
              method: "POST",
              body: formData,
              credentials: "same-origin",
              headers: {
                "X-Requested-With": "XMLHttpRequest"
              }
            }).then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            }).then(res => {
              if (res.success) {
                this.showResponseMSG(res.data, true);
              } else {
                this.showResponseMSG(res.data, false);
              }
              this.handleSubmissionComplete(formData);
            }).catch(error => {
              console.error("Error:", error);
              alert("An unexpected error occurred. Please try again later.");
              this.handleSubmissionComplete();
            });
          }
          handleSubmissionComplete(formData) {
            this.wrapper.classList.remove("petitioner--loading");
            this.formEl?.reset();
            this.captchaValidated = false;
            if (formData) {
              const event = new CustomEvent("petitionerFormSubmit", {
                detail: {
                  formData
                }
              });
              document.dispatchEvent(event);
            }
          }
        }
        class SubmissionsRenderer {
          constructor(options) {
            this.options = options;
            this.options.currentPage = this.options.currentPage || 1;
            this.submissionListDiv = document.createElement("div");
            this.submissionListDiv.className = "submissions__list";
            this.paginationDiv = document.createElement("div");
            this.paginationDiv.className = "submissions__pagination";
            if (!this.options.wrapper) {
              throw new Error("Element not found");
            }
          }
          attachEventListeners() {
            if (!this.paginationDiv) return;
            this.paginationDiv.addEventListener("click", async event => {
              const target = event.target;
              if (target.tagName === "BUTTON") {
                const page = parseInt(target.dataset.page || "1", 10);
                if (!isNaN(page)) {
                  this.options.currentPage = page;
                  const newSubmissions = await this.options.onPageChange(page);
                  this.options.submissions = newSubmissions;
                  this.update();
                }
              }
            });
          }
          render() {
            if (!this.options.submissions) {
              return;
            }
            this.options.wrapper.appendChild(this.submissionListDiv);
            this.options.wrapper.appendChild(this.paginationDiv);
            this.submissionListDiv.innerHTML = this.renderSubmissionsList();
            this.paginationDiv.innerHTML = this.renderPagination();
            this.attachEventListeners();
          }
          update() {
            this.submissionListDiv.innerHTML = this.renderSubmissionsList();
            this.paginationDiv.querySelectorAll(".active").forEach(btn => {
              btn.classList.remove("active");
            });
            this.paginationDiv.querySelector(`[data-page="${this.options.currentPage}"]`)?.classList.add("active");
          }
          renderSubmissionsList() {
            if (!this.options.submissions || this.options.submissions.length === 0) {
              return "";
            }
            return this.options.submissions.map(submission => {
              return this.renderSubmissionItem(submission);
            }).join(", ");
          }
          renderSubmissionItem(submission) {
            return `<span class="submissions__item">${submission.name}</span>`;
          }
          renderPagination() {
            if (!this.options.total || !this.options.perPage || !this.options.pagination) {
              return "";
            }
            const totalPages = Math.ceil(this.options.total / this.options.perPage);
            if (totalPages <= 1) {
              return "";
            }
            let paginationHTML = '<div class="ptr-pagination">';
            for (let i = 1; i <= totalPages; i++) {
              paginationHTML += `<button class="ptr-pagination__item ${i === this.options.currentPage ? "active" : ""}" data-page="${i}">${i}</button>`;
            }
            paginationHTML += "</div>";
            return paginationHTML;
          }
        }
        class SubmissionsRendererTable extends SubmissionsRenderer {
          constructor(options) {
            super(options);
            this.options = options;
          }
          render() {
            if (!this.options.submissions) {
              return;
            }
            this.options.wrapper.appendChild(this.submissionListDiv);
            this.options.wrapper.appendChild(this.paginationDiv);
            this.options.wrapper.style = this.getWrapperStyles();
            this.submissionListDiv.innerHTML = this.renderSubmissionsList();
            this.paginationDiv.innerHTML = this.renderPagination();
            this.attachEventListeners();
          }
          renderSubmissionsList() {
            if (!this.options.submissions || this.options.submissions.length === 0) {
              return "";
            }
            const labels = this.prepareLabels();
            const list = this.options.submissions.map(submission => {
              return this.renderSubmissionItem(submission);
            }).join("");
            return `
		<div class="submissions__item submissions__item--heading">
			${labels.map(key => {
              return `<div>${key}</div>`;
            }).join("")}
		</div>
		${list}`;
          }
          prepareLabels() {
            const labels = [];
            const submissionEntry = this.options.submissions[0];
            Object.keys(submissionEntry).forEach(key => {
              if (!this.options.labels?.[key] || !this.options.fields.includes(key)) {
                return;
              }
              labels.push(this.options.labels?.[key]);
            });
            return labels;
          }
          renderSubmissionItem(submission) {
            const filteredKeys = Object.keys(submission).filter(key => key in this.options.labels && this.options.fields.includes(key));
            return `<div class="submissions__item">
			${filteredKeys.map(key => {
              const renderedValue = key === "fname" ? `${submission.fname} ${submission.lname}` : submission?.[key];
              return `<div class="submissions__item__inner">
						<strong>${this.options.labels?.[key] || key}:</strong>
						${renderedValue ? renderedValue : ""}
					</div>`;
            }).join("")}
		</div>`;
          }
          /**
           *
           * @returns string final CSS for the wrapper
           */
          getWrapperStyles() {
            const labels = this.prepareLabels();
            return `--ptr-submission-columns: ${labels.length}`;
          }
        }
        class PetitionerSubmissions {
          constructor(wrapper) {
            this.wrapper = wrapper;
            this.currentPage = 1;
            this.totalResults = 10;
            if (!this.wrapper) {
              throw new Error("Element not found");
            }
            const settings = this.wrapper.dataset.ptrSettings;
            this.ajaxurl = window?.petitionerSubmissionSettings?.actionPath || "";
            this.nonce = window?.petitionerSubmissionSettings?.nonce || "";
            this.labels = {};
            if (!this.ajaxurl || !this.nonce) {
              throw new Error("AJAX URL or nonce is not defined in settings");
            }
            if (!settings) {
              throw new Error("Wrapper is missing data-ptr-settings attribute");
            }
            const settingsJSON = safelyParseJSON(settings);
            if (!settingsJSON || typeof settingsJSON !== "object" || !settingsJSON.form_id || !settingsJSON.per_page || !settingsJSON.style) {
              throw new Error("Invalid settings provided for PetitionerSubmissions");
            }
            this.settings = settingsJSON;
            this.init();
          }
          async init() {
            if (!this.settings) {
              return;
            }
            await this.fetchSubmissions();
            if (typeof this.submissions === "object" && this.submissions?.length > 0) {
              const RenderClass = this.settings.style === "simple" ? SubmissionsRenderer : SubmissionsRendererTable;
              this.renderer = new RenderClass({
                wrapper: this.wrapper,
                submissions: this.submissions,
                perPage: this.settings.per_page,
                total: this.totalResults,
                currentPage: this.currentPage,
                labels: this.labels,
                fields: this.settings.fields ? this.settings.fields.split(",").map(f => f.trim()) : [],
                pagination: this.settings.show_pagination,
                onPageChange: async pageNum => {
                  this.currentPage = pageNum;
                  await this.fetchSubmissions();
                  return this.submissions ?? [];
                }
              });
              this.renderer.render();
            }
          }
          buildURL() {
            const url = new URL(this.ajaxurl, window.location.origin);
            url.searchParams.set("form_id", String(this.settings?.form_id));
            url.searchParams.set("per_page", String(this.settings?.per_page));
            url.searchParams.set("page", String(this.currentPage));
            if (this.settings?.fields) {
              url.searchParams.set("fields", this.settings.fields);
            }
            return url.toString();
          }
          async fetchSubmissions() {
            const fetchURL = this.buildURL();
            const submissions = await fetch(fetchURL);
            if (!submissions.ok) {
              throw new Error("Failed to fetch submissions");
            }
            const response = await submissions.json();
            if (!response.success) {
              throw new Error("Failed to fetch submissions: " + response.data);
            }
            this.totalResults = Number(response.data.total) || 0;
            this.submissions = response.data.submissions || [];
            this.labels = response.data.labels || [];
          }
        }
        const allPetitions = document.querySelectorAll(".petitioner");
        allPetitions.forEach(petition => {
          if (!(petition instanceof HTMLElement)) {
            return;
          }
          new PetitionerForm(petition);
        });
        const allSubmissions = document.querySelectorAll(".petitioner-submissions");
        allSubmissions.forEach(submissionsDiv => {
          if (!(submissionsDiv instanceof HTMLElement)) {
            return;
          }
          new PetitionerSubmissions(submissionsDiv);
        });
        if (window.location.search.includes("petitioner=confirmed")) {
          alert("Thank you for confirming your email!");
        }
        if (window.location.search.includes("petitioner=invalid")) {
          alert("Something went wrong - could not confirm your email");
        }
      }
    };
  });
})();
