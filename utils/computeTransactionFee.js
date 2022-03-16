/**
 * calculates the fee applicable to a specific transaction
 * @param {object} payload object containing the transaction details
 * @param {object} spec object containing the transaction specification
 * @returns object that shows the applicable fees and amount to be paid
 */
function computeTransactionFee(payload, spec) {
  const feeCurrency = payload.Currency;

  // since we are only considering NGN currency
  // we can return early if the currency is different
  // comment this code if we start considering other currencies
  if (feeCurrency !== "NGN") return null;

  const feeLocale =
    payload.CurrencyCountry === payload.PaymentEntity.Country ? "LOCL" : "INTL";
  const feeEntity = payload.PaymentEntity.Type;

  const specKeys = [];
  const entityKeys = ["ID", "Number", "SixID", "Issuer", "Brand"];

  // key is in decreasing order of precedence
  let precendenceObj = {
    1: [`${feeCurrency} ${feeLocale} ${feeEntity}(*)`],
    2: [],
    3: [`${feeCurrency} ${feeLocale} *(*)`],
    4: [],
    5: [`${feeCurrency} * ${feeEntity}(*)`],
    6: [],
    7: [`${feeCurrency} * *(*)`],
  };

  entityKeys.forEach((key) => {
    let specKey = `${feeCurrency} ${feeLocale} ${feeEntity}(${payload.PaymentEntity[key]})`;
    specKeys.push(specKey);

    precendenceObj[6].push(`${feeCurrency} * *(${payload.PaymentEntity[key]})`);
    precendenceObj[4].push(
      `${feeCurrency} * ${feeEntity}(${payload.PaymentEntity[key]})`
    );
    precendenceObj[2].push(
      `${feeCurrency} ${feeLocale} *(${payload.PaymentEntity[key]})`
    );
  });

  specKeys.push(...Object.values(precendenceObj).flat());

  let transactionSpec = null;
  for (let i = 0; i < specKeys.length; i++) {
    if (specKeys[i] in spec) {
      transactionSpec = spec[specKeys[i]];
      break;
    }
  }

  if (!transactionSpec) return null;

  // result to be returned
  const transactionObj = {
    AppliedFeeID: transactionSpec.feeId,
    ChargeAmount: payload.Amount,
  };

  // handle calculations and return value
  const feeSpecItems = transactionSpec.feeSpec.split(" ");
  const feeType = feeSpecItems[1];
  const feeValue =
    feeType === "FLAT_PERC" ? feeSpecItems[2] : Number(feeSpecItems[2]);

  if (feeType === "FLAT") {
    transactionObj.AppliedFeeValue = feeValue;
  }
  if (feeType === "PERC") {
    transactionObj.AppliedFeeValue = Math.round(
      (feeValue / 100) * payload.Amount
    );
  }
  if (feeType === "FLAT_PERC") {
    const flatPerc = feeValue.split(":");
    const flat = Number(flatPerc[0]);
    const perc = Number(flatPerc[1]);
    transactionObj.AppliedFeeValue = Math.round(
      flat + (perc / 100) * payload.Amount
    );
  }

  // add fee value if customer is bearing the fee
  if (payload.Customer.BearsFee) {
    transactionObj.ChargeAmount =
      payload.Amount + transactionObj.AppliedFeeValue;
  }

  transactionObj.SettlementAmount =
    transactionObj.ChargeAmount - transactionObj.AppliedFeeValue;

  return transactionObj;
}

module.exports = computeTransactionFee;
