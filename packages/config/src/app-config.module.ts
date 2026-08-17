import { Global, Module } from '@nestjs/common';

import { AppConfigService } from './app-config.service';
import { parseEnvironment } from './environment.schema';

@Global()
@Module({
  providers: [
    {
      provide: AppConfigService,
      useFactory: (): AppConfigService =>
        new AppConfigService(parseEnvironment(process.env)),
    },
  ],
  exports: [AppConfigService],
})
export class AppConfigModule {}
