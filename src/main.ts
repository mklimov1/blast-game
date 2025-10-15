import '@/shared/styles/global.css';
import { App } from '@/app';

(async () => {
  const node = document.querySelector('#app');
  const app = new App();

  await app.init(node as HTMLElement);
  await app.create();
  app.render();
})();
