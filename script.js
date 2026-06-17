document.documentElement.dataset.theme = 'light';
document.documentElement.style.colorScheme = 'light';

// Load configuration from config.js if available, otherwise use defaults
const CONTACT_EMAIL = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.contactEmail) || 'info@blackcrownride.com';
const HOURLY_RATE = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.hourlyRate) || 79;
const ESTIMATE_SPEED_MPH = 28;
const ESTIMATE_MINUTES_BUFFER = 18;
const ESTIMATE_MINUTES_PER_STOP = 8;
const CHILD_SEAT_PRICE = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.childSeatPrice) || 10;
const PROMO_CODES = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.promoCodes) || {
  '10OFF': { type: 'percent', amount: 10, label: '10% off' }
};

const pricingState = {
  hourlyRate: HOURLY_RATE,
  serviceMileRates: (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.serviceMileRates) || {
    'Cadillac Escalade ESV': 4,
    'Chevy Suburban': 4
  },
  featuredRoutes: (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.featuredRoutes) || [
    { label: 'DFW to Downtown Dallas', price: 125 },
    { label: 'DAL to Fort Worth', price: 165 },
    { label: 'Dallas to Austin', price: 699 }
  ]
};

const formatCurrency = (value) =>
  Number.isFinite(value) ? `$${value.toFixed(2)}` : '$0.00';

const getForm = () =>
  document.querySelector('.booking-form');

const getNumber = (input, fallback = 0) => {
  const value = Number.parseFloat(input?.value || '');
  return Number.isFinite(value) ? value : fallback;
};

const getSelectedServiceType = (form = getForm()) =>
  form?.querySelector('[name="serviceType"]')?.value.trim() || 'Cadillac Escalade ESV';

const serviceMileRate = (serviceType) => {
  const configured = Number(pricingState.serviceMileRates[serviceType]);
  return Number.isFinite(configured) && configured > 0 ? configured : 4;
};

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}
document.documentElement.classList.add('js-ready');

const renderFeaturedRoutes = () => {
  const desktopList = document.getElementById('featured-route-list');
  const mobileList = document.getElementById('mobile-route-list');
  
  const desktopMarkup = pricingState.featuredRoutes
    .map(
      (route) => {
        const emailSubject = encodeURIComponent(`${route.label} - Chauffeured Service`);
        const emailBody = encodeURIComponent(
          `Hello,\n\nI would like to book the ${route.label} route.\n\nEstimated price: $${route.price}\n\nDate/time:\nPickup location:\nContact number:\n\nThanks!`
        );
        
        const featuresHTML = route.features
          ? `<ul>${route.features.map(f => `<li>${f}</li>`).join('')}</ul>`
          : '';
        
        return `
        <article class="pricing-card route-card">
          <h3>${route.label}</h3>
          <p>${route.description || ''}</p>
          <span class="price">$${route.price}</span>
          ${featuresHTML}
          <a
            class="secondary-btn"
            href="mailto:${CONTACT_EMAIL}?subject=${emailSubject}&body=${emailBody}"
          >
            Request Route
          </a>
        </article>
      `;
      }
    )
    .join('');

  const mobileMarkup = pricingState.featuredRoutes
    .map(
      (route) => {
        const emailSubject = encodeURIComponent(`${route.label} - Chauffeured Service`);
        const emailBody = encodeURIComponent(
          `Hello,\n\nI would like to book the ${route.label} route.\n\nEstimated price: $${route.price}\n\nDate/time:\nPickup location:\nContact number:\n\nThanks!`
        );
        
        const featuresHTML = route.features
          ? `<ul>${route.features.map(f => `<li>${f}</li>`).join('')}</ul>`
          : '';
        
        return `
        <div class="card">
          <h3>${route.label}</h3>
          <p>${route.description || ''}</p>
          <span class="price">$${route.price}</span>
          ${featuresHTML}
          <a
            class="secondary-btn"
            href="mailto:${CONTACT_EMAIL}?subject=${emailSubject}&body=${emailBody}"
          >
            Request Route
          </a>
        </div>
      `;
      }
    )
    .join('');

  if (desktopList) desktopList.innerHTML = desktopMarkup;
  if (mobileList) mobileList.innerHTML = mobileMarkup;
};

const setHourlyPrices = () => {
  document.querySelectorAll('[data-price-hourly]').forEach((item) => {
    item.textContent = `$${pricingState.hourlyRate} / hour`;
  });
};

const setVehiclePrices = (form = getForm(), estimate = null) => {
  document.querySelectorAll('[data-vehicle-price]').forEach((item) => {
    const serviceType = item.dataset.vehiclePrice || '';
    if (estimate?.miles) {
      item.textContent = `$${serviceMileRate(serviceType)}/mi`;
    } else {
      item.textContent = 'Select route';
    }
  });
};

const syncServiceType = (form = getForm()) => {
  if (!form) return;
  const serviceField = form.querySelector('[name="serviceType"]');
  const cards = form.querySelectorAll('[data-service-type]');
  const selected = getSelectedServiceType(form);

  cards.forEach((card) => {
    const active = card.dataset.serviceType === selected;
    card.classList.toggle('active', active);
    card.setAttribute('aria-pressed', active ? 'true' : 'false');
  });

  if (serviceField) serviceField.value = selected;
};

const getStopsCount = (form = getForm()) =>
  form ? form.querySelectorAll('[data-route-point="stop"]').length : 0;

const getAddOnsTotal = (form = getForm()) => {
  if (!form) return 0;
  const forwardSeats = getNumber(form.querySelector('[name="forwardFacingSeats"]'));
  const boosterSeats = getNumber(form.querySelector('[name="boosterSeats"]'));
  return (forwardSeats + boosterSeats) * CHILD_SEAT_PRICE;
};

const getPromoDiscount = (baseTotal, form = getForm()) => {
  const code = form?.querySelector('[name="promoCode"]')?.value.trim().toUpperCase() || '';
  const promo = PROMO_CODES[code];
  if (!promo || !Number.isFinite(baseTotal) || baseTotal <= 0) return 0;
  if (promo.type === 'percent') return Math.round(baseTotal * promo.amount) / 100;
  return 0;
};

const estimateFromForm = (form = getForm()) => {
  if (!form) return null;
  const pickup = form.querySelector('[name="pickupLocation"]')?.value.trim();
  const dropoff = form.querySelector('[name="dropoffLocation"]')?.value.trim();
  if (!pickup || !dropoff) return null;

  const stopCount = getStopsCount(form);
  const minimumMinutes = ESTIMATE_MINUTES_BUFFER + stopCount * ESTIMATE_MINUTES_PER_STOP;
  const estimatedMiles = Math.max(12, 18 + stopCount * 8);
  const estimatedHours = Math.max(1, Math.ceil(((estimatedMiles / ESTIMATE_SPEED_MPH) * 60 + minimumMinutes) / 30) / 2);
  const serviceType = getSelectedServiceType(form);
  const baseTotal = Math.round((estimatedHours * pricingState.hourlyRate + estimatedMiles * serviceMileRate(serviceType)) * 100) / 100;
  const addOnsTotal = getAddOnsTotal(form);
  const discount = getPromoDiscount(baseTotal, form);
  const gratuity = getGratuityTotal(Math.max(0, baseTotal - discount), form);
  const total = Math.max(0, baseTotal - discount) + addOnsTotal + gratuity;

  return {
    hours: estimatedHours,
    miles: estimatedMiles,
    baseTotal,
    addOnsTotal,
    discount,
    gratuity,
    total
  };
};

const getGratuityTotal = (baseTotal, form = getForm()) => {
  const selected = form?.querySelector('[name="gratuityPercent"]:checked')?.value || '0';
  const percent = selected === 'custom'
    ? getNumber(form.querySelector('[name="customGratuityPercent"]'))
    : Number.parseFloat(selected);
  return Number.isFinite(percent) && percent > 0
    ? Math.round(baseTotal * percent) / 100
    : 0;
};

const updateEstimate = (form = getForm()) => {
  if (!form) return;
  const estimate = estimateFromForm(form);
  const hoursEl = document.getElementById('estimated-hours');
  const originalEl = document.getElementById('original-total');
  const totalEl = document.getElementById('estimated-total');
  const addOnsEl = form.querySelector('[data-addons-total]');

  if (addOnsEl) addOnsEl.textContent = `$${getAddOnsTotal(form)}`;

  if (!estimate) {
    if (hoursEl) hoursEl.textContent = 'Select locations';
    if (originalEl) originalEl.textContent = '$0.00';
    if (totalEl) totalEl.textContent = '$0.00';
    setVehiclePrices(form, null);
    return;
  }

  if (hoursEl) hoursEl.textContent = `${estimate.hours.toFixed(1)} hrs approx.`;
  if (originalEl) originalEl.textContent = formatCurrency(estimate.baseTotal + estimate.addOnsTotal + estimate.gratuity);
  if (totalEl) totalEl.textContent = formatCurrency(estimate.total);
  setVehiclePrices(form, estimate);
};

const applyPromo = (form = getForm()) => {
  const status = document.getElementById('promo-status');
  const code = form?.querySelector('[name="promoCode"]')?.value.trim().toUpperCase() || '';
  if (!status) return;
  if (!code) {
    status.textContent = 'Promo code will apply to your trip estimate.';
  } else if (PROMO_CODES[code]) {
    status.textContent = `${PROMO_CODES[code].label} applied to the estimate.`;
  } else {
    status.textContent = 'Promo code is not active on this temporary form.';
  }
  updateEstimate(form);
};

const enforceLuggageCounts = (form = getForm()) => {
  if (!form) return;
  const travelers = form.querySelector('[name="travelers"]');
  const carryOn = form.querySelector('[name="carryOnBags"]');
  const checked = form.querySelector('[name="checkedBags"]');
  const oversized = form.querySelector('[name="oversizedBags"]');
  const note = form.querySelector('[data-luggage-note]');

  if (travelers) {
    travelers.max = '6';
    travelers.value = Math.min(6, Math.max(1, getNumber(travelers, 1)));
  }
  if (carryOn) carryOn.value = Math.min(6, Math.max(0, getNumber(carryOn)));
  if (checked) checked.value = Math.min(4, Math.max(0, getNumber(checked)));
  if (oversized) oversized.value = Math.min(4, Math.max(0, getNumber(oversized)));
  if (note) note.textContent = 'SUV luggage max: 6 carry-on, or 4 checked + 2 carry-on.';
};

const toggleConditionalFields = (form = getForm()) => {
  if (!form) return;
  const showLuggage = form.querySelector('[name="hasPassengerLuggage"]:checked')?.value === 'yes';
  const luggageCounters = form.querySelector('[data-passenger-luggage-counters]');
  if (luggageCounters) luggageCounters.hidden = !showLuggage;

  const showSeats = form.querySelector('[name="hasChildSeats"]:checked')?.value === 'yes';
  const seatCounters = form.querySelector('[data-child-seat-counters]');
  if (seatCounters) seatCounters.hidden = !showSeats;
  if (!showSeats) {
    form.querySelectorAll('[data-seat-counter]').forEach((input) => {
      input.value = '0';
    });
    form.querySelector('[name="forwardFacingSeats"]').value = '0';
    form.querySelector('[name="boosterSeats"]').value = '0';
  }

  enforceLuggageCounts(form);
  updateEstimate(form);
};

const syncSeatInputs = (form = getForm()) => {
  if (!form) return;
  const forward = form.querySelector('[data-seat-counter="forward"]');
  const booster = form.querySelector('[data-seat-counter="booster"]');
  form.querySelector('[name="forwardFacingSeats"]').value = String(Math.max(0, Math.min(2, getNumber(forward))));
  form.querySelector('[name="boosterSeats"]').value = String(Math.max(0, Math.min(2, getNumber(booster))));
  updateEstimate(form);
};

const addStop = (form = getForm()) => {
  if (!form) return;
  const target = form.querySelector('#roundtrip-stops') || form.querySelector('.roundtrip-stops');
  if (!target) return;
  const index = target.querySelectorAll('[data-route-point="stop"]').length + 1;
  const label = document.createElement('label');
  label.className = 'autocomplete-field';
  label.innerHTML = `
    Stop ${index}
    <input type="text" name="stop${index}" placeholder="Enter stop address" data-route-point="stop" />
  `;
  target.appendChild(label);
  updateEstimate(form);
};

const collectFormLines = (form) => {
  const data = new FormData(form);
  const estimate = estimateFromForm(form);
  const lines = [
    `Name: ${data.get('fullName') || ''}`,
    `Phone: ${data.get('contactNumber') || ''}`,
    `Date: ${data.get('pickupDate') || ''}`,
    `Time: ${data.get('pickupTime') || ''}`,
    `Vehicle: ${data.get('serviceType') || ''}`,
    `Pickup: ${data.get('pickupLocation') || ''}`,
    `Dropoff: ${data.get('dropoffLocation') || ''}`
  ];

  const stops = Array.from(form.querySelectorAll('[data-route-point="stop"]'))
    .map((input, index) => `Stop ${index + 1}: ${input.value.trim()}`)
    .filter((line) => !line.endsWith(': '));
  lines.push(...stops);

  if (data.get('hasPassengerLuggage') === 'yes') {
    lines.push(`Luggage: ${data.get('checkedBags') || 0} checked, ${data.get('carryOnBags') || 0} carry-on, ${data.get('oversizedBags') || 0} oversized`);
  }
  if (data.get('hasChildSeats') === 'yes') {
    lines.push(`Child seats: ${data.get('forwardFacingSeats') || 0} forward-facing, ${data.get('boosterSeats') || 0} booster`);
  }
  if (data.get('promoCode')) lines.push(`Promo code: ${data.get('promoCode')}`);
  if (estimate) lines.push(`Temporary estimate: ${formatCurrency(estimate.total)} (${estimate.hours.toFixed(1)} hrs approx.)`);

  return lines;
};

const submitInquiry = (form) => {
  if (!form.reportValidity()) return;
  const subject = encodeURIComponent('Chauffeured Service Inquiry');
  const body = encodeURIComponent(['Hello,', '', 'I would like to request chauffeured service.', '', ...collectFormLines(form), '', 'Thanks!'].join('\n'));
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  const status = document.getElementById('form-status');
  if (status) status.textContent = 'Opening your email app with the inquiry details.';
};

const initBookingForm = (form) => {
  if (!form) return;
  syncServiceType(form);
  toggleConditionalFields(form);
  updateEstimate(form);

  form.addEventListener('input', (event) => {
    if (event.target.matches('[data-seat-counter]')) syncSeatInputs(form);
    if (event.target.matches('[name="travelers"], [name="carryOnBags"], [name="checkedBags"], [name="oversizedBags"]')) enforceLuggageCounts(form);
    updateEstimate(form);
  });

  form.addEventListener('change', (event) => {
    if (event.target.matches('[name="hasPassengerLuggage"], [name="hasChildSeats"]')) toggleConditionalFields(form);
    if (event.target.matches('[name="gratuityPercent"]')) updateEstimate(form);
  });

  form.addEventListener('click', (event) => {
    const vehicle = event.target.closest('[data-service-type]');
    if (vehicle) {
      const field = form.querySelector('[name="serviceType"]');
      if (field) field.value = vehicle.dataset.serviceType;
      syncServiceType(form);
      enforceLuggageCounts(form);
      updateEstimate(form);
      return;
    }

    if (event.target.closest('[data-action="add-stop"]')) {
      addStop(form);
      return;
    }

    if (event.target.closest('[data-action="apply-promo"]')) {
      applyPromo(form);
      return;
    }

    const modeButton = event.target.closest('.toggle');
    if (modeButton) {
      form.querySelectorAll('.toggle').forEach((button) => button.classList.remove('active'));
      modeButton.classList.add('active');
    }
  });

  form.addEventListener('reset', () => {
    window.setTimeout(() => {
      syncServiceType(form);
      toggleConditionalFields(form);
      applyPromo(form);
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    submitInquiry(form);
  });

  const emailButton = form.querySelector('[data-action="email-form"]');
  if (emailButton) {
    emailButton.addEventListener('click', (event) => {
      if (emailButton.type !== 'submit') {
        event.preventDefault();
        submitInquiry(form);
      }
    });
  }
};

renderFeaturedRoutes();
setHourlyPrices();

// Simple booking form for mobile
const initSimpleBookingForm = () => {
  const form = document.getElementById('simple-booking-form');
  if (!form) return;

  const hourlyFields = document.getElementById('hourly-fields');
  const routeFields = document.getElementById('route-fields');
  const toggleButtons = form.querySelectorAll('[data-booking-type]');

  // Toggle between hourly and route
  toggleButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const type = button.dataset.bookingType;
      
      // Update active state
      toggleButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Show/hide fields
      if (type === 'hourly') {
        hourlyFields.style.display = 'block';
        routeFields.style.display = 'none';
        // Make hourly fields required
        form.querySelector('[name="pickupAddress"]').required = true;
        form.querySelector('[name="estimatedHours"]').required = true;
        form.querySelector('[name="selectedRoute"]').required = false;
      } else {
        hourlyFields.style.display = 'none';
        routeFields.style.display = 'block';
        // Make route field required
        form.querySelector('[name="pickupAddress"]').required = false;
        form.querySelector('[name="estimatedHours"]').required = false;
        form.querySelector('[name="selectedRoute"]').required = true;
      }
    });
  });

  // Handle form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const activeType = form.querySelector('[data-booking-type].active').dataset.bookingType;
    
    let emailBody = `Hello,\n\nI would like to request a booking:\n\n`;
    emailBody += `Name: ${formData.get('fullName')}\n`;
    emailBody += `Contact: ${formData.get('contactNumber')}\n`;
    emailBody += `Date: ${formData.get('serviceDate')}\n`;
    emailBody += `Time: ${formData.get('serviceTime')}\n`;
    emailBody += `Vehicle: ${formData.get('vehicle')}\n\n`;
    
    if (activeType === 'hourly') {
      emailBody += `Service Type: Hourly\n`;
      emailBody += `Pickup Address: ${formData.get('pickupAddress')}\n`;
      emailBody += `Estimated Hours: ${formData.get('estimatedHours')}\n`;
    } else {
      emailBody += `Service Type: Set Route\n`;
      emailBody += `Selected Route: ${formData.get('selectedRoute')}\n`;
    }
    
    if (formData.get('notes')) {
      emailBody += `\nAdditional Notes:\n${formData.get('notes')}\n`;
    }
    
    emailBody += `\nThank you!`;
    
    const subject = activeType === 'hourly' 
      ? 'Hourly Chauffeur Service Request'
      : 'Set Route Booking Request';
    
    const mailtoLink = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
  });
};

initSimpleBookingForm();
document.querySelectorAll('.booking-form').forEach(initBookingForm);
