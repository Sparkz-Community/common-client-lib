# Quick Started

A short guide to help user get started in using the library.

You may also describe the features or design of the library briefly.

## Install

If you are using module bundlers such as Webpack, you can directly include package into your project via:

NPM:

``` bash
$ npm install @iy4u/common-client-lib --save
```

or Yarn:

``` bash
$ yarn add @iy4u/common-client-lib
```

#### Vue.js plugin:

Then register `@iy4u/common-client-lib` components and directives all at once in your app's entry:

``` js
// main.js
import Vue from 'vue';
import iyCommonClientLib from '@iy4u/common-client-lib/src';

Vue.use(iyCommonClientLib);
```

#### Quasar:

or Quasar boot file `iyCommonClientLib.js`

``` js
import iyCommonClientLib from '@iy4u/common-client-lib/src';

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/cli-documentation/boot-files#Anatomy-of-a-boot-file
export default async ({Vue}) => {
  Vue.use(iyCommonClientLib);
};
```

Register it in `quasar.conf.js`

``` js
    boot: [
      'i18n',
      'axios',
      'iyCommonClientLib'
    ],
```

## i18n

How to configure the library to use different language.
