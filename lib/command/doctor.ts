// istanbul ignore file
import Command from 'common-bin';
import check from 'check-node-version';
import { promisify } from 'util';
import { join } from 'path';
import redis from '../redis';
import { defineGlobalOptions } from '../utils/command';

import { errorHandler } from '../utils/error-helper';

type OnComplete = Parameters<typeof check>[1];
type CheckInfo = Parameters<OnComplete>[1];

class DoctorCommand extends Command {
  constructor(rawArgv?: string[]) {
    super(rawArgv);
    this.usage = '使用方法: surgio doctor';

    defineGlobalOptions(this.yargs);
  }

  public async run(ctx): Promise<void> {
    const doctorInfo = await DoctorCommand.generateDoctorInfo(ctx.cwd);

    doctorInfo.forEach((item) => {
      console.log(item);
    });

    await redis.destroyRedis();
  }

  // istanbul ignore next
  public get description(): string {
    return '检查运行环境';
  }

  // istanbul ignore next
  public errorHandler(err): void {
    errorHandler.call(this, err);
  }

  public static async generateDoctorInfo(
    cwd: string,
  ): Promise<ReadonlyArray<string>> {
    const doctorInfo: string[] = [];
    const pkg = require('../../package.json');
    const checkInfo = await promisify<CheckInfo>(check)();

    try {
      const gatewayPkg = require(join(
        cwd,
        'node_modules/@surgio/gateway/package.json',
      ));
      doctorInfo.push(`@surgio/gateway: ${gatewayPkg.version}`);
    } catch (_) {
      // no catch
    }

    doctorInfo.push(`surgio: ${pkg.version} (${join(__dirname, '../..')})`);

    if (checkInfo) {
      Object.keys(checkInfo.versions).forEach((key) => {
        const version = checkInfo.versions[key].version;
        if (version) {
          if (key === 'node') {
            doctorInfo.push(`${key}: ${version} (${process.execPath})`);
          } else {
            doctorInfo.push(`${key}: ${version}`);
          }
        }
      });
    }

    return doctorInfo;
  }
}

export = DoctorCommand;
