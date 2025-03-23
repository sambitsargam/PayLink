import express from 'express';
import bodyParser from 'body-parser';
import { uniswap } from "@goat-sdk/plugin-uniswap";
import { modespray } from "@goat-sdk/plugin-modespray";
import { pumpfun } from "@goat-sdk/plugin-pumpfun";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { opensea } from "@goat-sdk/plugin-opensea";
import { http } from "viem";
import { createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mantleSepoliaTestnet } from "viem/chains";
import twilio from "twilio";
import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { USDC, erc20 } from "@goat-sdk/plugin-erc20";
import { kim } from "@goat-sdk/plugin-kim";
import { coingecko } from "@goat-sdk/plugin-coingecko";
import { sendETH } from "@goat-sdk/wallet-evm";
import { viem } from "@goat-sdk/wallet-viem";
import { modeGovernance } from "@goat-sdk/plugin-mode-governance";


require("dotenv").config();
const app = express();
app.use(bodyParser.json()); // for parsing application/json

const account = privateKeyToAccount(process.env.KEY as `0x${string}`);

const walletClient = createWalletClient({
    account: account,
    transport: http(process.env.RPC_PROVIDER_URL),
    chain: mantleSepoliaTestnet
    ,
});

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


(async () => {
    const tools = await getOnChainTools({
        wallet: viem(walletClient),
        plugins: [
            sendETH(),
            erc20({
                tokens: [{
                    decimals: 18,
                    symbol: "USDC",
                    name: "USDC Coin",
                    chains: {
                        "5003": {
                            contractAddress: "0xAcab8129E2cE587fD203FD770ec9ECAFA2C88080",
                        },
                    },
                },
                {
                    decimals: 18,
                    symbol: "MNT",
                    name: "Mantle Token",
                    chains: {
                        "5003": {
                            contractAddress: "0x0000000000000000000000000000000000000000",
                        },
                    },
                },]
            }),
           // kim(),
          //  modespray(),
            coingecko({ apiKey: "CG-omKTqVxpPKToZaXWYBb8bCJJ" }),
            opensea(process.env.OPENSEA_API_KEY as string),
            // pumpfun(),
           // modeGovernance(),
        ],
    });

    const app = express();
    // Parse URL-encoded bodies (as sent by HTML forms)
    app.use(bodyParser.urlencoded({ extended: true }));

    // Parse JSON bodies (as sent by API clients)
    app.use(bodyParser.json());

    app.post("/api/send-whatsapp", async (req, res) => {
        console.log("Headers:", req.headers);
        console.log("Body:", req.body);
        const from = req.body.From;  // The sender's phone number
        let body = req.body.Body;
        console.log("Received WhatsApp message from", from, "with body:", body);
        // if body contain Sam then change Sam to 0x90D9CD66FAdFF1C2Ba32C99A47C76532d08A704B
        if (body.includes("Sam")) {
            body = body.replace("Sam", "0x90D9CD66FAdFF1C2Ba32C99A47C76532d08A704B");
        }

        // if body include zksync then post the body into 3001 port
        if (body.includes("zksync")) {
            const response = await fetch('http://localhost:3001/api/send-whatsapp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ From: from, Body: body }),
                });
            } else {

        try {
            const result = await generateText({
                model: openai("gpt-4o"),
                tools: tools,
                maxSteps: 10,
                prompt: body,
            });

            console.log("AI response:", result.text);

            const message = await twilioClient.messages.create({
                to: `${from}`,
                from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
                body: result.text
            });
            res.json({ success: true, message: "WhatsApp message sent with AI response.", sid: message.sid });
        } catch (error) {
            const message = await twilioClient.messages.create({
                to: `${from}`,
                from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
                body: "Sorry, Currenlty I am not able to process your request. Please try again later."
            });

            console.error("Failed to send WhatsApp message with AI response:", error);
            res.status(500).json({ success: false, message: "Failed to send WhatsApp message." });
        }
    
    }
}
);

    // SMS and WhatsApp message handling with AI text generation
    app.post("/api/send-sms", async (req, res) => {
        const { to, body } = req.body;

        try {
            const result = await generateText({
                model: openai("gpt-4o"),
                tools: tools,
                maxSteps: 10,
                prompt: body,
            });

            const message = await twilioClient.messages.create({
                to: to,
                from: process.env.TWILIO_SMS_NUMBER,
                body: result.text
            });
            res.json({ success: true, message: "SMS sent with AI response.", sid: message.sid });
        } catch (error) {
            console.error("Failed to send SMS with AI response:", error);
            res.status(500).json({ success: false, message: "Failed to send SMS." });
        }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
    module.exports = app;
})();
