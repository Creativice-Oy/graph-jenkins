import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const deviceGroupSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: {HOSTNAME}/role-strategy/strategy/getAllRoles?type={roleType}
     * PATTERN: Fetch Entities
     */
    id: 'fetch-roles',
    name: 'Fetch Roles',
    entities: [
      {
        resourceName: 'Role',
        _type: 'jenkins_role',
        _class: ['AccessRole'],
      },
    ],
    relationships: [
      {
        _type: 'jenkins_account_has_role',
        sourceType: 'jenkins_account',
        _class: RelationshipClass.HAS,
        targetType: 'jenkins_role',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
];
