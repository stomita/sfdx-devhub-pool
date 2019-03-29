import {core, flags, SfdxCommand } from '@salesforce/command';
import {AnyJson} from '@salesforce/ts-types';
import {grantJwtAuth} from '../../../../externalCommand';

// Initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = core.Messages.loadMessages('sfdx-devhub-pool', 'auth_jwt_grant');

export default class AuthJwtGrant extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');

  public static examples = [
    '$ sfdx devhubpool:auth:jwt:grant -u admin@hub01.example.org,admin@hub02.example.org -f keys/server.key -i CLIENT_ID',
    '$ sfdx devhubpool:auth:jwt:grant -u admin@hub01.example.org,admin@hub02.example.org -f keys/server.key -i CLIENT_ID -a hub01,hub02'
  ];

  protected static flagsConfig = {
    clientid: flags.string({
      char: 'i',
      description: messages.getMessage('clientIdFlagDescription'),
      required: true
    }),
    instanceurl: flags.string({
      char: 'r',
      description: messages.getMessage('instanceUrlFlagDescription')
    }),
    jwtkeyfile: flags.filepath({
      char: 'f',
      description: messages.getMessage('jwtKeyFileFlagDescription'),
      required: true
    }),
    setaliases: flags.array({
      char: 'a',
      description: messages.getMessage('setAliasesFlagDescription')
    }),
    usernames: flags.array({
      char: 'u',
      description: messages.getMessage('usernamesFlagDescription'),
      required: true
    })
  };

  // Comment this out if your command does not require an org username
  protected static supportsUsername = false;

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = false;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<AnyJson> {
    const { usernames, setaliases: aliases = [], ...params } = this.flags;
    try {
      const results = await Promise.all(
        (usernames as string[]).map(async (username, i) => {
          const alias = aliases[i];
          const result = await grantJwtAuth(username, alias, params);
          return result;
        })
      );
      for (const result of results) {
        this.ux.log(`Successfully authorized ${result.username} with org ID ${result.orgId}`);
      }
      return results;
    } catch (err) {
      this.error(err.message);
    }
  }
}
