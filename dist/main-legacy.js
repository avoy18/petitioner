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
          form;
          hcaptchaField;
          hcaptchaContainer;
          widgetId = null;
          callbackFunction = null;
          constructor(currentForm) {
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
          form;
          turnstileField;
          turnstileContainer;
          widgetId = null;
          callbackFunction = null;
          constructor(petitionForm) {
            this.form = petitionForm;
            this.turnstileField = this.form.querySelector('[name="petitioner-turnstile-response"]');
            this.turnstileContainer = this.form.querySelector(".petitioner-turnstile-container");
            if (typeof window?.turnstile === "undefined" || !window.petitionerCaptcha?.turnstileSiteKey || !this.turnstileContainer) {
              return;
            }
            this.initTurnstile();
          }
          initTurnstile() {
            const sitekey = window.petitionerCaptcha?.turnstileSiteKey;
            if (!sitekey) {
              this.handleError();
              return;
            }
            this.widgetId = window?.turnstile?.render?.(this.turnstileContainer, {
              sitekey,
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
            if (this.widgetId) {
              window?.turnstile?.execute?.(this.widgetId);
            }
          }
        }
        class PetitionerForm {
          wrapper;
          responseTitle;
          responseText;
          formEl;
          viewLetterBTN;
          petitionerModal;
          modalClose;
          backdrop;
          actionPath;
          nonce;
          captchaValidated = false;
          hcaptcha = null;
          turnstile = null;
          _escListener = null;
          constructor(wrapper) {
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
          paginationDiv;
          submissionListDiv;
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
        let PetitionerSubmissions$1 = class PetitionerSubmissions {
          constructor(wrapper) {
            this.wrapper = wrapper;
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
          settings;
          submissions;
          renderer;
          ajaxurl;
          nonce;
          currentPage = 1;
          totalResults = 10;
          labels;
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
        };

        /**
         * @license
         * Copyright 2019 Google LLC
         * SPDX-License-Identifier: BSD-3-Clause
         */
        const t$2 = globalThis,
          e$2 = t$2.ShadowRoot && (void 0 === t$2.ShadyCSS || t$2.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype,
          s$2 = Symbol(),
          o$4 = new WeakMap();
        let n$3 = class n {
          constructor(t, e, o) {
            if (this._$cssResult$ = true, o !== s$2) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
            this.cssText = t, this.t = e;
          }
          get styleSheet() {
            let t = this.o;
            const s = this.t;
            if (e$2 && void 0 === t) {
              const e = void 0 !== s && 1 === s.length;
              e && (t = o$4.get(s)), void 0 === t && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), e && o$4.set(s, t));
            }
            return t;
          }
          toString() {
            return this.cssText;
          }
        };
        const r$3 = t => new n$3("string" == typeof t ? t : t + "", void 0, s$2),
          S$1 = (s, o) => {
            if (e$2) s.adoptedStyleSheets = o.map(t => t instanceof CSSStyleSheet ? t : t.styleSheet);else for (const e of o) {
              const o = document.createElement("style"),
                n = t$2.litNonce;
              void 0 !== n && o.setAttribute("nonce", n), o.textContent = e.cssText, s.appendChild(o);
            }
          },
          c$2 = e$2 ? t => t : t => t instanceof CSSStyleSheet ? (t => {
            let e = "";
            for (const s of t.cssRules) e += s.cssText;
            return r$3(e);
          })(t) : t;

        /**
         * @license
         * Copyright 2017 Google LLC
         * SPDX-License-Identifier: BSD-3-Clause
         */
        const {
            is: i$2,
            defineProperty: e$1,
            getOwnPropertyDescriptor: h$1,
            getOwnPropertyNames: r$2,
            getOwnPropertySymbols: o$3,
            getPrototypeOf: n$2
          } = Object,
          a$1 = globalThis,
          c$1 = a$1.trustedTypes,
          l$1 = c$1 ? c$1.emptyScript : "",
          p$1 = a$1.reactiveElementPolyfillSupport,
          d$1 = (t, s) => t,
          u$1 = {
            toAttribute(t, s) {
              switch (s) {
                case Boolean:
                  t = t ? l$1 : null;
                  break;
                case Object:
                case Array:
                  t = null == t ? t : JSON.stringify(t);
              }
              return t;
            },
            fromAttribute(t, s) {
              let i = t;
              switch (s) {
                case Boolean:
                  i = null !== t;
                  break;
                case Number:
                  i = null === t ? null : Number(t);
                  break;
                case Object:
                case Array:
                  try {
                    i = JSON.parse(t);
                  } catch (t) {
                    i = null;
                  }
              }
              return i;
            }
          },
          f$1 = (t, s) => !i$2(t, s),
          b = {
            attribute: true,
            type: String,
            converter: u$1,
            reflect: false,
            useDefault: false,
            hasChanged: f$1
          };
        Symbol.metadata ??= Symbol("metadata"), a$1.litPropertyMetadata ??= new WeakMap();
        let y$1 = class y extends HTMLElement {
          static addInitializer(t) {
            this._$Ei(), (this.l ??= []).push(t);
          }
          static get observedAttributes() {
            return this.finalize(), this._$Eh && [...this._$Eh.keys()];
          }
          static createProperty(t, s = b) {
            if (s.state && (s.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t) && ((s = Object.create(s)).wrapped = true), this.elementProperties.set(t, s), !s.noAccessor) {
              const i = Symbol(),
                h = this.getPropertyDescriptor(t, i, s);
              void 0 !== h && e$1(this.prototype, t, h);
            }
          }
          static getPropertyDescriptor(t, s, i) {
            const {
              get: e,
              set: r
            } = h$1(this.prototype, t) ?? {
              get() {
                return this[s];
              },
              set(t) {
                this[s] = t;
              }
            };
            return {
              get: e,
              set(s) {
                const h = e?.call(this);
                r?.call(this, s), this.requestUpdate(t, h, i);
              },
              configurable: true,
              enumerable: true
            };
          }
          static getPropertyOptions(t) {
            return this.elementProperties.get(t) ?? b;
          }
          static _$Ei() {
            if (this.hasOwnProperty(d$1("elementProperties"))) return;
            const t = n$2(this);
            t.finalize(), void 0 !== t.l && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
          }
          static finalize() {
            if (this.hasOwnProperty(d$1("finalized"))) return;
            if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d$1("properties"))) {
              const t = this.properties,
                s = [...r$2(t), ...o$3(t)];
              for (const i of s) this.createProperty(i, t[i]);
            }
            const t = this[Symbol.metadata];
            if (null !== t) {
              const s = litPropertyMetadata.get(t);
              if (void 0 !== s) for (const [t, i] of s) this.elementProperties.set(t, i);
            }
            this._$Eh = new Map();
            for (const [t, s] of this.elementProperties) {
              const i = this._$Eu(t, s);
              void 0 !== i && this._$Eh.set(i, t);
            }
            this.elementStyles = this.finalizeStyles(this.styles);
          }
          static finalizeStyles(s) {
            const i = [];
            if (Array.isArray(s)) {
              const e = new Set(s.flat(1 / 0).reverse());
              for (const s of e) i.unshift(c$2(s));
            } else void 0 !== s && i.push(c$2(s));
            return i;
          }
          static _$Eu(t, s) {
            const i = s.attribute;
            return false === i ? void 0 : "string" == typeof i ? i : "string" == typeof t ? t.toLowerCase() : void 0;
          }
          constructor() {
            super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
          }
          _$Ev() {
            this._$ES = new Promise(t => this.enableUpdating = t), this._$AL = new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach(t => t(this));
          }
          addController(t) {
            (this._$EO ??= new Set()).add(t), void 0 !== this.renderRoot && this.isConnected && t.hostConnected?.();
          }
          removeController(t) {
            this._$EO?.delete(t);
          }
          _$E_() {
            const t = new Map(),
              s = this.constructor.elementProperties;
            for (const i of s.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
            t.size > 0 && (this._$Ep = t);
          }
          createRenderRoot() {
            const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
            return S$1(t, this.constructor.elementStyles), t;
          }
          connectedCallback() {
            this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(true), this._$EO?.forEach(t => t.hostConnected?.());
          }
          enableUpdating(t) {}
          disconnectedCallback() {
            this._$EO?.forEach(t => t.hostDisconnected?.());
          }
          attributeChangedCallback(t, s, i) {
            this._$AK(t, i);
          }
          _$ET(t, s) {
            const i = this.constructor.elementProperties.get(t),
              e = this.constructor._$Eu(t, i);
            if (void 0 !== e && true === i.reflect) {
              const h = (void 0 !== i.converter?.toAttribute ? i.converter : u$1).toAttribute(s, i.type);
              this._$Em = t, null == h ? this.removeAttribute(e) : this.setAttribute(e, h), this._$Em = null;
            }
          }
          _$AK(t, s) {
            const i = this.constructor,
              e = i._$Eh.get(t);
            if (void 0 !== e && this._$Em !== e) {
              const t = i.getPropertyOptions(e),
                h = "function" == typeof t.converter ? {
                  fromAttribute: t.converter
                } : void 0 !== t.converter?.fromAttribute ? t.converter : u$1;
              this._$Em = e;
              const r = h.fromAttribute(s, t.type);
              this[e] = r ?? this._$Ej?.get(e) ?? r, this._$Em = null;
            }
          }
          requestUpdate(t, s, i) {
            if (void 0 !== t) {
              const e = this.constructor,
                h = this[t];
              if (i ??= e.getPropertyOptions(t), !((i.hasChanged ?? f$1)(h, s) || i.useDefault && i.reflect && h === this._$Ej?.get(t) && !this.hasAttribute(e._$Eu(t, i)))) return;
              this.C(t, s, i);
            }
            false === this.isUpdatePending && (this._$ES = this._$EP());
          }
          C(t, s, {
            useDefault: i,
            reflect: e,
            wrapped: h
          }, r) {
            i && !(this._$Ej ??= new Map()).has(t) && (this._$Ej.set(t, r ?? s ?? this[t]), true !== h || void 0 !== r) || (this._$AL.has(t) || (this.hasUpdated || i || (s = void 0), this._$AL.set(t, s)), true === e && this._$Em !== t && (this._$Eq ??= new Set()).add(t));
          }
          async _$EP() {
            this.isUpdatePending = true;
            try {
              await this._$ES;
            } catch (t) {
              Promise.reject(t);
            }
            const t = this.scheduleUpdate();
            return null != t && (await t), !this.isUpdatePending;
          }
          scheduleUpdate() {
            return this.performUpdate();
          }
          performUpdate() {
            if (!this.isUpdatePending) return;
            if (!this.hasUpdated) {
              if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
                for (const [t, s] of this._$Ep) this[t] = s;
                this._$Ep = void 0;
              }
              const t = this.constructor.elementProperties;
              if (t.size > 0) for (const [s, i] of t) {
                const {
                    wrapped: t
                  } = i,
                  e = this[s];
                true !== t || this._$AL.has(s) || void 0 === e || this.C(s, void 0, i, e);
              }
            }
            let t = false;
            const s = this._$AL;
            try {
              t = this.shouldUpdate(s), t ? (this.willUpdate(s), this._$EO?.forEach(t => t.hostUpdate?.()), this.update(s)) : this._$EM();
            } catch (s) {
              throw t = false, this._$EM(), s;
            }
            t && this._$AE(s);
          }
          willUpdate(t) {}
          _$AE(t) {
            this._$EO?.forEach(t => t.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t)), this.updated(t);
          }
          _$EM() {
            this._$AL = new Map(), this.isUpdatePending = false;
          }
          get updateComplete() {
            return this.getUpdateComplete();
          }
          getUpdateComplete() {
            return this._$ES;
          }
          shouldUpdate(t) {
            return true;
          }
          update(t) {
            this._$Eq &&= this._$Eq.forEach(t => this._$ET(t, this[t])), this._$EM();
          }
          updated(t) {}
          firstUpdated(t) {}
        };
        y$1.elementStyles = [], y$1.shadowRootOptions = {
          mode: "open"
        }, y$1[d$1("elementProperties")] = new Map(), y$1[d$1("finalized")] = new Map(), p$1?.({
          ReactiveElement: y$1
        }), (a$1.reactiveElementVersions ??= []).push("2.1.1");

        /**
         * @license
         * Copyright 2017 Google LLC
         * SPDX-License-Identifier: BSD-3-Clause
         */
        const t$1 = globalThis,
          i$1 = t$1.trustedTypes,
          s$1 = i$1 ? i$1.createPolicy("lit-html", {
            createHTML: t => t
          }) : void 0,
          e = "$lit$",
          h = `lit$${Math.random().toFixed(9).slice(2)}$`,
          o$2 = "?" + h,
          n$1 = `<${o$2}>`,
          r$1 = document,
          l = () => r$1.createComment(""),
          c = t => null === t || "object" != typeof t && "function" != typeof t,
          a = Array.isArray,
          u = t => a(t) || "function" == typeof t?.[Symbol.iterator],
          d = "[ \t\n\f\r]",
          f = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
          v = /-->/g,
          _ = />/g,
          m = RegExp(`>|${d}(?:([^\\s"'>=/]+)(${d}*=${d}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"),
          p = /'/g,
          g = /"/g,
          $ = /^(?:script|style|textarea|title)$/i,
          y = t => (i, ...s) => ({
            _$litType$: t,
            strings: i,
            values: s
          }),
          x = y(1),
          T = Symbol.for("lit-noChange"),
          E = Symbol.for("lit-nothing"),
          A = new WeakMap(),
          C = r$1.createTreeWalker(r$1, 129);
        function P(t, i) {
          if (!a(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
          return void 0 !== s$1 ? s$1.createHTML(i) : i;
        }
        const V = (t, i) => {
          const s = t.length - 1,
            o = [];
          let r,
            l = 2 === i ? "<svg>" : 3 === i ? "<math>" : "",
            c = f;
          for (let i = 0; i < s; i++) {
            const s = t[i];
            let a,
              u,
              d = -1,
              y = 0;
            for (; y < s.length && (c.lastIndex = y, u = c.exec(s), null !== u);) y = c.lastIndex, c === f ? "!--" === u[1] ? c = v : void 0 !== u[1] ? c = _ : void 0 !== u[2] ? ($.test(u[2]) && (r = RegExp("</" + u[2], "g")), c = m) : void 0 !== u[3] && (c = m) : c === m ? ">" === u[0] ? (c = r ?? f, d = -1) : void 0 === u[1] ? d = -2 : (d = c.lastIndex - u[2].length, a = u[1], c = void 0 === u[3] ? m : '"' === u[3] ? g : p) : c === g || c === p ? c = m : c === v || c === _ ? c = f : (c = m, r = void 0);
            const x = c === m && t[i + 1].startsWith("/>") ? " " : "";
            l += c === f ? s + n$1 : d >= 0 ? (o.push(a), s.slice(0, d) + e + s.slice(d) + h + x) : s + h + (-2 === d ? i : x);
          }
          return [P(t, l + (t[s] || "<?>") + (2 === i ? "</svg>" : 3 === i ? "</math>" : "")), o];
        };
        class N {
          constructor({
            strings: t,
            _$litType$: s
          }, n) {
            let r;
            this.parts = [];
            let c = 0,
              a = 0;
            const u = t.length - 1,
              d = this.parts,
              [f, v] = V(t, s);
            if (this.el = N.createElement(f, n), C.currentNode = this.el.content, 2 === s || 3 === s) {
              const t = this.el.content.firstChild;
              t.replaceWith(...t.childNodes);
            }
            for (; null !== (r = C.nextNode()) && d.length < u;) {
              if (1 === r.nodeType) {
                if (r.hasAttributes()) for (const t of r.getAttributeNames()) if (t.endsWith(e)) {
                  const i = v[a++],
                    s = r.getAttribute(t).split(h),
                    e = /([.?@])?(.*)/.exec(i);
                  d.push({
                    type: 1,
                    index: c,
                    name: e[2],
                    strings: s,
                    ctor: "." === e[1] ? H : "?" === e[1] ? I : "@" === e[1] ? L : k
                  }), r.removeAttribute(t);
                } else t.startsWith(h) && (d.push({
                  type: 6,
                  index: c
                }), r.removeAttribute(t));
                if ($.test(r.tagName)) {
                  const t = r.textContent.split(h),
                    s = t.length - 1;
                  if (s > 0) {
                    r.textContent = i$1 ? i$1.emptyScript : "";
                    for (let i = 0; i < s; i++) r.append(t[i], l()), C.nextNode(), d.push({
                      type: 2,
                      index: ++c
                    });
                    r.append(t[s], l());
                  }
                }
              } else if (8 === r.nodeType) if (r.data === o$2) d.push({
                type: 2,
                index: c
              });else {
                let t = -1;
                for (; -1 !== (t = r.data.indexOf(h, t + 1));) d.push({
                  type: 7,
                  index: c
                }), t += h.length - 1;
              }
              c++;
            }
          }
          static createElement(t, i) {
            const s = r$1.createElement("template");
            return s.innerHTML = t, s;
          }
        }
        function S(t, i, s = t, e) {
          if (i === T) return i;
          let h = void 0 !== e ? s._$Co?.[e] : s._$Cl;
          const o = c(i) ? void 0 : i._$litDirective$;
          return h?.constructor !== o && (h?._$AO?.(false), void 0 === o ? h = void 0 : (h = new o(t), h._$AT(t, s, e)), void 0 !== e ? (s._$Co ??= [])[e] = h : s._$Cl = h), void 0 !== h && (i = S(t, h._$AS(t, i.values), h, e)), i;
        }
        class M {
          constructor(t, i) {
            this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
          }
          get parentNode() {
            return this._$AM.parentNode;
          }
          get _$AU() {
            return this._$AM._$AU;
          }
          u(t) {
            const {
                el: {
                  content: i
                },
                parts: s
              } = this._$AD,
              e = (t?.creationScope ?? r$1).importNode(i, true);
            C.currentNode = e;
            let h = C.nextNode(),
              o = 0,
              n = 0,
              l = s[0];
            for (; void 0 !== l;) {
              if (o === l.index) {
                let i;
                2 === l.type ? i = new R(h, h.nextSibling, this, t) : 1 === l.type ? i = new l.ctor(h, l.name, l.strings, this, t) : 6 === l.type && (i = new z(h, this, t)), this._$AV.push(i), l = s[++n];
              }
              o !== l?.index && (h = C.nextNode(), o++);
            }
            return C.currentNode = r$1, e;
          }
          p(t) {
            let i = 0;
            for (const s of this._$AV) void 0 !== s && (void 0 !== s.strings ? (s._$AI(t, s, i), i += s.strings.length - 2) : s._$AI(t[i])), i++;
          }
        }
        class R {
          get _$AU() {
            return this._$AM?._$AU ?? this._$Cv;
          }
          constructor(t, i, s, e) {
            this.type = 2, this._$AH = E, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = s, this.options = e, this._$Cv = e?.isConnected ?? true;
          }
          get parentNode() {
            let t = this._$AA.parentNode;
            const i = this._$AM;
            return void 0 !== i && 11 === t?.nodeType && (t = i.parentNode), t;
          }
          get startNode() {
            return this._$AA;
          }
          get endNode() {
            return this._$AB;
          }
          _$AI(t, i = this) {
            t = S(this, t, i), c(t) ? t === E || null == t || "" === t ? (this._$AH !== E && this._$AR(), this._$AH = E) : t !== this._$AH && t !== T && this._(t) : void 0 !== t._$litType$ ? this.$(t) : void 0 !== t.nodeType ? this.T(t) : u(t) ? this.k(t) : this._(t);
          }
          O(t) {
            return this._$AA.parentNode.insertBefore(t, this._$AB);
          }
          T(t) {
            this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
          }
          _(t) {
            this._$AH !== E && c(this._$AH) ? this._$AA.nextSibling.data = t : this.T(r$1.createTextNode(t)), this._$AH = t;
          }
          $(t) {
            const {
                values: i,
                _$litType$: s
              } = t,
              e = "number" == typeof s ? this._$AC(t) : (void 0 === s.el && (s.el = N.createElement(P(s.h, s.h[0]), this.options)), s);
            if (this._$AH?._$AD === e) this._$AH.p(i);else {
              const t = new M(e, this),
                s = t.u(this.options);
              t.p(i), this.T(s), this._$AH = t;
            }
          }
          _$AC(t) {
            let i = A.get(t.strings);
            return void 0 === i && A.set(t.strings, i = new N(t)), i;
          }
          k(t) {
            a(this._$AH) || (this._$AH = [], this._$AR());
            const i = this._$AH;
            let s,
              e = 0;
            for (const h of t) e === i.length ? i.push(s = new R(this.O(l()), this.O(l()), this, this.options)) : s = i[e], s._$AI(h), e++;
            e < i.length && (this._$AR(s && s._$AB.nextSibling, e), i.length = e);
          }
          _$AR(t = this._$AA.nextSibling, i) {
            for (this._$AP?.(false, true, i); t !== this._$AB;) {
              const i = t.nextSibling;
              t.remove(), t = i;
            }
          }
          setConnected(t) {
            void 0 === this._$AM && (this._$Cv = t, this._$AP?.(t));
          }
        }
        class k {
          get tagName() {
            return this.element.tagName;
          }
          get _$AU() {
            return this._$AM._$AU;
          }
          constructor(t, i, s, e, h) {
            this.type = 1, this._$AH = E, this._$AN = void 0, this.element = t, this.name = i, this._$AM = e, this.options = h, s.length > 2 || "" !== s[0] || "" !== s[1] ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = E;
          }
          _$AI(t, i = this, s, e) {
            const h = this.strings;
            let o = false;
            if (void 0 === h) t = S(this, t, i, 0), o = !c(t) || t !== this._$AH && t !== T, o && (this._$AH = t);else {
              const e = t;
              let n, r;
              for (t = h[0], n = 0; n < h.length - 1; n++) r = S(this, e[s + n], i, n), r === T && (r = this._$AH[n]), o ||= !c(r) || r !== this._$AH[n], r === E ? t = E : t !== E && (t += (r ?? "") + h[n + 1]), this._$AH[n] = r;
            }
            o && !e && this.j(t);
          }
          j(t) {
            t === E ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
          }
        }
        class H extends k {
          constructor() {
            super(...arguments), this.type = 3;
          }
          j(t) {
            this.element[this.name] = t === E ? void 0 : t;
          }
        }
        class I extends k {
          constructor() {
            super(...arguments), this.type = 4;
          }
          j(t) {
            this.element.toggleAttribute(this.name, !!t && t !== E);
          }
        }
        class L extends k {
          constructor(t, i, s, e, h) {
            super(t, i, s, e, h), this.type = 5;
          }
          _$AI(t, i = this) {
            if ((t = S(this, t, i, 0) ?? E) === T) return;
            const s = this._$AH,
              e = t === E && s !== E || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive,
              h = t !== E && (s === E || e);
            e && this.element.removeEventListener(this.name, this, s), h && this.element.addEventListener(this.name, this, t), this._$AH = t;
          }
          handleEvent(t) {
            "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
          }
        }
        class z {
          constructor(t, i, s) {
            this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
          }
          get _$AU() {
            return this._$AM._$AU;
          }
          _$AI(t) {
            S(this, t);
          }
        }
        const j = t$1.litHtmlPolyfillSupport;
        j?.(N, R), (t$1.litHtmlVersions ??= []).push("3.3.1");
        const B = (t, i, s) => {
          const e = s?.renderBefore ?? i;
          let h = e._$litPart$;
          if (void 0 === h) {
            const t = s?.renderBefore ?? null;
            e._$litPart$ = h = new R(i.insertBefore(l(), t), t, void 0, s ?? {});
          }
          return h._$AI(t), h;
        };

        /**
         * @license
         * Copyright 2017 Google LLC
         * SPDX-License-Identifier: BSD-3-Clause
         */
        const s = globalThis;
        class i extends y$1 {
          constructor() {
            super(...arguments), this.renderOptions = {
              host: this
            }, this._$Do = void 0;
          }
          createRenderRoot() {
            const t = super.createRenderRoot();
            return this.renderOptions.renderBefore ??= t.firstChild, t;
          }
          update(t) {
            const r = this.render();
            this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = B(r, this.renderRoot, this.renderOptions);
          }
          connectedCallback() {
            super.connectedCallback(), this._$Do?.setConnected(true);
          }
          disconnectedCallback() {
            super.disconnectedCallback(), this._$Do?.setConnected(false);
          }
          render() {
            return T;
          }
        }
        i._$litElement$ = true, i["finalized"] = true, s.litElementHydrateSupport?.({
          LitElement: i
        });
        const o$1 = s.litElementPolyfillSupport;
        o$1?.({
          LitElement: i
        });
        (s.litElementVersions ??= []).push("4.2.1");

        /**
         * @license
         * Copyright 2017 Google LLC
         * SPDX-License-Identifier: BSD-3-Clause
         */
        const t = t => (e, o) => {
          void 0 !== o ? o.addInitializer(() => {
            customElements.define(t, e);
          }) : customElements.define(t, e);
        };

        /**
         * @license
         * Copyright 2017 Google LLC
         * SPDX-License-Identifier: BSD-3-Clause
         */
        const o = {
            attribute: true,
            type: String,
            converter: u$1,
            reflect: false,
            hasChanged: f$1
          },
          r = (t = o, e, r) => {
            const {
              kind: n,
              metadata: i
            } = r;
            let s = globalThis.litPropertyMetadata.get(i);
            if (void 0 === s && globalThis.litPropertyMetadata.set(i, s = new Map()), "setter" === n && ((t = Object.create(t)).wrapped = true), s.set(r.name, t), "accessor" === n) {
              const {
                name: o
              } = r;
              return {
                set(r) {
                  const n = e.get.call(this);
                  e.set.call(this, r), this.requestUpdate(o, n, t);
                },
                init(e) {
                  return void 0 !== e && this.C(o, void 0, t, e), e;
                }
              };
            }
            if ("setter" === n) {
              const {
                name: o
              } = r;
              return function (r) {
                const n = this[o];
                e.call(this, r), this.requestUpdate(o, n, t);
              };
            }
            throw Error("Unsupported decorator location: " + n);
          };
        function n(t) {
          return (e, o) => "object" == typeof o ? r(t, e, o) : ((t, e, o) => {
            const r = e.hasOwnProperty(o);
            return e.constructor.createProperty(o, t), r ? Object.getOwnPropertyDescriptor(e, o) : void 0;
          })(t, e, o);
        }
        var __defProp$2 = Object.defineProperty;
        var __getOwnPropDesc$2 = Object.getOwnPropertyDescriptor;
        var __decorateClass$2 = (decorators, target, key, kind) => {
          var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$2(target, key) : target;
          for (var i = decorators.length - 1, decorator; i >= 0; i--) if (decorator = decorators[i]) result = (kind ? decorator(target, key, result) : decorator(result)) || result;
          if (kind && result) __defProp$2(target, key, result);
          return result;
        };
        let SimpleList = class extends i {
          submissions = [];
          labels = {};
          render() {
            return x`
        assasa
			<div>${JSON.stringify(this.submissions)}</div>
		`;
          }
        };
        __decorateClass$2([n({
          type: Array
        })], SimpleList.prototype, "submissions", 2);
        __decorateClass$2([n({
          type: Object
        })], SimpleList.prototype, "labels", 2);
        SimpleList = __decorateClass$2([t("simple-list")], SimpleList);
        var __defProp$1 = Object.defineProperty;
        var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
        var __decorateClass$1 = (decorators, target, key, kind) => {
          var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
          for (var i = decorators.length - 1, decorator; i >= 0; i--) if (decorator = decorators[i]) result = (kind ? decorator(target, key, result) : decorator(result)) || result;
          if (kind && result) __defProp$1(target, key, result);
          return result;
        };
        let TableList = class extends i {
          submissions = [];
          labels = {};
          render() {
            return x`
        Table List
			<div>${JSON.stringify(this.submissions)}</div>
		`;
          }
        };
        __decorateClass$1([n({
          type: Array
        })], TableList.prototype, "submissions", 2);
        __decorateClass$1([n({
          type: Object
        })], TableList.prototype, "labels", 2);
        TableList = __decorateClass$1([t("table-list")], TableList);
        var __defProp = Object.defineProperty;
        var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
        var __decorateClass = (decorators, target, key, kind) => {
          var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
          for (var i = decorators.length - 1, decorator; i >= 0; i--) if (decorator = decorators[i]) result = (kind ? decorator(target, key, result) : decorator(result)) || result;
          if (kind && result) __defProp(target, key, result);
          return result;
        };
        const ajaxUrl = window?.petitionerSubmissionSettings?.actionPath ?? "";
        const nonce = window?.petitionerSubmissionSettings?.nonce ?? "";
        if (!ajaxUrl || !nonce) {
          throw new Error("AJAX URL or nonce is not defined in settings");
        }
        let PetitionerSubmissions = class extends i {
          formId = 0;
          perPage = 10;
          formStyle = "simple";
          formFields = "";
          showPagination = false;
          labels = {};
          ajaxurl = ajaxUrl;
          nonce = nonce;
          totalResults = 10;
          submissions = [];
          currentPage = 1;
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
          buildURL() {
            const url = new URL(this.ajaxurl, window.location.origin);
            url.searchParams.set("form_id", String(this.formId));
            url.searchParams.set("per_page", String(this.perPage));
            url.searchParams.set("page", String(this.currentPage));
            if (this.formFields) {
              url.searchParams.set("fields", this.formFields);
            }
            return url.toString();
          }
          firstUpdated() {
            this.fetchSubmissions();
          }
          getLabels() {
            return this.labels;
          }
          renderListComponent() {
            if (this.formStyle === "simple") {
              return x`<simple-list
				.submissions=${this.submissions}
				.labels=${this.labels}
			></simple-list>`;
            }
            return x`<table-list
			.submissions=${this.submissions}
			.labels=${this.labels}
		></table-list>`;
          }
          render() {
            return x`
			<div class="submissions__list">${this.renderListComponent()}</div>
		`;
          }
        };
        __decorateClass([n({
          type: Number,
          attribute: "form-id"
        })], PetitionerSubmissions.prototype, "formId", 2);
        __decorateClass([n({
          type: Number,
          attribute: "per-page"
        })], PetitionerSubmissions.prototype, "perPage", 2);
        __decorateClass([n({
          type: String,
          attribute: "form-style"
        })], PetitionerSubmissions.prototype, "formStyle", 2);
        __decorateClass([n({
          type: String,
          attribute: "fields"
        })], PetitionerSubmissions.prototype, "formFields", 2);
        __decorateClass([n({
          type: Boolean,
          attribute: "show_pagination"
        })], PetitionerSubmissions.prototype, "showPagination", 2);
        __decorateClass([n({
          type: Object
        })], PetitionerSubmissions.prototype, "labels", 2);
        __decorateClass([n({
          type: String
        })], PetitionerSubmissions.prototype, "ajaxurl", 2);
        __decorateClass([n({
          type: String
        })], PetitionerSubmissions.prototype, "nonce", 2);
        __decorateClass([n({
          type: Number
        })], PetitionerSubmissions.prototype, "totalResults", 2);
        __decorateClass([n({
          type: Array
        })], PetitionerSubmissions.prototype, "submissions", 2);
        __decorateClass([n({
          type: Number
        })], PetitionerSubmissions.prototype, "currentPage", 2);
        PetitionerSubmissions = __decorateClass([t("petitioner-submissions")], PetitionerSubmissions);
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
          new PetitionerSubmissions$1(submissionsDiv);
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
