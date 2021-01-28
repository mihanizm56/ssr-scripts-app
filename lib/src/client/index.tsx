import 'core-js';
import 'regenerator-runtime/runtime';
import deepForceUpdate from 'react-deep-force-update';
import React from 'react';
import ReactDOM, { hydrate, render } from 'react-dom';
import { actionHandler } from '../modules/router/middlewares';
import { handleRedirect, setMeta } from '../modules/router/plugins';
import { configureCookies } from '../modules/cookies';
import { Page as ErrorPage } from '../pages/error/page';
import { App } from '../_components/app';
import { configureRouter } from '../modules/router';
import routes from '../pages/routes';

const customWindow = window as IWindow;

// DOM элемент приложения
const container = document.getElementById('app');

// Получение данных с севера через window
// const {} = customWindow.ssrData;

// Конфигурирование cookies
const cookies = configureCookies();

// Конфигурирование router
const router = configureRouter({
  setMetaPlugin: setMeta,
  customActionHandler: actionHandler,
  routes,
  defaultRoute: 'home',
});

router.setDependencies({
  cookies,
});

// eslint-disable-next-line
// @ts-ignore
router.usePlugin(handleRedirect);

// Отключение браузерного восстановления скрола при переходах между страницами
/* eslint-disable no-restricted-globals */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
/* eslint-enable no-restricted-globals */

// Удаление ssrData из памяти
delete customWindow.ssrData;

// Экземпляр приложения
let appInstance;

const runApp = (renderer: ReactDOM.Renderer, callback?: () => void) => {
  try {
    router.start(() => {
      renderer(
        <App
          ref={node => {
            appInstance = node;
          }}
          cookies={cookies}
          router={router}
        />,
        container,
        () => {
          if (typeof callback === 'function') {
            callback();
          }
        },
      );
    });
    // });
  } catch (err) {
    renderer(
      <ErrorPage
        ref={node => {
          appInstance = node;
        }}
      />,
      container,
      () => {
        if (typeof callback === 'function') {
          callback();
        }
      },
    );
  }
};

runApp(hydrate);

// Автоматический перезапуск приложения
// В режиме Hot Module Replacement
if (module.hot) {
  module.hot.accept('../modules/router/index', () => {
    const scrollPosition =
      document.documentElement.scrollTop || document.body.scrollTop;
    const setScrollPosition = () => {
      setTimeout(() => {
        // eslint-disable-next-line no-multi-assign
        document.documentElement.scrollTop = document.body.scrollTop = scrollPosition;
      }, 1);
    };

    if (appInstance && appInstance.updater.isMounted(appInstance)) {
      runApp(render, () => {
        deepForceUpdate(appInstance);
        setScrollPosition();
      });
    } else {
      ReactDOM.unmountComponentAtNode(container);
      runApp(render, () => {
        setScrollPosition();
      });
    }
  });
}
