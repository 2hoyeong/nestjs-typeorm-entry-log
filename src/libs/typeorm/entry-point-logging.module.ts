import { DiscoveryModule, DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { DynamicModule, Module, OnModuleInit } from '@nestjs/common';
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

  isRepository(instance: any) {
    // return instance.constructor.name.endsWith('Repository');
    return Object.getOwnPropertyNames(instance).some((prop) => instance[prop] instanceof Repository);
  }

  onModuleInit() {
    this.discovery
      .getProviders()
      .filter((wrapper) => wrapper.isDependencyTreeStatic())
      .filter(({ instance }) => instance && Object.getPrototypeOf(instance))
      .filter(({ instance }) => this.isRepository(instance))
      .forEach(({ instance }) => {
        this.scanner.getAllMethodNames(Object.getPrototypeOf(instance)).forEach(this.addEntryPointAtComment(instance));
      });
  }

  addEntryPointAtComment(instance: any) {
    return (methodName: string) => {
      const methodRef = instance[methodName];

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
        const origin = target[propKey];
        if (propKey === 'createQueryBuilder') {
          const entrypoint = `${projectName}.${targetName}.${propertyKey}`;
          return (...args: any[]) => origin.call(target, ...args).comment(entrypoint);
        }

        if (origin instanceof Repository) {
          const entrypoint = `${projectName}.${targetName}.${propertyKey}`;
          return new Proxy(origin, {
            get: function (target, propKey, receiver) {
              if (target[propKey] instanceof Function) {
                return (firstArg: any, ...args: any[]) => {
                  if (firstArg && firstArg instanceof Object && firstArg.where && !firstArg.comment) {
                    firstArg.comment = entrypoint;
                  }
                  return Reflect.get(target, propKey, receiver).call(target, ...[firstArg, ...args]);
                };
              }

              return Reflect.get(target, propKey, receiver);
            },
          });
        }
        return Reflect.get(target, propKey, receiver);
      },
    });
  }
}
