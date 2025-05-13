
# 🦾 Defilord Frontend

The official frontend for **Defilord**, a decentralized finance platform offering:

- 💸 **Collateral-Free Borrowing** – Borrow up to 85% of idle capital without selling your assets
- 📈 **Tiered Investment Strategies** – Earn up to 50%+ APY via curated crypto products
- 🧠 **Automated Crypto Education** – Seamless blockchain onboarding for new users

Live Preview: [https://defilord-frontend.vercel.app](https://defilord-frontend.vercel.app)

---

## 🚀 Tech Stack

- **React + Vite** – blazing fast frontend
- **Ethers.js v6** – smart contract interaction
- **MetaMask Wallet Integration**
- **Smart UI Design** inspired by Kamino, Pendle & Euler

---

## 🛠️ Getting Started

```bash
git clone https://github.com/Richard-Famojuro/defilord-frontend.git
cd defilord-frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

To connect to contracts or APIs:

```
VITE_CONTRACT_ADDRESS=0xYourContract
VITE_NETWORK_ID=11155111
```

> Store in a `.env` file (not committed to Git)

---

## 📦 Build for Production

```bash
npm run build
```

Output goes to the `dist/` directory, ready for deployment.

---

## 🔗 Deployment

This project is auto-deployed via [Vercel](https://vercel.com/).

![Vercel](https://vercel.com/button)

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 📄 License

[MIT](LICENSE)
