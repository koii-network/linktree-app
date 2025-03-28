# Koii Linktree Task 🌐

## Project Overview

Koii Linktree is a decentralized web application that allows users to create and share personalized link collections, similar to traditional linktree services but powered by blockchain technology. Users can create custom link profiles that can be shared across the web, with enhanced security and ownership through Koii's decentralized infrastructure.

### Key Features
- 🔒 Secure, decentralized link management
- 🌈 Customizable link profiles
- 🔗 Easy link sharing
- 🚀 Built on blockchain technology

## Technologies Used

- **Frontend**:
  - React (v18.2.0)
  - React Router
  - Chakra UI
  - Framer Motion

- **Blockchain & Web3**:
  - Ethereum (ethers.js)
  - Magic SDK
  - Web3.js
  - WAGMI

- **Additional Libraries**:
  - Axios
  - Formik
  - React Dropzone
  - Web3 Storage

## Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- Yarn package manager

### Installation Steps

1. Clone the repository
```bash
git clone https://github.com/your-org/koii-linktree.git
cd koii-linktree
```

2. Install dependencies
```bash
yarn install
```

3. Set up environment variables
```bash
# Copy sample environment file
cp .env.local.sample .env.local

# Edit .env.local and fill in necessary values
```

4. Start the development server
```bash
yarn start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
koii-linktree/
├── public/          # Static assets
├── src/             # Source code
│   ├── components/  # Reusable React components
│   ├── contexts/    # React context providers
│   ├── hooks/       # Custom React hooks
│   ├── pages/       # Top-level page components
│   ├── App.js       # Main application component
│   └── index.js     # Entry point
└── task-template-linktree/  # Backend task template
```

## Backend and Task Template

The project includes a `task-template-linktree` directory that contains the backend logic and Koii task implementation. To access backend code:

```bash
cd task-template-linktree
```

## Deployment

### Build for Production
```bash
yarn build
```

### Deployment Options
- Vercel
- Netlify
- IPFS (recommended for decentralized hosting)

## Configuration

### Environment Variables
- `REACT_APP_MAGIC_PUBLISHABLE_KEY`: Magic.link authentication key
- `REACT_APP_WALLET_CONNECT_PROJECT_ID`: WalletConnect project ID
- Add other required environment variables in `.env.local`

## Security Notes

🚨 **Important**: Never commit sensitive keys or credentials to the repository. Always use environment variables and `.env` files.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` file for more information.

## Deployed Version

Check out the live demo: [Koii Linktree](https://linktree.koii.network/linktree/0x07c3e160270ed08f307a49013f4b1ac37659e572)

---

Built with ❤️ by the Koii Network Team