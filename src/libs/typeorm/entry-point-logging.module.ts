import { DiscoveryModule, DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { DynamicModule, Module, OnModuleInit } from '@nestjs/common';
import { ADD_ENTRY_POINT_COMMENT } from './utils';
import { NestConfigModule } from '../../common/config/config.module';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';

@Module({
  imports: [DiscoveryModule, NestConfigModule],
})
export class EntryPointLoggingModule implements OnModuleInit {
  constructor(
    private readonly discovery: DiscoveryService,
    private readonly scanner: MetadataScanner,
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  static forRoot(): DynamicModule {
    return {
      module: EntryPointLoggingModule,
      global: true,
    };
  }

  onModuleInit() {
    this.discovery
      .getProviders()
      .filter((wrapper) => wrapper.isDependencyTreeStatic())
      .filter(({ instance }) => instance && Object.getPrototypeOf(instance))
      .forEach(({ instance }) => {
        this.scanner.getAllMethodNames(Object.getPrototypeOf(instance)).forEach(this.addEntryPointAtComment(instance));
      });
  }

  addEntryPointAtComment(instance: any) {
    return (methodName: string) => {
      const methodRef = instance[methodName];

      const metadata = this.reflector.get(ADD_ENTRY_POINT_COMMENT, instance[methodName]);
      if (!metadata) {
        return;
      }

      const originalMethod = methodRef;

      if (methodRef.constructor.name === 'AsyncFunction') {
        instance[methodName] = async (...args: unknown[]) => {
          const proxy = this.createProxy(instance, instance.constructor.name, methodName);
          return await originalMethod.call(proxy, ...args);
        };
      } else {
        instance[methodName] = (...args: unknown[]) => {
          const proxy = this.createProxy(instance, instance.constructor.name, methodName);
          return originalMethod.call(proxy, ...args);
        };
      }
    };
  }

  createProxy(thisArg: any, targetName: string, propertyKey: string) {
    const projectName = this.configService.get('app.projectName');
    return new Proxy(thisArg, {
      get: function (target, propKey, receiver) {
        if (propKey === 'createQueryBuilder') {
          const origin = target[propKey];
          const entrypoint = `${projectName}.${targetName}.${propertyKey}`;
          return (...args: any[]) => origin.call(target, ...args).comment(entrypoint);
        }
        return Reflect.get(target, propKey, receiver);
      },
    });
  }
}
