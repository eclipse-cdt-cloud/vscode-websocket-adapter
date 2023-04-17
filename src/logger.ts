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

export enum Verbosity {
    off = 0,
    error = 1,
    warn = 2,
    info = 3,
    debug = 4
}

export class Logger {
    public static instance = new Logger();

    protected outputChannel = vscode.window.createOutputChannel(manifest.DISPLAY_NAME);
    protected logVerbosity: Verbosity;

    protected constructor() {
        this.logVerbosity = this.getVerbosity();
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration(`${manifest.PACKAGE_NAME}.${manifest.CONFIG_LOGGING_VERBOSITY}`)) {
                this.logVerbosity = this.getVerbosity();
            }
        });
    }

    public getVerbosity(): Verbosity {
        const config = vscode.workspace.getConfiguration(manifest.PACKAGE_NAME).get<string>(manifest.CONFIG_LOGGING_VERBOSITY) || manifest.DEFAULT_LOGGING_VERBOSITY;
        return Verbosity[config as keyof typeof Verbosity];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public log(verbosity: Verbosity, message: string | any): void {
        if (this.logVerbosity === Verbosity.off) {
            return;
        }

        if (typeof message !== 'string') {
            message = JSON.stringify(message, undefined, '\t');
        }

        if (verbosity <= this.logVerbosity) {
            this.outputChannel.appendLine(message);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public error = (message: string | any): void => this.log(Verbosity.error, message);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public warn = (message: string | any): void => this.log(Verbosity.warn, message);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public info = (message: string | any): void => this.log(Verbosity.info, message);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public debug = (message: string | any): void => this.log(Verbosity.debug, message);
}

export const logger = Logger.instance;
