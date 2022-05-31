import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { JenkinsUser } from '../../types';
import { Entities } from '../constants';

export function getUserKey(id: string): string {
  return `jenkins_user:${id}`;
}

export function createUserEntity(users: JenkinsUser): Entity {
  const userUrl = users.user.absoluteUrl;
  const lastSlash = userUrl.lastIndexOf('/');
  const userId = userUrl.substring(lastSlash + 1);

  return createIntegrationEntity({
    entityData: {
      source: users,
      assign: {
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        _key: getUserKey(userId),
        id: userId,
        lastChange: users.lastChange,
        project: users.project,
        userUrl: users.user.absoluteUrl,
        fullName: users.user.fullName,

        name: userId,
        username: userId,
        active: true,
      },
    },
  });
}
