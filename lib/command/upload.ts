// istanbul ignore file
import OSS from 'ali-oss';
import Command from 'common-bin';
import fs from 'fs';
import dir from 'node-dir';
import ora, { Ora } from 'ora';
import path from 'path';
import redis from '../redis';
import { defineGlobalOptions } from '../utils/command';

import { loadConfig, setConfig } from '../utils/config';
import { errorHandler } from '../utils/error-helper';

class GenerateCommand extends Command {
  private readonly spinner: Ora;

  constructor(rawArgv?: string[]) {
    super(rawArgv);
    this.usage = '使用方法: surgio upload';
    this.spinner = ora();
    this.options = {
      o: {
        type: 'string',
        alias: 'output',
        description: '生成规则的目录',
      },
    };

    defineGlobalOptions(this.yargs);
  }

  public async run(ctx): Promise<void> {
    const config = loadConfig(ctx.cwd, ctx.argv.config);

    if (ctx.argv.output) {
      setConfig('output', ctx.argv.output);
    }

    const ossConfig = {
      region: config?.upload?.region,
      bucket: config?.upload?.bucket,
      endpoint: config?.upload?.endpoint,
      accessKeyId: ctx.env.OSS_ACCESS_KEY_ID || config?.upload?.accessKeyId,
      accessKeySecret:
        ctx.env.OSS_ACCESS_KEY_SECRET || config?.upload?.accessKeySecret,
    };
    const client = new OSS({
      secure: true,
      ...ossConfig,
    });
    const prefix = config?.upload?.prefix || '/';
    const fileList = await dir.promiseFiles(config.output);
    const files = fileList.map((filePath) => ({
      fileName: path.basename(filePath),
      filePath,
    }));
    const fileNameList = files.map((file) => file.fileName);

    const upload = () => {
      return Promise.all(
        files.map((file) => {
          const { fileName, filePath } = file;
          const objectName = `${prefix}${fileName}`;
          const readStream = fs.createReadStream(filePath);

          return client.put(objectName, readStream, {
            mime: 'text/plain; charset=utf-8',
            headers: {
              'Cache-Control': 'private, no-cache, no-store',
            },
          });
        }),
      );
    };
    const deleteUnwanted = async () => {
      const list = await client.list({
        prefix,
        delimiter: '/',
      });
      const deleteList: string[] = [];

      for (const key in list.objects) {
        if (list.objects.hasOwnProperty(key)) {
          const object = list.objects[key];
          const objectName = object.name.replace(prefix, '');
          const isExist = fileNameList.indexOf(objectName) > -1;

          if (objectName && !isExist) {
            deleteList.push(object.name);
          }
        }
      }

      if (deleteList.length) {
        await client.deleteMulti(deleteList);
      }
    };

    this.spinner.start('开始上传到阿里云 OSS');
    await upload();
    await deleteUnwanted();
    await redis.destroyRedis();
    this.spinner.succeed();
  }

  // istanbul ignore next
  public get description(): string {
    return '上传规则到阿里云 OSS';
  }

  // istanbul ignore next
  public errorHandler(err): void {
    this.spinner.fail();

    errorHandler.call(this, err);
  }
}

export = GenerateCommand;
