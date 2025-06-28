// Google Apps Script for Tree Removal Lead Generation
// This script handles form submissions, sends notifications, and manages lead data

// Configuration - Update these values for your setup
const CONFIG = {
  SPREADSHEET_ID: 'YOUR_GOOGLE_SHEETS_ID_HERE', // Replace with your Google Sheets ID
  TELEGRAM_BOT_TOKEN: 'YOUR_TELEGRAM_BOT_TOKEN_HERE', // Replace with your Telegram bot token
  TELEGRAM_CHAT_ID: 'YOUR_TELEGRAM_CHAT_ID_HERE', // Replace with your Telegram chat ID
  NOTIFICATION_EMAIL: 'your-email@example.com', // Replace with your notification email
  SMS_PHONE: '5551234567' // Replace with your phone number for SMS notifications
};

// Main function to handle POST requests from the website
function doPost(e) {
  try {
    // Enable CORS
    const response = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      }
    };

    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Process the lead
    const result = processTreeRemovalLead(data);
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing request:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle OPTIONS requests for CORS
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}

// Process tree removal lead
function processTreeRemovalLead(data) {
  try {
    // Add timestamp and generate lead ID
    const leadId = generateLeadId();
    const timestamp = new Date();
    
    const leadData = {
      ...data,
      lead_id: leadId,
      timestamp: timestamp,
      processed: false
    };

    // Save to Google Sheets
    saveToSheet(leadData);
    
    // Send notifications
    sendEmailNotification(leadData);
    sendTelegramNotification(leadData);
    
    // Log the successful processing
    console.log('Lead processed successfully:', leadId);
    
    return {
      success: true,
      lead_id: leadId,
      message: 'Lead submitted successfully'
    };
    
  } catch (error) {
    console.error('Error processing lead:', error);
    throw error;
  }
}

// Generate unique lead ID
function generateLeadId() {
  const now = new Date();
  const timestamp = now.getTime().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `TREE-${timestamp}-${random}`.toUpperCase();
}

// Save lead data to Google Sheets
function saveToSheet(leadData) {
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName('Tree Removal Leads');
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = spreadsheet.insertSheet('Tree Removal Leads');
      
      // Add headers
      const headers = [
        'Lead ID', 'Timestamp', 'Name', 'Phone', 'Email', 'Address',
        'Tree Condition', 'Tree Size', 'Emergency Removal', 'Property Type',
        'Access Difficulty', 'Budget', 'Additional Info', 'Quote Estimate',
        'Priority Level', 'Lead Source', 'Processed', 'Notes'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#2d5016');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
    }
    
    // Prepare row data
    const rowData = [
      leadData.lead_id,
      leadData.timestamp,
      leadData.full_name,
      leadData.phone,
      leadData.email,
      leadData.address || '',
      leadData.quiz_responses?.tree_condition || '',
      leadData.quiz_responses?.tree_size || '',
      leadData.quiz_responses?.emergency_removal || '',
      leadData.quiz_responses?.property_type || '',
      leadData.quiz_responses?.access_difficulty || '',
      leadData.quiz_responses?.budget || '',
      leadData.additional_info || '',
      leadData.quote_estimate?.range || '',
      leadData.quote_estimate?.priority || '',
      leadData.lead_source,
      'No',
      ''
    ];
    
    // Append the data
    sheet.appendRow(rowData);
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, rowData.length);
    
    console.log('Data saved to sheet successfully');
    
  } catch (error) {
    console.error('Error saving to sheet:', error);
    throw error;
  }
}

// Send email notification
function sendEmailNotification(leadData) {
  try {
    const subject = `🌳 New Tree Removal Lead - ${leadData.quote_estimate?.priority || 'STANDARD'} Priority`;
    
    const htmlBody = generateEmailTemplate(leadData);
    
    // Send email
    GmailApp.sendEmail(
      CONFIG.NOTIFICATION_EMAIL,
      subject,
      '', // Plain text body (empty since we're using HTML)
      {
        htmlBody: htmlBody,
        name: 'TreeCare Pro Lead System'
      }
    );
    
    console.log('Email notification sent successfully');
    
  } catch (error) {
    console.error('Error sending email:', error);
    // Don't throw error - notification failure shouldn't stop lead processing
  }
}

// Generate email template
function generateEmailTemplate(leadData) {
  const responses = leadData.quiz_responses || {};
  const estimate = leadData.quote_estimate || {};
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #2d5016; color: white; padding: 20px; text-align: center;">
        <h1>🌳 New Tree Removal Lead</h1>
        <p style="margin: 0; font-size: 18px;">Lead ID: ${leadData.lead_id}</p>
      </div>
      
      <div style="padding: 20px; background: #f8f9fa;">
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #2d5016; margin-top: 0;">Contact Information</h2>
          <p><strong>Name:</strong> ${leadData.full_name}</p>
          <p><strong>Phone:</strong> ${leadData.phone}</p>
          <p><strong>Email:</strong> ${leadData.email}</p>
          ${leadData.address ? `<p><strong>Address:</strong> ${leadData.address}</p>` : ''}
          <p><strong>Submitted:</strong> ${leadData.timestamp.toLocaleString()}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #2d5016; margin-top: 0;">Tree Removal Details</h2>
          <p><strong>Tree Condition:</strong> ${getReadableOption('tree_condition', responses.tree_condition)}</p>
          <p><strong>Tree Size:</strong> ${getReadableOption('tree_size', responses.tree_size)}</p>
          <p><strong>Emergency Removal:</strong> ${getReadableOption('emergency_removal', responses.emergency_removal)}</p>
          <p><strong>Property Type:</strong> ${getReadableOption('property_type', responses.property_type)}</p>
          <p><strong>Access Difficulty:</strong> ${getReadableOption('access_difficulty', responses.access_difficulty)}</p>
          <p><strong>Budget Range:</strong> ${getReadableOption('budget', responses.budget)}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #2d5016; margin-top: 0;">Quote Estimate</h2>
          <p><strong>Estimated Range:</strong> ${estimate.range || 'Not calculated'}</p>
          <p><strong>Priority Level:</strong> <span style="color: ${getPriorityColor(estimate.priority)}; font-weight: bold;">${estimate.priority || 'STANDARD'}</span></p>
        </div>
        
        ${leadData.additional_info ? `
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #2d5016; margin-top: 0;">Additional Information</h2>
          <p>${leadData.additional_info}</p>
        </div>
        ` : ''}
        
        <div style="background: #2d5016; color: white; padding: 20px; border-radius: 8px; text-align: center;">
          <h3 style="margin-top: 0;">Recommended Text Message</h3>
          <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 5px; font-style: italic;">
            "Hi ${leadData.full_name}, this is TreeCare Pro regarding your tree removal inquiry. Based on your assessment, we can provide a quote in the ${estimate.range || '$800-2000'} range. When would be a good time to schedule a free on-site evaluation? - TreeCare Pro"
          </div>
        </div>
      </div>
    </div>
  `;
}

// Send Telegram notification
function sendTelegramNotification(leadData) {
  if (!CONFIG.TELEGRAM_BOT_TOKEN || !CONFIG.TELEGRAM_CHAT_ID) {
    console.log('Telegram not configured, skipping notification');
    return;
  }
  
  try {
    const message = generateTelegramMessage(leadData);
    const url = `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const payload = {
      chat_id: CONFIG.TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    };
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload)
    };
    
    const response = UrlFetchApp.fetch(url, options);
    console.log('Telegram notification sent successfully');
    
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    // Don't throw error - notification failure shouldn't stop lead processing
  }
}

// Generate Telegram message
function generateTelegramMessage(leadData) {
  const responses = leadData.quiz_responses || {};
  const estimate = leadData.quote_estimate || {};
  
  return `
🌳 <b>NEW TREE REMOVAL LEAD</b>

👤 <b>Contact:</b> ${leadData.full_name}
📞 <b>Phone:</b> ${leadData.phone}
📧 <b>Email:</b> ${leadData.email}
🏠 <b>Address:</b> ${leadData.address || 'Not provided'}

🌲 <b>Tree Details:</b>
• Condition: ${getReadableOption('tree_condition', responses.tree_condition)}
• Size: ${getReadableOption('tree_size', responses.tree_size)}
• Emergency: ${getReadableOption('emergency_removal', responses.emergency_removal)}
• Access: ${getReadableOption('access_difficulty', responses.access_difficulty)}

💰 <b>Estimate:</b> ${estimate.range || 'Not calculated'}
🔥 <b>Priority:</b> ${estimate.priority || 'STANDARD'}

🆔 <b>Lead ID:</b> ${leadData.lead_id}
⏰ <b>Time:</b> ${leadData.timestamp.toLocaleString()}

📱 <b>Suggested Text:</b>
"Hi ${leadData.full_name}, this is TreeCare Pro regarding your tree removal. We can quote ${estimate.range || '$800-2000'}. When can we schedule a free evaluation?"
  `.trim();
}

// Helper function to get readable option labels
function getReadableOption(questionId, value) {
  const options = {
    tree_condition: {
      'dead': 'Dead tree - completely lifeless',
      'diseased': 'Diseased - showing signs of illness',
      'damaged': 'Storm damaged or partially fallen',
      'healthy_hazard': 'Healthy but poses a safety hazard',
      'healthy_removal': 'Healthy tree - removal for other reasons'
    },
    tree_size: {
      'small': 'Small (under 25 feet)',
      'medium': 'Medium (25-50 feet)',
      'large': 'Large (50-75 feet)',
      'very_large': 'Very Large (over 75 feet)',
      'multiple': 'Multiple trees of various sizes'
    },
    emergency_removal: {
      'immediate': 'Yes - immediate removal needed (within 24 hours)',
      'urgent': 'Yes - urgent but can wait 2-3 days',
      'soon': 'Within the next week',
      'flexible': 'No rush - flexible timing'
    },
    property_type: {
      'residential_single': 'Single family home',
      'residential_multi': 'Multi-family residence/duplex',
      'commercial_small': 'Small commercial property',
      'commercial_large': 'Large commercial/industrial',
      'municipal': 'Municipal/government property'
    },
    access_difficulty: {
      'easy': 'Easy access - open area, truck can get close',
      'moderate': 'Moderate - some obstacles, limited truck access',
      'difficult': 'Difficult - tight space, crane may be needed',
      'very_difficult': 'Very difficult - hand removal only, many obstacles',
      'near_structures': 'Very close to house/power lines/structures'
    },
    budget: {
      'under_500': 'Under $500',
      '500_1000': '$500 - $1,000',
      '1000_2500': '$1,000 - $2,500',
      '2500_5000': '$2,500 - $5,000',
      'over_5000': 'Over $5,000',
      'unsure': 'Not sure - need estimate'
    }
  };
  
  return options[questionId]?.[value] || value || 'Not specified';
}

// Helper function to get priority color
function getPriorityColor(priority) {
  switch(priority) {
    case 'HIGH PRIORITY': return '#dc3545';
    case 'MEDIUM PRIORITY': return '#ffc107';
    default: return '#28a745';
  }
}

// Test function for development
function testSubmission() {
  const testData = {
    full_name: 'John Smith',
    phone: '(555) 123-4567',
    email: 'john@example.com',
    address: '123 Oak Street, Springfield, IL',
    additional_info: 'Large oak tree fell during storm, blocking driveway',
    quiz_responses: {
      tree_condition: 'damaged',
      tree_size: 'large',
      emergency_removal: 'urgent',
      property_type: 'residential_single',
      access_difficulty: 'moderate',
      budget: '1000_2500'
    },
    quote_estimate: {
      range: '$1,200 - $2,100',
      priority: 'HIGH PRIORITY'
    },
    lead_source: 'Tree Removal Quiz'
  };
  
  return processTreeRemovalLead(testData);
}