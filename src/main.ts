import '@/shared/styles/global.scss';
import App from '@/app/App';

(async () => {
  const app = new App();

  await app.init();
  app.create();

  const node = document.querySelector('#app');

  app.render(node as HTMLElement);
})();
