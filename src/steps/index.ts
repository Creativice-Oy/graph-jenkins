import { accountSteps } from './account';
import { userSteps } from './user';
import { repositorySteps } from './repository';
import { roleSteps } from './role';

const integrationSteps = [
  ...accountSteps,
  ...userSteps,
  ...repositorySteps,
  ...roleSteps,
];

export { integrationSteps };
