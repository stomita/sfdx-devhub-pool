import { expect, test } from '@salesforce/command/lib/test';
import * as externalCommand from '../../../../../src/externalCommand';

/**
 * 
 */
describe('devhubpool:auth:jwt:grant', () => {
  const ts = test
    .stub(externalCommand, 'grantJwtAuth', async (username, _, params) => {
      if (username.indexOf('nouser') === 0) {
        throw new Error('invalid_grant');
      }
      return {
        orgId: username === 'u@hub01.org' ? '00D000000000000000' : '00D111111111111111',
        accessToken: 'accesstoken',
        instanceUrl: 'https://cs3.salesforce.com',
        loginUrl: 'https://login.salesforce.com',
        username,
        clientId: params.clientid,
        privateKey: params.jwtkeyfile
      };
    })
    .stdout()
    .stderr();

  /**
   * 
   */
  ts.command(['devhubpool:auth:jwt:grant', '--usernames', 'u@hub01.org,u@hub02.org', '--clientid', 'CLIENT_ID', '--jwtkeyfile', './path/to/server.key'])
    .it('runs devhubpool:auth:jwt:grant --usernames u@hub01.org,u@hub02.org --clientid CLIENT_ID --jwtkeyfile ./path/to/server.key', ctx => {
      expect(ctx.stdout).includes('Successfully authorized u@hub01.org with org ID 00D000000000000000');
      expect(ctx.stdout).includes('Successfully authorized u@hub02.org with org ID 00D111111111111111');
    });

  /**
   * 
   */
  ts.command(['devhubpool:auth:jwt:grant', '--usernames', 'nouser@hub01.org,u@hub02.org', '--clientid', 'CLIENT_ID', '--jwtkeyfile', './path/to/server.key'])
    .it('runs devhubpool:auth:jwt:grant --usernames nouser@hub01.org,u@hub02.org --clientid CLIENT_ID --jwtkeyfile ./path/to/server.key', ctx => {
      expect(ctx.stderr).includes('invalid_grant');
    });

});
