import { ExtendedContext } from '../functions/common/types';

declare function currentContext(): ExtendedContext;
declare global {
    namespace jest {
        interface Matchers<R> {
            toBeJSON(): R;
            toEqualJSON(b: any): R;
            toMatchJSON(b: any): R;
        }
        interface Expect {
            // eslint-disable-next-line @typescript-eslint/ban-types
            jsonContaining<E = {}>(b: E): any;
        }
    }
}
