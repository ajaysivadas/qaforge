#!/usr/bin/env node

/**
 * Standalone project scanner.
 * Delegates to the main installer's scan logic.
 *
 * Usage: node scripts/scan-project.js [path]
 */

const { execSync } = require("child_process");
const path = require("path");

const targetDir = process.argv[2] || process.cwd();
const installScript = path.join(__dirname, "..", "bin", "install.js");

process.chdir(targetDir);
execSync(`node "${installScript}" --scan`, { stdio: "inherit" });
