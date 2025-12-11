# Baby Girl Birth Invitation Website - Claude Code Prompt

## Project Overview

Create a **single-page invitation website** for a baby girl birth celebration event using vanilla **HTML + CSS + JavaScript** (no frameworks). The design should combine a **modern pink color palette** with a **retro pixel-art/old game aesthetic** (think 8-bit baby girl theme).

---

## Tech Stack

- **HTML5** - Semantic structure
- **CSS3** - Styling with CSS variables, animations, and modern features
- **Vanilla JavaScript** - Interactions and animations
- **No frameworks/libraries** - Pure implementation

---

## Design Requirements

### Color Palette (Modern Pink Theme)

```css
:root {
  --pink-primary: #FF6B9D;      /* Main pink */
  --pink-light: #FFB8D0;        /* Light pink backgrounds */
  --pink-dark: #E84A7F;         /* Dark pink for accents */
  --pink-pastel: #FFF0F5;       /* Very light pink background */
  --gold-accent: #FFD700;       /* Gold for highlights */
  --white: #FFFFFF;
  --text-dark: #4A4A4A;
  --pixel-shadow: #C44D7B;      /* For pixel art shadows */
}
```

### Visual Style: Retro Game Baby Girl

1. **Pixel-art borders** - Use CSS to create 8-bit style borders around sections
2. **Pixel font** - Use a retro/pixel font for headings (e.g., "Press Start 2P" from Google Fonts)
3. **Chunky buttons** - Buttons should look like old game UI elements with pixel shadows
4. **Floating pixel elements** - Small animated pixel hearts, stars, bottles, pacifiers
5. **Scanline effect** (subtle) - Optional CRT-like overlay for extra retro feel
6. **Bounce/blink animations** - Classic game-style animations

---

## Page Structure & Components

### 1. Header Section

```
┌─────────────────────────────────────┐
│         🎀 הזמנה לברית 🎀           │
│      (Invitation to Brit Bat)       │
│    [Pixel-art baby girl icon]       │
└─────────────────────────────────────┘
```

- RTL (Right-to-Left) Hebrew text support
- Pixel-art decorative border
- Animated sparkles/stars around title

### 2. Hero Image Section

```
┌─────────────────────────────────────┐
│                                     │
│     ┌───────────────────────┐       │
│     │                       │       │
│     │    [CUSTOM IMAGE]     │       │
│     │    (baby photo)       │       │
│     │                       │       │
│     └───────────────────────┘       │
│                                     │
│     [Pixel-art frame around image]  │
│                                     │
└─────────────────────────────────────┘
```

**Requirements:**
- Image placeholder that accepts custom image via:
  - Hardcoded path: `const BABY_IMAGE = './images/baby.jpg'`
  - Or config object at top of JS file
- Pixel-art style frame/border around image
- Optional: Gentle floating animation
- Fallback placeholder if no image provided

### 3. Event Details Content

```
┌─────────────────────────────────────┐
│                                     │
│   בשעה טובה ומוצלחת נולדה לנו בת    │
│                                     │
│   הנכם מוזמנים לאירוע הברית         │
│                                     │
│   📅 תאריך: [DATE]                  │
│   🕐 שעה: [TIME]                    │
│   📍 מיקום: [VENUE_NAME]            │
│      [VENUE_ADDRESS]                │
│                                     │
│   נשמח לראותכם בין אורחינו          │
│   [PARENTS_NAMES]                   │
│                                     │
└─────────────────────────────────────┘
```

**Config object for easy editing:**

```javascript
const EVENT_CONFIG = {
  babyGender: 'girl',
  eventType: 'ברית', // or 'זבד הבת'
  date: '15/12/2025',
  dayOfWeek: 'יום שני',
  time: '14:00',
  venue: {
    name: 'אולם האירועים',
    address: 'רחוב הדוגמה 18, תל אביב',
    wazeLink: 'waze://?q=<venue address>'
  },
  parents: {
    names: 'שרה ודוד ישראלי'
  },
  additionalNotes: 'ניתן לחנות בחניון ללא תשלום'
};
```

### 4. Navigation Button (Waze)

```
┌─────────────────────────────────────┐
│                                     │
│   ┌─────────────────────────────┐   │
│   │  🗺️  ניווט למקום (WAZE)     │   │
│   └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

- Pixel-art styled button
- Waze icon (SVG or pixel art)
- Opens Waze navigation on click
- Hover animation (bounce/glow)

### 5. RSVP Form Section

```
┌─────────────────────────────────────┐
│         האם את/ה מגיע/ה?            │
│                                     │
│   ┌────────┬────────┬────────┐      │
│   │  מגיע  │ אולי?  │לא אגיע │      │
│   └────────┴────────┴────────┘      │
│                                     │
│   ┌─────────────────────────────┐   │
│   │ * שם מלא:                   │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │ * טלפון:                    │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌────┬─────────────────┬────┐     │
│   │ -  │   כמה מגיעים?   │ +  │     │
│   └────┴─────────────────┴────┘     │
│                                     │
│   ┌─────────────────────────────┐   │
│   │ הוספת ברכה / הערה (אופציונלי)│   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │     שליחת אישור הגעה  ➤     │   │
│   └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**Form Features:**

1. **Attendance Toggle** (3 options):
   - מגיע (Coming) - Green highlight when selected
   - אולי? (Maybe) - Yellow highlight when selected
   - לא אגיע (Not coming) - Red highlight when selected
   - Pixel-art toggle buttons with game-like click feedback

2. **Input Fields:**
   - Full name (required) - Pixel-style input
   - Phone number (required) - RTL number input
   - Both with pixel-art focus states

3. **Guest Counter:**
   - Minus (-) and Plus (+) pixel buttons
   - Number display in center
   - Min: 1, Max: 20
   - Bouncy animation on click

4. **Blessing/Note Textarea:**
   - Expandable on click ("הוספת ברכה/הערה")
   - Pixel-art styled textarea
   - Optional field

5. **Submit Button:**
   - Large pixel-art CTA button
   - Loading state with pixel animation
   - Success state with confetti explosion

### 6. Confetti Animation System

**Trigger on:**
- Page load (brief celebration)
- Successful form submission (big celebration)

**Confetti Colors (pink theme):**
```javascript
const CONFETTI_COLORS = [
  '#FF6B9D',  // Pink
  '#FFB8D0',  // Light pink
  '#FFD700',  // Gold
  '#FF69B4',  // Hot pink
  '#FFC0CB',  // Pastel pink
];
```

**Confetti shapes:**
- Hearts (pixel style)
- Stars
- Circles
- Small rectangles

### 7. Floating Pixel Decorations

Create animated floating elements throughout the page:

```javascript
const FLOATING_ELEMENTS = [
  '💖', // Heart
  '⭐', // Star  
  '🍼', // Baby bottle
  '🎀', // Ribbon
  '👶', // Baby
];
```

Or use CSS pixel-art versions of:
- Baby bottle
- Pacifier
- Heart
- Star
- Bow/ribbon

---

## Animations Specification

### 1. Entrance Animations
- Title: Bounce in from top
- Image: Fade in with scale
- Content: Slide in from right (RTL)
- Form: Slide in from bottom

### 2. Interactive Animations
- Buttons: Pixel "press" effect (translate down + shadow change)
- Input focus: Glowing pink border pulse
- Counter buttons: Bounce on click
- Toggle buttons: Color transition + scale

### 3. Background Animations
- Floating pixel elements (continuous, slow)
- Subtle sparkle effects on decorative elements
- Optional: Moving pixel clouds or stars

### 4. Celebration Animations
- Confetti burst (page load + form submit)
- Success checkmark animation
- Heart explosion effect

---

## CSS Animation Examples

```css
/* Pixel button press effect */
.pixel-button:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 var(--pixel-shadow);
}

/* Floating animation */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* Pixel heart beat */
@keyframes pixel-heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* Sparkle effect */
@keyframes sparkle {
  0%, 100% { opacity: 0; transform: scale(0); }
  50% { opacity: 1; transform: scale(1); }
}
```

---

## File Structure

```
baby-invitation/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── images/
│   ├── baby.jpg          (user's custom image)
│   └── pixel-sprites/    (optional pixel art assets)
└── fonts/                (optional local fonts)
```

---

## JavaScript Functionality

### Config Section (Top of main.js)

```javascript
// ============================================
// CONFIGURATION - EDIT THESE VALUES
// ============================================

const CONFIG = {
  // Event Details
  event: {
    type: 'ברית',           // 'ברית' or 'זבד הבת'
    date: '15/12/2025',
    dayOfWeek: 'יום שני',
    time: '14:00',
  },
  
  // Venue
  venue: {
    name: 'אולם האירועים',
    address: 'רחוב הדוגמה 18, תל אביב',
    wazeQuery: 'אולם האירועים תל אביב',
  },
  
  // Parents
  parents: {
    names: 'שרה ודוד ישראלי',
  },
  
  // Images
  images: {
    baby: './images/baby.jpg',
    fallback: 'https://via.placeholder.com/400x300/FFB8D0/FF6B9D?text=👶'
  },
  
  // Additional Text
  additionalNotes: 'ניתן לחנות בחניון ללא תשלום',
  
  // Form submission endpoint (optional)
  formEndpoint: null, // Set URL for actual form submission
};
```

### Core Functions

```javascript
// Initialize page
function init() { }

// Handle attendance selection
function selectAttendance(status) { }

// Guest counter
function incrementGuests() { }
function decrementGuests() { }

// Form validation
function validateForm() { }

// Form submission
function submitRSVP() { }

// Confetti system
function launchConfetti() { }

// Floating elements animation
function initFloatingElements() { }

// Toast/Alert notifications
function showNotification(message, type) { }
```

---

## Responsive Design

- **Mobile-first** approach
- Breakpoints:
  - Mobile: < 480px
  - Tablet: 481px - 768px
  - Desktop: > 768px
- Touch-friendly buttons (min 44px tap target)
- Readable fonts on all sizes

---

## Accessibility

- RTL support with `dir="rtl"` and `lang="he"`
- Proper form labels
- Keyboard navigation support
- Focus indicators
- Color contrast compliance
- Screen reader friendly

---

## Form Behavior

### On Submit (No Backend):
1. Validate required fields
2. Show loading animation
3. Simulate submission (setTimeout)
4. Show success message
5. Launch confetti celebration
6. Log form data to console
7. Optional: Copy to clipboard / show summary

### Alert Messages:
- Missing name: "אנא הזינו שם מלא"
- Missing phone: "אנא הזינו מספר טלפון"
- Invalid phone: "מספר טלפון לא תקין"
- Success: "תודה! אישור ההגעה נשלח בהצלחה 🎉"

---

## Optional Enhancements

1. **Sound effects** - 8-bit sounds on button clicks
2. **Save to calendar** - Generate .ics file
3. **Share buttons** - WhatsApp share link
4. **Dark mode** - Pink/purple dark theme variant
5. **Language toggle** - Hebrew/English

---

## Summary Checklist

- [ ] HTML structure with all sections
- [ ] CSS with pixel-art retro styling
- [ ] Pink color theme throughout
- [ ] Config object for easy customization
- [ ] Custom image support
- [ ] RTL Hebrew text support
- [ ] RSVP form with validation
- [ ] Attendance toggle (3 options)
- [ ] Guest counter (+/-)
- [ ] Blessing/note textarea
- [ ] Waze navigation button
- [ ] Confetti animation
- [ ] Floating pixel decorations
- [ ] Entrance animations
- [ ] Button press effects
- [ ] Mobile responsive
- [ ] Success/error notifications

---

## Example Prompt for Claude Code

Copy and paste this to start:

```
Create a baby girl birth invitation website based on the specification in baby-invitation-prompt.md

Start by:
1. Creating the HTML structure with all sections
2. Adding the CSS with pixel-art retro styling and pink theme
3. Implementing the JavaScript functionality

Use the CONFIG object pattern so I can easily change event details, venue info, and the baby image path.

Make sure:
- All text is in Hebrew (RTL)
- The design looks like a retro 8-bit game with modern pink colors
- Include confetti animation on page load and form submission
- The form validates required fields before "submitting"
- Mobile responsive design
```

---

## Notes

- This is a **static website** - form data is logged to console only
- For actual RSVP collection, you'll need to add a backend endpoint to CONFIG.formEndpoint
- Test on mobile devices for touch interactions
- The pixel-art style should be fun but still readable and professional
