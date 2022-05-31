// Providers often supply types with their API libraries

export type JenkinsUser = {
  lastChange: string | null;
  project: string | null;
  user: {
    absoluteUrl: string;
    fullName: string;
  };

  id: string;
};

export type JenkinsRepository = {
  _class: string;
  name: string;
  url: string;
  color: string;
};

export type JenkinsRole = {
  name: string;
  roleType: string;

  modelViewDelete: string;
  modelComputerConnect: string;
  modelRunDelete: string;
  CredentialsProviderManageDomains: string;
  modelComputerCreate: string;
  modelViewConfigure: string;
  modelComputerBuild: string;
  modelItemConfigure: string;
  modelHudsonAdminister: string;
  modelItemCancel: string;
  modelItemRead: string;
  CredentialsProviderView: string;
  modelComputerDelete: string;
  modelItemBuild: string;
  SCMTag: string;
  modelItemMove: string;
  modelItemDiscover: string;
  modelHudsonRead: string;
  CredentialsProviderUpdate: string;
  modelItemCreate: string;
  modelItemWorkspace: string;
  CredentialsProviderDelete: string;
  modelComputerProvision: string;
  modelRunReplay: string;
  modelViewRead: string;
  modelViewCreate: string;
  modelItemDelete: string;
  modelComputerConfigure: string;
  CredentialsProviderCreate: string;
  modelComputerDisconnect: string;
  modelRunUpdate: string;
};
