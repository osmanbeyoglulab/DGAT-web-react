// backend/azure/emailService.js
const { EmailClient } = require("@azure/communication-email");

async function sendAnalysisCompleteEmail(requestorEmail, fileName, analysisResults) {
  try {
    const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING;
    const senderAddress = process.env.AZURE_SENDER_EMAIL;

    const emailClient = new EmailClient(connectionString);

    const message = {
      senderAddress: senderAddress,
      content: {
        subject: `Analysis Complete: ${fileName}`,
        plainText: `Hello,\n\nYour document "${fileName}" has been successfully analyzed.\n\nResults:\n${analysisResults}\n\nThank you for using the DGAT System.`,
        html: `
          <h2>Analysis Complete</h2>
          <p>Hello,</p>
          <p>Your document <strong>"${fileName}"</strong> has been successfully analyzed.</p>
          <h3>Results:</h3>
          <pre style="background-color: #f4f4f4; padding: 10px; border-radius: 5px;">${analysisResults}</pre>
          <p>Thank you for using the DGAT System.</p>
        `,
      },
      recipients: {
        to: [
          {
            address: requestorEmail,
          },
        ],
      },
    };

    const poller = await emailClient.beginSend(message);
    const response = await poller.pollUntilDone();
    
    console.log(`✅ Email successfully sent to ${requestorEmail}. Status: ${response.status}`);
    return response;

  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
    throw error;
  }
}

module.exports = { sendAnalysisCompleteEmail };