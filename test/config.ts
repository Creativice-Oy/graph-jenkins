import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { StepTestConfig } from '@jupiterone/integration-sdk-testing';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { invocationConfig } from '../src';
import { IntegrationConfig } from '../src/config';

if (process.env.LOAD_ENV) {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}
const DEFAULT_USERNAME = 'dummy_username';
const DEFAULT_CLIENT_SECRET = 'dummy_secret';
const DEFAULT_HOSTNAME = 'default_url';

export const integrationConfig: IntegrationConfig = {
  userName: process.env.USER_NAME || DEFAULT_USERNAME,
  apiKey: process.env.API_KEY || DEFAULT_CLIENT_SECRET,
  hostName: process.env.HOST_NAME || DEFAULT_HOSTNAME,
};

export function buildStepTestConfigForStep(stepId: string): StepTestConfig {
  return {
    stepId,
    instanceConfig: integrationConfig,
    invocationConfig: invocationConfig as IntegrationInvocationConfig,
  };
}
