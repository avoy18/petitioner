;
(function () {
  System.register([], function (exports, module) {
    'use strict';

    return {
      execute: function () {
        exports("s", safelyParseJSON);
        function safelyParseJSON(jsonString) {
          try {
            return JSON.parse(jsonString);
          } catch (error) {
            console.error("Error parsing JSON:", error);
            return {};
          }
        }
      }
    };
  });
})();
