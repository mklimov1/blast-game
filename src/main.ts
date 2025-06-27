import './styles/style.css';
import App from './App.ts';

(async () => {
  const app = new App();
  await app.init();

  const node = document.querySelector('#app');
  app.render(node as HTMLElement);
})();
