# Tree Removal Lead Generation Website

A complete lead generation system for tree removal services built with HTML, CSS, and JavaScript, featuring an interactive 6-question assessment quiz and automated lead management.

## Features

- **Professional Landing Page** - Mobile-responsive design with modern UI
- **Interactive Quiz System** - 6 targeted questions about tree removal needs
- **Smart Quote Estimation** - Automated pricing based on quiz responses
- **Lead Capture Forms** - Validated contact information collection
- **Real-time Notifications** - Email and Telegram alerts for new leads
- **Google Sheets Integration** - Automatic lead data storage and management
- **Mobile-First Design** - Optimized for all devices

## Quiz Questions Covered

1. **Tree Condition** - Dead, diseased, damaged, or healthy trees
2. **Tree Size** - Small to very large trees (under 25ft to over 75ft)
3. **Emergency Removal** - Immediate, urgent, or flexible timing
4. **Property Type** - Residential, commercial, or municipal
5. **Access Difficulty** - Easy access to complex removals near structures
6. **Budget Range** - From under $500 to over $5,000

## Files Structure

```
tree-removal-leadgen/
├── tree-removal-index.html      # Main landing page
├── tree-removal-styles.css      # Complete styling system
├── tree-removal-script.js       # Quiz functionality and lead capture
├── tree-removal-gas.js          # Google Apps Script backend
└── tree-removal-readme.md       # This documentation
```

## Setup Instructions

### 1. Google Apps Script Setup

1. Go to [Google Apps Script](https://script.google.com/)
2. Create a new project
3. Copy the code from `tree-removal-gas.js`
4. Update the CONFIG section with your details:
   ```javascript
   const CONFIG = {
     SPREADSHEET_ID: 'your-google-sheets-id',
     TELEGRAM_BOT_TOKEN: 'your-telegram-bot-token',
     TELEGRAM_CHAT_ID: 'your-chat-id',
     NOTIFICATION_EMAIL: 'your-email@example.com',
     SMS_PHONE: '5551234567'
   };
   ```
5. Deploy as a web app with "Anyone" access
6. Copy the web app URL

### 2. Website Configuration

1. Open `tree-removal-script.js`
2. Update the Google Apps Script URL:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```

### 3. Google Sheets Setup

1. Create a new Google Sheets document
2. Copy the Sheet ID from the URL
3. The script will automatically create the "Tree Removal Leads" sheet with proper headers

### 4. Telegram Bot Setup (Optional)

1. Create a bot using [@BotFather](https://t.me/botfather)
2. Get your bot token
3. Get your chat ID by messaging [@userinfobot](https://t.me/userinfobot)
4. Update the CONFIG in your Google Apps Script

### 5. Deployment Options

#### Option A: Netlify (Recommended)
1. Create a GitHub repository with your files
2. Connect to Netlify
3. Deploy automatically

#### Option B: GitHub Pages
1. Create a GitHub repository
2. Upload your files
3. Enable GitHub Pages in repository settings

#### Option C: Manual Hosting
1. Upload files to your web hosting provider
2. Ensure HTTPS is enabled for security

## Customization

### Branding
- Update company name "TreeCare Pro" in HTML
- Modify contact information (phone, email)
- Change color scheme in CSS variables:
  ```css
  :root {
    --primary-color: #2d5016;
    --secondary-color: #4a8934;
    --accent-color: #8bc34a;
  }
  ```

### Quiz Logic
- Modify questions in `quizQuestions` array
- Adjust pricing logic in `generateQuoteEstimate()` function
- Update priority levels in `getPriorityLevel()` function

### Styling
- All styles are in `tree-removal-styles.css`
- Mobile-responsive breakpoints at 768px and 480px
- CSS Grid and Flexbox layout system

## Lead Management

### Automatic Features
- **Lead ID Generation** - Unique identifier for each lead
- **Priority Scoring** - HIGH/MEDIUM/STANDARD based on urgency
- **Quote Estimation** - Price ranges based on assessment
- **Timestamp Tracking** - Submission date and time
- **Source Tracking** - Lead attribution

### Notification Template
The system generates ready-to-send text messages:
```
"Hi [Name], this is TreeCare Pro regarding your tree removal inquiry. 
Based on your assessment, we can provide a quote in the [Range] range. 
When would be a good time to schedule a free on-site evaluation? 
- TreeCare Pro"
```

## Analytics & Tracking

### Google Sheets Columns
- Lead ID, Timestamp, Contact Info
- Quiz Responses, Quote Estimate
- Priority Level, Lead Source
- Processing Status, Notes

### Performance Metrics
- Lead conversion tracking
- Priority distribution
- Average quote values
- Response time tracking

## Security Features

- **Form Validation** - Client and server-side validation
- **CORS Handling** - Proper cross-origin resource sharing
- **Input Sanitization** - Clean data processing
- **Error Handling** - Graceful error management

## Mobile Optimization

- **Touch-Friendly** - Large tap targets and buttons
- **Fast Loading** - Optimized images and code
- **Responsive Design** - Works on all screen sizes
- **Progressive Enhancement** - Functions without JavaScript

## Testing

### Quiz Flow Testing
1. Test all question combinations
2. Verify form validation
3. Check quote calculations
4. Test mobile functionality

### Backend Testing
1. Use the `testSubmission()` function in Google Apps Script
2. Verify email notifications
3. Check Telegram integration
4. Confirm data storage

## Troubleshooting

### Common Issues
1. **Forms not submitting** - Check Google Apps Script URL
2. **No notifications** - Verify email/Telegram configuration
3. **Mobile issues** - Test responsive design
4. **Slow loading** - Optimize images and code

### Debug Mode
Add `console.log()` statements to track:
- Quiz progression
- Form validation
- Data submission
- API responses

## Future Enhancements

### Potential Additions
- **Photo Upload** - Tree condition assessment
- **Geolocation** - Automatic address detection
- **Calendar Integration** - Appointment scheduling
- **Live Chat** - Real-time customer support
- **Review System** - Customer testimonials
- **Multi-language** - Spanish translation

### Advanced Features
- **AI Quote Estimation** - Machine learning pricing
- **Weather Integration** - Storm damage alerts
- **Route Optimization** - Service area mapping
- **CRM Integration** - Customer relationship management

## Support

For technical support or customization requests:
- Create an issue in the GitHub repository
- Check the troubleshooting section
- Review the Google Apps Script logs

## License

This project is provided as-is for educational and commercial use. Modify as needed for your business requirements.

---

**Built with ❤️ for tree service professionals**