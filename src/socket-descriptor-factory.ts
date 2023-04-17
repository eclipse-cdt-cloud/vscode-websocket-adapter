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
import * as manifest from './manifest';
import { SocketDebugSession } from './socket-debug-session';

export class SocketDescriptorFactory implements vscode.DebugAdapterDescriptorFactory {
    public async activate(context: vscode.ExtensionContext): Promise<void> {
        context.subscriptions.push(
            vscode.debug.registerDebugAdapterDescriptorFactory(manifest.DEBUG_TYPE, this)
        );
    }

    public async createDebugAdapterDescriptor(session: vscode.DebugSession, _executable: vscode.DebugAdapterExecutable | undefined): Promise<vscode.DebugAdapterDescriptor | undefined> {
        // Create inline adapter
        const armSession = new SocketDebugSession(session.configuration.address, session.configuration.pathMapping);
        return new vscode.DebugAdapterInlineImplementation(armSession);
    }
}
