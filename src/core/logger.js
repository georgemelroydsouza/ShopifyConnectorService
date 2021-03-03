'use strict';

const util = require('util');

const log = (text) => {
    console.log(new Date().toUTCString() + " - " + text);
}

const logJSON = (text) => {
    console.log(new Date().toUTCString() + " - " + JSON.stringify(text));
}

exports.log = log;
exports.logJSON = logJSON;