import SlsWebLogger from 'js-sls-logger';

export default function (project, store, globalArgs) {
   const logger = new SlsWebLogger({
      host: 'cn-hangzhou.log.aliyuncs.com', project: project, logstore: store,
   });
   this.send = (topic, args) => logger.send({__topic__: topic}, globalArgs, args);
}
