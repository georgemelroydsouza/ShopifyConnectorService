'use strict';

const _ = require('lodash');

/**
 * @invoiceData ~ (array) invoice data
 * 
 * @float ~ net price
 */
const fetch = (invoiceData) => {
    
    let netPrice = 0;
    if (_.has(invoiceData, 'total_price_set') && _.has(invoiceData.total_price_set, 'shop_money')) {
        
        netPrice += (_.has(invoiceData.total_price_set.shop_money, 'amount')) ? 
            parseFloat(invoiceData.total_price_set.shop_money.amount) : 
            0;
        
    }
    
    return netPrice.toFixed(2);
}

exports.fetch = fetch;