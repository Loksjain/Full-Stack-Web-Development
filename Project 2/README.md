# Responsive Login Form

A centered, responsive login form built with HTML and CSS, demonstrating proper use of the box model and alignment techniques.

## Features

### ✅ Box Model Implementation
- **Fixed width**: 350px for the login card
- **Proper box-sizing**: `border-box` ensures width includes padding and border
- **Consistent spacing**: 20px internal padding, proper margins between elements
- **Predictable sizing**: Total card size remains consistent across browsers

### ✅ Alignment Techniques
- **Horizontal centering**: Card centered on page using flexbox
- **Vertical centering**: Card centered in viewport using flexbox
- **Text alignment**: Heading and button text centered
- **Form alignment**: Labels and inputs left-aligned, inputs full-width

### ✅ Visual Design
- **Subtle border**: 1px solid #ddd with 10px border-radius
- **Soft shadow**: Multi-layered box-shadow for depth
- **Light background**: Clean white card on gradient background
- **Modern styling**: Smooth transitions and hover effects

### ✅ Responsive Design
- **Mobile-friendly**: Adapts to smaller screens
- **Touch-friendly**: Proper input sizing for mobile devices
- **Consistent experience**: Maintains design integrity across devices

## File Structure

```
├── index.html      # Main HTML structure
├── styles.css      # CSS styling and layout
└── README.md       # Project documentation
```

## How to Use

1. Open `index.html` in a web browser
2. The login form will be displayed centered on the page
3. Form includes email and password validation
4. Responsive design works on all screen sizes

## Technical Implementation

### Box Model Usage
- Used `box-sizing: border-box` for predictable sizing
- 350px width includes padding and border
- Proper margin and padding for spacing

### Centering Techniques
- **Viewport centering**: Flexbox on body with `align-items: center` and `justify-content: center`
- **Card centering**: Flexbox container with centered alignment
- **Text centering**: `text-align: center` for headings and buttons

### Responsive Features
- Media queries for mobile devices
- Flexible width with max-width constraints
- Touch-friendly input sizing (16px minimum)

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design tested on various screen sizes 