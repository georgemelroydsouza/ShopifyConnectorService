/**
 * Formatter class to format the data fetched from Shopify and convert it into required OrderWise JSON format
 */
'use strict';

const _ = require('lodash');
const shippingdays = require('./shopifytojson/shippingdays');
const discounts = require('./shopifytojson/discounts');
const lineitems = require('./shopifytojson/lineitems');
const shippingcost = require('./shopifytojson/shippingcost');
const netcost = require('./shopifytojson/netcost');

const common_functions = require('../helpers/common_functions');

class shopifytojson {
    
    static processedData = {};
    static invoiceData;
    
    static customerData;
    static billingData;
    static shippingData;
    
    /**
     * @invoiceData ~ (object) invoice data returned
     * @params ~ (object) params to be used when processing order
     */
    constructor(invoiceData, params) {
        
        this.invoiceData = invoiceData;
        this.params = params;
        
    }
    
    /**
     * main function to execute the conversion of object into required JSON format
     * 
     * @return ~ (object) JSON format
     */
    execute() {
        
        const shippingDate = shippingdays.calculate(new Date());
        const { notes, discountReason} = discounts.fetch(this.params, this.invoiceData);
        const shippingCostValue = shippingcost.fetch(this.invoiceData);
        const netCostValue = netcost.fetch(this.invoiceData);
        
        const invoicePrimaryFieldName = 'billing_address';
        const invoiceCustomerName = _.trim(this.extractField(invoicePrimaryFieldName, 'first_name') + ' ' + this.extractField(invoicePrimaryFieldName, 'last_name'));
        const shippingPrimaryFieldName = 'shipping_address';
        const shippingCustomerName = _.trim(this.extractField(shippingPrimaryFieldName, 'first_name') + ' ' + this.extractField(shippingPrimaryFieldName, 'last_name'));
        const customerEmail = _.trim(this.extractField('customer', 'email'));

        // ******************* DO YOUR MANIPULATION OF CODE HERE
        
        // ******************* DO YOUR MANIPULATION OF CODE HERE
        
        return({});
        
    }
    
   
    /**
     * @primaryAttribute ~ (string) Primary Attribute to search under
     * @fieldToExtract ~ (string) column to fetch from under the primary attribute
     * @return ~ (string) value of the attribute
     */
    extractField(primaryAttribute, fieldToExtract) {

        if (_.has(this.invoiceData, primaryAttribute)) {
            return (_.has(this.invoiceData[primaryAttribute], fieldToExtract)) ? _.trim(this.invoiceData[primaryAttribute][fieldToExtract]) : '';
        }
        
        return '';
    }
    
}

module.exports = shopifytojson;