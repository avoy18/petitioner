var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _a2, _b2, _c2, _d2, _e2;
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
    __publicField(this, "form");
    __publicField(this, "hcaptchaField");
    __publicField(this, "hcaptchaContainer");
    __publicField(this, "widgetId", null);
    __publicField(this, "callbackFunction", null);
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
    var _a3, _b3;
    return !!(typeof hcaptcha !== "undefined" && ((_a3 = window.petitionerCaptcha) == null ? void 0 : _a3.enableHcaptcha) && ((_b3 = window.petitionerCaptcha) == null ? void 0 : _b3.hcaptchaSiteKey) && this.hcaptchaContainer);
  }
  initHCaptcha() {
    var _a3;
    if (!hcaptcha || !((_a3 = window.petitionerCaptcha) == null ? void 0 : _a3.hcaptchaSiteKey) || !this.hcaptchaContainer) {
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
    __publicField(this, "form");
    __publicField(this, "turnstileField");
    __publicField(this, "turnstileContainer");
    __publicField(this, "widgetId", null);
    __publicField(this, "callbackFunction", null);
    var _a3;
    this.form = petitionForm;
    this.turnstileField = this.form.querySelector(
      '[name="petitioner-turnstile-response"]'
    );
    this.turnstileContainer = this.form.querySelector(
      ".petitioner-turnstile-container"
    );
    if (typeof (window == null ? void 0 : window.turnstile) === "undefined" || !((_a3 = window.petitionerCaptcha) == null ? void 0 : _a3.turnstileSiteKey) || !this.turnstileContainer) {
      return;
    }
    this.initTurnstile();
  }
  initTurnstile() {
    var _a3, _b3, _c3;
    const sitekey = (_a3 = window.petitionerCaptcha) == null ? void 0 : _a3.turnstileSiteKey;
    if (!sitekey) {
      this.handleError();
      return;
    }
    this.widgetId = (_c3 = (_b3 = window == null ? void 0 : window.turnstile) == null ? void 0 : _b3.render) == null ? void 0 : _c3.call(_b3, this.turnstileContainer, {
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
    var _a3, _b3;
    if (!this.turnstileField || this.turnstileField.value) {
      callback();
      return;
    }
    this.callbackFunction = callback;
    if (this.widgetId) {
      (_b3 = (_a3 = window == null ? void 0 : window.turnstile) == null ? void 0 : _a3.execute) == null ? void 0 : _b3.call(_a3, this.widgetId);
    }
  }
}
class PetitionerForm {
  constructor(wrapper) {
    __publicField(this, "wrapper");
    __publicField(this, "responseTitle");
    __publicField(this, "responseText");
    __publicField(this, "formEl");
    __publicField(this, "viewLetterBTN");
    __publicField(this, "petitionerModal");
    __publicField(this, "modalClose");
    __publicField(this, "backdrop");
    __publicField(this, "actionPath");
    __publicField(this, "nonce");
    __publicField(this, "captchaValidated", false);
    __publicField(this, "hcaptcha", null);
    __publicField(this, "turnstile", null);
    __publicField(this, "_escListener", null);
    this.wrapper = wrapper;
    this.responseTitle = null;
    this.responseText = null;
    this.formEl = null;
    this.viewLetterBTN = null;
    this.petitionerModal = null;
    this.modalClose = null;
    this.backdrop = null;
    const settings = (window == null ? void 0 : window.petitionerFormSettings) || {};
    const { actionPath = "", nonce: nonce2 = "" } = settings;
    this.actionPath = actionPath || "";
    this.nonce = nonce2;
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
      this._escListener = (e2) => {
        if (e2.key === "Escape") this.toggleModal(false);
      };
      document.addEventListener("keydown", this._escListener);
    } else if (this._escListener) {
      document.removeEventListener("keydown", this._escListener);
      this._escListener = null;
    }
  }
  handleFormSubmit(e2) {
    e2.preventDefault();
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
    var _a3;
    this.wrapper.classList.remove("petitioner--loading");
    (_a3 = this.formEl) == null ? void 0 : _a3.reset();
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
    __publicField(this, "paginationDiv");
    __publicField(this, "submissionListDiv");
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
    var _a3;
    this.submissionListDiv.innerHTML = this.renderSubmissionsList();
    this.paginationDiv.querySelectorAll(".active").forEach((btn) => {
      btn.classList.remove("active");
    });
    (_a3 = this.paginationDiv.querySelector('[data-page="'.concat(this.options.currentPage, '"]'))) == null ? void 0 : _a3.classList.add("active");
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
    for (let i2 = 1; i2 <= totalPages; i2++) {
      paginationHTML += '<button class="ptr-pagination__item '.concat(i2 === this.options.currentPage ? "active" : "", '" data-page="').concat(i2, '">').concat(i2, "</button>");
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
      var _a3, _b3;
      if (!((_a3 = this.options.labels) == null ? void 0 : _a3[key]) || !this.options.fields.includes(key)) {
        return;
      }
      labels.push((_b3 = this.options.labels) == null ? void 0 : _b3[key]);
    });
    return labels;
  }
  renderSubmissionItem(submission) {
    const filteredKeys = Object.keys(submission).filter(
      (key) => key in this.options.labels && this.options.fields.includes(key)
    );
    return '<div class="submissions__item">\n			'.concat(filteredKeys.map((key) => {
      var _a3;
      const renderedValue = key === "fname" ? "".concat(submission.fname, " ").concat(submission.lname) : submission == null ? void 0 : submission[key];
      return '<div class="submissions__item__inner">\n						<strong>'.concat(((_a3 = this.options.labels) == null ? void 0 : _a3[key]) || key, ":</strong>\n						").concat(renderedValue ? renderedValue : "", "\n					</div>");
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
let PetitionerSubmissions$1 = class PetitionerSubmissions {
  constructor(wrapper) {
    __publicField(this, "settings");
    __publicField(this, "submissions");
    __publicField(this, "renderer");
    __publicField(this, "ajaxurl");
    __publicField(this, "nonce");
    __publicField(this, "currentPage", 1);
    __publicField(this, "totalResults", 10);
    __publicField(this, "labels");
    var _a3, _b3;
    this.wrapper = wrapper;
    if (!this.wrapper) {
      throw new Error("Element not found");
    }
    const settings = this.wrapper.dataset.ptrSettings;
    this.ajaxurl = ((_a3 = window == null ? void 0 : window.petitionerSubmissionSettings) == null ? void 0 : _a3.actionPath) || "";
    this.nonce = ((_b3 = window == null ? void 0 : window.petitionerSubmissionSettings) == null ? void 0 : _b3.nonce) || "";
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
    var _a3;
    if (!this.settings) {
      return;
    }
    await this.fetchSubmissions();
    if (typeof this.submissions === "object" && ((_a3 = this.submissions) == null ? void 0 : _a3.length) > 0) {
      const RenderClass = this.settings.style === "simple" ? SubmissionsRenderer : SubmissionsRendererTable;
      this.renderer = new RenderClass({
        wrapper: this.wrapper,
        submissions: this.submissions,
        perPage: this.settings.per_page,
        total: this.totalResults,
        currentPage: this.currentPage,
        labels: this.labels,
        fields: this.settings.fields ? this.settings.fields.split(",").map((f2) => f2.trim()) : [],
        pagination: this.settings.show_pagination,
        onPageChange: async (pageNum) => {
          var _a4;
          this.currentPage = pageNum;
          await this.fetchSubmissions();
          return (_a4 = this.submissions) != null ? _a4 : [];
        }
      });
      this.renderer.render();
    }
  }
  buildURL() {
    var _a3, _b3, _c3;
    const url = new URL(this.ajaxurl, window.location.origin);
    url.searchParams.set("form_id", String((_a3 = this.settings) == null ? void 0 : _a3.form_id));
    url.searchParams.set("per_page", String((_b3 = this.settings) == null ? void 0 : _b3.per_page));
    url.searchParams.set("page", String(this.currentPage));
    if ((_c3 = this.settings) == null ? void 0 : _c3.fields) {
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
const t$2 = globalThis, e$2 = t$2.ShadowRoot && (void 0 === t$2.ShadyCSS || t$2.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, s$2 = Symbol(), o$4 = /* @__PURE__ */ new WeakMap();
let n$3 = class n {
  constructor(t2, e2, o2) {
    if (this._$cssResult$ = true, o2 !== s$2) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t2, this.t = e2;
  }
  get styleSheet() {
    let t2 = this.o;
    const s2 = this.t;
    if (e$2 && void 0 === t2) {
      const e2 = void 0 !== s2 && 1 === s2.length;
      e2 && (t2 = o$4.get(s2)), void 0 === t2 && ((this.o = t2 = new CSSStyleSheet()).replaceSync(this.cssText), e2 && o$4.set(s2, t2));
    }
    return t2;
  }
  toString() {
    return this.cssText;
  }
};
const r$3 = (t2) => new n$3("string" == typeof t2 ? t2 : t2 + "", void 0, s$2), S$1 = (s2, o2) => {
  if (e$2) s2.adoptedStyleSheets = o2.map((t2) => t2 instanceof CSSStyleSheet ? t2 : t2.styleSheet);
  else for (const e2 of o2) {
    const o3 = document.createElement("style"), n3 = t$2.litNonce;
    void 0 !== n3 && o3.setAttribute("nonce", n3), o3.textContent = e2.cssText, s2.appendChild(o3);
  }
}, c$2 = e$2 ? (t2) => t2 : (t2) => t2 instanceof CSSStyleSheet ? ((t3) => {
  let e2 = "";
  for (const s2 of t3.cssRules) e2 += s2.cssText;
  return r$3(e2);
})(t2) : t2;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: i$2, defineProperty: e$1, getOwnPropertyDescriptor: h$1, getOwnPropertyNames: r$2, getOwnPropertySymbols: o$3, getPrototypeOf: n$2 } = Object, a$1 = globalThis, c$1 = a$1.trustedTypes, l$1 = c$1 ? c$1.emptyScript : "", p$1 = a$1.reactiveElementPolyfillSupport, d$1 = (t2, s2) => t2, u$1 = { toAttribute(t2, s2) {
  switch (s2) {
    case Boolean:
      t2 = t2 ? l$1 : null;
      break;
    case Object:
    case Array:
      t2 = null == t2 ? t2 : JSON.stringify(t2);
  }
  return t2;
}, fromAttribute(t2, s2) {
  let i2 = t2;
  switch (s2) {
    case Boolean:
      i2 = null !== t2;
      break;
    case Number:
      i2 = null === t2 ? null : Number(t2);
      break;
    case Object:
    case Array:
      try {
        i2 = JSON.parse(t2);
      } catch (t3) {
        i2 = null;
      }
  }
  return i2;
} }, f$1 = (t2, s2) => !i$2(t2, s2), b = { attribute: true, type: String, converter: u$1, reflect: false, useDefault: false, hasChanged: f$1 };
(_a = Symbol.metadata) != null ? _a : Symbol.metadata = Symbol("metadata"), (_b = a$1.litPropertyMetadata) != null ? _b : a$1.litPropertyMetadata = /* @__PURE__ */ new WeakMap();
let y$1 = class y extends HTMLElement {
  static addInitializer(t2) {
    var _a3;
    this._$Ei(), ((_a3 = this.l) != null ? _a3 : this.l = []).push(t2);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t2, s2 = b) {
    if (s2.state && (s2.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t2) && ((s2 = Object.create(s2)).wrapped = true), this.elementProperties.set(t2, s2), !s2.noAccessor) {
      const i2 = Symbol(), h2 = this.getPropertyDescriptor(t2, i2, s2);
      void 0 !== h2 && e$1(this.prototype, t2, h2);
    }
  }
  static getPropertyDescriptor(t2, s2, i2) {
    var _a3;
    const { get: e2, set: r2 } = (_a3 = h$1(this.prototype, t2)) != null ? _a3 : { get() {
      return this[s2];
    }, set(t3) {
      this[s2] = t3;
    } };
    return { get: e2, set(s3) {
      const h2 = e2 == null ? void 0 : e2.call(this);
      r2 == null ? void 0 : r2.call(this, s3), this.requestUpdate(t2, h2, i2);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t2) {
    var _a3;
    return (_a3 = this.elementProperties.get(t2)) != null ? _a3 : b;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d$1("elementProperties"))) return;
    const t2 = n$2(this);
    t2.finalize(), void 0 !== t2.l && (this.l = [...t2.l]), this.elementProperties = new Map(t2.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d$1("finalized"))) return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d$1("properties"))) {
      const t3 = this.properties, s2 = [...r$2(t3), ...o$3(t3)];
      for (const i2 of s2) this.createProperty(i2, t3[i2]);
    }
    const t2 = this[Symbol.metadata];
    if (null !== t2) {
      const s2 = litPropertyMetadata.get(t2);
      if (void 0 !== s2) for (const [t3, i2] of s2) this.elementProperties.set(t3, i2);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t3, s2] of this.elementProperties) {
      const i2 = this._$Eu(t3, s2);
      void 0 !== i2 && this._$Eh.set(i2, t3);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s2) {
    const i2 = [];
    if (Array.isArray(s2)) {
      const e2 = new Set(s2.flat(1 / 0).reverse());
      for (const s3 of e2) i2.unshift(c$2(s3));
    } else void 0 !== s2 && i2.push(c$2(s2));
    return i2;
  }
  static _$Eu(t2, s2) {
    const i2 = s2.attribute;
    return false === i2 ? void 0 : "string" == typeof i2 ? i2 : "string" == typeof t2 ? t2.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var _a3;
    this._$ES = new Promise((t2) => this.enableUpdating = t2), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (_a3 = this.constructor.l) == null ? void 0 : _a3.forEach((t2) => t2(this));
  }
  addController(t2) {
    var _a3, _b3;
    ((_a3 = this._$EO) != null ? _a3 : this._$EO = /* @__PURE__ */ new Set()).add(t2), void 0 !== this.renderRoot && this.isConnected && ((_b3 = t2.hostConnected) == null ? void 0 : _b3.call(t2));
  }
  removeController(t2) {
    var _a3;
    (_a3 = this._$EO) == null ? void 0 : _a3.delete(t2);
  }
  _$E_() {
    const t2 = /* @__PURE__ */ new Map(), s2 = this.constructor.elementProperties;
    for (const i2 of s2.keys()) this.hasOwnProperty(i2) && (t2.set(i2, this[i2]), delete this[i2]);
    t2.size > 0 && (this._$Ep = t2);
  }
  createRenderRoot() {
    var _a3;
    const t2 = (_a3 = this.shadowRoot) != null ? _a3 : this.attachShadow(this.constructor.shadowRootOptions);
    return S$1(t2, this.constructor.elementStyles), t2;
  }
  connectedCallback() {
    var _a3, _b3;
    (_a3 = this.renderRoot) != null ? _a3 : this.renderRoot = this.createRenderRoot(), this.enableUpdating(true), (_b3 = this._$EO) == null ? void 0 : _b3.forEach((t2) => {
      var _a4;
      return (_a4 = t2.hostConnected) == null ? void 0 : _a4.call(t2);
    });
  }
  enableUpdating(t2) {
  }
  disconnectedCallback() {
    var _a3;
    (_a3 = this._$EO) == null ? void 0 : _a3.forEach((t2) => {
      var _a4;
      return (_a4 = t2.hostDisconnected) == null ? void 0 : _a4.call(t2);
    });
  }
  attributeChangedCallback(t2, s2, i2) {
    this._$AK(t2, i2);
  }
  _$ET(t2, s2) {
    var _a3;
    const i2 = this.constructor.elementProperties.get(t2), e2 = this.constructor._$Eu(t2, i2);
    if (void 0 !== e2 && true === i2.reflect) {
      const h2 = (void 0 !== ((_a3 = i2.converter) == null ? void 0 : _a3.toAttribute) ? i2.converter : u$1).toAttribute(s2, i2.type);
      this._$Em = t2, null == h2 ? this.removeAttribute(e2) : this.setAttribute(e2, h2), this._$Em = null;
    }
  }
  _$AK(t2, s2) {
    var _a3, _b3, _c3;
    const i2 = this.constructor, e2 = i2._$Eh.get(t2);
    if (void 0 !== e2 && this._$Em !== e2) {
      const t3 = i2.getPropertyOptions(e2), h2 = "function" == typeof t3.converter ? { fromAttribute: t3.converter } : void 0 !== ((_a3 = t3.converter) == null ? void 0 : _a3.fromAttribute) ? t3.converter : u$1;
      this._$Em = e2;
      const r2 = h2.fromAttribute(s2, t3.type);
      this[e2] = (_c3 = r2 != null ? r2 : (_b3 = this._$Ej) == null ? void 0 : _b3.get(e2)) != null ? _c3 : r2, this._$Em = null;
    }
  }
  requestUpdate(t2, s2, i2) {
    var _a3, _b3;
    if (void 0 !== t2) {
      const e2 = this.constructor, h2 = this[t2];
      if (i2 != null ? i2 : i2 = e2.getPropertyOptions(t2), !(((_a3 = i2.hasChanged) != null ? _a3 : f$1)(h2, s2) || i2.useDefault && i2.reflect && h2 === ((_b3 = this._$Ej) == null ? void 0 : _b3.get(t2)) && !this.hasAttribute(e2._$Eu(t2, i2)))) return;
      this.C(t2, s2, i2);
    }
    false === this.isUpdatePending && (this._$ES = this._$EP());
  }
  C(t2, s2, { useDefault: i2, reflect: e2, wrapped: h2 }, r2) {
    var _a3, _b3, _c3;
    i2 && !((_a3 = this._$Ej) != null ? _a3 : this._$Ej = /* @__PURE__ */ new Map()).has(t2) && (this._$Ej.set(t2, (_b3 = r2 != null ? r2 : s2) != null ? _b3 : this[t2]), true !== h2 || void 0 !== r2) || (this._$AL.has(t2) || (this.hasUpdated || i2 || (s2 = void 0), this._$AL.set(t2, s2)), true === e2 && this._$Em !== t2 && ((_c3 = this._$Eq) != null ? _c3 : this._$Eq = /* @__PURE__ */ new Set()).add(t2));
  }
  async _$EP() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t3) {
      Promise.reject(t3);
    }
    const t2 = this.scheduleUpdate();
    return null != t2 && await t2, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var _a3, _b3;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if ((_a3 = this.renderRoot) != null ? _a3 : this.renderRoot = this.createRenderRoot(), this._$Ep) {
        for (const [t4, s3] of this._$Ep) this[t4] = s3;
        this._$Ep = void 0;
      }
      const t3 = this.constructor.elementProperties;
      if (t3.size > 0) for (const [s3, i2] of t3) {
        const { wrapped: t4 } = i2, e2 = this[s3];
        true !== t4 || this._$AL.has(s3) || void 0 === e2 || this.C(s3, void 0, i2, e2);
      }
    }
    let t2 = false;
    const s2 = this._$AL;
    try {
      t2 = this.shouldUpdate(s2), t2 ? (this.willUpdate(s2), (_b3 = this._$EO) == null ? void 0 : _b3.forEach((t3) => {
        var _a4;
        return (_a4 = t3.hostUpdate) == null ? void 0 : _a4.call(t3);
      }), this.update(s2)) : this._$EM();
    } catch (s3) {
      throw t2 = false, this._$EM(), s3;
    }
    t2 && this._$AE(s2);
  }
  willUpdate(t2) {
  }
  _$AE(t2) {
    var _a3;
    (_a3 = this._$EO) == null ? void 0 : _a3.forEach((t3) => {
      var _a4;
      return (_a4 = t3.hostUpdated) == null ? void 0 : _a4.call(t3);
    }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t2)), this.updated(t2);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t2) {
    return true;
  }
  update(t2) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t3) => this._$ET(t3, this[t3]))), this._$EM();
  }
  updated(t2) {
  }
  firstUpdated(t2) {
  }
};
y$1.elementStyles = [], y$1.shadowRootOptions = { mode: "open" }, y$1[d$1("elementProperties")] = /* @__PURE__ */ new Map(), y$1[d$1("finalized")] = /* @__PURE__ */ new Map(), p$1 == null ? void 0 : p$1({ ReactiveElement: y$1 }), ((_c = a$1.reactiveElementVersions) != null ? _c : a$1.reactiveElementVersions = []).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1 = globalThis, i$1 = t$1.trustedTypes, s$1 = i$1 ? i$1.createPolicy("lit-html", { createHTML: (t2) => t2 }) : void 0, e = "$lit$", h = "lit$".concat(Math.random().toFixed(9).slice(2), "$"), o$2 = "?" + h, n$1 = "<".concat(o$2, ">"), r$1 = document, l = () => r$1.createComment(""), c = (t2) => null === t2 || "object" != typeof t2 && "function" != typeof t2, a = Array.isArray, u = (t2) => a(t2) || "function" == typeof (t2 == null ? void 0 : t2[Symbol.iterator]), d = "[ 	\n\f\r]", f = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, v = /-->/g, _ = />/g, m = RegExp(">|".concat(d, "(?:([^\\s\"'>=/]+)(").concat(d, "*=").concat(d, "*(?:[^ 	\n\f\r\"'`<>=]|(\"|')|))|$)"), "g"), p = /'/g, g = /"/g, $ = /^(?:script|style|textarea|title)$/i, y2 = (t2) => (i2, ...s2) => ({ _$litType$: t2, strings: i2, values: s2 }), x = y2(1), T = Symbol.for("lit-noChange"), E = Symbol.for("lit-nothing"), A = /* @__PURE__ */ new WeakMap(), C = r$1.createTreeWalker(r$1, 129);
function P(t2, i2) {
  if (!a(t2) || !t2.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== s$1 ? s$1.createHTML(i2) : i2;
}
const V = (t2, i2) => {
  const s2 = t2.length - 1, o2 = [];
  let r2, l2 = 2 === i2 ? "<svg>" : 3 === i2 ? "<math>" : "", c2 = f;
  for (let i3 = 0; i3 < s2; i3++) {
    const s3 = t2[i3];
    let a2, u2, d2 = -1, y3 = 0;
    for (; y3 < s3.length && (c2.lastIndex = y3, u2 = c2.exec(s3), null !== u2); ) y3 = c2.lastIndex, c2 === f ? "!--" === u2[1] ? c2 = v : void 0 !== u2[1] ? c2 = _ : void 0 !== u2[2] ? ($.test(u2[2]) && (r2 = RegExp("</" + u2[2], "g")), c2 = m) : void 0 !== u2[3] && (c2 = m) : c2 === m ? ">" === u2[0] ? (c2 = r2 != null ? r2 : f, d2 = -1) : void 0 === u2[1] ? d2 = -2 : (d2 = c2.lastIndex - u2[2].length, a2 = u2[1], c2 = void 0 === u2[3] ? m : '"' === u2[3] ? g : p) : c2 === g || c2 === p ? c2 = m : c2 === v || c2 === _ ? c2 = f : (c2 = m, r2 = void 0);
    const x2 = c2 === m && t2[i3 + 1].startsWith("/>") ? " " : "";
    l2 += c2 === f ? s3 + n$1 : d2 >= 0 ? (o2.push(a2), s3.slice(0, d2) + e + s3.slice(d2) + h + x2) : s3 + h + (-2 === d2 ? i3 : x2);
  }
  return [P(t2, l2 + (t2[s2] || "<?>") + (2 === i2 ? "</svg>" : 3 === i2 ? "</math>" : "")), o2];
};
class N {
  constructor({ strings: t2, _$litType$: s2 }, n3) {
    let r2;
    this.parts = [];
    let c2 = 0, a2 = 0;
    const u2 = t2.length - 1, d2 = this.parts, [f2, v2] = V(t2, s2);
    if (this.el = N.createElement(f2, n3), C.currentNode = this.el.content, 2 === s2 || 3 === s2) {
      const t3 = this.el.content.firstChild;
      t3.replaceWith(...t3.childNodes);
    }
    for (; null !== (r2 = C.nextNode()) && d2.length < u2; ) {
      if (1 === r2.nodeType) {
        if (r2.hasAttributes()) for (const t3 of r2.getAttributeNames()) if (t3.endsWith(e)) {
          const i2 = v2[a2++], s3 = r2.getAttribute(t3).split(h), e2 = /([.?@])?(.*)/.exec(i2);
          d2.push({ type: 1, index: c2, name: e2[2], strings: s3, ctor: "." === e2[1] ? H : "?" === e2[1] ? I : "@" === e2[1] ? L : k }), r2.removeAttribute(t3);
        } else t3.startsWith(h) && (d2.push({ type: 6, index: c2 }), r2.removeAttribute(t3));
        if ($.test(r2.tagName)) {
          const t3 = r2.textContent.split(h), s3 = t3.length - 1;
          if (s3 > 0) {
            r2.textContent = i$1 ? i$1.emptyScript : "";
            for (let i2 = 0; i2 < s3; i2++) r2.append(t3[i2], l()), C.nextNode(), d2.push({ type: 2, index: ++c2 });
            r2.append(t3[s3], l());
          }
        }
      } else if (8 === r2.nodeType) if (r2.data === o$2) d2.push({ type: 2, index: c2 });
      else {
        let t3 = -1;
        for (; -1 !== (t3 = r2.data.indexOf(h, t3 + 1)); ) d2.push({ type: 7, index: c2 }), t3 += h.length - 1;
      }
      c2++;
    }
  }
  static createElement(t2, i2) {
    const s2 = r$1.createElement("template");
    return s2.innerHTML = t2, s2;
  }
}
function S(t2, i2, s2 = t2, e2) {
  var _a3, _b3, _c3;
  if (i2 === T) return i2;
  let h2 = void 0 !== e2 ? (_a3 = s2._$Co) == null ? void 0 : _a3[e2] : s2._$Cl;
  const o2 = c(i2) ? void 0 : i2._$litDirective$;
  return (h2 == null ? void 0 : h2.constructor) !== o2 && ((_b3 = h2 == null ? void 0 : h2._$AO) == null ? void 0 : _b3.call(h2, false), void 0 === o2 ? h2 = void 0 : (h2 = new o2(t2), h2._$AT(t2, s2, e2)), void 0 !== e2 ? ((_c3 = s2._$Co) != null ? _c3 : s2._$Co = [])[e2] = h2 : s2._$Cl = h2), void 0 !== h2 && (i2 = S(t2, h2._$AS(t2, i2.values), h2, e2)), i2;
}
class M {
  constructor(t2, i2) {
    this._$AV = [], this._$AN = void 0, this._$AD = t2, this._$AM = i2;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t2) {
    var _a3;
    const { el: { content: i2 }, parts: s2 } = this._$AD, e2 = ((_a3 = t2 == null ? void 0 : t2.creationScope) != null ? _a3 : r$1).importNode(i2, true);
    C.currentNode = e2;
    let h2 = C.nextNode(), o2 = 0, n3 = 0, l2 = s2[0];
    for (; void 0 !== l2; ) {
      if (o2 === l2.index) {
        let i3;
        2 === l2.type ? i3 = new R(h2, h2.nextSibling, this, t2) : 1 === l2.type ? i3 = new l2.ctor(h2, l2.name, l2.strings, this, t2) : 6 === l2.type && (i3 = new z(h2, this, t2)), this._$AV.push(i3), l2 = s2[++n3];
      }
      o2 !== (l2 == null ? void 0 : l2.index) && (h2 = C.nextNode(), o2++);
    }
    return C.currentNode = r$1, e2;
  }
  p(t2) {
    let i2 = 0;
    for (const s2 of this._$AV) void 0 !== s2 && (void 0 !== s2.strings ? (s2._$AI(t2, s2, i2), i2 += s2.strings.length - 2) : s2._$AI(t2[i2])), i2++;
  }
}
class R {
  get _$AU() {
    var _a3, _b3;
    return (_b3 = (_a3 = this._$AM) == null ? void 0 : _a3._$AU) != null ? _b3 : this._$Cv;
  }
  constructor(t2, i2, s2, e2) {
    var _a3;
    this.type = 2, this._$AH = E, this._$AN = void 0, this._$AA = t2, this._$AB = i2, this._$AM = s2, this.options = e2, this._$Cv = (_a3 = e2 == null ? void 0 : e2.isConnected) != null ? _a3 : true;
  }
  get parentNode() {
    let t2 = this._$AA.parentNode;
    const i2 = this._$AM;
    return void 0 !== i2 && 11 === (t2 == null ? void 0 : t2.nodeType) && (t2 = i2.parentNode), t2;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t2, i2 = this) {
    t2 = S(this, t2, i2), c(t2) ? t2 === E || null == t2 || "" === t2 ? (this._$AH !== E && this._$AR(), this._$AH = E) : t2 !== this._$AH && t2 !== T && this._(t2) : void 0 !== t2._$litType$ ? this.$(t2) : void 0 !== t2.nodeType ? this.T(t2) : u(t2) ? this.k(t2) : this._(t2);
  }
  O(t2) {
    return this._$AA.parentNode.insertBefore(t2, this._$AB);
  }
  T(t2) {
    this._$AH !== t2 && (this._$AR(), this._$AH = this.O(t2));
  }
  _(t2) {
    this._$AH !== E && c(this._$AH) ? this._$AA.nextSibling.data = t2 : this.T(r$1.createTextNode(t2)), this._$AH = t2;
  }
  $(t2) {
    var _a3;
    const { values: i2, _$litType$: s2 } = t2, e2 = "number" == typeof s2 ? this._$AC(t2) : (void 0 === s2.el && (s2.el = N.createElement(P(s2.h, s2.h[0]), this.options)), s2);
    if (((_a3 = this._$AH) == null ? void 0 : _a3._$AD) === e2) this._$AH.p(i2);
    else {
      const t3 = new M(e2, this), s3 = t3.u(this.options);
      t3.p(i2), this.T(s3), this._$AH = t3;
    }
  }
  _$AC(t2) {
    let i2 = A.get(t2.strings);
    return void 0 === i2 && A.set(t2.strings, i2 = new N(t2)), i2;
  }
  k(t2) {
    a(this._$AH) || (this._$AH = [], this._$AR());
    const i2 = this._$AH;
    let s2, e2 = 0;
    for (const h2 of t2) e2 === i2.length ? i2.push(s2 = new R(this.O(l()), this.O(l()), this, this.options)) : s2 = i2[e2], s2._$AI(h2), e2++;
    e2 < i2.length && (this._$AR(s2 && s2._$AB.nextSibling, e2), i2.length = e2);
  }
  _$AR(t2 = this._$AA.nextSibling, i2) {
    var _a3;
    for ((_a3 = this._$AP) == null ? void 0 : _a3.call(this, false, true, i2); t2 !== this._$AB; ) {
      const i3 = t2.nextSibling;
      t2.remove(), t2 = i3;
    }
  }
  setConnected(t2) {
    var _a3;
    void 0 === this._$AM && (this._$Cv = t2, (_a3 = this._$AP) == null ? void 0 : _a3.call(this, t2));
  }
}
class k {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t2, i2, s2, e2, h2) {
    this.type = 1, this._$AH = E, this._$AN = void 0, this.element = t2, this.name = i2, this._$AM = e2, this.options = h2, s2.length > 2 || "" !== s2[0] || "" !== s2[1] ? (this._$AH = Array(s2.length - 1).fill(new String()), this.strings = s2) : this._$AH = E;
  }
  _$AI(t2, i2 = this, s2, e2) {
    const h2 = this.strings;
    let o2 = false;
    if (void 0 === h2) t2 = S(this, t2, i2, 0), o2 = !c(t2) || t2 !== this._$AH && t2 !== T, o2 && (this._$AH = t2);
    else {
      const e3 = t2;
      let n3, r2;
      for (t2 = h2[0], n3 = 0; n3 < h2.length - 1; n3++) r2 = S(this, e3[s2 + n3], i2, n3), r2 === T && (r2 = this._$AH[n3]), o2 || (o2 = !c(r2) || r2 !== this._$AH[n3]), r2 === E ? t2 = E : t2 !== E && (t2 += (r2 != null ? r2 : "") + h2[n3 + 1]), this._$AH[n3] = r2;
    }
    o2 && !e2 && this.j(t2);
  }
  j(t2) {
    t2 === E ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t2 != null ? t2 : "");
  }
}
class H extends k {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t2) {
    this.element[this.name] = t2 === E ? void 0 : t2;
  }
}
class I extends k {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t2) {
    this.element.toggleAttribute(this.name, !!t2 && t2 !== E);
  }
}
class L extends k {
  constructor(t2, i2, s2, e2, h2) {
    super(t2, i2, s2, e2, h2), this.type = 5;
  }
  _$AI(t2, i2 = this) {
    var _a3;
    if ((t2 = (_a3 = S(this, t2, i2, 0)) != null ? _a3 : E) === T) return;
    const s2 = this._$AH, e2 = t2 === E && s2 !== E || t2.capture !== s2.capture || t2.once !== s2.once || t2.passive !== s2.passive, h2 = t2 !== E && (s2 === E || e2);
    e2 && this.element.removeEventListener(this.name, this, s2), h2 && this.element.addEventListener(this.name, this, t2), this._$AH = t2;
  }
  handleEvent(t2) {
    var _a3, _b3;
    "function" == typeof this._$AH ? this._$AH.call((_b3 = (_a3 = this.options) == null ? void 0 : _a3.host) != null ? _b3 : this.element, t2) : this._$AH.handleEvent(t2);
  }
}
class z {
  constructor(t2, i2, s2) {
    this.element = t2, this.type = 6, this._$AN = void 0, this._$AM = i2, this.options = s2;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t2) {
    S(this, t2);
  }
}
const j = t$1.litHtmlPolyfillSupport;
j == null ? void 0 : j(N, R), ((_d = t$1.litHtmlVersions) != null ? _d : t$1.litHtmlVersions = []).push("3.3.1");
const B = (t2, i2, s2) => {
  var _a3, _b3;
  const e2 = (_a3 = s2 == null ? void 0 : s2.renderBefore) != null ? _a3 : i2;
  let h2 = e2._$litPart$;
  if (void 0 === h2) {
    const t3 = (_b3 = s2 == null ? void 0 : s2.renderBefore) != null ? _b3 : null;
    e2._$litPart$ = h2 = new R(i2.insertBefore(l(), t3), t3, void 0, s2 != null ? s2 : {});
  }
  return h2._$AI(t2), h2;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const s = globalThis;
class i extends y$1 {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var _a3, _b3;
    const t2 = super.createRenderRoot();
    return (_b3 = (_a3 = this.renderOptions).renderBefore) != null ? _b3 : _a3.renderBefore = t2.firstChild, t2;
  }
  update(t2) {
    const r2 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t2), this._$Do = B(r2, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var _a3;
    super.connectedCallback(), (_a3 = this._$Do) == null ? void 0 : _a3.setConnected(true);
  }
  disconnectedCallback() {
    var _a3;
    super.disconnectedCallback(), (_a3 = this._$Do) == null ? void 0 : _a3.setConnected(false);
  }
  render() {
    return T;
  }
}
i._$litElement$ = true, i["finalized"] = true, (_e = s.litElementHydrateSupport) == null ? void 0 : _e.call(s, { LitElement: i });
const o$1 = s.litElementPolyfillSupport;
o$1 == null ? void 0 : o$1({ LitElement: i });
((_f = s.litElementVersions) != null ? _f : s.litElementVersions = []).push("4.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t = (t2) => (e2, o2) => {
  void 0 !== o2 ? o2.addInitializer(() => {
    customElements.define(t2, e2);
  }) : customElements.define(t2, e2);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const o = { attribute: true, type: String, converter: u$1, reflect: false, hasChanged: f$1 }, r = (t2 = o, e2, r2) => {
  const { kind: n3, metadata: i2 } = r2;
  let s2 = globalThis.litPropertyMetadata.get(i2);
  if (void 0 === s2 && globalThis.litPropertyMetadata.set(i2, s2 = /* @__PURE__ */ new Map()), "setter" === n3 && ((t2 = Object.create(t2)).wrapped = true), s2.set(r2.name, t2), "accessor" === n3) {
    const { name: o2 } = r2;
    return { set(r3) {
      const n4 = e2.get.call(this);
      e2.set.call(this, r3), this.requestUpdate(o2, n4, t2);
    }, init(e3) {
      return void 0 !== e3 && this.C(o2, void 0, t2, e3), e3;
    } };
  }
  if ("setter" === n3) {
    const { name: o2 } = r2;
    return function(r3) {
      const n4 = this[o2];
      e2.call(this, r3), this.requestUpdate(o2, n4, t2);
    };
  }
  throw Error("Unsupported decorator location: " + n3);
};
function n2(t2) {
  return (e2, o2) => "object" == typeof o2 ? r(t2, e2, o2) : ((t3, e3, o3) => {
    const r2 = e3.hasOwnProperty(o3);
    return e3.constructor.createProperty(o3, t3), r2 ? Object.getOwnPropertyDescriptor(e3, o3) : void 0;
  })(t2, e2, o2);
}
var __defProp$2 = Object.defineProperty;
var __getOwnPropDesc$2 = Object.getOwnPropertyDescriptor;
var __decorateClass$2 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$2(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$2(target, key, result);
  return result;
};
let SimpleList = class extends i {
  constructor() {
    super(...arguments);
    __publicField(this, "submissions", []);
    __publicField(this, "labels", {});
  }
  render() {
    return x(_a2 || (_a2 = __template(["\n        assasa\n			<div>", "</div>\n		"])), JSON.stringify(this.submissions));
  }
};
__decorateClass$2([
  n2({ type: Array })
], SimpleList.prototype, "submissions", 2);
__decorateClass$2([
  n2({ type: Object })
], SimpleList.prototype, "labels", 2);
SimpleList = __decorateClass$2([
  t("simple-list")
], SimpleList);
var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$1(target, key, result);
  return result;
};
let TableList = class extends i {
  constructor() {
    super(...arguments);
    __publicField(this, "submissions", []);
    __publicField(this, "labels", {});
  }
  render() {
    return x(_b2 || (_b2 = __template(["\n        Table List\n			<div>", "</div>\n		"])), JSON.stringify(this.submissions));
  }
};
__decorateClass$1([
  n2({ type: Array })
], TableList.prototype, "submissions", 2);
__decorateClass$1([
  n2({ type: Object })
], TableList.prototype, "labels", 2);
TableList = __decorateClass$1([
  t("table-list")
], TableList);
var __defProp2 = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp2(target, key, result);
  return result;
};
const ajaxUrl = (_h = (_g = window == null ? void 0 : window.petitionerSubmissionSettings) == null ? void 0 : _g.actionPath) != null ? _h : "";
const nonce = (_j = (_i = window == null ? void 0 : window.petitionerSubmissionSettings) == null ? void 0 : _i.nonce) != null ? _j : "";
if (!ajaxUrl || !nonce) {
  throw new Error("AJAX URL or nonce is not defined in settings");
}
let PetitionerSubmissions2 = class extends i {
  constructor() {
    super(...arguments);
    __publicField(this, "formId", 0);
    __publicField(this, "perPage", 10);
    __publicField(this, "formStyle", "simple");
    __publicField(this, "formFields", "");
    __publicField(this, "showPagination", false);
    __publicField(this, "labels", {});
    __publicField(this, "ajaxurl", ajaxUrl);
    __publicField(this, "nonce", nonce);
    __publicField(this, "totalResults", 10);
    __publicField(this, "submissions", []);
    __publicField(this, "currentPage", 1);
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
      return x(_c2 || (_c2 = __template(["<simple-list\n				.submissions=", "\n				.labels=", "\n			></simple-list>"])), this.submissions, this.labels);
    }
    return x(_d2 || (_d2 = __template(["<table-list\n			.submissions=", "\n			.labels=", "\n		></table-list>"])), this.submissions, this.labels);
  }
  render() {
    return x(_e2 || (_e2 = __template(['\n			<div class="submissions__list">', "</div>\n		"])), this.renderListComponent());
  }
};
__decorateClass([
  n2({ type: Number, attribute: "form-id" })
], PetitionerSubmissions2.prototype, "formId", 2);
__decorateClass([
  n2({ type: Number, attribute: "per-page" })
], PetitionerSubmissions2.prototype, "perPage", 2);
__decorateClass([
  n2({ type: String, attribute: "form-style" })
], PetitionerSubmissions2.prototype, "formStyle", 2);
__decorateClass([
  n2({ type: String, attribute: "fields" })
], PetitionerSubmissions2.prototype, "formFields", 2);
__decorateClass([
  n2({ type: Boolean, attribute: "show_pagination" })
], PetitionerSubmissions2.prototype, "showPagination", 2);
__decorateClass([
  n2({ type: Object })
], PetitionerSubmissions2.prototype, "labels", 2);
__decorateClass([
  n2({ type: String })
], PetitionerSubmissions2.prototype, "ajaxurl", 2);
__decorateClass([
  n2({ type: String })
], PetitionerSubmissions2.prototype, "nonce", 2);
__decorateClass([
  n2({ type: Number })
], PetitionerSubmissions2.prototype, "totalResults", 2);
__decorateClass([
  n2({ type: Array })
], PetitionerSubmissions2.prototype, "submissions", 2);
__decorateClass([
  n2({ type: Number })
], PetitionerSubmissions2.prototype, "currentPage", 2);
PetitionerSubmissions2 = __decorateClass([
  t("petitioner-submissions")
], PetitionerSubmissions2);
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
  new PetitionerSubmissions$1(submissionsDiv);
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
