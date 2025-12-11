// ============================================
// GOOGLE APPS SCRIPT - RSVP Form Handler
// ============================================
// This script receives form submissions and saves them to Google Sheets
// Copy this entire code into Google Apps Script Editor

/**
 * Runs once when you first set up the script
 * Creates the headers row in your spreadsheet
 */
function setupSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Clear any existing content in row 1
  sheet.getRange(1, 1, 1, 6).clear();

  // Set Hebrew headers (Right-to-Left)
  var headers = ['תאריך', 'שם', 'טלפון', 'סטטוס', 'כמות אורחים', 'ברכה'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Style the header row
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#FF6B9D');           // Pink background
  headerRange.setFontColor('#FFFFFF');            // White text
  headerRange.setFontWeight('bold');              // Bold
  headerRange.setHorizontalAlignment('center');   // Center align
  headerRange.setFontSize(12);                    // Larger font

  // Set column widths for better readability
  sheet.setColumnWidth(1, 150);  // תאריך
  sheet.setColumnWidth(2, 150);  // שם
  sheet.setColumnWidth(3, 120);  // טלפון
  sheet.setColumnWidth(4, 100);  // סטטוס
  sheet.setColumnWidth(5, 100);  // כמות אורחים
  sheet.setColumnWidth(6, 250);  // ברכה

  // Freeze header row
  sheet.setFrozenRows(1);

  // Set RTL for the entire sheet
  sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns())
       .setHorizontalAlignment('right');

  SpreadsheetApp.getUi().alert('✅ הגדרת הטבלה הושלמה בהצלחה!\n\nעכשיו עליך לפרוס את הסקריפט כ-Web App');
}

/**
 * Handles POST requests from the invitation website
 * This function is called automatically when form is submitted
 */
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Format the date in Hebrew locale
    var now = new Date();
    var formattedDate = Utilities.formatDate(now, 'Asia/Jerusalem', 'dd/MM/yyyy HH:mm');

    // Add new row with the form data
    sheet.appendRow([
      formattedDate,
      data.name || '',
      data.phone || '',
      data.attendance || '',
      data.guests || 0,
      data.blessing || ''
    ]);

    // Style the new row (optional - for better readability)
    var lastRow = sheet.getLastRow();
    var newRowRange = sheet.getRange(lastRow, 1, 1, 6);
    newRowRange.setHorizontalAlignment('right');

    // Color code based on attendance status
    var statusCell = sheet.getRange(lastRow, 4);
    if (data.attendance === 'מגיע/ה') {
      statusCell.setBackground('#90EE90');  // Light green
    } else if (data.attendance === 'אולי') {
      statusCell.setBackground('#FFE4B5');  // Light orange
    } else if (data.attendance === 'לא מגיע/ה') {
      statusCell.setBackground('#FFB6C1');  // Light pink/red
    }

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'RSVP saved successfully',
        row: lastRow
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Log error for debugging
    console.error('Error in doPost:', error);

    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Test function - adds a sample row to verify everything works
 * Run this manually to test before deploying
 */
function testAddRow() {
  var testData = {
    postData: {
      contents: JSON.stringify({
        name: 'בדיקה - ישראל ישראלי',
        phone: '050-1234567',
        attendance: 'מגיע/ה',
        guests: 3,
        blessing: 'מזל טוב! שתגדלו אותה לתורה, לחופה ולמעשים טובים!'
      })
    }
  };

  var result = doPost(testData);
  Logger.log(result.getContent());

  SpreadsheetApp.getUi().alert('✅ שורת בדיקה נוספה בהצלחה!\n\nבדוק את הטבלה ומחק את השורה לפני השימוש האמיתי.');
}

/**
 * Creates a summary of RSVPs
 * Run manually to get attendance statistics
 */
function getSummary() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();

  var coming = 0;
  var maybe = 0;
  var notComing = 0;
  var totalGuests = 0;

  // Skip header row (start from 1)
  for (var i = 1; i < data.length; i++) {
    var status = data[i][3];  // Column D - סטטוס
    var guests = data[i][4];  // Column E - כמות אורחים

    if (status === 'מגיע/ה') {
      coming++;
      totalGuests += parseInt(guests) || 0;
    } else if (status === 'אולי') {
      maybe++;
      totalGuests += parseInt(guests) || 0;  // Count maybe guests too
    } else if (status === 'לא מגיע/ה') {
      notComing++;
    }
  }

  var summary = '📊 סיכום אישורי הגעה\n\n' +
                '✅ מגיעים: ' + coming + ' משפחות\n' +
                '❓ אולי: ' + maybe + ' משפחות\n' +
                '❌ לא מגיעים: ' + notComing + ' משפחות\n\n' +
                '👥 סה"כ אורחים צפויים: ' + totalGuests + '\n' +
                '(כולל אולי)';

  SpreadsheetApp.getUi().alert(summary);
}
