import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const createIndexWithExport = (): void => {
    const root = path.join(__dirname, './../src');
    const folders = fs.readdirSync(root);
    const indexFile: string[] = [
        `// DO NOT EDIT THIS DIRECTLY - WILL BE CREATED FROM makeAllExportableFromRoot`,
        '// Let this be...',
        '',
    ];
    for (const folder of folders) {
        const pathToFolder = path.join(root, folder);
        const stat = fs.statSync(pathToFolder);
        if (!stat.isDirectory()) continue;
        // Now - iteratively get all files
        indexFile.push(`// From folder ${folder}`);
        const typescriptFiles = execSync(`find ${pathToFolder} -name "*.ts"`, { stdio: 'pipe' })
            .toString('utf8')
            .split('\n')
            .filter(Boolean);
        for (const typescriptFile of typescriptFiles) {
            if (
                /\/test/i.test(typescriptFile) ||
                /-ti.ts$/.test(typescriptFile) ||
                // Ignore all sample* folders
                /\/sample[a-z]*\//i.test(typescriptFile)
            )
                continue;
            const relativePath = typescriptFile.replace(root, '').replace(/\.ts$/, '');
            indexFile.push(`export * from ".${relativePath}"`);
        }
    }
    indexFile.push('', '// Let this be...');
    fs.writeFileSync(path.join(root, './index.ts'), indexFile.join('\r\n'));

    // Now - make sure that we have interface checks for all
    const interfaceFolder = path.join(root, '/interfaces');
    if (!fs.existsSync(interfaceFolder)) {
        throw new Error(`The required path does not exist ${interfaceFolder}`);
    }
    const interfaceBuilderFolder = path.join(__dirname, '../node_modules/ts-interface-builder');
    for (const fileName of fs.readdirSync(interfaceFolder)) {
        const filePath = path.join(interfaceFolder, fileName);
        if (!/\.ts$/.test(filePath) || /\-ti\.ts$/.test(filePath)) {
            if (fs.statSync(filePath).isDirectory()) {
                for (const subfile of fs.readdirSync(filePath)) {
                    const subfilePath = path.join(filePath, subfile);
                    if (!/\.ts$/.test(subfilePath) || /\-ti\.ts$/.test(subfilePath)) continue;
                    execSync(`\`npm bin\`/ts-interface-builder --inline-imports ${subfilePath}`);
                }
            }
            continue;
        }
        execSync(`\`npm bin\`/ts-interface-builder --inline-imports ${filePath}`);
    }
};
createIndexWithExport();
