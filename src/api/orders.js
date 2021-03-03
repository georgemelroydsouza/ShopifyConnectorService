/**
 * Script to fetch all the orders from connection source (used currently for SHOPIFY)
 */
'use strict';

const _ = require('lodash');
const { log, logJSON } = require('../core/logger');
const js2xmlparser = require("js2xmlparser");

const commonFunctions = require('../helpers/common_functions');

class orders {
    
    static connectionService;
    static formatterClass
    static exporterClass;
    static filterParams;
    
    /**
     * @connectionService ~ (object) Dependency to the connection service from where the data will be fetched.
     * @formatterClass ~ (class) formatting class passed as dependency injection
     * @exporterClass ~ (class) exporter class passed as dependency injection
     * @filterParams ~ (object) Params relating to filtering the list to download the orders
     */
    constructor(connectionService, formatterClass, exporterClass, filterParams) {
        
        this.connectionService = connectionService;
        this.formatterClass = formatterClass;
        this.exporterClass = exporterClass;
        this.filterParams = filterParams;
    }
    
    /**
     * function to process the downloading of the orders from connection source
     * @params ~ (object) params required when processing the JSON file
     * 
     * @return ~ (boolean)
     */
    async download(params) {
        try{
            
            const orders = await this.connectionService.fetchOrders(this.filterParams.params.orderStatus,
                commonFunctions.fetchCurrDateDifferenceInHours(this.filterParams.params.orderFromHours),
                this.filterParams.params.orderLimit);
                
            log("Fetched " + orders.length + " order(s) ");
            for (const loop in orders) {
                
                // validate the order item to check if its already downloaded 
                if (this.ignoreOrderItem(orders, loop, this.filterParams.ignoreTag) == false)
                {
                       
                    log ("# " + commonFunctions.shopifyToOrderWiseId(orders[loop].id, orders[loop].order_number) + " processing...");
                    
                    //logJSON(orders[loop]);
                    log("");
                    log ("############# Formating into JSON");                    
                    log("");
                    
                    // format the structure into json
                    let orderItemJSON = (new this.formatterClass(orders[loop], params)).execute();
                    logJSON(orderItemJSON);
                    
                    // check if the order requires to be fulfilled that means either one line item "requires_shipping" is true
                    // this identifies this order as either recurring payment 
                    if (this.orderRequiresShipping(orders[loop]) == true) {
                        
                        // normal website purchase
                        this.submitWebsaleOrder(orders[loop], orderItemJSON);
                        
                    } 
                    else 
                    {
                        // recurring payments
                        this.submitRecurringOrder(orders[loop], orderItemJSON);
                    }
                    
                } else {
                    
                    log ("# " + commonFunctions.shopifyToOrderWiseId(orders[loop].id, orders[loop].order_number) + " order already downloaded");
                    
                }
            }
            
            
        }catch(err) {
            console.log(err);
            logJSON(err);
            log('Error connecting to Connect Source "' + err.name + '"');
            
        }
        
    }
    
    /**
     * @orderData ~ (array) order item
     * @orderDataJSON ~ (object) order item in json format for recording
     * 
     * @return ~ boolean
     */
    async submitRecurringOrder(orderData, orderDataJSON) {
        // export to xml
        const xmlData = js2xmlparser.parse("XMLFile", orderDataJSON);
        let fileResponse = await (new this.exporterClass(xmlData, this.filterParams.xmlFilePath)).download(orderData.id);
        if (fileResponse != false) {
            
            log("Written to file " + fileResponse);
            
            // update the service that the order was downloaded
            let updatedData = await this.connectionService.updateTags(orderData, this.filterParams.ignoreTag);
            
            logJSON("Updated the record back to ~ " + updatedData);
            
            //fulfill the order
            await this.connectionService.createFulfillment(orderData.id, this.filterParams.recurringfulfillmentPost);
            
            log("Order has been fulfilled since this order is a recurring monthly payment");
        }
    }
    
    /**
     * @orderData ~ (array) order item
     * @orderDataJSON ~ (object) order item in json format for recording
     * 
     * @return ~ boolean
     */
    async submitWebsaleOrder(orderData, orderDataJSON, exporterObject) {


        // export to xml
        const xmlData = js2xmlparser.parse("XMLFile", orderDataJSON);
        let fileResponse = await (new this.exporterClass(xmlData, this.filterParams.xmlFilePath)).download(orderData.id);
        if (fileResponse != false) {
            
            log("Written to file " + fileResponse);
            
            // update the service that the order was downloaded
            let updatedData = await this.connectionService.updateTags(orderData, this.filterParams.ignoreTag);
            
            logJSON("Updated the record back to ~ " + updatedData);
        }
        
        return true;
    }
    
    /**
     * @orderData ~ (array) order item
     * 
     * @return ~ boolean
     */
    orderRequiresShipping(orderData) {
       
        const invoiceLineItem = orderData.line_items;
        
        for (const loop in invoiceLineItem) {
            if (Object.hasOwnProperty.call(invoiceLineItem, loop)) {
                if (invoiceLineItem[loop].requires_shipping == true) {
                    return true;
                }
            }
        }
        
        return false;
        
    }
    
    /**
     * @orders ~ (array) list of orders returned
     * @index ~ (int) index of the item to process within the list
     * @ignoreTag ~ (string) tag name that we should check against every item
     */
    ignoreOrderItem(orders, index, ignoreTag) {
        let ignoreTagData = false;
        if (Object.hasOwnProperty.call(orders, index)) {
            const orderItem = orders[index];
            let tagsArray = orderItem.tags.split(',');
            
            _.mapValues(tagsArray, (data) => {
                if (data.trim() == ignoreTag) {
                    ignoreTagData = true;
                }
            });
        }
        return ignoreTagData;
    }
}

module.exports = orders;