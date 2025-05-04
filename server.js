const express = require("express");
const midtransClient = require("midtrans-client");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Konfigurasi Midtrans (gunakan Sandbox dulu)
const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: 'SB-Mid-server-9tlXqGDq24bM-M_bdQ_pi5Bk',
});

app.post("/create-transaction", async (req, res) => {
    try {
        const parameter = {
            transaction_details: {
                order_id: 'ORDER-' + Math.floor(Math.random() * 1000000),
                gross_amount: req.body.amount, // jumlah bayar dari React
            },
            credit_card: {
                secure: true
            },
            customer_details: {
                first_name: req.body.name || "Guest",
                email: req.body.email || "guest@example.com"
            }
        };

        const transaction = await snap.createTransaction(parameter);
        res.json({ token: transaction.token });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(3001, () => {
    console.log("Server listening on port 3001");
});
