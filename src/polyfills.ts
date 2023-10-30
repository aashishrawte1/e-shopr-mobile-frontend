import { environment } from './environments/environment';
import './zone-flags.ts';

/***************************************************************************************************
 * Zone JS is required by default for Angular itself.
 */
import 'zone.js/dist/zone';
(window as any).process = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  env: { DEBUG: undefined },
};
