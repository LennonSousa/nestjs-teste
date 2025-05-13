import { pino } from 'pino';

export class Logger {
  private context?: string;
  private logger: pino.Logger;

  constructor(context?: string) {
    this.context = context;

    this.logger = pino();
  }

  setContext(context: string) {
    this.context = context;
  }

  log(message: any, extra?: any) {
    this.logger.info({
      context: this.context,
      data: extra,
      msg: message,
    });
  }

  info(message: any, extra?: any) {
    this.logger.info({
      context: this.context,
      data: extra,
      msg: message,
    });
  }

  error(message: any, extra?: any) {
    this.logger.error({
      context: this.context,
      data: extra,
      msg: message,
    });
  }

  debug(message: any, extra?: any) {
    this.logger.debug({
      context: this.context,
      data: extra,
      msg: message,
    });
  }

  warn(message: any, extra?: any) {
    this.logger.warn({
      context: this.context,
      data: extra,
      msg: message,
    });
  }
}
