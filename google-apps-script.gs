/**
 * Limitless BioLabs — Stage 1 Lead Capture endpoint
 *
 * WHAT THIS DOES
 * Receives form submissions from the contact form on index.html and
 * appends one row per submission to this Google Sheet. Collects only
 * the non-PHI Stage 1 fields (name, email, role, goal, message,
 * whether a catalog was requested) — no health information ever
 * passes through this script or this sheet.
 *
 * ───────────────────────────────────────────────────────────────
 * SETUP (one-time, ~10 minutes)
 * ───────────────────────────────────────────────────────────────
 * 1. Create a new Google Sheet. Rename the first tab "Leads".
 * 2. In row 1, add these headers, one per column:
 *    Timestamp | Name | Email | Role | Goal | Message | Catalog Requested
 * 3. In the Sheet, go to Extensions > Apps Script.
 * 4. Delete any starter code in the editor and paste this entire file.
 * 5. Click Deploy > New deployment.
 *    - Click the gear icon next to "Select type" and choose "Web app".
 *    - Description: "Lead capture endpoint" (or anything you like).
 *    - Execute as: Me.
 *    - Who has access: Anyone.
 *    - Click Deploy.
 * 6. Authorize the script when prompted (it's your own script, this
 *    is Google's standard permission screen, not a third party).
 * 7. Copy the "Web app URL" you're given — it looks like:
 *    https://script.google.com/macros/s/XXXXXXXXXXXX/exec
 * 8. Paste that URL into index.html where it says
 *    SHEET_ENDPOINT = "PASTE_YOUR_WEB_APP_URL_HERE";
 *    (see the <script> section near the bottom of the file).
 *
 * If you ever edit this script after deploying, you need to create
 * a "New deployment" again (not just save) for changes to take effect,
 * or use "Manage deployments" > edit (pencil icon) > Version: New >
 * Deploy, which keeps the same URL.
 * ───────────────────────────────────────────────────────────────
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Leads')
      || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    var data = e.parameter;

    sheet.appendRow([
      new Date(),
      data.name || '',
      data.email || '',
      data.role || '',
      data.goal || '',
      data.message || '',
      data.catalog === 'yes' ? 'Yes' : 'No'
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Optional: lets you sanity-check the deployment by visiting the
 * Web App URL directly in a browser (a GET request). You should see
 * a small JSON message rather than an error page.
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'Lead capture endpoint is live.' }))
    .setMimeType(ContentService.MimeType.JSON);
}
