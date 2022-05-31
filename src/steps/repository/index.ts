import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import {
  Entities,
  Relationships,
  Steps,
  ACCOUNT_ENTITY_KEY,
} from '../constants';
import { createRepositoryEntity } from './converter';

export async function fetchRepos({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await apiClient.iterateRepos(async (repository) => {
    if (repository._class == 'hudson.model.FreeStyleProject') {
      const repositoryEntity = await jobState.addEntity(
        createRepositoryEntity(repository),
      );

      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: accountEntity,
          to: repositoryEntity,
        }),
      );
    }
  });
}

export const repositorySteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.REPOSITORY,
    name: 'Fetch Repository',
    entities: [Entities.REPOSITORY],
    relationships: [Relationships.ACCOUNT_HAS_REPOSITORY],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchRepos,
  },
];
