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
        __vite_style__.textContent = "/* Breakpoints */\n:root {\n    /* Spacing scale */\n    --ptr-spacer-xs: 4px;\n    --ptr-spacer-sm: 8px;\n    --ptr-spacer-md: 16px;\n    --ptr-spacer-lg: 24px;\n    --ptr-spacer-xl: 32px;\n\n    /* Colors */\n    --ptr-color-primary: #e01a2b;\n    --ptr-color-dark: #000000;\n    --ptr-color-grey: #efefef;\n\n    /* Font sizes */\n    --ptr-fs-sm: 14px;\n    --ptr-fs-md: 18px;\n\n    /* Border radius */\n    --ptr-border-radius-xs: 2px;\n    --ptr-border-radius-sm: 4px;\n    --ptr-border-radius-md: 8px;\n    --ptr-border-radius-lg: 16px;\n\n}\n.petitioner {\n    /* wrapper */\n    --ptr-spacing-x: var(--ptr-spacer-md);\n    --ptr-spacing-y: var(--ptr-spacer-md);\n    --ptr-wrapper-bg: white;\n    --ptr-wrapper-radius: var(--ptr-border-radius-lg);\n\n    /* input related */\n    --ptr-input-border-width: 1px;\n    --ptr-input-border-color: #a1a1a1;\n    --ptr-input-border-color-active: #00000;\n    --ptr-input-border-radius: var(--ptr-border-radius-md);\n    --ptr-input-spacing-y: 0.7rem;\n    --ptr-input-spacing-x: var(--ptr-spacer-md);\n    --ptr-input-line-height: 40px;\n\n    /* label related */\n    --ptr-label-font-size: var(--ptr-fs-sm);\n\n    /* button */\n    --ptr-btn-font-size: var(--ptr-fs-md);\n    --ptr-btn-bg: var(--ptr-color-primary);\n    --ptr-btn-bg-hover: var(--ptr-color-dark);\n    --ptr-button-border-width: var(--ptr-input-border-width);\n    --ptr-button-border-color: transparent;\n    --ptr-button-border-color-active: var(--ptr-color-dark);\n    --ptr-button-border-radius: var(--ptr-border-radius-md);\n\n    /* progress bar */\n    --ptr-progress-height: var(--ptr-spacer-sm);\n    --ptr-progress-bg: var(--ptr-color-grey);\n    --ptr-progress-radius: var(--ptr-spacer-xs);\n    --ptr-progress-inner-bg: var(--ptr-color-primary);\n\n    /* misc */\n    --ptr-transition-duration: 0.2s;\n\n    padding: var(--ptr-spacing-y) var(--ptr-spacing-x);\n    background-color: var(--ptr-wrapper-bg);\n    border-radius: var(--ptr-wrapper-radius);\n    box-sizing: border-box;\n}\n.petitioner__input {\n    display: flex;\n    flex-direction: column;\n    gap: var(--ptr-spacer-xs);\n    margin-bottom: var(--ptr-spacer-sm);\n}\n.petitioner__input label {\n    font-size: var(--ptr-label-font-size);\n}\n.petitioner__input input:not([type=\"checkbox\"]),\n.petitioner__input textarea {\n    outline: none;\n    border-radius: var(--ptr-input-border-radius);\n    border-color: var(--ptr-input-border-color);\n    border-width: var(--ptr-input-border-width);\n    padding: var(--ptr-input-spacing-y) var(--ptr-input-spacing-x);\n    border-style: solid;\n    font-size: var(--ptr-label-font-size);\n    line-height: var(--ptr-input-line-height);\n}\n.petitioner__input input:not([type=\"checkbox\"]):focus,\n.petitioner__input textarea:focus {\n    border-color: var(--ptr-input-border-color-active);\n}\n.petitioner__input select {\n    outline: none;\n    border-radius: var(--ptr-input-border-radius);\n    border: var(--ptr-input-border-width) solid var(--ptr-input-border-color);\n    padding: var(--ptr-input-spacing-y) var(--ptr-input-spacing-x);\n    font-size: var(--ptr-label-font-size);\n    background-color: var(--ptr-wrapper-bg);\n    color: var(--ptr-color-dark);\n    -webkit-appearance: none;\n       -moz-appearance: none;\n            appearance: none;\n    background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23000000'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E\");\n    background-repeat: no-repeat;\n    background-position: right var(--ptr-input-spacing-x) center;\n    background-size: 1rem;\n    cursor: pointer;\n    transition:\n        border-color var(--ptr-transition-duration),\n        background-color var(--ptr-transition-duration);\n    line-height: var(--ptr-input-line-height);\n}\n.petitioner__input select:focus {\n    border-color: var(--ptr-input-border-color-active);\n    box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);\n}\n.petitioner__input select:hover {\n    background-color: var(--ptr-color-grey);\n}\n.petitioner__input select::-moz-placeholder {\n    color: #aaa;\n}\n.petitioner__input select::placeholder {\n    color: #aaa;\n}\n.petitioner__input--checkbox {\n    flex-direction: row;\n    flex-wrap: nowrap;\n    align-items: flex-start;\n    margin-top: var(--ptr-spacer-md);\n    margin-bottom: var(--ptr-spacer-md);\n}\n.petitioner__input--checkbox label {\n    order: 1;\n    display: inline-block;\n    width: auto;\n    transform: translateY(-3%);\n}\n.petitioner__input--checkbox label:hover {\n    cursor: pointer;\n}\n.petitioner__input--checkbox input[type=\"checkbox\"] {\n    -webkit-appearance: none;\n    -moz-appearance: none;\n         appearance: none;\n    width: var(--ptr-fs-md);\n    height: var(--ptr-fs-md);\n    border: var(--ptr-input-border-width) solid var(--ptr-input-border-color);\n    border-radius: var(--ptr-border-radius-xs);\n    background-color: var(--ptr-wrapper-bg);\n    display: inline-block;\n    cursor: pointer;\n    transition:\n        background-color var(--ptr-transition-duration),\n        border-color var(--ptr-transition-duration);\n    padding: 0;\n    flex-shrink: 0;\n}\n.petitioner__input--checkbox input[type=\"checkbox\"]:checked {\n    background-color: var(--ptr-color-primary);\n    border-color: var(--ptr-color-primary);\n    background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24'%3E%3Cpath d='M20.285 6.707l-1.413-1.414L9.5 14.664 5.128 10.293 3.714 11.707 9.5 17.5z'/%3E%3C/svg%3E\");\n    background-size: 70%;\n    background-position: center;\n    background-repeat: no-repeat;\n}\n.petitioner__input--checkbox input[type=\"checkbox\"]:focus {\n    outline: none;\n    box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);\n}\n.petitioner__btn {\n    margin-top: var(--ptr-spacer-xs);\n    outline: none;\n    border-radius: var(--ptr-button-border-radius);\n    border-color: var(--ptr-button-border-color);\n    border-width: var(--ptr-button-border-width);\n    padding: var(--ptr-input-spacing-y) var(--ptr-input-spacing-x);\n    border-style: solid;\n    width: 100%;\n    background-color: var(--ptr-color-grey);\n    transition: 0.1s;\n    margin-bottom: var(--ptr-spacer-md);\n}\n.petitioner__btn--submit {\n    font-size: var(--ptr-fs-md);\n    background-color: var(--ptr-color-primary);\n    color: white;\n}\n.petitioner__btn--submit:hover {\n    background-color: var(--ptr-color-dark);\n}\n.petitioner__btn--letter {\n    font-size: var(--ptr-fs-sm);\n    background-color: var(--ptr-color-grey);\n    color: var(--ptr-color-dark);\n}\n.petitioner__btn--letter:hover {\n    background-color: var(--ptr-color-dark);\n    color: white;\n}\n.petitioner__btn:active,\n.petitioner__btn:focus {\n    border-color: var(--ptr-button-border-color-active);\n}\n.petitioner__btn:hover {\n    cursor: pointer;\n}\n.petitioner__title {\n    padding: 0;\n    margin: 0 0 var(--ptr-spacer-md) 0;\n    font-size: 24px;\n}\n.petitioner__response {\n    display: none;\n}\n.petitioner__response h3 {\n    margin: 0;\n    padding: 0;\n}\n.petitioner--submitted form {\n    display: none;\n}\n.petitioner--submitted .petitioner__response {\n    display: block;\n}\n.petitioner--loading form {\n    pointer-events: none;\n    opacity: 0.8;\n    cursor: progress;\n}\n.petitioner .petitioner-disclaimer-text {\n    font-size: 12px;\n}\n.grecaptcha-badge {\n    visibility: hidden;\n}\n.petitioner-turnstile-container iframe {\n    width: 100%;\n}\n.petitioner__goal {\n\twidth: 100%;\n\tdisplay: flex;\n\tflex-wrap: wrap;\n\tmargin-top: var(--ptr-spacer-lg);\n\tmargin-bottom: var(--ptr-spacer-lg);\n}\n.petitioner__goal .petitioner__num {\n\tfont-size: 1rem;\n\tdisplay: block;\n\tfont-weight: bold;\n}\n.petitioner__goal .petitioner__numlabel {\n\tfont-size: 14px;\n}\n.petitioner__goal .petitioner__col {\n\twidth: 50%;\n\tdisplay: flex;\n\tflex-direction: column;\n}\n.petitioner__goal .petitioner__col--end {\n\talign-items: flex-end;\n}\n@media (min-width: 768px) {\n\t.petitioner__goal .petitioner__num {\n\t\tfont-size: 1.5rem;\n\t}\n\n\t.petitioner__goal .petitioner__numlabel {\n\t\tfont-size: 16px;\n\t}\n}\n.petitioner__progress {\n\tdisplay: block;\n\twidth: 100%;\n\theight: var(--ptr-progress-height);\n\tbackground-color: var(--ptr-progress-bg);\n\tborder-radius: var(--ptr-progress-radius);\n\tposition: relative;\n}\n.petitioner__progress-bar {\n\tflex-grow: 0;\n\tborder-radius: var(--ptr-progress-radius);\n\tbackground-color: var(--ptr-progress-inner-bg);\n\theight: 100%;\n\tdisplay: block;\n}\n.petitioner__progress-bar span {\n\tposition: absolute;\n\tdisplay: block;\n\tleft: 0;\n\tright: 0;\n\tmargin: 0 auto;\n\ttop: calc(-100% - var(--ptr-spacer-sm));\n\tfont-size: 14px;\n\ttext-align: center;\n}\n.petitioner-modal {\n\tposition: fixed;\n\tdisplay: none;\n\tjustify-content: center;\n\talign-items: center;\n\tleft: 0;\n\ttop: 0;\n\twidth: 100%;\n\theight: 100%;\n\tz-index: 99;\n}\n.petitioner-modal--visible {\n\tdisplay: flex;\n}\n.petitioner-modal__backdrop {\n\tposition: absolute;\n\tleft: 0;\n\ttop: 0;\n\twidth: 100%;\n\theight: 100%;\n\tbackground-color: rgba(0, 0, 0, 0.5);\n}\n.petitioner-modal__close {\n\tposition: absolute;\n\tright: var(--ptr-spacer-sm);\n\ttop: var(--ptr-spacer-sm);\n\tz-index: 2;\n\tbackground: transparent;\n\toutline: none;\n\tborder: 1px solid #ccc;\n\tpadding: var(--ptr-spacer-sm);\n\tborder-radius: var(--ptr-spacer-xs);\n\tline-height: 1;\n\twidth: var(--ptr-spacer-lg);\n\theight: var(--ptr-spacer-lg);\n\tdisplay: flex;\n\tjustify-content: center;\n\talign-items: center;\n\ttransition: 0.1s;\n\tcolor: var(--ptr-color-dark);\n}\n.petitioner-modal__close:hover {\n\tcursor: pointer;\n\tbackground: var(--ptr-color-dark);\n\tcolor: white;\n}\n.petitioner-modal__close span {\n\tposition: absolute;\n\twidth: 1px;\n\theight: 1px;\n\tpadding: 0;\n\tmargin: -1px;\n\toverflow: hidden;\n\tclip: rect(0, 0, 0, 0);\n\tborder: 0;\n}\n.petitioner-modal hr {\n\tborder: 0;\n\theight: 1px;\n\tbackground: #ccc;\n\tmargin-top: var(--ptr-spacer-lg);\n\tmargin-bottom: var(--ptr-spacer-sm);\n}\n.petitioner-modal__letter {\n\tposition: relative;\n\tmax-width: 500px;\n\tbackground-color: white;\n\tborder-radius: var(--ptr-spacer-md);\n\tpadding: var(--ptr-spacer-lg);\n}\n.petitioner-modal__inner {\n\tmax-height: 40vh;\n\toverflow-y: auto;\n}\n.petitioner-submissions .submissions__item {\n\tdisplay: inline;\n}\n.petitioner-submissions .ptr-pagination {\n\tdisplay: flex;\n\tjustify-content: flex-start;\n\talign-items: center;\n\tmargin-top: var(--ptr-spacer-lg);\n\tgap: var(--ptr-spacer-xs);\n\tflex-wrap: wrap;\n}\n.petitioner-submissions .ptr-pagination button {\n\tbackground-color: var(--ptr-color-grey);\n\tborder: none;\n\tborder-radius: var(--ptr-input-border-radius);\n\tpadding: var(--ptr-input-spacing-y) var(--ptr-input-spacing-x);\n\tcursor: pointer;\n\tfont-size: var(--ptr-fs-sm);\n\tcolor: var(--ptr-color-dark);\n\ttransition: background-color var(--ptr-transition-duration);\n}\n.petitioner-submissions .ptr-pagination button.active {\n\tbackground-color: var(--ptr-color-primary);\n\tcolor: white;\n}\n.petitioner-submissions .ptr-pagination button:hover {\n\tbackground-color: var(--ptr-color-dark);\n\tcolor: white;\n}\n.petitioner-submissions .ptr-pagination button[disabled] {\n\tbackground-color: var(--ptr-color-grey);\n\tcolor: var(--ptr-color-dark);\n\topacity: 0.5;\n\tcursor: not-allowed;\n}\n.petitioner-submissions--simple {\n\tborder: 1px solid var(--ptr-color-grey);\n}\n.petitioner-submissions--table {\n\t--ptr-submission-columns: 4;\n\tpadding-inline: 0;\n}\n.petitioner-submissions--table .submissions__list {\n\tdisplay: grid;\n\tgrid-auto-rows: minmax(40px, auto);\n\tgrid-template-columns: repeat(var(--ptr-submission-columns), 1fr);\n\t/* adjust row height as needed */\n}\n.petitioner-submissions--table .submissions__item {\n\tdisplay: contents;\n}\n.petitioner-submissions--table .submissions__item--heading div {\n\tfont-weight: bold;\n}\n.petitioner-submissions--table .submissions__item>div {\n\tdisplay: block;\n\tpadding: var(--ptr-spacer-xs) var(--ptr-spacer-sm);\n\tborder-bottom: 1px solid var(--ptr-color-grey);\n\tfont-size: var(--ptr-fs-sm);\n\tword-break: break-word;\n}\n.petitioner-submissions--table .submissions__item__inner strong {\n\tdisplay: none;\n}\n@media (max-width: 768px) {\n\t.petitioner-submissions--table .submissions__item {\n\t\tposition: relative;\n\t}\n\n\t.petitioner-submissions--table .submissions__item__inner {\n\t\tdisplay: flex;\n\t\tjustify-content: space-between;\n\t\tgap: var(--ptr-spacer-xs);\n\t}\n\n\t.petitioner-submissions--table .submissions__item::after {\n\t\tcontent: '';\n\t\tdisplay: block;\n\t\tposition: absolute;\n\t\tleft: 0;\n\t\tright: 0;\n\t\ttop: 100%;\n\t\twidth: 100%;\n\t\theight: 1px;\n\t\tbackground-color: var(--ptr-color-grey);\n\t\tmargin-top: var(--ptr-spacer-sm);\n\t}\n\n\t.petitioner-submissions--table .submissions__item:last-of-type::after {\n\t\tdisplay: none;\n\t}\n\n\t.petitioner-submissions--table .submissions__item__inner strong {\n\t\tdisplay: inline;\n\t}\n\n\t.petitioner-submissions--table .submissions__item.submissions__item--heading {\n\t\tdisplay: none;\n\t}\n\n\t.petitioner-submissions--table .submissions__list {\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\tgap: var(--ptr-spacer-lg);\n\t}\n\n\t.petitioner-submissions--table .submissions__item {\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t}\n\n\t.petitioner-submissions--table .submissions__item>div {\n\t\tborder-bottom: none;\n\t\tpadding: var(--ptr-spacer-xs) 0;\n\t}\n}/*$vite$:1*/";
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
