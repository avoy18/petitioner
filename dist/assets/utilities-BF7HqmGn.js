function safelyParseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return {};
  }
}
export {
  safelyParseJSON as s
};
