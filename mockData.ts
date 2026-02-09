export const mockOrders = [
  {
    orderId: 'ORD-2024-001',
    customer: 'John Smith',
    phone: '07700 900123',
    address: '45 Baker Street, London, W1U 6TE',
    priority: 'High',
    currentStage: 'Site Check',
    status: 'In Progress',
    createdDate: '2024-01-15',
    products: [
      { product: 'Full Fibre 900', category: 'Broadband', quantity: 1 },
      { product: 'ONT Device', category: 'Hardware', quantity: 1 }
    ],
    inventory: { status: 'Available', warehouse: 'London Central', allocationTime: '2 hours' },
    site: { serviceable: true, technology: 'FTTP', distance: '250m' },
    node: { capacity: 'Available', port: 'Port 12' },
    agent: { name: 'Mike Johnson', phone: '07700 900456', region: 'London', vehicle: 'VAN-123' },
    timeline: [
      { time: '10:00', title: 'Order Created', actor: 'System' }
    ]
  },
  {
    orderId: 'ORD-2024-002',
    customer: 'Sarah Williams',
    phone: '07700 900234',
    address: '12 Oxford Road, Manchester, M1 5QA',
    priority: 'Medium',
    currentStage: 'Inventory Check',
    status: 'In Progress',
    createdDate: '2024-01-14',
    products: [
      { product: 'Full Fibre 500', category: 'Broadband', quantity: 1 },
      { product: 'Router', category: 'Hardware', quantity: 1 }
    ],
    inventory: { status: 'Available', warehouse: 'Manchester Hub', allocationTime: '1 hour' },
    site: { serviceable: true, technology: 'FTTP', distance: '180m' },
    node: { capacity: 'Available', port: 'Port 8' },
    agent: { name: 'Tom Davies', phone: '07700 900567', region: 'Manchester', vehicle: 'VAN-456' },
    timeline: [
      { time: '09:00', title: 'Order Created', actor: 'System' },
      { time: '09:10', title: 'Site Check Completed', actor: 'Ops Team' }
    ]
  },
  {
    orderId: 'ORD-2024-003',
    customer: 'David Brown',
    phone: '07700 900345',
    address: '78 High Street, Birmingham, B1 1AA',
    priority: 'Low',
    currentStage: 'Node Capacity Check',
    status: 'In Progress',
    createdDate: '2024-01-13',
    products: [
      { product: 'Full Fibre 150', category: 'Broadband', quantity: 1 }
    ],
    inventory: { status: 'Available', warehouse: 'Birmingham Depot', allocationTime: '24 hours' },
    site: { serviceable: true, technology: 'FTTP', distance: '320m' },
    node: { capacity: 'Available', port: 'Port 15' },
    agent: { name: 'Lisa Chen', phone: '07700 900678', region: 'Birmingham', vehicle: 'VAN-789' },
    timeline: [
      { time: '08:00', title: 'Order Created', actor: 'System' },
      { time: '08:15', title: 'Site Check Completed', actor: 'Ops Team' },
      { time: '08:30', title: 'Inventory Check Completed', actor: 'System' }
    ]
  },
  {
    orderId: 'ORD-2024-004',
    customer: 'Emma Wilson',
    phone: '07700 900456',
    address: '23 Park Lane, Leeds, LS1 2AA',
    priority: 'High',
    currentStage: 'Site Check',
    status: 'In Progress',
    createdDate: '2024-01-15',
    products: [
      { product: 'Full Fibre 900', category: 'Broadband', quantity: 1 }
    ],
    inventory: { status: 'Available', warehouse: 'Leeds Hub', allocationTime: '3 hours' },
    site: { serviceable: true, technology: 'FTTP', distance: '200m' },
    node: { capacity: 'Available', port: 'Port 5' },
    agent: { name: 'James Brown', phone: '07700 900789', region: 'Leeds', vehicle: 'VAN-234' },
    timeline: [
      { time: '11:00', title: 'Order Created', actor: 'System' }
    ]
  },
  {
    orderId: 'ORD-2024-005',
    customer: 'Michael Taylor',
    phone: '07700 900567',
    address: '56 Queen Street, Bristol, BS1 4HP',
    priority: 'Medium',
    currentStage: 'Allocate Local Stock',
    status: 'In Progress',
    createdDate: '2024-01-12',
    products: [
      { product: 'Full Fibre 500', category: 'Broadband', quantity: 1 },
      { product: 'ONT Device', category: 'Hardware', quantity: 1 }
    ],
    inventory: { status: 'Available', warehouse: 'Bristol Depot', allocationTime: '1 hour' },
    site: { serviceable: true, technology: 'FTTP', distance: '150m' },
    node: { capacity: 'Available', port: 'Port 9' },
    agent: { name: 'Sarah Miller', phone: '07700 900890', region: 'Bristol', vehicle: 'VAN-567' },
    timeline: [
      { time: '07:00', title: 'Order Created', actor: 'System' },
      { time: '07:15', title: 'Site Check Completed', actor: 'Ops Team' },
      { time: '07:30', title: 'Inventory Check Completed', actor: 'System' },
      { time: '07:45', title: 'Node Capacity Verified', actor: 'Network Team' }
    ]
  },
  {
    orderId: 'ORD-2024-006',
    customer: 'Olivia Davis',
    phone: '07700 900678',
    address: '89 King Street, Liverpool, L1 8JQ',
    priority: 'High',
    currentStage: 'Field Agent Assigned',
    status: 'In Progress',
    createdDate: '2024-01-11',
    products: [
      { product: 'Full Fibre 900', category: 'Broadband', quantity: 1 }
    ],
    inventory: { status: 'Available', warehouse: 'Liverpool Hub', allocationTime: '2 hours' },
    site: { serviceable: true, technology: 'FTTP', distance: '280m' },
    node: { capacity: 'Available', port: 'Port 11' },
    agent: { name: 'David Wilson', phone: '07700 900901', region: 'Liverpool', vehicle: 'VAN-890' },
    timeline: [
      { time: '06:00', title: 'Order Created', actor: 'System' },
      { time: '06:15', title: 'Site Check Completed', actor: 'Ops Team' },
      { time: '06:30', title: 'Inventory Check Completed', actor: 'System' },
      { time: '06:45', title: 'Node Capacity Verified', actor: 'Network Team' },
      { time: '07:00', title: 'Stock Allocated', actor: 'Warehouse' }
    ]
  },
  {
    orderId: 'ORD-2024-007',
    customer: 'James Anderson',
    phone: '07700 900789',
    address: '34 Church Road, Newcastle, NE1 5DD',
    priority: 'Low',
    currentStage: 'Site Check',
    status: 'In Progress',
    createdDate: '2024-01-15',
    products: [
      { product: 'Full Fibre 150', category: 'Broadband', quantity: 1 }
    ],
    inventory: { status: 'Available', warehouse: 'Newcastle Depot', allocationTime: '4 hours' },
    site: { serviceable: true, technology: 'FTTP', distance: '350m' },
    node: { capacity: 'Available', port: 'Port 14' },
    agent: { name: 'Emma Taylor', phone: '07700 901012', region: 'Newcastle', vehicle: 'VAN-123' },
    timeline: [
      { time: '12:00', title: 'Order Created', actor: 'System' }
    ]
  },
  {
    orderId: 'ORD-2024-008',
    customer: 'Sophia Martinez',
    phone: '07700 900890',
    address: '67 Station Road, Sheffield, S1 2JE',
    priority: 'Medium',
    currentStage: 'Inventory Check',
    status: 'In Progress',
    createdDate: '2024-01-14',
    products: [
      { product: 'Full Fibre 500', category: 'Broadband', quantity: 1 },
      { product: 'Router', category: 'Hardware', quantity: 1 }
    ],
    inventory: { status: 'Available', warehouse: 'Sheffield Hub', allocationTime: '2 hours' },
    site: { serviceable: true, technology: 'FTTP', distance: '220m' },
    node: { capacity: 'Available', port: 'Port 7' },
    agent: { name: 'Oliver Harris', phone: '07700 901123', region: 'Sheffield', vehicle: 'VAN-456' },
    timeline: [
      { time: '09:30', title: 'Order Created', actor: 'System' },
      { time: '09:45', title: 'Site Check Completed', actor: 'Ops Team' }
    ]
  },
  {
    orderId: 'ORD-2024-009',
    customer: 'William Thompson',
    phone: '07700 900901',
    address: '12 Market Street, Nottingham, NG1 6HX',
    priority: 'High',
    currentStage: 'Node Capacity Check',
    status: 'In Progress',
    createdDate: '2024-01-13',
    products: [
      { product: 'Full Fibre 900', category: 'Broadband', quantity: 1 },
      { product: 'ONT Device', category: 'Hardware', quantity: 1 }
    ],
    inventory: { status: 'Available', warehouse: 'Nottingham Depot', allocationTime: '1 hour' },
    site: { serviceable: true, technology: 'FTTP', distance: '190m' },
    node: { capacity: 'Available', port: 'Port 6' },
    agent: { name: 'Sophie Clark', phone: '07700 901234', region: 'Nottingham', vehicle: 'VAN-789' },
    timeline: [
      { time: '08:00', title: 'Order Created', actor: 'System' },
      { time: '08:20', title: 'Site Check Completed', actor: 'Ops Team' },
      { time: '08:40', title: 'Inventory Check Completed', actor: 'System' }
    ]
  },
  {
    orderId: 'ORD-2024-010',
    customer: 'Isabella Garcia',
    phone: '07700 901012',
    address: '45 Bridge Street, Cambridge, CB2 1UF',
    priority: 'Low',
    currentStage: 'Allocate Local Stock',
    status: 'In Progress',
    createdDate: '2024-01-12',
    products: [
      { product: 'Full Fibre 150', category: 'Broadband', quantity: 1 }
    ],
    inventory: { status: 'Available', warehouse: 'Cambridge Hub', allocationTime: '3 hours' },
    site: { serviceable: true, technology: 'FTTP', distance: '240m' },
    node: { capacity: 'Available', port: 'Port 10' },
    agent: { name: 'Jack Robinson', phone: '07700 901345', region: 'Cambridge', vehicle: 'VAN-234' },
    timeline: [
      { time: '07:30', title: 'Order Created', actor: 'System' },
      { time: '07:50', title: 'Site Check Completed', actor: 'Ops Team' },
      { time: '08:10', title: 'Inventory Check Completed', actor: 'System' },
      { time: '08:30', title: 'Node Capacity Verified', actor: 'Network Team' }
    ]
  },
  {
    orderId: 'ORD-2024-011',
    customer: 'Liam White',
    phone: '07700 901123',
    address: '78 Mill Lane, Oxford, OX1 1HZ',
    priority: 'Medium',
    currentStage: 'Site Check',
    status: 'In Progress',
    createdDate: '2024-01-15',
    products: [
      { product: 'Full Fibre 500', category: 'Broadband', quantity: 1 }
    ],
    inventory: { status: 'Available', warehouse: 'Oxford Depot', allocationTime: '2 hours' },
    site: { serviceable: true, technology: 'FTTP', distance: '210m' },
    node: { capacity: 'Available', port: 'Port 13' },
    agent: { name: 'Emily Walker', phone: '07700 901456', region: 'Oxford', vehicle: 'VAN-567' },
    timeline: [
      { time: '10:30', title: 'Order Created', actor: 'System' }
    ]
  },
  {
    orderId: 'ORD-2024-012',
    customer: 'Charlotte Lee',
    phone: '07700 901234',
    address: '90 Castle Street, Edinburgh, EH1 2NE',
    priority: 'High',
    currentStage: 'Field Agent Assigned',
    status: 'In Progress',
    createdDate: '2024-01-11',
    products: [
      { product: 'Full Fibre 900', category: 'Broadband', quantity: 1 },
      { product: 'Router', category: 'Hardware', quantity: 1 }
    ],
    inventory: { status: 'Available', warehouse: 'Edinburgh Hub', allocationTime: '1 hour' },
    site: { serviceable: true, technology: 'FTTP', distance: '170m' },
    node: { capacity: 'Available', port: 'Port 4' },
    agent: { name: 'George Hall', phone: '07700 901567', region: 'Edinburgh', vehicle: 'VAN-890' },
    timeline: [
      { time: '06:30', title: 'Order Created', actor: 'System' },
      { time: '06:50', title: 'Site Check Completed', actor: 'Ops Team' },
      { time: '07:10', title: 'Inventory Check Completed', actor: 'System' },
      { time: '07:30', title: 'Node Capacity Verified', actor: 'Network Team' },
      { time: '07:50', title: 'Stock Allocated', actor: 'Warehouse' }
    ]
  },
  {
    orderId: 'ORD-2024-013',
    customer: 'Benjamin Young',
    phone: '07700 901345',
    address: '23 Victoria Road, Cardiff, CF10 3NP',
    priority: 'Low',
    currentStage: 'Inventory Check',
    status: 'In Progress',
    createdDate: '2024-01-14',
    products: [
      { product: 'Full Fibre 150', category: 'Broadband', quantity: 1 }
    ],
    inventory: { status: 'Available', warehouse: 'Cardiff Depot', allocationTime: '4 hours' },
    site: { serviceable: true, technology: 'FTTP', distance: '300m' },
    node: { capacity: 'Available', port: 'Port 16' },
    agent: { name: 'Amelia King', phone: '07700 901678', region: 'Cardiff', vehicle: 'VAN-123' },
    timeline: [
      { time: '09:00', title: 'Order Created', actor: 'System' },
      { time: '09:20', title: 'Site Check Completed', actor: 'Ops Team' }
    ]
  },
  {
    orderId: 'ORD-2024-014',
    customer: 'Mia Scott',
    phone: '07700 901456',
    address: '56 George Street, Glasgow, G1 1QE',
    priority: 'Medium',
    currentStage: 'Node Capacity Check',
    status: 'In Progress',
    createdDate: '2024-01-13',
    products: [
      { product: 'Full Fibre 500', category: 'Broadband', quantity: 1 },
      { product: 'ONT Device', category: 'Hardware', quantity: 1 }
    ],
    inventory: { status: 'Available', warehouse: 'Glasgow Hub', allocationTime: '2 hours' },
    site: { serviceable: true, technology: 'FTTP', distance: '230m' },
    node: { capacity: 'Available', port: 'Port 8' },
    agent: { name: 'Henry Wright', phone: '07700 901789', region: 'Glasgow', vehicle: 'VAN-456' },
    timeline: [
      { time: '08:15', title: 'Order Created', actor: 'System' },
      { time: '08:35', title: 'Site Check Completed', actor: 'Ops Team' },
      { time: '08:55', title: 'Inventory Check Completed', actor: 'System' }
    ]
  },
  {
    orderId: 'ORD-2024-015',
    customer: 'Lucas Green',
    phone: '07700 901567',
    address: '12 Princes Street, Bath, BA1 1HL',
    priority: 'High',
    currentStage: 'Allocate Local Stock',
    status: 'In Progress',
    createdDate: '2024-01-12',
    products: [
      { product: 'Full Fibre 900', category: 'Broadband', quantity: 1 }
    ],
    inventory: { status: 'Available', warehouse: 'Bath Depot', allocationTime: '1 hour' },
    site: { serviceable: true, technology: 'FTTP', distance: '160m' },
    node: { capacity: 'Available', port: 'Port 3' },
    agent: { name: 'Ella Adams', phone: '07700 901890', region: 'Bath', vehicle: 'VAN-789' },
    timeline: [
      { time: '07:00', title: 'Order Created', actor: 'System' },
      { time: '07:20', title: 'Site Check Completed', actor: 'Ops Team' },
      { time: '07:40', title: 'Inventory Check Completed', actor: 'System' },
      { time: '08:00', title: 'Node Capacity Verified', actor: 'Network Team' }
    ]
  }
];

export const orderSteps = [
  'Site Check',
  'Inventory Check',
  'Node Capacity Check',
  'Allocate Local Stock',
  'Field Agent Assigned',
  'Work Completed by Agent',
  'Payment Verification',
  'Service Enabled'
];

export const getActionForStage = (stage: string, userRole?: string) => {
  if (stage === 'Work Completed by Agent' && userRole === 'FIELD_AGENT') {
    return 'Waiting for OPS';
  }
  if (stage === 'Payment Verification' && userRole === 'FIELD_AGENT') {
    return 'Waiting for OPS';
  }
  
  const actions: Record<string, string> = {
    'Site Check': 'Run Site Check',
    'Inventory Check': 'Run Inventory Check',
    'Node Capacity Check': 'Verify Capacity',
    'Allocate Local Stock': 'Allocate Stock',
    'Field Agent Assigned': 'Assign Agent',
    'Work Completed by Agent': 'Mark Work Complete',
    'Payment Verification': 'Confirm Payment Received',
    'Service Enabled': 'Complete'
  };
  return actions[stage] || 'Next Step';
};

export const getActionTitle = (stage: string) => {
  const titles: Record<string, string> = {
    'Site Check': 'Site Check Completed',
    'Inventory Check': 'Inventory Check Completed',
    'Node Capacity Check': 'Node Capacity Verified',
    'Allocate Local Stock': 'Stock Allocated',
    'Field Agent Assigned': 'Agent Assigned',
    'Work Completed by Agent': 'Work Completed by Agent',
    'Payment Verification': 'Payment Verified',
    'Service Enabled': 'Service Enabled'
  };
  return titles[stage] || 'Step Completed';
};

export const canUserProgressStage = (stage: string, userRole?: string): boolean => {
  if (userRole === 'FIELD_AGENT') {
    return stage === 'Field Agent Assigned';
  }
  if (userRole === 'ORIT_OPS') {
    return stage !== 'Field Agent Assigned' && stage !== 'Work Completed by Agent';
  }
  return true;
};
