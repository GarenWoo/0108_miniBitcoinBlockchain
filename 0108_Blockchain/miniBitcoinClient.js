import express from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import Blockchain from './components/Blockchain';
import Transaction from './components/Transaction';

const app = express();
app.use(bodyParser.json());
const nodeIdentifier = uuidv4().replace(/-/g, '');
const blockchain = new Blockchain();

app.get('/mine', (req, res) => {
    res.send("We'll mine a new Block");
});

app.post('/transactions/new', (req, res) => {
    const { sender, recipient, amount, fee, signature } = req.body;
    if (!sender || !recipient || amount == null) {
        return res.status(400).send('Missing values');
    }
    const index = new Transaction(sender, recipient, amount, fee, signature);
    const response = { message: `Transaction will be added to Block ${index}` };
    return res.status(201).json(response);
});

app.get('/chain', (req, res) => {
    const response = {
        chain: blockchain.chain,
        length: blockchain.chain.length,
    };
    res.json(response);
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
