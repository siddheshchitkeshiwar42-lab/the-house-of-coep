/**
 * COEP Merchandise Store - Secure Google Sheets Order Handler
 * Author: COEP Merchandise Team
 */

// 🔒 OFFICIAL AUTHORIZED MERCHANT CONFIGURATION (Locked on Server)
var AUTHORIZED_MERCHANT_UPI = "9730492964-2@ybl";
var SHEET_NAME = "Sheet1"; // Change if your sheet tab has a different name

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // Prevent concurrent write race conditions

  try {
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();

    // Sanitize & format incoming fields
    var timestamp = data.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    var orderId = data.orderId || "COEP-" + new Date().getTime();
    var customerName = data.customerName || data.fullName || "COEP Buyer";
    var email = data.email || "N/A";
    var mobile = data.mobile || data.phone || "N/A";
    
    // Fix: Separate MIS ID and Department properly with fallback to "N/A"
    var coepId = (data.coepId && String(data.coepId).trim() !== "") ? String(data.coepId).trim() : (data.misId || data.mis || data.rollNo || "N/A");
    var department = data.department || "N/A";
    
    var deliveryType = data.deliveryType || "delivery";
    var hostelNote = data.hostelNote || data.address || "COEP Campus";
    var city = data.city || "Pune";
    var state = data.state || "Maharashtra";
    var pincode = data.pincode || "411005";
    var products = data.products || "COEP Item";
    var subtotal = Number(data.subtotal) || 0;
    var deliveryCharge = Number(data.deliveryCharge) || 0;
    var totalAmount = Number(data.totalAmount) || 0;
    var paymentStatus = data.paymentStatus || "PAID";
    var transactionId = data.transactionId || "N/A";
    var orderStatus = data.orderStatus || "New";

    // 🛡️ SECURITY GUARD: Strictly record verified server-side UPI ID
    var securedUpiId = AUTHORIZED_MERCHANT_UPI;

    // Append to Sheet Ledger (Matching your exact 19/20 columns order)
    sheet.appendRow([
      timestamp,       // Col A: Timestamp
      customerName,    // Col B: Full Name
      email,           // Col C: Email Address
      mobile,          // Col D: Mobile Number
      coepId,          // Col E: COEP MIS ID / Roll No (writes "N/A" if not provided)
      department,      // Col F: Department / Branch
      deliveryType,    // Col G: Delivery Preference
      hostelNote,      // Col H: Hostel Room / Address
      city,            // Col I: City
      state,           // Col J: State
      pincode,         // Col K: Pincode
      products,        // Col L: Products
      subtotal,        // Col M: Total Product Amount / Subtotal
      deliveryCharge,  // Col N: Delivery Charge
      totalAmount,     // Col O: Final Total
      orderId,         // Col P: Order ID
      paymentStatus,   // Col Q: Payment Status
      transactionId,   // Col R: Transaction ID / UTR
      orderStatus,     // Col S: Order Status
      securedUpiId     // Col T: Verified Merchant UPI
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: "Order securely recorded", orderId: orderId }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "active", merchantUpi: AUTHORIZED_MERCHANT_UPI, message: "COEP Merch API Active" }))
    .setMimeType(ContentService.MimeType.JSON);
}
