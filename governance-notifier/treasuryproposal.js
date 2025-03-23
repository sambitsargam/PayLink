const axios = require('axios');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
require('dotenv').config();

// --- Configuration for Email --- //
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your preferred email service
  auth: {
    user: process.env.USER,
    pass: process.env.PASS  // email password or app-specific password
  }
});
const emailRecipient = process.env.EMAIL; // recipient email address

// --- Configuration for Twilio WhatsApp --- //
const accountSid = process.env.SID; // your Twilio Account SID
const authToken = process.env.KEY;   // your Twilio Auth Token
const client = twilio(accountSid, authToken);
const whatsappFrom = 'whatsapp:+14155238886'; // your Twilio WhatsApp sender number (sandbox or verified)
const whatsappTo = process.env.TOW; // recipient's WhatsApp number

// Function to fetch proposals and send notifications if new proposals are found
const fetchProposals = () => {
  const data = JSON.stringify({
    "page": 0,
    "row": 10
  });

  const config = {
    method: 'post',
    url: 'https://polkadot.api.subscan.io/api/scan/treasury/proposals',
    headers: { 
      'X-Requested-With': '', 
      'User-Agent': 'Apidog/1.0.0 (https://apidog.com)', 
      'Content-Type': 'application/json', 
      'Accept': '*/*', 
      'Host': 'polkadot.api.subscan.io', 
      'Connection': 'keep-alive'
    },
    data: data
  };

  axios(config)
    .then((response) => {
      const result = response.data;
      console.log('Response:', JSON.stringify(result));

      const nowUnix = Math.floor(Date.now() / 1000); // current Unix timestamp (seconds)

      // Filter proposals where block_timestamp is within the last 10 seconds
      const newProposals = result.data.list.filter(proposal => {
        return (nowUnix - proposal.block_timestamp) <= 10;
      });

      if (newProposals.length > 0) {
        // Format the details for notifications
        const messageContent = newProposals.map(proposal => {
          // Use display name if available, else fallback to address
          const beneficiary = (proposal.beneficiary.people && proposal.beneficiary.people.display) 
            ? proposal.beneficiary.people.display 
            : proposal.beneficiary.address;
          const proposer = (proposal.proposer.people && proposal.proposer.people.display) 
            ? proposal.proposer.people.display 
            : proposal.proposer.address;
          return `Proposal ID: ${proposal.proposal_id}
Title: ${proposal.title}
Status: ${proposal.status}
Reward: ${proposal.reward}
Block Timestamp: ${proposal.block_timestamp}
Beneficiary: ${beneficiary}
Proposer: ${proposer}
----------------------------`;
        }).join('\n');

        // --- Send Email --- //
        const mailOptions = {
          from: process.env.USER,
          to: emailRecipient,
          subject: 'New Proposals Alert',
          text: `New proposals detected within the last 10 seconds:\n\n${messageContent}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });

        // --- Send WhatsApp Message via Twilio --- //
        client.messages
          .create({
            body: `New proposals detected:\n${messageContent}`,
            from: whatsappFrom,
            to: whatsappTo
          })
          .then(message => console.log('WhatsApp message sent with SID:', message.sid))
          .catch(error => console.error('Error sending WhatsApp message:', error));
      } else {
        console.log('No new proposals within the last 10 seconds.');
      }
    })
    .catch((error) => {
      console.error('Error fetching proposals:', error);
    });
};

// Run immediately and then every 10 seconds
fetchProposals();
setInterval(fetchProposals, 10000);
