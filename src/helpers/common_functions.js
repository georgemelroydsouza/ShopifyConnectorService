/**
 * List of the common functions
 */

'use strict';
const _ = require('lodash');

module.exports = {
    
    /**
     * @hoursToSubtract ~ (int) Hours to subtract from the current date
     * 
     * @return ~ date
     */
    fetchCurrDateDifferenceInHours: (hoursToSubtract) => {
        
        let dt = new Date();
        dt.setHours(dt.getHours() - hoursToSubtract);
        
        return dt;
    },
    
    /**
     * @obj ~ (object)
     * 
     * @return ~ string
     */
    convertObjectToString: (obj) => {
        
        let stringArray = [];
        
        _.mapValues(obj, (value) => {
            stringArray.push(value);
        }, {});
        
        return stringArray.join(', ');
    },
    
    /**
     * @value ~ any
     */
    isEmptyValue: (value) => {
        return value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0);
    },
    
    /**
     * @nAmount ~ (float) amount to calculate inclusive
     * @nVatRate ~ (float) tax percentage
     * 
     * @return ~ float
     */
    calculateVatInclusive: (nAmount, nVatRate) => {
        
        return nAmount / (1 + (1 / nVatRate));
        
    },
 
    /**
     * @nId ~ (string) internal id of the shopify order
     * @nOrderNumber ~ (string) display order number
     * 
     * @return ~ string
     */
    shopifyToOrderWiseId: (nId, nOrderNumber) => {
        
        return nOrderNumber + '_' + nId;
        
    },
    
    /**
     * @nOrderWiseId ~ (string) order wise id to fetch the shopify record
     * 
     * @return ~ (array)
     */
    orderWisetoShopifyId: (nOrderWiseId) => {
        
        const orderIdArray = nOrderWiseId.split('_');
        
        return {
            'id': orderIdArray[1],
            'order_number': orderIdArray[0]
        }
    }
    
}