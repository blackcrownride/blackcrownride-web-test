// Black Crown Rides Configuration
// Update this file to change contact information across the entire website

const SITE_CONFIG = {
  // Contact Information
  contactEmail: 'info@blackcrownride.com',
  phoneNumber: '+1 (817) 760-8555',
  
  // Business Information
  businessName: 'Black Crown Ride',
  tagline: 'Black Car Service',
  serviceArea: 'Grapevine, Southlake, Colleyville, Keller, Trophy Club, Westlake, Flower Mound',
  
  // Pricing (can be updated here)
  hourlyRate: 59,
  childSeatPrice: 10,
  
  // Service Types and Rates (per mile)
  serviceMileRates: {
    'Cadillac Escalade ESV': 4,
  },
  
  // Featured Routes
  featuredRoutes: [
    {
      label: 'Service City to DAL or JSX Airport',
      price: 125,
      description: 'Flat-rate airport transfer from the service city to Dallas Love Field or JSX.',
      features: [
        'Service city pickup',
        'DAL or JSX airport dropoff',
        'Luggage assistance included'
      ]
    },
    {
      label: 'DAL to Fort Worth',
      price: 165,
      description: 'Love Field to Fort Worth city center with professional chauffeur service.',
      features: [
        'Love Field Airport pickup',
        'Fort Worth city dropoff',
        'Meet & greet service'
      ]
    },
    {
      label: 'Dallas to Austin',
      price: 699,
      description: 'Luxury intercity transfer between Dallas and Austin with comfort stops.',
      features: [
        '3-hour premium ride',
        'Comfort stops included',
        'City-to-city service'
      ]
    },
    {
      label: 'DAL or JSX',
      price: 125,
      description: 'Direct airport transfer to Dallas Love Field or JSX.',
      features: [
        'Airport pickup',
        'DAL or JSX dropoff',
        'Luggage assistance included'
      ]
    },
    {
      label: 'Grapevine to DAL or JSX',
      price: 60,
      description: 'Flat-rate service from Grapevine to Dallas Love Field or JSX airports.',
      features: [
        'Grapevine pickup',
        'DAL or JSX airport dropoff',
        'Professional chauffeur'
      ]
    },
    {
      label: 'Grapevine to DFW',
      price: 60,
      description: 'Flat-rate airport transfer from Grapevine to DFW Airport.'
    },
    {
      label: 'Southlake to DFW',
      price: 75,
      description: 'Flat-rate airport transfer from Southlake to DFW Airport.'
    },
    {
      label: 'Colleyville to DFW',
      price: 75,
      description: 'Flat-rate airport transfer from Colleyville to DFW Airport.'
    },
    {
      label: 'Keller to DFW',
      price: 75,
      description: 'Flat-rate airport transfer from Keller to DFW Airport.'
    },
    {
      label: 'Westlake to DFW',
      price: 75,
      description: 'Flat-rate airport transfer from Westlake to DFW Airport.'
    },
    {
      label: 'Trophy Club to DFW',
      price: 75,
      description: 'Flat-rate airport transfer from Trophy Club to DFW Airport.'
    },
    {
      label: 'Flower Mound to DFW',
      price: 75,
      description: 'Flat-rate airport transfer from Flower Mound to DFW Airport.'
    },
    {
      label: 'Coppell to DFW',
      price: 70,
      description: 'Flat-rate airport transfer from Coppell to DFW Airport.'
    },
  ],
  
  // Promo Codes
  promoCodes: {
    '10OFF': { type: 'percent', amount: 10, label: '10% off' }
  }
};

// Make config available globally
if (typeof window !== 'undefined') {
  window.SITE_CONFIG = SITE_CONFIG;
}

// Made with Bob
