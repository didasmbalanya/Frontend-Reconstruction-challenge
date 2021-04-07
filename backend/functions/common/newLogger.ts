import * as logform from 'logform';
import { LEVEL, MESSAGE } from 'triple-beam';
import winston, { Logger } from 'winston';

const loggers: Record<string, Logger> = {};

export const PRETTY_PRINT = winston.format.combine(
    winston.format.splat(),
    winston.format.json(),
    winston.format.prettyPrint(),
);

export default function newLogger(name, format?: logform.Format) {
    if (!loggers[name]) {
        loggers[name] = winston.loggers.add(name, {
            transports: [
                new winston.transports.Console({
                    format:
                        format ??
                        winston.format.combine(
                            winston.format.label({
                                label: name,
                            }),
                            winston.format.splat(),
                            winston.format.simple(),
                        ),
                    log(info, callback) {
                        setImmediate(() => this.emit('logged', info));

                        if (this.stderrLevels[info[LEVEL]]) {
                            console.error(info[MESSAGE]);

                            if (callback) {
                                callback();
                            }
                            return;
                        }

                        console.log(info[MESSAGE]);

                        if (callback) {
                            callback();
                        }
                    },
                }),
            ],
        });
    }
    return loggers[name];
}
