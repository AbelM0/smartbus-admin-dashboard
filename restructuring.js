const fs = require('fs');
const path = require('path');

const appDir = path.join(process.cwd(), 'app');

function restructure() {
    console.log(`Working in ${appDir}`);

    const localeDir = path.join(appDir, '[locale]');
    
    // Check if app/[locale] exists and what type it is
    if (fs.existsSync(localeDir)) {
        const stats = fs.statSync(localeDir);
        if (!stats.isDirectory()) {
            console.error(`ERORR: ${localeDir} exists but is NOT a directory! Removing it...`);
            fs.unlinkSync(localeDir);
        }
    }

    // Create [locale] directory
    if (!fs.existsSync(localeDir)) {
        console.log(`Creating directory: ${localeDir}`);
        fs.mkdirSync(localeDir);
    }

    const subDirs = ['users', 'routes', 'permissions', 'analytics'];
    subDirs.forEach(dir => {
        const target = path.join(localeDir, dir);
        if (!fs.existsSync(target)) {
            console.log(`Creating subdirectory: ${target}`);
            fs.mkdirSync(target);
        }
    });

    const filesToMove = [
        { src: 'page.tsx', dest: '[locale]/page.tsx' },
        { src: 'layout.tsx', dest: '[locale]/layout.tsx' },
        { src: 'users/page.tsx', dest: '[locale]/users/page.tsx' },
        { src: 'routes/page.tsx', dest: '[locale]/routes/page.tsx' },
        { src: 'permissions/page.tsx', dest: '[locale]/permissions/page.tsx' },
        { src: 'analytics/page.tsx', dest: '[locale]/analytics/page.tsx' }
    ];

    filesToMove.forEach(file => {
        const srcPath = path.join(appDir, file.src);
        const destPath = path.join(appDir, file.dest);
        
        if (fs.existsSync(srcPath)) {
            console.log(`Moving ${file.src} to ${file.dest}`);
            // Check if destination directory exists
            const destDir = path.dirname(destPath);
            if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir, { recursive: true });
            }
            fs.renameSync(srcPath, destPath);
        } else {
            console.warn(`Source not found: ${srcPath}`);
        }
    });

    // Cleanup empty old directories
    ['users', 'routes', 'permissions', 'analytics'].forEach(dir => {
        const dirPath = path.join(appDir, dir);
        if (fs.existsSync(dirPath) && fs.readdirSync(dirPath).length === 0) {
            console.log(`Removing empty directory: ${dirPath}`);
            fs.rmdirSync(dirPath);
        }
    });

    console.log('Restructuring complete.');
}

try {
    restructure();
} catch (err) {
    console.error('FAILED TO RESTRUCTURE:', err);
}
