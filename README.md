sfdx-devhub-pool
================



[![Version](https://img.shields.io/npm/v/sfdx-devhub-pool.svg)](https://npmjs.org/package/sfdx-devhub-pool)
[![CircleCI](https://circleci.com/gh/stomita/sfdx-devhub-pool/tree/master.svg?style=shield)](https://circleci.com/gh/stomita/sfdx-devhub-pool/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/stomita/sfdx-devhub-pool?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/sfdx-devhub-pool/branch/master)
[![Codecov](https://codecov.io/gh/stomita/sfdx-devhub-pool/branch/master/graph/badge.svg)](https://codecov.io/gh/stomita/sfdx-devhub-pool)
[![Greenkeeper](https://badges.greenkeeper.io/stomita/sfdx-devhub-pool.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/stomita/sfdx-devhub-pool/badge.svg)](https://snyk.io/test/github/stomita/sfdx-devhub-pool)
[![Downloads/week](https://img.shields.io/npm/dw/sfdx-devhub-pool.svg)](https://npmjs.org/package/sfdx-devhub-pool)
[![License](https://img.shields.io/npm/l/sfdx-devhub-pool.svg)](https://github.com/stomita/sfdx-devhub-pool/blob/master/package.json)

<!-- commands -->
* [`sfdx-devhub-pool devhubpool:auth:jwt:grant -i <string> -f <filepath> -u <array> [-r <string>] [-a <array>] [--json] [--loglevel trace|debug|info|warn|error|fatal]`](#sfdx-devhub-pool-devhubpoolauthjwtgrant--i-string--f-filepath--u-array--r-string--a-array---json---loglevel-tracedebuginfowarnerrorfatal)
* [`sfdx-devhub-pool devhubpool:org:create [-p <array>] [-f <filepath>] [-d <integer>] [-c] [-n] [-a <string>] [-s] [-w <integer>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal]`](#sfdx-devhub-pool-devhubpoolorgcreate--p-array--f-filepath--d-integer--c--n--a-string--s--w-integer--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfatal)

## `sfdx-devhub-pool devhubpool:auth:jwt:grant -i <string> -f <filepath> -u <array> [-r <string>] [-a <array>] [--json] [--loglevel trace|debug|info|warn|error|fatal]`

authorize pooled orgs using the JWT flow

```
USAGE
  $ sfdx-devhub-pool devhubpool:auth:jwt:grant -i <string> -f <filepath> -u <array> [-r <string>] [-a <array>] [--json] 
  [--loglevel trace|debug|info|warn|error|fatal]

OPTIONS
  -a, --setaliases=setaliases                     set aliases for the authenticated orgs
  -f, --jwtkeyfile=jwtkeyfile                     (required) path to a file containing the private key
  -i, --clientid=clientid                         (required) connected app consumer key
  -r, --instanceurl=instanceurl                   the login URL of the instance the org lives on
  -u, --usernames=usernames                       (required) username list for authentication
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  [default: warn] logging level for this command invocation

EXAMPLES
  $ sfdx devhubpool:auth:jwt:grant -u admin@hub01.example.org,admin@hub02.example.org -f keys/server.key -i CLIENT_ID
  $ sfdx devhubpool:auth:jwt:grant -u admin@hub01.example.org,admin@hub02.example.org -f keys/server.key -i CLIENT_ID -a 
  hub01,hub02
```

_See code: [src/commands/devhubpool/auth/jwt/grant.ts](https://github.com/stomita/sfdx-devhub-pool/blob/v1.1.0/src/commands/devhubpool/auth/jwt/grant.ts)_

## `sfdx-devhub-pool devhubpool:org:create [-p <array>] [-f <filepath>] [-d <integer>] [-c] [-n] [-a <string>] [-s] [-w <integer>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal]`

create a scratch org from pooled devhub orgs

```
USAGE
  $ sfdx-devhub-pool devhubpool:org:create [-p <array>] [-f <filepath>] [-d <integer>] [-c] [-n] [-a <string>] [-s] [-w 
  <integer>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal]

OPTIONS
  -a, --setalias=setalias                         set an alias for for the created scratch org
  -c, --noancestors                               do not include second-generation package ancestors in the scratch org
  -d, --durationdays=durationdays                 duration of the scratch org (in days) (default:7, min:1, max:30)
  -f, --definitionfile=definitionfile             path to a scratch org definition file
  -n, --nonamespace                               creates the scratch org with no namespace
  -p, --devhubpoolusernames=devhubpoolusernames   username or alias list for the pooled dev hub orgs
  -s, --setdefaultusername                        set the created org as the default username
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org
  -w, --wait=wait                                 the streaming client socket timeout (in minutes) (default:6, min:2)
  --apiversion=apiversion                         override the api version used for api requests made by this command
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  [default: warn] logging level for this command invocation

EXAMPLES
  $ sfdx devhubpool:org:create -p admin@hub01.example.org,admin@hub02.example.org -f config/enterprise-scratch-def.json 
  -a TestOrg1
  $ sfdx devhubpool:org:create -p admin@hub01.example.org,admin@hub02.example.org -a MyDevOrg -s edition=Developer
  $ sfdx devhubpool:org:create -p admin@hub01.example.org,admin@hub02.example.org -f config/enterprise-scratch-def.json 
  -a OrgWithOverrides username=testuser1@mycompany.org
```

_See code: [src/commands/devhubpool/org/create.ts](https://github.com/stomita/sfdx-devhub-pool/blob/v1.1.0/src/commands/devhubpool/org/create.ts)_
<!-- commandsstop -->
