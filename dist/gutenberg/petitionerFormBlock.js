/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/gutenberg/form/Edit.jsx":
/*!*************************************!*\
  !*** ./src/gutenberg/form/Edit.jsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/server-side-render */ "@wordpress/server-side-render");
/* harmony import */ var _wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);





var continents = ['Africa', 'America', 'Antarctica', 'Asia', 'Europe', 'Oceania'];
function Edit(_ref) {
  var attributes = _ref.attributes,
    setAttributes = _ref.setAttributes;
  var formId = attributes.formId,
    newPetitionLink = attributes.newPetitionLink;
  var blockAtts = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps)();
  var allPetitions = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useSelect)(function (select) {
    return select('core').getEntityRecords('postType', 'petitioner-petition', {
      per_page: -1,
      _fields: 'title,id'
    });
  }, []) || [];
  var petitionOptions = [];
  allPetitions.forEach(function (el) {
    var label = el.title.raw;
    var limit = 40;
    if (label.length > limit) {
      label = label.substring(0, limit) + '...';
    }
    var objToPush = {
      label: label,
      value: el.id
    };
    petitionOptions.push(objToPush);
  });
  var FinalCompontnt = function FinalCompontnt() {
    if (!allPetitions.length) {
      return /*#__PURE__*/React.createElement("div", {
        style: {
          padding: '24px',
          background: '#efefef'
        }
      }, /*#__PURE__*/React.createElement("p", null, " ", /*#__PURE__*/React.createElement("small", null, "Petitioner form")), /*#__PURE__*/React.createElement("p", null, "Looks like you haven't added any forms yet!"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
        variant: "secondary",
        href: newPetitionLink || ''
      }, "Create your first petition"));
    }
    if (!formId) {
      return /*#__PURE__*/React.createElement("div", {
        style: {
          padding: '24px',
          background: '#efefef'
        }
      }, /*#__PURE__*/React.createElement("p", null, " ", /*#__PURE__*/React.createElement("small", null, "Petitioner form")), /*#__PURE__*/React.createElement("p", null, "Use the dropdown in the block settings to select your petiton."));
    }
    return /*#__PURE__*/React.createElement("div", {
      style: {
        pointerEvents: "none"
      }
    }, /*#__PURE__*/React.createElement((_wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_1___default()), {
      block: "petitioner/form",
      attributes: attributes
    }));
  };
  return /*#__PURE__*/React.createElement("div", blockAtts, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
    label: "Selected Petition",
    value: formId,
    options: petitionOptions,
    onChange: function onChange(el) {
      return setAttributes({
        formId: el
      });
    }
  }))), /*#__PURE__*/React.createElement(FinalCompontnt, null));
}

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "@wordpress/server-side-render":
/*!******************************************!*\
  !*** external ["wp","serverSideRender"] ***!
  \******************************************/
/***/ ((module) => {

module.exports = window["wp"]["serverSideRender"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!*************************************!*\
  !*** ./src/gutenberg/form/index.js ***!
  \*************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Edit_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Edit.jsx */ "./src/gutenberg/form/Edit.jsx");
// import Edit from './Edit';
// // import Save from './Save';
// const { registerBlockType } = wp.blocks;
// const { __ } = wp.i18n;
// // import './style.scss'; // Frontend styles
// // import './editor.scss'; // Editor styles

// registerBlockType('petitioner/form', {
//   title: __('Petitioner Form', 'petitioner'),
//   category: 'widgets',
//   edit: Edit,
//   save: () => null
// });




// import Save from './Save';
// import './style.scss'; // Include styles if you have them

// Register the block
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)('petitioner/form', {
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Petitioner Form', 'petitioner'),
  icon: 'forms',
  category: 'widgets',
  edit: _Edit_jsx__WEBPACK_IMPORTED_MODULE_2__["default"],
  // React component for the editor view
  save: function save() {
    return null;
  } // React component for the frontend view
});
/******/ })()
;
//# sourceMappingURL=petitionerFormBlock.js.map