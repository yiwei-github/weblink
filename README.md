# Weblink

## Introduction

Weblink is a browser-based chat application built on WebRTC, requiring no downloads and usable directly in your browser. It offers a serverless, P2P architecture with multiple backends, including Firebase and WebSocket. The application supports real-time text chat, file transfer, file storage, video calls, and multi-party communication through a mesh network. Advanced features include chunked and compressed file transfers for efficient and resumable large file sharing, multi-channel data transfer using multiple DataChannels for faster performance, and IndexedDB caching to minimize memory usage during transfers. End-to-end encryption ensures privacy and security with encrypted signaling messages.

This project is deployed on Vercel. Check it out at [https://web1ink.vercel.app](https://web1ink.vercel.app).

You can also use [https://webl.ink](https://webl.ink) which deployed on aliyun instead.

[**中文介绍**](README_CN.md)

## Usage

### Run Locally

```bash
git clone https://github.com/yiwei-github/weblink.git
cd weblink
pnpm install
```

Make sure you configure the Firebase keys in the project (as shown below), then run the following command:

```bash
# Development
pnpm dev
# Build
pnpm build
```

### Deploy to Docker

You can deploy this project to Docker using `docker-compose.yaml`, and it will automatically build the [weblink-ws-server](https://github.com/99percentpeople/weblink-ws-server) as backend.

Modify the `docker-compose.yaml` file to set the correct environment variables. Then run the following command:

```bash
docker-compose up -d
```

To enable SSL you need to provide the SSL certificate `cert.pem` and key `key.pem` files in the `docker/ssl` directory. And run the following command:

```bash
ENABLE_SSL=true docker-compose up -d
```

Alternatively, you can also use Dockerfile to deploy this project to Docker.

### Deploy to Vercel

To deploy this project to Vercel, follow these steps:

1. Go to the Vercel website and log in (or create an account).

2. Connect your GitHub repository and select the cloned repository.

3. In your Vercel project settings, find "Environment Variables" and add the Firebase API key and other environment variables (as shown below).

4. Click the "Deploy" button, and Vercel will automatically build and deploy your project.

### Environment Variables Configuration (Firebase)

You will need to configure Firebase keys for both local development and deployment to Vercel. Add the following Firebase environment variables:

`VITE_FIREBASE_API_KEY`

`VITE_FIREBASE_AUTH_DOMAIN`

`VITE_FIREBASE_PROJECT_ID`

`VITE_FIREBASE_STORAGE_BUCKET`

`VITE_FIREBASE_MESSAGING_SENDER_ID`

`VITE_FIREBASE_APP_ID`

`VITE_FIREBASE_DATABASE_URL`

### Vercel Environment Variables Configuration

For Vercel deployment, set the environment variables by following these steps:

1. Open your Vercel project and go to "Settings."

2. Find "Environment Variables."

3. Add the Firebase configuration items above and input the corresponding values.

### WEBSOCKET Configuration

This application can deploy its own WEBSOCKET server, and a WEBSOCKET server is provided. You can choose to use it or not. For details, please refer to [weblink-ws-server](https://github.com/99percentpeople/weblink-ws-server).

### Local Environment Variables (.env.local)

For local development, create a .env.local file and add the Firebase keys:

```env
# backend choose FIREBASE or WEBSOCKET

# FIREBASE
VITE_BACKEND=FIREBASE
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
VITE_FIREBASE_APP_ID=your-firebase-app-id
VITE_FIREBASE_DATABASE_URL=your-database-url

# WEBSOCKET
VITE_BACKEND=WEBSOCKET
VITE_WEBSOCKET_URL=your-websocket-url
```

## Notes

### Configuring TURN Server (Non-LAN Connections)

If you are using P2P connections outside a local area network (in a NAT environment), you may need to configure a TURN server to ensure connections are established. In the settings page, you can configure the TURN server with the following format:

**TURN Configuration Format:**

```plaintext
turn:turn1.example.com:3478|user1|pass1|longterm
turns:turn2.example.com:5349|user2|pass2|hmac
```

### Use in LAN

The application currently supports LAN use in non-secure environments. Ensure that your devices are in the same LAN and the firewall does not block P2P connections.

And at the same time, run [weblink-ws-server](https://github.com/99percentpeople/weblink-ws-server) to support WEBSOCKET connections.

## Contribution

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is open-sourced under the [MIT License](LICENSE).
