/* eslint-disable import/no-import-module-exports */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import ReactDOM, { hydrate, render } from 'react-dom';
import { configureRouter } from '@wildberries/service-router';
import { configureCookies } from '@/_utils/cookies';
import { Page as ErrorPage } from '@/pages/error/page';
import { App } from '@/_components/app';
import { handleRedirect } from '@/_utils/router/plugins/client/handle-redirect';
import { setMeta } from '@/_utils/router/plugins/client/set-meta';
import { actionHandler } from '@/_utils/router/middlewares/action-handler';
import routes from '@/pages/routes';

// const isProduction = process.env.NODE_ENV === 'production';

// DOM элемент приложения
const container = document.getElementById('root');

// Нет window.ssrData если режим spa
const isCSR = !Boolean(window.ssrData) || __DEV__;

// Конфигурирование cookies
const cookies = configureCookies();

// Конфигурирование router
const router = configureRouter({
  setMetaPlugin: setMeta,
  customActionHandler: actionHandler,
  routes,
  allowNotFound: true,
  enableDeactivationMiddleware: true,
  queryParamsMode: 'default',
});

router.setDependencies({
  cookies,
});

// @ts-ignore
router.usePlugin(handleRedirect);

// Отключение браузерного восстановления скрола при переходах между страницами
/* eslint-disable no-restricted-globals */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
/* eslint-enable no-restricted-globals */

// Удаление ssrData из памяти
delete window.ssrData;

const runApp = async (renderer: ReactDOM.Renderer, callback?: () => void) => {
  try {
    router.start(() => {
      renderer(
        <App cookies={cookies} router={router} />,
        container,
        async () => {
          if (typeof callback === 'function') {
            callback();
          }

          // add post fetch here if necessary
        },
      );
    });
  } catch (err) {
    renderer(<ErrorPage router={router} />, container, () => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  }
};

const renderer = isCSR ? render : hydrate;

runApp(renderer);
