/*********************************************************************
 * Copyright (c) 2023 Arm Limited and others
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *********************************************************************/

import * as vscode from 'vscode';
import * as websocket from 'websocket-stream';
import { connect } from 'net';
import { DebugProtocol } from '@vscode/debugprotocol';
import { ProtocolServer } from '@vscode/debugadapter/lib/protocol';

const WEBSOCKET_REGEX = /^wss?:\/\/|^https?:\/\//;
const SOCKET_TIMEOUT = 10000;
const PATH_PREFIX = '"path":"';

export class SocketDebugSession extends ProtocolServer {
    protected adapter: DebugAdapter;

    public constructor(address: string, protected pathMapping?: { [key: string]: string }) {
        super();
        if (WEBSOCKET_REGEX.test(address)) {
            this.adapter = new WebsocketDebugAdapter(address);
        } else {
            if (vscode.env.uiKind === vscode.UIKind.Web) {
                throw new Error('Raw socket connections are not supported in the browser, use a websocket address');
            }
            this.adapter = new SocketDebugAdapter(address);
        }
        this.adapter.on('message', message => this.onMessage(message));
        this.adapter.on('error', (event: DebugProtocol.Event) => this.emit(event.event, event));
        this.adapter.on('close', (event: DebugProtocol.Event) => this.emit(event.event, event));
    }

    protected async dispatchRequest(request: DebugProtocol.Request): Promise<void> {
        const message = this.replacePaths(request, 'outgoing');
        this.adapter.send(message);
    }

    protected onMessage(message: DebugProtocol.ProtocolMessage): void {
        message = this.replacePaths(message, 'incoming');

        if (message.type === 'request') {
            // const request = message as DebugProtocol.Request;
            // this.sendRequest(request.command, request.arguments, 0, undefined as any);
        } else if (message.type === 'response') {
            const msg = message as DebugProtocol.Response;
            // sendResponse expects seq not to be set as it will add it's own
            msg.seq = 0;
            this.sendResponse(msg);
        } else if (message.type === 'event') {
            this.sendEvent(message as DebugProtocol.Event);
        }
    }

    protected replacePaths(message: DebugProtocol.ProtocolMessage, direction: 'incoming' | 'outgoing'): DebugProtocol.ProtocolMessage {
        if (!this.pathMapping) {
            return message;
        }

        let json = JSON.stringify(message);

        for (const [remote, local] of Object.entries(this.pathMapping)) {
            if (direction === 'incoming') {
                json = json.replace(new RegExp(PATH_PREFIX + remote, 'g'), PATH_PREFIX + local);
            } else {
                json = json.replace(new RegExp(PATH_PREFIX + local, 'g'), PATH_PREFIX + remote);
            }
        }

        return JSON.parse(json);
    }
}

abstract class DebugAdapter extends ProtocolServer {
    protected stream: NodeJS.ReadWriteStream;

    public constructor(address: string) {
        super();
        this.stream = this.createStream(address);
        super.start(this.stream, this.stream);
    }

    public handleMessage(message: DebugProtocol.ProtocolMessage): void {
        this.emit('message', message);
    }

    public send(message: DebugProtocol.ProtocolMessage) {
        const json = JSON.stringify(message);
        this.stream.write(`Content-Length: ${Buffer.byteLength(json, 'utf8')}\r\n\r\n${json}`, 'utf8');
    }

    protected abstract createStream(address: string): NodeJS.ReadWriteStream;
}

class SocketDebugAdapter extends DebugAdapter {
    protected createStream(address: string): NodeJS.ReadWriteStream {
        let port = 0;
        let host: string | undefined;

        const portParts = address.split(':');
        if (portParts.length === 2) {
            host = portParts[0];
            port = parseInt(portParts[1]);
        } else {
            port = parseInt(portParts[0]);
        }

        return connect({
            host,
            port,
            timeout: SOCKET_TIMEOUT
        });
    }
}

class WebsocketDebugAdapter extends DebugAdapter {
    protected createStream(address: string): NodeJS.ReadWriteStream {
        return websocket(address, {
            handshakeTimeout: SOCKET_TIMEOUT
        });
    }
}
