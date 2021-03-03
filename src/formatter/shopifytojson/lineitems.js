'use strict';

const _ = require('lodash');
const taxlineitem = require('../shopifytojson/taxlineitem');

/**
 * @invoiceData ~ (array) invoice data to parse
 * @skipSKU ~ (string) items that have tag in the skipSKU must be ignored
 * 
 * @return ~ array
 */
const fetch = (invoiceData, skipSKU) => {

    let lineItems = [];
    const invoiceLineItem = invoiceData.line_items;
    const indexToGiveDiscount = getHighestPricedItemIndex(invoiceData, skipSKU);
    const discountFlatRate = getDiscountPrice(invoiceData);
    
    for (const loop in invoiceLineItem) {
        if (Object.hasOwnProperty.call(invoiceLineItem, loop)) {
            const itemData = invoiceLineItem[loop];
            
            let itemPrice = itemData.price;
            itemPrice -= ((loop == indexToGiveDiscount) && discountFlatRate > 0) ? discountFlatRate : 0;
            
            const netPrice = taxlineitem.calculate(parseFloat(itemPrice), itemData.tax_lines);
            
            let sku = itemData.sku;
            if (sku.indexOf('|') > -1)
            {
                const skuSplitter = sku.split('|');
                sku = skuSplitter[0];
            }
            
            if (skipEntryWithInvalidSKU(sku, skipSKU) == false) {
                lineItems.push({
                    "Code": sku,
                    "Quantity": itemData.quantity,
                    "ItemGross": parseFloat(itemPrice),
                    "ItemNet": netPrice,
                    "RSP": netPrice,
                    "TaxCode": (itemData.taxable == true) ? "T1" : "T0",
                });
                   
            }
            
        }
    }
    
    return lineItems;
}

/**
 * @invoiceData ~ (array) item values
 * 
 * @return ~ float discount value
 */
const getDiscountPrice = (invoiceData) => {
    let discountPrice = 0;
    
    if (_.has(invoiceData, 'total_discounts_set') && _.has(invoiceData.total_discounts_set, 'shop_money')) {
        
        discountPrice += (_.has(invoiceData.total_discounts_set.shop_money, 'amount')) ? 
            parseFloat(invoiceData.total_discounts_set.shop_money.amount) : 
            0;
        
    }
    
    return discountPrice;
}

/**
 * @sku ~ (string) skip products cotaining this SKU
 * @params ~ (array) default params
 * 
 * @return ~ (boolean)
 */
const skipEntryWithInvalidSKU = (sku, skipSKU) => {
    
    return (_.isEmpty(sku) || sku == skipSKU);
    
}

/**
 * @invoiceData ~ (array) invoice data to parse
 * @skipSKU ~ (string) items that have tag in the skipSKU must be ignored
 * 
 * @return ~ int
 */
const getHighestPricedItemIndex = (invoiceData, skipSKU) => {

    const invoiceLineItem = invoiceData.line_items;
    let highestPriceIndex = 0;
    let priceToCompare = 0;    
    for (const loop in invoiceLineItem) {
        if (Object.hasOwnProperty.call(invoiceLineItem, loop)) {
            const itemData = invoiceLineItem[loop];
            if (skipEntryWithInvalidSKU(itemData, skipSKU) == false) {
                
                if (highestPriceIndex == 0) {
                    priceToCompare = itemData.price;
                }
                if (parseFloat(priceToCompare) <= parseFloat(itemData.price))
                {
                    priceToCompare = itemData.price;
                    highestPriceIndex = loop;
                }
            }
        }
    } 
    
    return highestPriceIndex;
}

exports.fetch = fetch;