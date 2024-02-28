import 'material-design-icons-iconfont/dist/material-design-icons.css';

import { createApp } from 'vue';
import App from './App.vue';
// копипаста с ui/main.ts, поменял @/ на @avalon/ui/src/
import router from '@avalon/ui/src/router';
import { store, key } from '@avalon/ui/src/store';

import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { aliases, md } from 'vuetify/iconsets/md';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
  },
  defaults: {
    VBtn: {
      color: 'primary',
      variants: 'tonal',
      rounded: 'lg',
    },
  },
  icons: {
    defaultSet: 'md',
    aliases,
    sets: {
      md,
    },
  },
});

createApp(App).use(store, key).use(router).use(vuetify).mount('#app');
