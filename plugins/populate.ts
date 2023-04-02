import { env } from 'process';
import ts from 'typescript';
import * as tstl from 'typescript-to-lua';

const basePopulate = 'awful.Populate(\n    {\n';
const endPopulate = `\n    },\n    ${env.PROJECT_NAME},\n    getfenv(1)\n)`;

const toReplace = 'return ____exports\n';

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
      if (!file.code.includes(toReplace)) continue;

      const path = file.outputPath
        .replace(/.*[/\\]dist[/\\]/, '')
        .replace(/[/\\]/g, '.')
        .replace('.lua', '');

      file.code = file.code.replace(
        toReplace,
        `${basePopulate}        ["${path}"] = ____exports,${endPopulate}\n`
      );
    }
  },
};

export default plugin;
