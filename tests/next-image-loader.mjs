import { registerHooks } from 'node:module';

// vinext sets "type": "module". Node then gives `import Image from 'next/image'`
// the module object instead of the component. Tests render that component.
const shim = new URL('./shims/next-image.mjs', import.meta.url).href;

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'next/image' && !String(context.parentURL).includes('/tests/shims/next-image.mjs')) {
      return { url: shim, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});
