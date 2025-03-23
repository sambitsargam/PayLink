const axios = require('axios');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
require('dotenv').config();

// --- Configuration for Email --- //
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your preferred email service
  auth: {
    user: process.env.USER,
    pass: process.env.PASS         // replace with your email password or app-specific password
  }
});
const emailRecipient = process.env.EMAIL; // recipient email address

// --- Configuration for Twilio WhatsApp --- //
const accountSid = process.env.SID; // your Twilio Account SID
const authToken = process.env.KEY;   // your Twilio Auth Token
const client = twilio(accountSid, authToken);
const whatsappFrom = 'whatsapp:+14155238886';   // your Twilio WhatsApp sender number (sandbox or verified)
const whatsappTo = process.env.TOW; // the recipient's WhatsApp number

// --- Function to fetch data and process posts --- //
const fetchData = () => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api.polkassembly.io/api/v1/listing/off-chain-posts?page=1&listingLimit=10&proposalType=discussions',
    headers: {
      'x-network': 'polkadot'
    }
  };

  axios.request(config)
    .then((response) => {
      const data = response.data;
      console.log(JSON.stringify(data));

      // Current time
      const now = new Date();

      // Filter posts created within the last 10 seconds
      const newPosts = data.posts.filter(post => {
        const postTime = new Date(post.created_at);
        const diff = now - postTime; // difference in milliseconds
        return diff <= 100000000;      // 10 seconds = 10000 ms
      });

      if (newPosts.length > 0) {
        // Format the message details
        const messageContent = newPosts.map(post => {
          return `Title: ${post.title}
Created At: ${post.created_at}
Username: ${post.username}
Comments: ${post.comments_count}
Tags: ${post.tags.join(', ')}
----------------------------`;
        }).join('\n');

        // --- Send Email --- //
        const mailOptions = {
          from: 'nistcloudcomputingclub@gmail.com',
          to: emailRecipient,
          subject: 'New Posts Alert',
          text: `New posts detected within the last 10 seconds:\n\n${messageContent}`
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
            body: `New posts detected:\n${messageContent}`,
            from: whatsappFrom,
            to: whatsappTo
          })
          .then(message => console.log('WhatsApp message sent with SID: ' + message.sid))
          .catch(error => console.error('Error sending WhatsApp message:', error));
      } else {
        console.log('No new posts within the last 10 seconds.');
      }
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
};

// Run immediately and then every 10 seconds
fetchData();
setInterval(fetchData, 10000);
