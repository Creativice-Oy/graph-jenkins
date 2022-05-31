import fetch, { Response } from 'node-fetch';
import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';
import { retry } from '@lifeomic/attempt';

import { IntegrationConfig } from './config';
import { JenkinsUser, JenkinsRepository, JenkinsRole } from './types';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

/**
 * An APIClient maintains authentication state and provides an interface to
 * third party data APIs.
 *
 * It is recommended that integrations wrap provider data APIs to provide a
 * place to handle error responses and implement common patterns for iterating
 * resources.
 */
export class APIClient {
  constructor(readonly config: IntegrationConfig) {}

  private baseUri = this.config.hostName;
  private withBaseUri = (path: string) => `${this.baseUri}${path}`;
  private roleTypes = ['globalRoles', 'projectRoles', 'slaveRoles'];
  private checkStatus = (response: Response) => {
    if (response.ok) {
      return response;
    } else {
      throw new IntegrationProviderAPIError(response);
    }
  };

  private async getRequest(endpoint: string, method: 'GET'): Promise<Response> {
    const auth =
      'Basic ' +
      Buffer.from(
        `${this.config.userName}` + ':' + `${this.config.apiKey}`,
      ).toString('base64');
    try {
      const options = {
        method,
        headers: {
          //Authorization: `Basic Y3JlYXRpdmljZWFkbWluOjExZjJkN2JmMTM1Njg1MzNjODYyMWNiYzE3ZDhhYjE3ZjU=`,
          Authorization: auth,
        },
      };

      const response = await retry(
        async () => {
          const res: Response = await fetch(endpoint, options);
          this.checkStatus(res);
          return res;
        },
        {
          delay: 5000,
          factor: 2,
          maxAttempts: 5,
          minDelay: 100,
          maxDelay: 500,
          jitter: true,
          handleError: (err, context) => {
            if (
              err.statusCode !== 429 ||
              ([500, 502, 503].includes(err.statusCode) &&
                context.attemptNum > 1)
            ) {
              context.abort();
            }
          },
        },
      );

      return response.json();
    } catch (err) {
      throw new IntegrationProviderAPIError({
        endpoint: endpoint,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  private async paginatedUserRequest<T>(
    uri: string,
    method: 'GET',
    iteratee: ResourceIteratee<T>,
  ): Promise<void> {
    let next = [];

    do {
      const response = await this.getRequest(uri, method);
      for (const item of response.users) {
        await iteratee(item);
      }
      next = response;
    } while (next.length);
  }

  private async paginatedRepositoryRequest<T>(
    uri: string,
    method: 'GET',
    iteratee: ResourceIteratee<T>,
  ): Promise<void> {
    let next = [];

    do {
      const response = await this.getRequest(uri, method);
      for (const item of response.jobs) {
        await iteratee(item);
      }
      next = response;
      break;
    } while (next.length);
  }

  public async verifyAuthentication(): Promise<void> {
    const uri = this.withBaseUri(`/api/json`);
    try {
      await this.getRequest(uri, 'GET');
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: uri,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  public async iterateUsers(
    iteratee: ResourceIteratee<JenkinsUser>,
  ): Promise<void> {
    await this.paginatedUserRequest<JenkinsUser>(
      this.withBaseUri(`/asynchPeople/api/json`),
      'GET',
      iteratee,
    );
  }

  public async iterateRepos(
    iteratee: ResourceIteratee<JenkinsRepository>,
  ): Promise<void> {
    await this.paginatedRepositoryRequest<JenkinsRepository>(
      this.withBaseUri(`/api/json`),
      'GET',
      iteratee,
    );
  }

  public async listAllRoles(): Promise<any> {
    const roleList: Array<string> = [];

    for (const roleType of this.roleTypes) {
      const roles = await this.getRequest(
        this.withBaseUri(
          `/role-strategy/strategy/getAllRoles?type=${roleType}`,
        ),
        'GET',
      );
      for (const role in roles) {
        roleList.push(`${roleType}:${role}`);
      }
    }

    return roleList;
  }

  public async getRoleMembers(role: JenkinsRole): Promise<any> {
    const request = await this.getRequest(
      this.withBaseUri(
        `/role-strategy/strategy/getRole?type=${role.roleType}&roleName=${role.name}`,
      ),
      'GET',
    );
    return request.sids;
  }

  public async getRoleDetails(role: string): Promise<JenkinsRole> {
    const colonIndex = role.lastIndexOf(':');
    const roleName = role.substring(colonIndex + 1);
    const roleType = role.substring(0, colonIndex);

    const request = await this.getRequest(
      this.withBaseUri(
        `/role-strategy/strategy/getRole?type=${roleType}&roleName=${roleName}`,
      ),
      'GET',
    );
    request.name = roleName;
    request.roleType = `${roleType}`;
    return request;
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
