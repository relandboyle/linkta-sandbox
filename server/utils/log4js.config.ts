import { configure } from "log4js";


export const Log4jsConfig = (logLevel: string) => {
  configure({
    appenders: {
      app: {
        type: 'file',
        filename: 'app.log'
      },
      out: {
        type: 'stdout'
      }
    },
    categories: {
      default: {
        appenders: ['app', 'out'],
        level: logLevel
      }
    }
  });
}
