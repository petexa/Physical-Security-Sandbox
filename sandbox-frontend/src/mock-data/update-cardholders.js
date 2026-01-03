const fs = require('fs');
const cardholders = require('./cardholders.json');

// Add created and modified timestamps to each cardholder
const updated = cardholders.map(ch => {
  // Use hire_date as created, or generate a date
  const hireDate = new Date(ch.hire_date);
  const created = hireDate.toISOString();
  
  // Modified is sometime after created
  const modifiedDate = new Date(hireDate);
  modifiedDate.setMonth(modifiedDate.getMonth() + Math.floor(Math.random() * 12));
  const modified = modifiedDate.toISOString();
  
  return {
    ...ch,
    created,
    modified
  };
});

fs.writeFileSync('./cardholders.json', JSON.stringify(updated, null, 2));
console.log('Updated cardholders.json with created and modified timestamps');
