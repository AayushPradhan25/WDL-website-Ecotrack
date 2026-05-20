const fs = require('fs');
const path = require('path');

const backendRoot = path.resolve(__dirname, '..');
const prismaClientPackagePath = path.join(backendRoot, 'node_modules', '@prisma', 'client');
const targetPrismaPath = path.join(backendRoot, 'node_modules', '.prisma');
const linkPath = path.join(prismaClientPackagePath, '.prisma');

if (!fs.existsSync(prismaClientPackagePath)) {
    console.error('Cannot find @prisma/client installation at', prismaClientPackagePath);
    process.exit(1);
}

if (!fs.existsSync(targetPrismaPath)) {
    console.error('Cannot find generated Prisma client at', targetPrismaPath);
    process.exit(1);
}

if (fs.existsSync(linkPath)) {
    const stat = fs.lstatSync(linkPath);
    if (!stat.isSymbolicLink()) {
        fs.rmSync(linkPath, { recursive: true, force: true });
    } else {
        const existingTarget = fs.readlinkSync(linkPath);
        if (existingTarget === targetPrismaPath) {
            console.log('Prisma symlink already present:', linkPath);
            process.exit(0);
        }
        fs.rmSync(linkPath, { recursive: true, force: true });
    }
}

fs.symlinkSync(targetPrismaPath, linkPath, 'dir');
console.log('Created Prisma symlink:', linkPath, '->', targetPrismaPath);