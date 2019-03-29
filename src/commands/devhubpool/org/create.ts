import {core, flags, SfdxCommand } from '@salesforce/command';
import {AnyJson} from '@salesforce/ts-types';
import {createOrg, displayApiLimits} from '../../../externalCommand';

// Initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = core.Messages.loadMessages('sfdx-devhub-pool', 'org_create');

export default class Create extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');

  public static examples = [
    '$ sfdx devhubpool:org:create -p admin@hub01.example.org,admin@hub02.example.org -f config/enterprise-scratch-def.json -a TestOrg1',
    '$ sfdx devhubpool:org:create -p admin@hub01.example.org,admin@hub02.example.org -a MyDevOrg -s edition=Developer',
    '$ sfdx devhubpool:org:create -p admin@hub01.example.org,admin@hub02.example.org -f config/enterprise-scratch-def.json -a OrgWithOverrides username=testuser1@mycompany.org'
  ];

  protected static flagsConfig = {
    devhubpoolusernames: flags.array({
      char: 'p',
      description: messages.getMessage('devhubPoolUsernamesFlagDescription')
    }),
    definitionfile: flags.filepath({
      char: 'f',
      description: messages.getMessage('definitionFileFlagDescription')
    }),
    durationdays: flags.integer({
      char: 'd',
      description: messages.getMessage('durationDaysFlagDescription')
    }),
    noancestors: flags.boolean({
      char: 'c',
      description: messages.getMessage('noAncestorsFlagDescription')
    }),
    nonamespace: flags.boolean({
      char: 'n',
      description: messages.getMessage('noNamespaceFlagDescription')
    }),
    setalias: flags.string({
      char: 'a',
      description: messages.getMessage('setAliasFlagDescription')
    }),
    setdefaultusername: flags.boolean({
      char: 's',
      description: messages.getMessage('setDefaultUsernameFlagDescription')
    }),
    wait: flags.integer({
      char: 'w',
      description: messages.getMessage('waitFlagDescription')
    })
  };

  // Comment this out if your command does not require an org username
  protected static supportsUsername = true;

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = false;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<AnyJson> {
    const { devhubpoolusernames, ...params } = this.flags;
    const poolUsernames: string[] = devhubpoolusernames;
    try {
      const [targetHubOrg, targetRemaining] = (
        await Promise.all(
          poolUsernames.map(async username => {
            const limits = await displayApiLimits(username);
            const scratchOrgLimit = limits.find(limit => limit.name === 'DailyScratchOrgs');
            if (scratchOrgLimit) {
              const { remaining } = scratchOrgLimit;
              const priority = remaining + Math.random();
              return [username, remaining, priority] as [string, number, number];
            }
            return [username, 0, 0] as [string, number, number];
          })
        )
      ).sort((s1, s2) => s1[2] < s2[2] ? 1 : s1[2] > s2[2] ? -1 : 0)[0];

      if (targetRemaining === 0) {
        this.error('No capacity to create scratch org in dev pools');
        return;
      }
      this.ux.log(`Using hub org: ${targetHubOrg}`);

      const result = await createOrg(targetHubOrg, params);
      this.ux.log(`Successfully created scratch org: ${result.orgId}, username: ${result.username}`);
      return result;
    } catch (err) {
      this.error(err.message);
    }
  }
}
