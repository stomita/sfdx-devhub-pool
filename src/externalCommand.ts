import { exec } from 'child_process';

async function execAsync(command: string) {
  return new Promise<string>((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        return resolve(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}

export async function execCommand(
  command: string,
  args: string[]
) {
  const retStr = await execAsync(`sfdx ${command} ${args.join(' ')} --json`);
  const ret = JSON.parse(retStr);
  if (ret.status === 0) {
    return ret;
  } else {
    const err = new Error(ret.message);
    err.name = ret.name;
    throw err;
  }
}

export type ApiLimit = {
  name: string,
  max: number,
  remaining: number
};

export async function displayApiLimits(username: string) {
  const { result } = await execCommand('force:limits:api:display', ['-u', username]);
  return result as ApiLimit[];
}

export type CreateOrgResult = {
  orgId: string,
  username: string
};

export async function createOrg(
  devhubUsername: string,
  params: { [name: string]: string | number | boolean }
) {
  const args: string[] = [];
  args.push('-v', devhubUsername);
  for (const name of Object.keys(params)) {
    const value = params[name];
    args.push(`--${name}`);
    if (typeof value !== 'boolean') {
      args.push(String(value));
    }
  }
  const { result } = await execCommand('force:org:create', args);
  return result as CreateOrgResult;
}

export type GrantJwtAuthResult = {
  orgId: string,
  accessToken: string,
  instanceUrl: string,
  loginUrl: string,
  username: string,
  clientId: string,
  privateKey: string
};

export async function grantJwtAuth(
  username: string,
  alias: string | undefined,
  params: { [name: string]: string | number | boolean }
) {
  const args: string[] = [];
  args.push('-u', username);
  if (alias) {
    args.push('-a', alias);
  }
  for (const name of Object.keys(params)) {
    const value = params[name];
    args.push(`--${name}`);
    if (typeof value !== 'boolean') {
      args.push(String(value));
    }
  }
  const { result } = await execCommand('force:auth:jwt:grant', args);
  return result as GrantJwtAuthResult;
}
