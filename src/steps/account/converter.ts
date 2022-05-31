import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';

export function getAccountKey(name: string): string {
  return `jenkins_account:${name}`;
}

export function createAccountEntity(account: { accountName: string }): Entity {
  return createIntegrationEntity({
    entityData: {
      source: account,
      assign: {
        _key: getAccountKey(account.accountName),
        _type: Entities.ACCOUNT._type,
        _class: Entities.ACCOUNT._class,
        name: account.accountName,
      },
    },
  });
}
