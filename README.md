# WebSocket Debug Adapter

VS Code Debug Adapter for WebSockets

## Server

See the example in the `server` folder for running a remote server to connect to.

## Client

Build this extension using `yarn`.

Run this extension in a desktop extension host (Run And Debug > Desktop Extension).

-or-

Run this extension in https://vscode.dev using:

```bash
yarn serve
```

And then side-load the extension (CTRL+P > Developer: Install Extension from Location...).

Open the test-workspace folder and start the `WebSocket` or `Raw Socket` debug session.

## Architecture

<img width="1834" alt="websocket-adapter" src="https://user-images.githubusercontent.com/61341/232730730-e9336048-1f0f-4f30-ae7d-fc72144527d2.png">
