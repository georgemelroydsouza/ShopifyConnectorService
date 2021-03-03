'use strict';

const _ = require('lodash');

/**
 * @params ~ (object) default values
 * @invoiceData ~ (array) invoice data
 */
const fetch = (params, invoiceData) => {
    
    let notes = params.purchaseNotes;
    let discountReason = params.purchaseDiscountReason;
    
    if (_.isEmpty(invoiceData.discount_codes) == false)
    {
        for (const key in invoiceData.discount_codes) {
            if (Object.hasOwnProperty.call(invoiceData.discount_codes, key)) {
                notes = notes + "\nVoucher Code: " + invoiceData.discount_codes[key].code;
            }
        }
         
        discountReason = "Voucher";
    }
    
    return {
        'notes': notes,
        'discountReason': discountReason
    };
}

exports.fetch = fetch;