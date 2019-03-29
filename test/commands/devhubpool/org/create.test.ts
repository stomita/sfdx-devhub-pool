import { expect, test } from '@salesforce/command/lib/test';
import * as externalCommand from '../../../../src/externalCommand';

/**
 * 
 */
describe('devhubpool:org:create', () => {
  const ts = test
    .stub(externalCommand, 'displayApiLimits', async (targetUsername) => {
      return [{
        name: 'DailyScratchOrgs',
        max: 20,
        remaining: targetUsername === 'devhub01' ? 20 : 0, 
      }];
    })
    .stub(externalCommand, 'createOrg', async (devhubusername, params) => {
      return {
        username: params.targetusername || 'test-scratch@example.com',
        orgId: '00D0000000000000000'
      };
    })
    .stdout()
    .stderr();

  /**
   * 
   */
  ts.command(['devhubpool:org:create', '--devhubpoolusernames', 'devhub01,devhub02'])
    .it('runs devhubpool:org:create --devhubpoolusernames devhub01,devhub02', ctx => {
      expect(ctx.stdout).includes('test-scratch@example.com');
    });
  
  /**
   * 
   */
  ts.command(['devhubpool:org:create', '--devhubpoolusernames', 'devhub01,devhub02', '--targetusername', 'test@my.org'])
    .it('runs devhubpool:org:create --devhubpoolusernames devhub01,devhub02', ctx => {
      expect(ctx.stdout).includes('test@my.org');
      expect(ctx.stdout).includes('00D0000000000000000');
    });
  
  /**
   * 
   */
  ts.command(['devhubpool:org:create', '--devhubpoolusernames', 'devhub02,devhub03'])
    .it('runs devhubpool:org:create --devhubpoolusernames devhub02,devhub03', ctx => {
      expect(ctx.stderr).includes('No capacity to create scratch org in dev pools');
    });
});
