const isNotEmptyString = (str) => typeof str === "string" && str.length !== 0;

const outputLinesToJson = (line) => {
  try {
    return JSON.parse(line);
  } catch (err) {
    console.log("Error while parsing line from rawData: %s", err.message);
    return {};
  }
};

const removeWhitespace = (str) => str.trim();

const outputLineWithLocalProxyAddress = (data) =>
  data.local_proxy_address !== undefined;

const focusOnValuesAndNotAppNode = (data) => Object.values(data);

function extractLinkFromAppData(rawData) {
  const lineWithLink = rawData
    .split("\n")
    .map(removeWhitespace)
    .filter(isNotEmptyString)
    .map(outputLinesToJson)
    .flatMap(focusOnValuesAndNotAppNode)
    .find(outputLineWithLocalProxyAddress);

  return lineWithLink ? lineWithLink.local_proxy_address : "";
}

module.exports = {
  extractLinkFromAppData,
};
