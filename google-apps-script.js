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

  // Set phone column (C) to Plain Text format to preserve leading zeros
  sheet.getRange('C:C').setNumberFormat('@');

  // Freeze header row
  sheet.setFrozenRows(1);

  // Set RTL for the entire sheet
  sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns())
       .setHorizontalAlignment('right');

  SpreadsheetApp.getUi().alert('✅ הגדרת הטבלה הושלמה בהצלחה!\n\nעכשיו עליך לפרוס את הסקריפט כ-Web App');
}

/**
 * Normalizes phone number for comparison
 * Removes dashes, spaces, and apostrophes
 */
function normalizePhone(phone) {
  return String(phone || '').replace(/[-\s']/g, '');
}

/**
 * Finds row index by phone number
 * Returns row number (1-indexed) or -1 if not found
 */
function findRowByPhone(sheet, phone) {
  var normalizedSearch = normalizePhone(phone);
  if (!normalizedSearch) return -1;

  var data = sheet.getDataRange().getValues();

  // Start from row 2 (skip header)
  for (var i = 1; i < data.length; i++) {
    var cellPhone = normalizePhone(data[i][2]); // Column C (index 2)
    if (cellPhone === normalizedSearch) {
      return i + 1; // Convert to 1-indexed row number
    }
  }

  return -1;
}

/**
 * Handles POST requests from the invitation website
 * This function is called automatically when form is submitted
 * If phone exists: updates the existing row
 * If phone is new: creates a new row
 */
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Format the date in Hebrew locale
    var now = new Date();
    var formattedDate = Utilities.formatDate(now, 'Asia/Jerusalem', 'dd/MM/yyyy HH:mm');

    // Normalize phone - remove dashes/spaces, add apostrophe to keep as text
    var rawPhone = normalizePhone(data.phone);
    var phoneForSheet = "'" + rawPhone; // Apostrophe forces text format, preserves leading zero

    // Prepare row data
    var rowData = [
      formattedDate,
      data.name || '',
      phoneForSheet,
      data.attendance || '',
      data.guests || 0,
      data.blessing || ''
    ];

    // Check if phone already exists
    var existingRow = findRowByPhone(sheet, rawPhone);
    var isUpdate = existingRow > 0;
    var targetRow;

    if (isUpdate) {
      // Update existing row
      targetRow = existingRow;
      sheet.getRange(targetRow, 1, 1, 6).setValues([rowData]);
    } else {
      // Append new row
      sheet.appendRow(rowData);
      targetRow = sheet.getLastRow();
    }

    // Style the row
    var rowRange = sheet.getRange(targetRow, 1, 1, 6);
    rowRange.setHorizontalAlignment('right');

    // Color code based on attendance status
    var statusCell = sheet.getRange(targetRow, 4);
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
        message: isUpdate ? 'RSVP updated successfully' : 'RSVP saved successfully',
        row: targetRow,
        isUpdate: isUpdate
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
 * Test function - tests the update functionality
 * Run this after testAddRow to verify updates work
 */
function testUpdateRow() {
  var testData = {
    postData: {
      contents: JSON.stringify({
        name: 'בדיקה - ישראל ישראלי (עודכן)',
        phone: '050-1234567', // Same phone as testAddRow
        attendance: 'לא מגיע/ה',
        guests: 0,
        blessing: 'מצטערים, לא נוכל להגיע'
      })
    }
  };

  var result = doPost(testData);
  var response = JSON.parse(result.getContent());

  if (response.isUpdate) {
    SpreadsheetApp.getUi().alert('✅ השורה עודכנה בהצלחה!\n\nבדוק שהשורה הקיימת עודכנה ולא נוספה שורה חדשה.');
  } else {
    SpreadsheetApp.getUi().alert('⚠️ נוספה שורה חדשה במקום עדכון.\n\nבדוק שמספר הטלפון תואם.');
  }
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
