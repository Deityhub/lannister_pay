/**
 * Parses the specification to a usable format for various calculations within the application
 * @param {string} spec The specification to be parsed to setup fee configuration spec
 * @returns json representing FCS to be used in the application
 */
function configureFCS(spec) {
  const config = {};
  const specCombo = spec.split("\n");

  specCombo.forEach((eachSpec) => {
    let feeId = eachSpec.slice(0, 8);
    let remaining = eachSpec.slice(9).split(" : ");
    config[remaining[0]] = { feeId, feeSpec: remaining[1] };
  });

  return config;
}

module.exports = configureFCS;
