/**
 * Script to list all the products on the shop
 */
'use strict';

const Config = require('config');
const  { log } = require('./core/logger');

const shopifyConnector = require('./core/shopify');


(async () => {
    try{
        const shopifyConnection = new shopifyConnector(Config.shopifyConnection);
        await shopifyConnection.connect();
        const products = await shopifyConnection.fetchProducts({ published_status: 'any' });
        console.log(products);        
    }catch (err) {
        console.log(err);
    }
})();



