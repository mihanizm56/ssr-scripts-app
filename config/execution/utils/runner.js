#!/usr/bin/env node
/* eslint-disable no-shadow */

/* eslint-disable no-console */
// eslint-disable-next-line
const colors = require('colors');
const username = require('os').userInfo().username;
const path = require('path');
const { Listr } = require('listr2');
const { remove } = require('fs-extra');
const { isWindows } = require('./is-windows');
const { exec, access, rename } = require('./fs-promises');
const { getExecutionPaths } = require('./execution-paths');
const { getArrayOfCopiedFiles } = require('./get-array-of-copied-files');
const {
  replaceEmptyPackageJsonFields,
} = require('./replace-empty-package-json-fields');

class ExecutionRunner {
  constructor() {
    this.areNPMDirsExist = true;
    this.areGitDirsExist = true;
    this.isWindows = isWindows();
  }

  async init() {
    await this.startExecution();
  }

  startTimer = () => process.hrtime();

  finishTimer = hrstart => {
    const hrend = process.hrtime(hrstart);

    const mins = Math.floor(hrend[0] / 60);
    const seconds = hrend[0] - mins * 60;

    console.log('');
    console.log(`installation time: ${mins}m ${seconds}s`.green);
    console.log('');
  };

  async checkNPMDirs() {
    try {
      await access(path.join(this.rootDir, 'package.json'));
      await access(path.join(this.rootDir, 'package-lock.json'));
      await access(path.join(this.rootDir, 'node_modules'));
    } catch {
      this.areNPMDirsExist = false;
      await exec('npm init -y');
    }
  }

  async checkGitDir() {
    try {
      await access(path.join(this.pathToExecute, '.git'));
    } catch {
      this.areGitDirsExist = false;
      await exec('git init');
    }
  }

  async renameNpmFiles() {
    const gitignoreOldFilePath = path.join(
      this.projectFolder,
      '.gitignore-prepare',
    );
    const gitignoreNewFilePath = path.join(this.projectFolder, '.gitignore');

    await rename(gitignoreOldFilePath, gitignoreNewFilePath);
  }

  async setupRoots() {
    if (this.isWindows) {
      await exec(
        'find ./config -name "*.*" | xargs git update-index --chmod=+x',
      );
    } else {
      await exec(`chown -R ${username} ./config`);
    }
  }

  async uninstallInitialPackages() {
    await exec('npm uninstall ssr-scripts-app');
  }

  async startExecution() {
    const timestampStart = this.startTimer();

    try {
      const cliRunner = this.getConfiguredCliRunner();

      await cliRunner.run();

      this.finishTimer(timestampStart);
      console.log('Happy coding =)'.green);
    } catch (error) {
      console.error(
        'error when executing the package',
        error.stdout || error.message,
      );
    }
  }

  getConfiguredCliRunner() {
    return new Listr(
      [
        {
          task: async (ctx, task) => {
            const inputPath = await task.prompt({
              type: 'Input',
              message: 'Введите путь до установки проекта',
            });

            if (!inputPath) {
              throw new Error('Путь до установки проекта введен некорректно!');
            }

            const { pathToExecute, projectFolder, rootDir } = getExecutionPaths(
              inputPath,
            );

            const arrayOfFilesToCopy = getArrayOfCopiedFiles({
              projectFolder,
              pathToExecute,
            });

            this.rootDir = rootDir;
            this.pathToExecute = pathToExecute;
            this.arrayToCopy = arrayOfFilesToCopy;
            this.projectFolder = projectFolder;
          },
        },
        {
          title: 'Подготовка исходной директории',
          task: (ctx, task) =>
            task.newListr([
              {
                title: 'Очистка кэша npm',
                task: async () => {
                  await exec('npm cache clean -f');
                },
              },
              {
                title: 'Подготовка npm исходной директории',
                task: async () => {
                  await this.checkNPMDirs();
                  await this.uninstallInitialPackages();
                },
              },
            ]),
        },
        {
          title: 'Конфигурирование бойлерплейта',
          task: (ctx, task) =>
            task.newListr([
              {
                title: 'Установка Git',
                task: async () => {
                  await this.checkGitDir();
                },
              },
              {
                title: 'Добавление всех файлов проекта в гит (git add .)',
                task: async () => {
                  await exec('git add .');
                },
              },
              {
                title: 'Установка Husky',
                task: async () => {
                  await exec('npx husky');
                },
              },
              {
                title: 'Установка прав на директории проекта',
                task: async () => {
                  await this.setupRoots();
                },
              },
              {
                title: 'Установка npm зависимостей',
                task: async () => {
                  await replaceEmptyPackageJsonFields();

                  await exec('npm install');

                  if (
                    this.pathToExecute !== this.rootDir &&
                    !this.areNPMDirsExist
                  ) {
                    await remove(path.join(this.rootDir, 'package.json'));
                    await remove(path.join(this.rootDir, 'package-lock.json'));
                    await remove(path.join(this.rootDir, 'node_modules'));
                  }
                },
              },
              {
                title: 'Запуск проверок',
                task: async (ctx, task) => {
                  task.newListr(
                    [
                      {
                        title: 'Запуск Eslint and Stylelint',
                        task: async () => {
                          await exec('npm run lint');
                        },
                      },
                      {
                        title: 'Проверка типизации',
                        task: async () => {
                          await exec('npx tsc');
                        },
                      },
                      {
                        title: 'Сборка приложения',
                        task: async () => {
                          await exec('npm run build');
                        },
                      },
                    ],
                    {
                      rendererOptions: { collapse: false },
                      concurrent: true,
                    },
                  );
                },
              },
            ]),
        },
      ],
      {
        rendererOptions: { collapse: false },
      },
    );
  }
}

module.exports.ExecutionRunner = ExecutionRunner;
