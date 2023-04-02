import { env } from 'process';
import ts from 'typescript';
import * as tstl from 'typescript-to-lua';

const populate = `\nawful.Populate(\n    {\n        ["lualib_bundle"] = ____exports,\n    },\n    ${env.PROJECT_NAME},\n    getfenv(1)\n)`;

const plugin: tstl.Plugin = {
  beforeEmit(
    program: ts.Program,
    options: tstl.CompilerOptions,
    emitHost: tstl.EmitHost,
    result: tstl.EmitFile[]
  ) {
    void program;
    void options;
    void emitHost;

    for (const file of result) {
      if (file.outputPath.includes('lualib_bundle.lua')) {
        const matches = file.code.match(/^.*return\s\{[\s\S]*?^.*\}.*\n?/gm);

        if (matches == null) continue;
        const toReplace = matches[matches.length - 1];
        const newContent = toReplace.replace('return', 'local ____exports =');

        file.code = file.code.replace(toReplace, newContent);
        file.code += populate;
      }
    }
  },
};

export default plugin;
