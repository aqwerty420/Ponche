import { env } from 'process';
import * as ts from 'typescript';
import * as tstl from 'typescript-to-lua';

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
      file.code = file.code.replace(
        /require\("(.+?)"\)/g,
        `${env.PROJECT_NAME}["$1"]`
      );
    }
  },
};

export default plugin;
