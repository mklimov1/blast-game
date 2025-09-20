import '@/shared/styles/global.scss';
import App from '@/app/App';

(async () => {
  const node = document.querySelector('#app');
  const app = new App();

  await app.init(node as HTMLElement);
  await app.create();
  app.render();
})();
