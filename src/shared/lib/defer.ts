export interface Defer<T = void> {
  resolve: (res: T) => void;
  reject: (err?: Error) => void;
  promise: Promise<T>;
}

export const defer = <T = void>(): Defer<T> => {
  const deferred = {} as Defer<T>;

  const promise = new Promise<T>((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });

  deferred.promise = promise;

  return deferred;
};
