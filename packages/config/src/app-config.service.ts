import type { AppConfig } from './environment.schema';

export class AppConfigService {
  constructor(private readonly config: AppConfig) {}

  get runtime(): AppConfig['runtime'] {
    return this.config.runtime;
  }

  get http(): AppConfig['http'] {
    return this.config.http;
  }
}
