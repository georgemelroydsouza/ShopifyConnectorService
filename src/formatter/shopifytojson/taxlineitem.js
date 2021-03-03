'use strict';

const commonFunctions = require('../../helpers/common_functions');

/**
 * @price ~ price of the item
 * @taxLineArray ~ tax included in the line items 
 * 
 * @return ~ float
 */
const calculate = (price, taxLineArray) => {

    let netPrice = 0;
    let totalVatRate = 0;
    
    if (price > 0) {
        netPrice = price;
        for (const loop in taxLineArray) {
            if (Object.hasOwnProperty.call(taxLineArray, loop)) {
                totalVatRate += taxLineArray[loop].rate;
            }
        }
        netPrice -= commonFunctions.calculateVatInclusive(price, totalVatRate);
    }
    
    return parseFloat(netPrice.toFixed(2));

}

exports.calculate = calculate;