import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const image = require(path.join(path.dirname(fileURLToPath(import.meta.url)), '../../node_modules/next/image.js'));

export default image.default;
export const getImageProps = image.getImageProps;
