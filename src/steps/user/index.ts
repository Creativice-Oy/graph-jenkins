import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
  getRawData,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { JenkinsRole } from '../../types';

import { IntegrationConfig } from '../../config';
import {
  Entities,
  Relationships,
  Steps,
  ACCOUNT_ENTITY_KEY,
} from '../constants';

import { createUserEntity, getUserKey } from './converter';

import { getRoleKey } from '../role/converter';

export async function fetchUsers({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;
  //await apiClient.listAllRoles();
  await apiClient.iterateUsers(async (user) => {
    const userEntity = await jobState.addEntity(createUserEntity(user));
    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: accountEntity,
        to: userEntity,
      }),
    );
  });
}

export async function buildUserAndRoleRelationships({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  //const roleList = await apiClient.listAllRoles();

  await jobState.iterateEntities(
    { _type: Entities.ROLE._type },
    async (roleEntity) => {
      const role = getRawData<JenkinsRole>(roleEntity);
      if (!role) {
        logger.warn(
          { _key: roleEntity._key },
          'Could not get raw data for role entity',
        );
        return;
      }

      const isRoleEntity = await jobState.findEntity(
        getRoleKey(role.name.toString()),
      );

      if (isRoleEntity) {
        const roleMembers = await apiClient.getRoleMembers(role);
        for (const member of roleMembers) {
          const isUserEntity = await jobState.findEntity(getUserKey(member));

          if (isUserEntity) {
            await jobState.addRelationship(
              createDirectRelationship({
                _class: RelationshipClass.HAS,
                from: isUserEntity,
                to: isRoleEntity,
              }),
            );
          }
        }
      }
    },
  );
}

export const userSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.USER,
    name: 'Fetch Users',
    entities: [Entities.USER],
    relationships: [Relationships.ACCOUNT_HAS_USER],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchUsers,
  },
  {
    id: Steps.BUILD_USER__ROLE_RELATIONSHIPS,
    name: 'Build User and Role Relationships',
    entities: [],
    relationships: [Relationships.USER_HAS_ROLE],
    dependsOn: [Steps.USER, Steps.ROLE],
    executionHandler: buildUserAndRoleRelationships,
  },
];
