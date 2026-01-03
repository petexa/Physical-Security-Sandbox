// Script to generate realistic mock data
const fs = require('fs');
const path = require('path');

// Helper functions
function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateDate(yearsBack) {
  const end = new Date();
  const start = new Date();
  start.setFullYear(start.getFullYear() - yearsBack);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    .toISOString().split('T')[0];
}

// Data pools
const firstNames = [
  'Sarah', 'James', 'Maria', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Patricia', 'Robert',
  'Lisa', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Karen', 'Christopher',
  'Nancy', 'Daniel', 'Betty', 'Matthew', 'Margaret', 'Anthony', 'Sandra', 'Mark', 'Ashley', 'Donald',
  'Emily', 'Steven', 'Kimberly', 'Paul', 'Donna', 'Andrew', 'Michelle', 'Joshua', 'Carol', 'Kenneth',
  'Amanda', 'Kevin', 'Melissa', 'Brian', 'Deborah', 'George', 'Stephanie', 'Timothy', 'Rebecca', 'Ronald',
  'Sharon', 'Edward', 'Laura', 'Jason', 'Cynthia', 'Jeffrey', 'Kathleen', 'Ryan', 'Amy', 'Jacob',
  'Angela', 'Gary', 'Shirley', 'Nicholas', 'Anna', 'Eric', 'Brenda', 'Jonathan', 'Pamela', 'Stephen',
  'Nicole', 'Larry', 'Emma', 'Justin', 'Samantha', 'Scott', 'Katherine', 'Brandon', 'Christine', 'Benjamin',
  'Debra', 'Samuel', 'Rachel', 'Raymond', 'Carolyn', 'Patrick', 'Janet', 'Alexander', 'Catherine', 'Jack',
  'Maria', 'Dennis', 'Heather', 'Jerry', 'Diane', 'Tyler', 'Ruth', 'Aaron', 'Julie', 'Jose'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
  'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes',
  'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper',
  'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson',
  'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes',
  'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez'
];

const domains = ['acmecorp.com', 'globalindustries.com', 'techcorp.com'];

const departments = [
  'Engineering', 'Engineering', 'Engineering',
  'HR', 'Finance', 'Operations', 'Operations',
  'Security', 'Executive', 'IT', 'Marketing',
  'Sales', 'Facilities', 'Legal', 'Research'
];

const jobTitles = {
  'Engineering': ['Senior Engineer', 'Engineer', 'Junior Engineer', 'Engineering Manager', 'Lead Engineer', 'Principal Engineer'],
  'HR': ['HR Manager', 'HR Specialist', 'Recruiter', 'HR Director'],
  'Finance': ['Financial Analyst', 'Accountant', 'Finance Manager', 'CFO', 'Controller'],
  'Operations': ['Operations Manager', 'Operations Analyst', 'Operations Director', 'Logistics Coordinator'],
  'Security': ['Security Manager', 'Security Officer', 'Security Director', 'Security Analyst'],
  'Executive': ['CEO', 'CTO', 'COO', 'VP Engineering', 'VP Sales', 'VP Operations'],
  'IT': ['IT Manager', 'System Administrator', 'Network Engineer', 'IT Support Specialist', 'DevOps Engineer'],
  'Marketing': ['Marketing Manager', 'Marketing Specialist', 'Content Manager', 'Marketing Director'],
  'Sales': ['Sales Representative', 'Sales Manager', 'Account Executive', 'Sales Director'],
  'Facilities': ['Facilities Manager', 'Maintenance Technician', 'Building Manager'],
  'Legal': ['Legal Counsel', 'Paralegal', 'General Counsel'],
  'Research': ['Research Scientist', 'Research Manager', 'Lab Technician']
};

const accessGroupsByDept = {
  'Engineering': ['AG-ALL-STAFF', 'AG-ENGINEERING', 'AG-MAIN-BUILDING'],
  'HR': ['AG-ALL-STAFF', 'AG-MAIN-BUILDING', 'AG-HR'],
  'Finance': ['AG-ALL-STAFF', 'AG-MAIN-BUILDING', 'AG-FINANCE'],
  'Operations': ['AG-ALL-STAFF', 'AG-MAIN-BUILDING', 'AG-OPERATIONS'],
  'Security': ['AG-ALL-STAFF', 'AG-SECURITY', 'AG-MAIN-BUILDING', 'AG-SERVER-ROOM'],
  'Executive': ['AG-ALL-STAFF', 'AG-EXECUTIVE', 'AG-MAIN-BUILDING', 'AG-SERVER-ROOM'],
  'IT': ['AG-ALL-STAFF', 'AG-IT', 'AG-MAIN-BUILDING', 'AG-SERVER-ROOM'],
  'Marketing': ['AG-ALL-STAFF', 'AG-MAIN-BUILDING'],
  'Sales': ['AG-ALL-STAFF', 'AG-MAIN-BUILDING'],
  'Facilities': ['AG-ALL-STAFF', 'AG-FACILITIES', 'AG-MAIN-BUILDING'],
  'Legal': ['AG-ALL-STAFF', 'AG-MAIN-BUILDING'],
  'Research': ['AG-ALL-STAFF', 'AG-RESEARCH', 'AG-MAIN-BUILDING', 'AG-LAB']
};

// Generate cardholders
function generateCardholders(count = 87) {
  const cardholders = [];
  const usedEmails = new Set();
  
  for (let i = 1; i <= count; i++) {
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    const domain = getRandomElement(domains);
    let email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
    
    // Ensure unique emails
    let counter = 1;
    while (usedEmails.has(email)) {
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${counter}@${domain}`;
      counter++;
    }
    usedEmails.add(email);
    
    const department = getRandomElement(departments);
    const jobTitle = getRandomElement(jobTitles[department]);
    const status = Math.random() < 0.9 ? 'active' : 'inactive';
    
    cardholders.push({
      id: `CH-${String(i).padStart(3, '0')}`,
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      department: department,
      job_title: jobTitle,
      hire_date: generateDate(5),
      status: status,
      card_number: String(1000000000 + i * 11111).slice(0, 10),
      access_groups: accessGroupsByDept[department],
      photo_url: null
    });
  }
  
  return cardholders;
}

// Generate access groups
function generateAccessGroups() {
  return [
    {
      id: 'AG-ALL-STAFF',
      name: 'All Staff',
      description: 'Standard building access for all employees',
      member_count: 87,
      doors: ['DOOR-001', 'DOOR-002', 'DOOR-005', 'DOOR-010'],
      schedule: '24/7'
    },
    {
      id: 'AG-MAIN-BUILDING',
      name: 'Main Building',
      description: 'Access to main building during business hours',
      member_count: 87,
      doors: ['DOOR-001', 'DOOR-002', 'DOOR-003', 'DOOR-004', 'DOOR-005'],
      schedule: 'Mon-Fri 6am-8pm'
    },
    {
      id: 'AG-ENGINEERING',
      name: 'Engineering',
      description: 'Engineering department areas',
      member_count: 25,
      doors: ['DOOR-006', 'DOOR-007', 'DOOR-015'],
      schedule: '24/7'
    },
    {
      id: 'AG-EXECUTIVE',
      name: 'Executive',
      description: 'Executive suite access',
      member_count: 8,
      doors: ['DOOR-008', 'DOOR-009'],
      schedule: '24/7'
    },
    {
      id: 'AG-SERVER-ROOM',
      name: 'Server Room',
      description: 'Data center and server room access',
      member_count: 12,
      doors: ['DOOR-020', 'DOOR-021'],
      schedule: '24/7'
    },
    {
      id: 'AG-SECURITY',
      name: 'Security',
      description: 'Security office and monitoring areas',
      member_count: 6,
      doors: ['DOOR-011', 'DOOR-012', 'DOOR-020'],
      schedule: '24/7'
    },
    {
      id: 'AG-HR',
      name: 'HR Department',
      description: 'Human Resources areas',
      member_count: 8,
      doors: ['DOOR-013'],
      schedule: 'Mon-Fri 7am-6pm'
    },
    {
      id: 'AG-FINANCE',
      name: 'Finance',
      description: 'Finance department secure areas',
      member_count: 10,
      doors: ['DOOR-014'],
      schedule: 'Mon-Fri 7am-7pm'
    },
    {
      id: 'AG-IT',
      name: 'IT Department',
      description: 'IT department and technical areas',
      member_count: 15,
      doors: ['DOOR-015', 'DOOR-020', 'DOOR-021'],
      schedule: '24/7'
    },
    {
      id: 'AG-OPERATIONS',
      name: 'Operations',
      description: 'Operations and warehouse access',
      member_count: 18,
      doors: ['DOOR-016', 'DOOR-017', 'DOOR-018'],
      schedule: 'Mon-Sat 5am-11pm'
    },
    {
      id: 'AG-FACILITIES',
      name: 'Facilities',
      description: 'Building maintenance and facilities',
      member_count: 8,
      doors: ['DOOR-019', 'DOOR-022', 'DOOR-023'],
      schedule: '24/7'
    },
    {
      id: 'AG-RESEARCH',
      name: 'Research',
      description: 'Research and development areas',
      member_count: 12,
      doors: ['DOOR-024', 'DOOR-025'],
      schedule: '24/7'
    },
    {
      id: 'AG-LAB',
      name: 'Laboratory',
      description: 'Laboratory and testing facilities',
      member_count: 10,
      doors: ['DOOR-024', 'DOOR-025', 'DOOR-026'],
      schedule: 'Mon-Fri 6am-10pm'
    }
  ];
}

// Generate doors
function generateDoors() {
  const doorTypes = [
    { name: 'Main Entrance', location: 'Building A - Ground Floor', security: 'low' },
    { name: 'South Entrance', location: 'Building A - Ground Floor', security: 'low' },
    { name: 'North Entrance', location: 'Building A - Ground Floor', security: 'low' },
    { name: 'East Entrance', location: 'Building A - Ground Floor', security: 'low' },
    { name: 'Reception Area', location: 'Building A - Ground Floor', security: 'low' },
    { name: 'Engineering Wing Door 1', location: 'Building A - 2nd Floor', security: 'medium' },
    { name: 'Engineering Wing Door 2', location: 'Building A - 2nd Floor', security: 'medium' },
    { name: 'Executive Suite', location: 'Building A - 5th Floor', security: 'high' },
    { name: 'Executive Conference Room', location: 'Building A - 5th Floor', security: 'high' },
    { name: 'Cafeteria', location: 'Building A - Ground Floor', security: 'low' },
    { name: 'Security Office', location: 'Building A - Ground Floor', security: 'high' },
    { name: 'Security Monitoring Room', location: 'Building A - Ground Floor', security: 'high' },
    { name: 'HR Department', location: 'Building A - 3rd Floor', security: 'medium' },
    { name: 'Finance Department', location: 'Building A - 4th Floor', security: 'high' },
    { name: 'IT Department', location: 'Building B - 1st Floor', security: 'medium' },
    { name: 'Operations Office', location: 'Building C - Ground Floor', security: 'medium' },
    { name: 'Warehouse Entrance', location: 'Building C - Ground Floor', security: 'medium' },
    { name: 'Loading Dock', location: 'Building C - Ground Floor', security: 'medium' },
    { name: 'Maintenance Room', location: 'Building A - Basement', security: 'medium' },
    { name: 'Server Room Main', location: 'Building B - Basement', security: 'critical' },
    { name: 'Server Room Backup', location: 'Building B - Basement', security: 'critical' },
    { name: 'Electrical Room', location: 'Building A - Basement', security: 'high' },
    { name: 'HVAC Room', location: 'Building A - Roof', security: 'medium' },
    { name: 'Research Lab 1', location: 'Building B - 2nd Floor', security: 'high' },
    { name: 'Research Lab 2', location: 'Building B - 2nd Floor', security: 'high' },
    { name: 'Testing Lab', location: 'Building B - 2nd Floor', security: 'high' },
    { name: 'Emergency Exit A', location: 'Building A - All Floors', security: 'low' },
    { name: 'Emergency Exit B', location: 'Building B - All Floors', security: 'low' },
    { name: 'Parking Garage Entrance', location: 'Parking Structure', security: 'low' },
    { name: 'Parking Garage Elevator', location: 'Parking Structure', security: 'low' },
    { name: 'Conference Room A', location: 'Building A - 3rd Floor', security: 'medium' },
    { name: 'Conference Room B', location: 'Building A - 4th Floor', security: 'medium' },
    { name: 'Training Room', location: 'Building A - 2nd Floor', security: 'low' },
    { name: 'Break Room A', location: 'Building A - 2nd Floor', security: 'low' },
    { name: 'Break Room B', location: 'Building B - 1st Floor', security: 'low' }
  ];
  
  const doors = [];
  const statusOptions = ['online', 'online', 'online', 'online', 'online', 'online', 'online', 'online', 'offline', 'fault'];
  
  for (let i = 0; i < doorTypes.length; i++) {
    const doorType = doorTypes[i];
    const controllerId = `CTRL-${String(Math.floor(i / 7) + 1).padStart(3, '0')}`;
    const status = getRandomElement(statusOptions);
    
    doors.push({
      id: `DOOR-${String(i + 1).padStart(3, '0')}`,
      name: doorType.name,
      location: doorType.location,
      controller_id: controllerId,
      reader_id: `RDR-${String(i + 1).padStart(3, '0')}`,
      status: status,
      access_groups: ['AG-ALL-STAFF'],
      schedule: '24/7',
      last_event: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      event_count_24h: Math.floor(Math.random() * 300)
    });
  }
  
  return doors;
}

// Generate controllers
function generateControllers() {
  const controllers = [];
  const buildings = ['A', 'B', 'C'];
  const statusOptions = ['online', 'online', 'online', 'online', 'online', 'online', 'online', 'online', 'online', 'offline'];
  
  for (let i = 1; i <= 5; i++) {
    const building = buildings[Math.floor((i - 1) / 2) % buildings.length];
    const status = getRandomElement(statusOptions);
    const doorsPerController = 7;
    const startDoor = (i - 1) * doorsPerController + 1;
    const connectedDoors = [];
    
    for (let j = 0; j < doorsPerController; j++) {
      if (startDoor + j <= 35) {
        connectedDoors.push(`DOOR-${String(startDoor + j).padStart(3, '0')}`);
      }
    }
    
    controllers.push({
      id: `CTRL-${String(i).padStart(3, '0')}`,
      name: `Building ${building} Controller ${i}`,
      location: `Building ${building} - Comms Room`,
      ip_address: `192.168.${i}.100`,
      status: status,
      firmware_version: `8.${Math.floor(Math.random() * 40 + 20)}.${Math.floor(Math.random() * 9999)}`,
      last_communication: new Date(Date.now() - Math.random() * 600000).toISOString(),
      connected_doors: connectedDoors
    });
  }
  
  return controllers;
}

// Generate inputs
function generateInputs() {
  const inputs = [];
  const inputTypes = ['door_contact', 'rex_button', 'motion_sensor', 'tamper_switch'];
  const stateOptions = ['normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'alarm', 'fault'];
  
  for (let i = 1; i <= 50; i++) {
    const doorNum = Math.min(i, 35);
    const type = getRandomElement(inputTypes);
    const doorId = `DOOR-${String(doorNum).padStart(3, '0')}`;
    const controllerId = `CTRL-${String(Math.floor((doorNum - 1) / 7) + 1).padStart(3, '0')}`;
    
    let name = '';
    if (type === 'door_contact') name = `Door ${doorNum} Contact`;
    else if (type === 'rex_button') name = `Door ${doorNum} REX Button`;
    else if (type === 'motion_sensor') name = `Door ${doorNum} Motion Sensor`;
    else name = `Door ${doorNum} Tamper Switch`;
    
    inputs.push({
      id: `INPUT-${String(i).padStart(3, '0')}`,
      name: name,
      type: type,
      location: `Associated with Door ${doorNum}`,
      door_id: doorId,
      controller_id: controllerId,
      state: getRandomElement(stateOptions)
    });
  }
  
  return inputs;
}

// Generate outputs
function generateOutputs() {
  const outputs = [];
  const outputTypes = ['door_strike', 'relay', 'alarm_output', 'led_indicator'];
  const stateOptions = ['inactive', 'inactive', 'inactive', 'inactive', 'inactive', 'inactive', 'inactive', 'inactive', 'active'];
  
  for (let i = 1; i <= 50; i++) {
    const doorNum = Math.min(i, 35);
    const type = getRandomElement(outputTypes);
    const doorId = `DOOR-${String(doorNum).padStart(3, '0')}`;
    const controllerId = `CTRL-${String(Math.floor((doorNum - 1) / 7) + 1).padStart(3, '0')}`;
    
    let name = '';
    if (type === 'door_strike') name = `Door ${doorNum} Strike`;
    else if (type === 'relay') name = `Door ${doorNum} Relay`;
    else if (type === 'alarm_output') name = `Door ${doorNum} Alarm`;
    else name = `Door ${doorNum} LED`;
    
    outputs.push({
      id: `OUTPUT-${String(i).padStart(3, '0')}`,
      name: name,
      type: type,
      location: `Associated with Door ${doorNum}`,
      door_id: doorId,
      controller_id: controllerId,
      state: getRandomElement(stateOptions)
    });
  }
  
  return outputs;
}

// Generate cameras
function generateCameras() {
  const cameras = [];
  const manufacturers = ['Axis', 'Hikvision', 'Hanwha', 'Bosch'];
  const models = {
    'Axis': ['P3245-LVE', 'P3265-LVE', 'M3065-V', 'Q6155-E'],
    'Hikvision': ['DS-2CD2385G1', 'DS-2CD2143G2', 'DS-2DE4425IW'],
    'Hanwha': ['QNO-8080R', 'PNM-9080VQ', 'XNO-8080R'],
    'Bosch': ['FLEXIDOME IP 3000i', 'AUTODOME IP 5000i']
  };
  const resolutions = ['1920x1080', '2560x1440', '3840x2160'];
  const statusOptions = ['online', 'online', 'online', 'online', 'online', 'online', 'online', 'online', 'offline'];
  
  const locations = [
    { name: 'Main Entrance - Exterior', door: 'DOOR-001' },
    { name: 'Main Entrance - Interior', door: 'DOOR-001' },
    { name: 'South Entrance', door: 'DOOR-002' },
    { name: 'North Entrance', door: 'DOOR-003' },
    { name: 'Reception Area', door: 'DOOR-005' },
    { name: 'Executive Suite Hallway', door: 'DOOR-008' },
    { name: 'Server Room Entrance', door: 'DOOR-020' },
    { name: 'Warehouse Overview', door: 'DOOR-017' },
    { name: 'Loading Dock', door: 'DOOR-018' },
    { name: 'Parking Garage Level 1', door: 'DOOR-029' },
    { name: 'Parking Garage Level 2', door: 'DOOR-029' },
    { name: 'Security Office', door: 'DOOR-011' },
    { name: 'Cafeteria', door: 'DOOR-010' },
    { name: 'Building A Perimeter - North', door: null },
    { name: 'Building A Perimeter - South', door: null },
    { name: 'Building B Perimeter - East', door: null }
  ];
  
  for (let i = 0; i < locations.length; i++) {
    const manufacturer = getRandomElement(manufacturers);
    const model = getRandomElement(models[manufacturer]);
    const location = locations[i];
    
    cameras.push({
      id: `CAM-${String(i + 1).padStart(3, '0')}`,
      name: location.name,
      location: location.name,
      ip_address: `192.168.2.${100 + i}`,
      status: getRandomElement(statusOptions),
      manufacturer: manufacturer,
      model: model,
      resolution: getRandomElement(resolutions),
      recording: Math.random() > 0.1,
      linked_doors: location.door ? [location.door] : []
    });
  }
  
  return cameras;
}

// Main execution
const cardholders = generateCardholders(87);
const accessGroups = generateAccessGroups();
const doors = generateDoors();
const controllers = generateControllers();
const inputs = generateInputs();
const outputs = generateOutputs();
const cameras = generateCameras();

// Write files
fs.writeFileSync(path.join(__dirname, 'cardholders.json'), JSON.stringify(cardholders, null, 2));
fs.writeFileSync(path.join(__dirname, 'access-groups.json'), JSON.stringify(accessGroups, null, 2));
fs.writeFileSync(path.join(__dirname, 'doors.json'), JSON.stringify(doors, null, 2));
fs.writeFileSync(path.join(__dirname, 'controllers.json'), JSON.stringify(controllers, null, 2));
fs.writeFileSync(path.join(__dirname, 'inputs.json'), JSON.stringify(inputs, null, 2));
fs.writeFileSync(path.join(__dirname, 'outputs.json'), JSON.stringify(outputs, null, 2));
fs.writeFileSync(path.join(__dirname, 'cameras.json'), JSON.stringify(cameras, null, 2));

console.log('Mock data generated successfully!');
console.log(`- ${cardholders.length} cardholders`);
console.log(`- ${accessGroups.length} access groups`);
console.log(`- ${doors.length} doors`);
console.log(`- ${controllers.length} controllers`);
console.log(`- ${inputs.length} inputs`);
console.log(`- ${outputs.length} outputs`);
console.log(`- ${cameras.length} cameras`);
