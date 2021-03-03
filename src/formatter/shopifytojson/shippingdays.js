'use strict';

const calculate = (dateToAddShipping) => {
    
	let now = dateToAddShipping;
	let addDays = 1;
	
	// when its after 12 we have 2 days to ship (i.e. end of )
	if (now.getHours() > 12)
		addDays = 2;
	
	// promised time is 6pm either 1 or 2 days from now
	var shipBy = new Date(now.getFullYear(), now.getMonth(), now.getDate() + addDays, 18,0,0,0);
	
	// if this is sunday move to monday
	if (shipBy.getDay() == 0)
		shipBy.setDate(shipBy.getDate() + 1);
	
	// if this is saturday move to monday
	if (shipBy.getDay() == 6)
		shipBy.setDate(shipBy.getDate() + 2);
    
    return shipBy.toISOString();
}

exports.calculate = calculate;