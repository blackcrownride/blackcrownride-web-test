# Black Crown Rides - Luxury Chauffeur Service Website

A static website for Black Crown Rides, a premium black car chauffeur service in Texas.

## Features

- **Responsive Design**: Separate desktop and mobile experiences
- **Email-Based Booking**: All booking requests are sent via email
- **Dynamic Pricing**: Configurable rates and featured routes
- **Add-ons**: Child seats, luggage tracking, and gratuity options
- **Promo Codes**: Support for discount codes

## Configuration

All site settings can be easily updated in `config.js`:

### Contact Information
```javascript
contactEmail: 'info@blackcrownride.com',
phoneNumber: '+1 (817) 760-8555',
```

### Pricing
```javascript
hourlyRate: 59,
childSeatPrice: 10,
serviceMileRates: {
  'Cadillac Escalade ESV': 4,
}
```

### Featured Routes
```javascript
featuredRoutes: [
  { label: 'Service City to DAL or JSX Airport', price: 125 },
  { label: 'DAL to Fort Worth', price: 165 },
  { label: 'Dallas to Austin', price: 699 },
  { label: 'Houston to Austin', price: 749 }
]
```

### Promo Codes
```javascript
promoCodes: {
  '10OFF': { type: 'percent', amount: 10, label: '10% off' }
}
```

## File Structure

```
Black Crown Rides/
├── index.html          # Desktop version
├── mobile.html         # Mobile version
├── config.js           # Site configuration (UPDATE THIS!)
├── script.js           # Main JavaScript functionality
├── styles.css          # Desktop styles
├── mobile.css          # Mobile styles
├── assets/             # Images and media
│   ├── cadillac-escalade-esv.png
│   └── black-suv.png
└── README.md           # This file
```

## How It Works

1. **Route Detection**: The site automatically detects mobile devices and redirects to `mobile.html`
2. **Booking Form**: Users fill out the booking form with pickup/dropoff locations, dates, and preferences
3. **Email Generation**: When submitted, the form generates a pre-filled email with all booking details
4. **Email Client**: Opens the user's default email client with the booking request ready to send

## Updating the Email Address

To change the contact email address:

1. Open `config.js`
2. Update the `contactEmail` value:
   ```javascript
   contactEmail: 'your-new-email@domain.com',
   ```
3. Save the file - changes will apply across the entire site

## Deployment

This is a static website that can be hosted on:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service
- Traditional web hosting

Simply upload all files to your hosting provider.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design for all screen sizes

## License

© 2026 Black Crown Rides. All rights reserved.
