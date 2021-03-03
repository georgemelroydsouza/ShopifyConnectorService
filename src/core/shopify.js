/**
 * Core class to connect to shopify and fetch details
 */
'use strict';

const ShopifyApi = require('shopify-api-node');
const commonFunctions = require('../helpers/common_functions');

class shopify {
    
    static connectionParams;
    static defaultFetchHours = 24;
    
    static shopifyConnectionObject;
    
    /**
     * @connectionParams ~ (object) Params used for connection (defined in config)
     */
    constructor(connectionParams) {
        
        this.connectionParams = connectionParams
        
    }
    
    /**
     * connect to the shopify api resource via the shopify api
     * 
     * @return ~ connection object
     */
    async connect() {
        
        this.shopifyConnectionObject = new ShopifyApi(this.connectionParams);
        
    }
    
    /**
     * @status ~ (Open/Close) status of the orders you want to fetch
     * @startDate ~ (Date) date from when the orders must be fetched
     * @limit ~ (int) Limit the number per connection (default 100)
     * 
     * @return ~ array of orders
     */
    async fetchOrders(status, startDate, limit) {
        
        if (typeof limit === 'undefined') limit = 150;
        if (typeof status === 'undefined') status = 'open';
        if (typeof startDate === 'undefined') {
            startDate = commonFunctions.fetchCurrDateDifferenceInHours(this.defaultFetchHours);
        }
        
        let orderList = [];
        let params = {
            "limit": limit,
            "status": status,
            "created_at_min": startDate,
        };
        do {
            const orders = await this.shopifyConnectionObject.order.list(params);
            
            for (const key in orders) {
                if (Object.hasOwnProperty.call(orders, key)) {
                    orderList.push(orders[key]);
                }
            }
            
            params = orders.nextPageParameters;
            
        } while (params !== undefined);
        
        return orderList;
    }
    
    /**
     * @id ~ (int) id of the order
     * 
     * @return ~ order details of the selected id
     */
    async read(id) {
        
        const order = await this.shopifyConnectionObject.order.get(id);
        
        return order;
    }
  
    /**
     * @id ~ (int) id of the order
     * 
     * @return ~ order details of the selected id
     */
    async createFulfillment(id, params) {
        
        const order = await this.shopifyConnectionObject.fulfillment.create(id, params);
        
        return order;
    }
    
    /**
     * @orderData ~ (array|object) array of the order data
     * @params ~ (array) params required to fulfill the order
     * @notes ~ (string) data
     * @tagData ~ (string) tag information to be sent
     * 
     * @return ~ boolean
     */
    async fulfillOrder(orderData, params, notes, tagData) {
        
        // first create the fulfillment record for the order
        await this.createFulfillment(orderData.id, params);
                
        // update the tags
        await this.updateTags(orderData, tagData);
        
        // update the notes
        await this.updateNotes(orderData, notes);
        
        return true;
    }
    
    /**
     * @id ~ (int) id of the order
     * 
     * @return ~ order details of the selected id
     */
    async fetchFulfillmentList(id, params) {
        
        const order = await this.shopifyConnectionObject.fulfillment.list(id);
        
        return order;
    }
    
    /**
     * @return ~ array
     */
    async fetchProducts(params) {
        
        const products = await this.shopifyConnectionObject.product.list(params);
        
        return products;
    }
    
    /**
     * @orderData ~ (array|object) order data that is required to be modified
     * @tagNameToInclude ~ (string) tag name to include
     * 
     * @return ~ (string) tag string that has been modified
     */
    async updateTags(orderData, tagNameToInclude) {
        const { tags } = await this.shopifyConnectionObject.order.update(orderData.id, {
                    "id": orderData.id,
                    "tags": this.modifyTags(orderData.tags, tagNameToInclude)
                });
        return tags;
    }
    
    /**
     * @orderData ~ (array|object) order data that is required to be modified
     * @noteData ~ (string) notes to include
     * 
     * @return ~ (string) tag string that has been modified
     */
    async updateNotes(orderData, noteData) {
        const { notes } = await this.shopifyConnectionObject.order.update(orderData.id, {
                    "id": orderData.id,
                    "note": noteData
                });
        return notes;
    }
    
    /**
     * @currentTagData ~ (string) tags that are required to be modified (comma separated)
     * @tagNameToInclude ~ (string) tag that requires to be added
     * 
     * @return ~ (string) tag string comma separated 
     */
    modifyTags(currentTagData, tagNameToInclude) {
        
        let tags = currentTagData.split(',');
        tags.push(tagNameToInclude);
        
        return tags.join(',');
    }
    
}


module.exports = shopify;
