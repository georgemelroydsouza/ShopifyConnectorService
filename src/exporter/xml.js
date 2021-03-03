'use strict';

const fs = require('fs');
const { promisify } = require('util');

class xml {
    
    static data;
    static xmlFilePath;
    static writeFileAsync;
    
    constructor(data, xmlFilePath) {
        this.data = data;
        this.xmlFilePath = xmlFilePath;
        this.writeFileAsync = promisify(fs.writeFile);
    }
    
    /**
     * @invoiceNumber ~ (string) order id or invoice number
     * 
     * @return ~ promise
     */
    async download(invoiceNumber) {
        return new Promise((resolve, reject) => {
            let xmlFile = this.xmlFilePath + invoiceNumber + ".xml";
        
            this.writeFileAsync(xmlFile, this.data)
                .then((result) => {
                    resolve(xmlFile);
                })
                .catch((err) => {
                    reject(false);
                })
        });
    }
    
}

module.exports = xml;