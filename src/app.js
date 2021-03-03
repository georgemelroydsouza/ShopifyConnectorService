/**
 * Script to start the scheduler service 
 */
'use strict';

const Schedule = require('node-schedule');

const  { log } = require('./core/logger');

const { download } = require('./service/download');

log('*** STARTING SCHEDULER *** ');


Schedule.scheduleJob('*/5 * * * *', function(){
    
    (async () => {
   
        log('*** JOB STARTED *** ');
        
        await download();
        
        log('*** JOB ENDED *** ');
        
    })();
}); 