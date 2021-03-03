'use strict';

const _ = require('lodash');

/**
 * @invoiceData ~ (array) invoice data
 * 
 * @float ~ shipping price
 */
const fetch = (invoiceData) => {
    
    let shippingPrice = 0;
    if (_.has(invoiceData, 'total_shipping_price_set') && _.has(invoiceData.total_shipping_price_set, 'shop_money')) {
        
            shippingPrice += (_.has(invoiceData.total_shipping_price_set.shop_money, 'amount')) ? 
            parseFloat(invoiceData.total_shipping_price_set.shop_money.amount) : 
            0;
        
    }
    
    return shippingPrice.toFixed(2);
}

exports.fetch = fetch;