# Tornado
![Tornano](data/img/logo-removebg-preview.png)

The Nano cryptocurrency anonymization program is a system designed to enhance the privacy of transactions made with the Nano cryptocurrency. It provides a means to conceal the origin of funds and make transactions more difficult to trace.

The main goal of this program is to protect users' privacy by masking the links between the sending and receiving addresses of Nano transactions. It implements various anonymization techniques to make transactions harder to trace and associate with specific identities.

The program utilizes a combination of features and protocols to achieve this goal:

1. Wallet generation: It generates additional Nano wallets, allowing for temporary addresses to be created for each transaction and obfuscating the trail.

2. Amount splitting: It divides transaction amounts into smaller fractions, making it harder to identify exact amounts and correlate different transactions.

3. Transaction mixing: It combines transactions from multiple users to create additional confusion about the source of funds. This makes tracking transaction flows much more complex.

4. Use of anonymous nodes: The program connects to anonymous nodes to perform transactions, adding an extra layer of privacy by masking the user's IP address.

5. Random transaction delay: It introduces random delays between transactions to further disrupt the temporal correlation of transactions and make traceability more difficult.

6. Protection against blockchain analysis: The program considers the potential risks of blockchain analysis and implements countermeasures to minimize the chances of discovering the true origin of funds.

The entire anonymization process is automated and integrated into a user-friendly interface. Users simply provide transaction details such as the destination address and amount, and the program takes care of the rest by applying appropriate anonymization techniques.

It is important to note that this program does not guarantee absolute anonymity but aims to make Nano transactions more resistant to analysis and strengthen user privacy.

## Architecture:

```bash
- `package.json`
- `package-lock.json`
- `index.js`
- `Dockerfile`
- `tools/`
  - `db.js`
  - `verify_key.js`
- `proxy/`
  - `http.js`
  - `ws.js`
- `config/`
  - `general.json`
  - `nodes.json`
  - `pow.json`
  - `roles.json`
- `start/`
  - `index.js`
  - `receive.js`
  - `cycle.js`
- `README.md`
- `config/`
  - `server.json`
  - `nanswap.json`
  - `db.json`
  - `general.json`
- `modules/`
  - `db.js`
  - `accounts.js`
  - `send.js`
```

## Installation
```bash
npm install
node index.js
```

## Docker
```bash
sudo docker build -t tornano:latest .
sudo docker run -d -p 3000:3000 tornano:latest 
```

## DON ❤️

Nano: `nano_3ktmq6dpwcc694hrnjzfdykbqeuj4w5w8nut3uqm5pgwa4m9jmstoc4ntu6p`

## Contact

Discord: @myecoria <br>
Instagram: @myecoria <br>
Twitter: @myecoria <br>
Mail: contact@myecoria.com <br>