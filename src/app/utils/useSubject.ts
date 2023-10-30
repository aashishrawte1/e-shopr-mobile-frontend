import { BehaviorSubject } from 'rxjs';

export const useSubject = <T>(val: T) => {
  return new BehaviorSubject<T>(val);
};
