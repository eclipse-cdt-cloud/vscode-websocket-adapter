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
import * as manifest from '../manifest';
import { SocketDescriptorFactory } from '../socket-descriptor-factory';
import { DebugLogger } from '../debug-logger';
import { DebugTracker } from '../debug-tracker';

export const activate = async (context: vscode.ExtensionContext): Promise<void> => {
    const socketDebugFactory = new SocketDescriptorFactory();
    const debugTracker = new DebugTracker([ manifest.DEBUG_TYPE ]);
    new DebugLogger(debugTracker);

    await socketDebugFactory.activate(context);
    await debugTracker.activate(context);
};
