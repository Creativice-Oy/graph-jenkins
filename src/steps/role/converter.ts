import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { JenkinsRole } from '../../types';
import { Entities } from '../constants';

export function getRoleKey(id: string): string {
  return `jenkins_role:${id}`;
}

export function createRoleEntity(role: JenkinsRole): Entity {
  return createIntegrationEntity({
    entityData: {
      source: role,
      assign: {
        _type: Entities.ROLE._type,
        _class: Entities.ROLE._class,
        _key: getRoleKey(role.name.toString()),

        name: role.name,
        roleType: role.roleType,
        modelViewDelete: role.modelViewDelete,
        modelComputerConnect: role.modelComputerConnect,
        modelRunDelete: role.modelRunDelete,
        CredentialsProviderManageDomains: role.CredentialsProviderManageDomains,
        modelComputerCreate: role.modelComputerCreate,
        modelViewConfigure: role.modelViewConfigure,
        modelComputerBuild: role.modelComputerBuild,
        modelItemConfigure: role.modelItemConfigure,
        modelHudsonAdminister: role.modelHudsonAdminister,
        modelItemCancel: role.modelItemCancel,
        modelItemRead: role.modelItemRead,
        CredentialsProviderView: role.CredentialsProviderView,
        modelComputerDelete: role.modelComputerDelete,
        modelItemBuild: role.modelItemBuild,
        SCMTag: role.SCMTag,
        modelItemMove: role.modelItemMove,
        modelItemDiscover: role.modelItemDiscover,
        modelHudsonRead: role.modelHudsonRead,
        CredentialsProviderUpdate: role.CredentialsProviderUpdate,
        modelItemCreate: role.modelItemCreate,
        modelItemWorkspace: role.modelItemWorkspace,
        CredentialsProviderDelete: role.CredentialsProviderDelete,
        modelComputerProvision: role.modelComputerProvision,
        modelRunReplay: role.modelRunReplay,
        modelViewRead: role.modelViewRead,
        modelViewCreate: role.modelViewCreate,
        modelItemDelete: role.modelItemDelete,
        modelComputerConfigure: role.modelComputerConfigure,
        CredentialsProviderCreate: role.CredentialsProviderCreate,
        modelComputerDisconnect: role.modelComputerDisconnect,
        modelRunUpdate: role.modelRunUpdate,
      },
    },
  });
}
