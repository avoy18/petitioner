function __vite_legacy_guard() {
  import.meta.url;
  import("_").catch(() => 1);
  (async function* () {
  })().next();
}
;
import { s as safelyParseJSON } from "./assets/utilities-BF7HqmGn.js";
class ReCaptcha {
  constructor(petitionForm) {
    if (typeof window.petitionerCaptcha !== "undefined" && window.petitionerCaptcha.recaptchaSiteKey) {
      const recaptchaField = petitionForm.querySelector(
        '[name="petitioner-g-recaptcha-response"]'
      );
      petitionForm.addEventListener(
        "focusin",
        function() {
          if (recaptchaField && recaptchaField.value) {
            return;
          }
          if (typeof grecaptcha === "undefined" || typeof (grecaptcha == null ? void 0 : grecaptcha.ready) === "undefined") {
            return;
          }
          grecaptcha.ready(function() {
            grecaptcha.execute(window.petitionerCaptcha.recaptchaSiteKey, {
              // action: 'submit',
            }).then((token) => {
              if (recaptchaField) {
                recaptchaField.value = token;
              }
            });
          });
        },
        { once: true }
      );
    } else {
      console.error(
        "petitioner - reCAPTCHA site key is missing or reCAPTCHA failed to load."
      );
    }
  }
}
class HCaptcha {
  constructor(currentForm) {
    this.widgetId = null;
    this.callbackFunction = null;
    this.form = currentForm;
    this.hcaptchaField = this.form.querySelector(
      '[name="petitioner-h-captcha-response"]'
    );
    this.hcaptchaContainer = this.form.querySelector(
      ".petitioner-h-captcha-container"
    );
    if (!this.isHCaptchaReady()) {
      return;
    }
    this.initHCaptcha();
  }
  isHCaptchaReady() {
    var _a, _b;
    return !!(typeof hcaptcha !== "undefined" && ((_a = window.petitionerCaptcha) == null ? void 0 : _a.enableHcaptcha) && ((_b = window.petitionerCaptcha) == null ? void 0 : _b.hcaptchaSiteKey) && this.hcaptchaContainer);
  }
  initHCaptcha() {
    var _a;
    if (!hcaptcha || !((_a = window.petitionerCaptcha) == null ? void 0 : _a.hcaptchaSiteKey) || !this.hcaptchaContainer) {
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
    var _a;
    this.widgetId = null;
    this.callbackFunction = null;
    this.form = petitionForm;
    this.turnstileField = this.form.querySelector(
      '[name="petitioner-turnstile-response"]'
    );
    this.turnstileContainer = this.form.querySelector(
      ".petitioner-turnstile-container"
    );
    if (typeof turnstile === "undefined" || !((_a = window.petitionerCaptcha) == null ? void 0 : _a.turnstileSiteKey) || !this.turnstileContainer) {
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
    const settings = (window == null ? void 0 : window.petitionerFormSettings) || {};
    const { actionPath = "", nonce = "" } = settings;
    this.actionPath = actionPath || "";
    this.nonce = nonce;
    if (!this.wrapper) return;
    this.responseTitle = this.wrapper.querySelector(
      ".petitioner__response > h3"
    );
    this.responseText = this.wrapper.querySelector(
      ".petitioner__response > p"
    );
    this.formEl = this.wrapper.querySelector("form");
    this.viewLetterBTN = this.wrapper.querySelector(
      ".petitioner__btn--letter"
    );
    this.petitionerModal = this.wrapper.querySelector(".petitioner-modal");
    this.modalClose = this.wrapper.querySelector(
      ".petitioner-modal__close"
    );
    this.backdrop = this.wrapper.querySelector(
      ".petitioner-modal__backdrop"
    );
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
      this.formEl.addEventListener(
        "submit",
        this.handleFormSubmit.bind(this)
      );
    }
    if (this.viewLetterBTN) {
      this.viewLetterBTN.addEventListener(
        "click",
        () => this.toggleModal(true)
      );
    }
    if (this.backdrop) {
      this.backdrop.addEventListener(
        "click",
        () => this.toggleModal(false)
      );
    }
    if (this.modalClose) {
      this.modalClose.addEventListener(
        "click",
        () => this.toggleModal(false)
      );
    }
  }
  showResponseMSG(messaging, isSuccess = false) {
    this.wrapper.classList.add("petitioner--submitted");
    const { title, message } = messaging || { title: "", message: "" };
    if (this.responseTitle) this.responseTitle.innerText = title;
    if (this.responseText) this.responseText.innerHTML = message;
  }
  toggleModal(isShow = true) {
    if (!this.petitionerModal) return;
    this.petitionerModal.classList[isShow ? "add" : "remove"](
      "petitioner-modal--visible"
    );
    if (isShow) {
      this._escListener = (e) => {
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
    return !!((petitionerCaptcha == null ? void 0 : petitionerCaptcha.enableHcaptcha) && this.hcaptcha && !this.captchaValidated);
  }
  shouldValidateTurnstile() {
    return !!((petitionerCaptcha == null ? void 0 : petitionerCaptcha.enableTurnstile) && this.turnstile && !this.captchaValidated);
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
      headers: { "X-Requested-With": "XMLHttpRequest" }
    }).then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error! status: ".concat(response.status));
      }
      return response.json();
    }).then((res) => {
      if (res.success) {
        this.showResponseMSG(res.data, true);
      } else {
        this.showResponseMSG(res.data, false);
      }
      this.handleSubmissionComplete(formData);
    }).catch((error) => {
      console.error("Error:", error);
      alert("An unexpected error occurred. Please try again later.");
      this.handleSubmissionComplete();
    });
  }
  handleSubmissionComplete(formData) {
    var _a;
    this.wrapper.classList.remove("petitioner--loading");
    (_a = this.formEl) == null ? void 0 : _a.reset();
    this.captchaValidated = false;
    if (formData) {
      const event = new CustomEvent(
        "petitionerFormSubmit",
        {
          detail: { formData }
        }
      );
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
    this.paginationDiv.addEventListener("click", async (event) => {
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
    var _a;
    this.submissionListDiv.innerHTML = this.renderSubmissionsList();
    this.paginationDiv.querySelectorAll(".active").forEach((btn) => {
      btn.classList.remove("active");
    });
    (_a = this.paginationDiv.querySelector('[data-page="'.concat(this.options.currentPage, '"]'))) == null ? void 0 : _a.classList.add("active");
  }
  renderSubmissionsList() {
    if (!this.options.submissions || this.options.submissions.length === 0) {
      return "";
    }
    return this.options.submissions.map((submission) => {
      return this.renderSubmissionItem(submission);
    }).join(", ");
  }
  renderSubmissionItem(submission) {
    return '<span class="submissions__item">'.concat(submission.name, "</span>");
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
      paginationHTML += '<button class="ptr-pagination__item '.concat(i === this.options.currentPage ? "active" : "", '" data-page="').concat(i, '">').concat(i, "</button>");
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
    const list = this.options.submissions.map((submission) => {
      return this.renderSubmissionItem(submission);
    }).join("");
    return '\n		<div class="submissions__item submissions__item--heading">\n			'.concat(labels.map((key) => {
      return "<div>".concat(key, "</div>");
    }).join(""), "\n		</div>\n		").concat(list);
  }
  prepareLabels() {
    const labels = [];
    const submissionEntry = this.options.submissions[0];
    Object.keys(submissionEntry).forEach((key) => {
      var _a, _b;
      if (!((_a = this.options.labels) == null ? void 0 : _a[key]) || !this.options.fields.includes(key)) {
        return;
      }
      labels.push((_b = this.options.labels) == null ? void 0 : _b[key]);
    });
    return labels;
  }
  renderSubmissionItem(submission) {
    const filteredKeys = Object.keys(submission).filter(
      (key) => key in this.options.labels && this.options.fields.includes(key)
    );
    return '<div class="submissions__item">\n			'.concat(filteredKeys.map((key) => {
      var _a;
      const renderedValue = key === "fname" ? "".concat(submission.fname, " ").concat(submission.lname) : submission == null ? void 0 : submission[key];
      return '<div class="submissions__item__inner">\n						<strong>'.concat(((_a = this.options.labels) == null ? void 0 : _a[key]) || key, ":</strong>\n						").concat(renderedValue ? renderedValue : "", "\n					</div>");
    }).join(""), "\n		</div>");
  }
  /**
   *
   * @returns string final CSS for the wrapper
   */
  getWrapperStyles() {
    const labels = this.prepareLabels();
    return "--ptr-submission-columns: ".concat(labels.length);
  }
}
class PetitionerSubmissions {
  constructor(wrapper) {
    var _a, _b;
    this.wrapper = wrapper;
    this.currentPage = 1;
    this.totalResults = 10;
    if (!this.wrapper) {
      throw new Error("Element not found");
    }
    const settings = this.wrapper.dataset.ptrSettings;
    this.ajaxurl = ((_a = window == null ? void 0 : window.petitionerSubmissionSettings) == null ? void 0 : _a.actionPath) || "";
    this.nonce = ((_b = window == null ? void 0 : window.petitionerSubmissionSettings) == null ? void 0 : _b.nonce) || "";
    this.labels = {};
    if (!this.ajaxurl || !this.nonce) {
      throw new Error("AJAX URL or nonce is not defined in settings");
    }
    if (!settings) {
      throw new Error("Wrapper is missing data-ptr-settings attribute");
    }
    const settingsJSON = safelyParseJSON(settings);
    if (!settingsJSON || typeof settingsJSON !== "object" || !settingsJSON.form_id || !settingsJSON.per_page || !settingsJSON.style) {
      throw new Error(
        "Invalid settings provided for PetitionerSubmissions"
      );
    }
    this.settings = settingsJSON;
    this.init();
  }
  async init() {
    var _a;
    if (!this.settings) {
      return;
    }
    await this.fetchSubmissions();
    if (typeof this.submissions === "object" && ((_a = this.submissions) == null ? void 0 : _a.length) > 0) {
      const RenderClass = this.settings.style === "simple" ? SubmissionsRenderer : SubmissionsRendererTable;
      this.renderer = new RenderClass({
        wrapper: this.wrapper,
        submissions: this.submissions,
        perPage: this.settings.per_page,
        total: this.totalResults,
        currentPage: this.currentPage,
        labels: this.labels,
        fields: this.settings.fields ? this.settings.fields.split(",").map((f) => f.trim()) : [],
        pagination: this.settings.show_pagination,
        onPageChange: async (pageNum) => {
          var _a2;
          this.currentPage = pageNum;
          await this.fetchSubmissions();
          return (_a2 = this.submissions) != null ? _a2 : [];
        }
      });
      this.renderer.render();
    }
  }
  buildURL() {
    var _a, _b, _c;
    const url = new URL(this.ajaxurl, window.location.origin);
    url.searchParams.set("form_id", String((_a = this.settings) == null ? void 0 : _a.form_id));
    url.searchParams.set("per_page", String((_b = this.settings) == null ? void 0 : _b.per_page));
    url.searchParams.set("page", String(this.currentPage));
    if ((_c = this.settings) == null ? void 0 : _c.fields) {
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
    console.log(this.submissions);
    console.log(this.submissions);
    this.labels = response.data.labels || [];
  }
}
const allPetitions = document.querySelectorAll(".petitioner");
allPetitions.forEach((petition) => {
  if (!(petition instanceof HTMLElement)) {
    return;
  }
  new PetitionerForm(petition);
});
const allSubmissions = document.querySelectorAll(".petitioner-submissions");
allSubmissions.forEach((submissionsDiv) => {
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
export {
  __vite_legacy_guard
};
