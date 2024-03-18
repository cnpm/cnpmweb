import type { IPluginAPI } from '@codeblitzjs/ide-core';

let _commands: IPluginAPI['commands'] | null = null;

export const PLUGIN_ID = 'IDE_PLUGIN';
export const api = {
  get commands() {
    return _commands;
  },
};

export const activate = ({ commands }: IPluginAPI) => {
  _commands = commands;
};

export const deactivate = () => {
  _commands = null
}
