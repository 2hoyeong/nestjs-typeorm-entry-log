const config = {
  projectName: 'NestJS-TypeORM-Entry-Log',
};

const ProxyFactory = (thisArg: any, targetName: string, propertyKey: string) => {
  return new Proxy(thisArg, {
    get: function (target, propKey, receiver) {
      if (propKey === 'createQueryBuilder') {
        const origin = target[propKey];
        const entrypoint = `${config.projectName}.${targetName}.${propertyKey}`;
        return (...args: any[]) => origin.call(target, ...args).comment(entrypoint);
      }
      return Reflect.get(target, propKey, receiver);
    },
  });
};

/**
 * @description QueryBuilder에 EntryPoint를 추가하는 함수 데코레이터
 */
export function AddEntryPointComment() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const prototype = Object.getPrototypeOf(originalMethod);
    if (prototype.constructor.name === 'AsyncFunction') {
      descriptor.value = async function (...args: any[]) {
        const proxy = ProxyFactory(this, target.constructor.name, propertyKey);
        return await originalMethod.call(proxy, ...args);
      };
    } else {
      descriptor.value = function (...args: any[]) {
        const proxy = ProxyFactory(this, target.constructor.name, propertyKey);
        return originalMethod.call(proxy, ...args);
      };
    }

    return descriptor;
  };
}
