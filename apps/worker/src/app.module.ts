import { Module } from '@nestjs/common';
import { AppConfigModule } from '@nexusflow/config';

@Module({
  imports: [AppConfigModule],
})
export class AppModule {}
