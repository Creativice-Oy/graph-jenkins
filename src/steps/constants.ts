import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const ACCOUNT_ENTITY_KEY = 'entity:account';
export const Steps = {
  ACCOUNT: 'fetch-account',
  USER: 'fetch-users',
  REPOSITORY: 'fetch-repository',
  ROLE: 'fetch-roles',
  BUILD_USER__ROLE_RELATIONSHIPS: 'build-user-and-role-relationships',
};

export const Entities: Record<
  'ACCOUNT' | 'USER' | 'REPOSITORY' | 'ROLE',
  StepEntityMetadata
> = {
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'jenkins_account',
    _class: ['Account'],
  },
  REPOSITORY: {
    resourceName: 'Repository',
    _type: 'jenkins_repository',
    _class: ['Repository'],
  },

  USER: {
    resourceName: 'User',
    _type: 'jenkins_user',
    _class: ['User'],
  },
  ROLE: {
    resourceName: 'Role',
    _type: 'jenkins_role',
    _class: ['AccessRole'],
  },
};

export const Relationships: Record<
  | 'ACCOUNT_HAS_USER'
  | 'ACCOUNT_HAS_REPOSITORY'
  | 'ACCOUNT_HAS_ROLE'
  | 'USER_HAS_ROLE',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_USER: {
    _type: 'jenkins_account_has_user',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  ACCOUNT_HAS_REPOSITORY: {
    _type: 'jenkins_account_has_repository',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.REPOSITORY._type,
  },
  ACCOUNT_HAS_ROLE: {
    _type: 'jenkins_account_has_role',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.ROLE._type,
  },
  USER_HAS_ROLE: {
    _type: 'jenkins_user_has_role',
    sourceType: Entities.USER._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.ROLE._type,
  },
};
