import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const repositorySpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: {HOSTNAME}/api/json
     * PATTERN: Fetch Entities
     */
    id: 'fetch-repository',
    name: 'Fetch Repository',
    entities: [
      {
        resourceName: 'Repository',
        _type: 'jenkins_repository',
        _class: ['Repository'],
      },
    ],
    relationships: [
      {
        _type: 'jenkins_account_has_user',
        sourceType: 'jenkins_account',
        _class: RelationshipClass.HAS,
        targetType: 'jenkins_user',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
];
