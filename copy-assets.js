import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src', 'views');
const destDir = path.join(__dirname, 'dist', 'views');

function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

try {
    if (fs.existsSync(srcDir)) {
        console.log(`Copying views from ${srcDir} to ${destDir}...`);
        copyDir(srcDir, destDir);
        console.log('Views copied successfully.');
    } else {
        console.log('Source views directory not found.');
    }
} catch (err) {
    console.error('Error copying assets:', err);
    process.exit(1);
}
