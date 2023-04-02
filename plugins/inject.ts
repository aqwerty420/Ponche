import { env } from 'process';
import ts from 'typescript';
import * as tstl from 'typescript-to-lua';

const isPonche = env.PROJECT_NAME === 'ponche';
const projName = isPonche ? 'Ponche' : 'UDNext';
const projCmd = isPonche ? 'ponche' : 'udnext';

const getClassname = (filePath: string): string | null => {
  if (filePath.includes('evoker')) return 'EVOKER';
  if (filePath.includes('rogue')) return 'ROGUE';
  if (filePath.includes('hunter')) return 'HUNTER';

  return null;
};

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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      file.code = file.code.replaceAll('PROJECT_NAME', projName);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      file.code = file.code.replaceAll('PROJECT_CMD', projCmd);
    }

    for (const file of result) {
      const className = getClassname(file.outputPath);
      if (className != null) {
        file.code = `local _, class = UnitClass("player")\nif class ~= '${className}' then return end\n${file.code}`;
      }
    }

    for (const file of result) {
      file.code = `local Unlocker, awful, ${env.PROJECT_NAME} = ...\n${file.code}`;
    }
  },
};

export default plugin;
