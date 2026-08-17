import { z } from 'zod';

const environmentSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().min(1).max(65_535).default(3000),
});

export type RuntimeEnvironment = z.infer<typeof environmentSchema>['NODE_ENV'];

export interface AppConfig {
  readonly runtime: {
    readonly environment: RuntimeEnvironment;
  };
  readonly http: {
    readonly port: number;
  };
}

interface EnvironmentValidationIssue {
  readonly message: string;
  readonly path: readonly PropertyKey[];
}

export class EnvironmentValidationError extends Error {
  constructor(issues: readonly EnvironmentValidationIssue[]) {
    const details = issues
      .map(
        (issue) =>
          `${issue.path.map((segment) => String(segment)).join('.')}: ${issue.message}`,
      )
      .join('; ');

    super(`Environment validation failed: ${details}`);
    this.name = 'EnvironmentValidationError';
  }
}

export function parseEnvironment(
  environment: Readonly<Record<string, string | undefined>>,
): AppConfig {
  const result = environmentSchema.safeParse(environment);

  if (!result.success) {
    throw new EnvironmentValidationError(result.error.issues);
  }

  return Object.freeze({
    runtime: Object.freeze({
      environment: result.data.NODE_ENV,
    }),
    http: Object.freeze({
      port: result.data.PORT,
    }),
  });
}
