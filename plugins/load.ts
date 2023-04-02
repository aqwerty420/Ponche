import { env } from 'process';
import ts from 'typescript';
import * as tstl from 'typescript-to-lua';
import * as fs from 'fs';

const isPonche = env.PROJECT_NAME === 'ponche';

const filePath = isPonche
  ? 'awful-config-ponche.json'
  : 'awful-config-udnext.json';
const outputPath = 'dist';
const fileOutputPath = outputPath + '/awful-config.json';

const plugin: tstl.Plugin = {
  beforeEmit(
    program: ts.Program,
    options: tstl.CompilerOptions,
    emitHost: tstl.EmitHost
  ) {
    void program;
    void options;
    void emitHost;

    try {
      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath);
      }
      fs.copyFileSync(filePath, fileOutputPath);
    } catch (err) {
      console.error("Error occurred while copying 'awful-config.json'!", err);
      throw err;
    }
  },
};

export default plugin;
