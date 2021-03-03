/**
 * Service to download the new orders
 */
'use strict';

const Config = require('config');

const  { log } = require('../core/logger');
const shopifyConnector = require('../core/shopify');
const shopifyToJSON = require('../formatter/shopifytojson');
const xml = require('../exporter/xml');
const ordersApi = require('../api/orders');

async function download() {
    
    log("Connecting to Shopify...");
    const shopifyConnection = new shopifyConnector(Config.shopifyConnection);
    await shopifyConnection.connect();
    
    log("Processing new orders...");
    // connecting to the api
    await (new ordersApi(shopifyConnection, shopifyToJSON, xml, Config.shopifyOrders))
        .download(Config.orderWiseInfo);
        
    log("Processing new orders completed...");
}

module.exports.download = download;