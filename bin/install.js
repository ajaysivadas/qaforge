#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");

const VERSION = "1.0.0";
const PACKAGE_ROOT = path.resolve(__dirname, "..");

// ── Path constants ───────────────────────────────────────────────────────
const CLAUDE_DIR = ".claude";
const COMMANDS_DIR = path.join("commands", "qa");
const KNOWLEDGE_DIR = "qaforge-knowledge";
const CONTEXT_FILE = "qaforge-context.md";

const CLAUDE_GLOBAL = path.join(os.homedir(), CLAUDE_DIR);
const CLAUDE_LOCAL = path.join(process.cwd(), CLAUDE_DIR);

// ── Colors ───────────────────────────────────────────────────────────────
const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
};

// ── Verbose logging ──────────────────────────────────────────────────────
let verbose = false;

function log(msg) {
  console.log(msg);
}

function debug(msg) {
  if (verbose) log(`${c.dim}  [debug] ${msg}${c.reset}`);
}

function banner() {
  log("");
  log(
    `${c.cyan}${c.bold}  ╔═══════════════════════════════════════╗${c.reset}`
  );
  log(
    `${c.cyan}${c.bold}  ║           QA FORGE v${VERSION}            ║${c.reset}`
  );
  log(
    `${c.cyan}${c.bold}  ║   QA Workflow System for Claude Code  ║${c.reset}`
  );
  log(
    `${c.cyan}${c.bold}  ╚═══════════════════════════════════════╝${c.reset}`
  );
  log("");
}

// ── Command descriptions (single source of truth) ────────────────────────
const COMMANDS = [
  { name: "test-plan", short: "Test strategy from features/PRs", desc: "Generate a comprehensive test plan from a feature, PR, or user story" },
  { name: "test-cases", short: "Detailed test case generation", desc: "Produce structured positive, negative, edge, and boundary test cases" },
  { name: "api-scaffold", short: "Full API test code scaffolding", desc: "Scaffold API test suite with executors, POJOs, test classes, and suite XML" },
  { name: "app-scaffold", short: "Mobile app test scaffolding", desc: "Scaffold mobile tests with screen objects and UI test flows (Appium/Selenide)" },
  { name: "bug-investigate", short: "Root cause analysis", desc: "Investigate failures using logs, Allure reports, or stack traces" },
  { name: "regression-plan", short: "Impact-based regression plan", desc: "Analyze code changes to build a prioritized regression test plan" },
  { name: "test-data", short: "Test data generation", desc: "Generate test data for JSON payloads, DataProviders, DB fixtures, and CSV" },
  { name: "flaky-detect", short: "Flaky test detection", desc: "Detect flaky tests and classify them across 10 failure patterns" },
  { name: "coverage-gap", short: "Coverage gap analysis", desc: "Find untested areas by comparing tests against endpoints or requirements" },
];

// ── File operations ──────────────────────────────────────────────────────

function ensureDir(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      debug(`Created directory: ${dirPath}`);
    }
  } catch (err) {
    log(`${c.red}  ERROR: Cannot create directory ${dirPath}${c.reset}`);
    log(`${c.dim}  ${err.message}${c.reset}`);
    process.exit(1);
  }
}

function copyDir(src, dest) {
  ensureDir(dest);
  let entries;
  try {
    entries = fs.readdirSync(src, { withFileTypes: true });
  } catch (err) {
    log(`${c.red}  ERROR: Cannot read directory ${src}${c.reset}`);
    log(`${c.dim}  ${err.message}${c.reset}`);
    return;
  }
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      try {
        fs.copyFileSync(srcPath, destPath);
        debug(`Copied: ${entry.name}`);
      } catch (err) {
        log(
          `${c.yellow}  [WARN] Failed to copy ${entry.name}: ${err.message}${c.reset}`
        );
      }
    }
  }
}

function removeDir(dirPath) {
  try {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
      debug(`Removed: ${dirPath}`);
      return true;
    }
  } catch (err) {
    log(
      `${c.yellow}  [WARN] Could not remove ${dirPath}: ${err.message}${c.reset}`
    );
  }
  return false;
}

function removeFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      debug(`Removed: ${filePath}`);
      return true;
    }
  } catch (err) {
    log(
      `${c.yellow}  [WARN] Could not remove ${filePath}: ${err.message}${c.reset}`
    );
  }
  return false;
}

function countFiles(dir, ext) {
  let count = 0;
  if (!fs.existsSync(dir)) return 0;
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    return 0;
  }
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += countFiles(fullPath, ext);
    } else if (entry.name.endsWith(ext)) {
      count++;
    }
  }
  return count;
}

function listFiles(dir, ext) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    return files;
  }
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(fullPath, ext));
    } else if (entry.name.endsWith(ext)) {
      files.push(fullPath);
    }
  }
  return files;
}

function safeWriteFile(filePath, content) {
  try {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, content);
    debug(`Wrote: ${filePath}`);
    return true;
  } catch (err) {
    log(`${c.red}  ERROR: Cannot write ${filePath}${c.reset}`);
    log(`${c.dim}  ${err.message}${c.reset}`);
    return false;
  }
}

// ── Install to a target ──────────────────────────────────────────────────

function installTo(targetBase, label, { withScan = false } = {}) {
  log(`${c.cyan}  Installing to ${label} ...${c.reset}`);

  // Install commands
  const commandsSrc = path.join(PACKAGE_ROOT, "commands", "qa");
  const commandsDest = path.join(targetBase, COMMANDS_DIR);

  if (!fs.existsSync(commandsSrc)) {
    log(
      `${c.red}  ERROR: Commands source not found at ${commandsSrc}${c.reset}`
    );
    return false;
  }

  ensureDir(commandsDest);
  copyDir(commandsSrc, commandsDest);
  const cmdCount = countFiles(commandsDest, ".md");
  log(
    `${c.green}  [OK]${c.reset} Installed ${c.bold}${cmdCount} commands${c.reset} to ${label}${COMMANDS_DIR}/`
  );

  // Install knowledge
  const knowledgeSrc = path.join(PACKAGE_ROOT, "knowledge");
  const knowledgeDest = path.join(targetBase, KNOWLEDGE_DIR);

  if (!fs.existsSync(knowledgeSrc)) {
    log(`${c.yellow}  [SKIP]${c.reset} Knowledge base not found`);
  } else {
    ensureDir(knowledgeDest);
    copyDir(knowledgeSrc, knowledgeDest);
    const kbCount = countFiles(knowledgeDest, ".md");
    log(
      `${c.green}  [OK]${c.reset} Installed ${c.bold}${kbCount} knowledge files${c.reset} to ${label}${KNOWLEDGE_DIR}/`
    );
  }

  // Scan if requested
  if (withScan) {
    log(`\n${c.cyan}  Scanning project for context...${c.reset}`);
    const context = scanAndGenerateContext();
    const outPath = path.join(targetBase, CONTEXT_FILE);
    if (safeWriteFile(outPath, context)) {
      log(
        `${c.green}  [OK]${c.reset} Project context saved to ${label}${CONTEXT_FILE}`
      );
    }
  }

  return true;
}

// ── Uninstall ────────────────────────────────────────────────────────────

function uninstall() {
  banner();
  log(`${c.cyan}  Uninstalling QA Forge...${c.reset}`);
  log("");

  let removed = 0;

  // Global
  const globalCmds = path.join(CLAUDE_GLOBAL, COMMANDS_DIR);
  const globalKb = path.join(CLAUDE_GLOBAL, KNOWLEDGE_DIR);
  if (removeDir(globalCmds)) {
    log(`${c.green}  [OK]${c.reset} Removed global commands (~/.claude/${COMMANDS_DIR}/)`);
    removed++;
  }
  if (removeDir(globalKb)) {
    log(`${c.green}  [OK]${c.reset} Removed global knowledge (~/.claude/${KNOWLEDGE_DIR}/)`);
    removed++;
  }

  // Local
  const localCmds = path.join(CLAUDE_LOCAL, COMMANDS_DIR);
  const localKb = path.join(CLAUDE_LOCAL, KNOWLEDGE_DIR);
  const localCtx = path.join(CLAUDE_LOCAL, CONTEXT_FILE);
  if (removeDir(localCmds)) {
    log(`${c.green}  [OK]${c.reset} Removed local commands (.claude/${COMMANDS_DIR}/)`);
    removed++;
  }
  if (removeDir(localKb)) {
    log(`${c.green}  [OK]${c.reset} Removed local knowledge (.claude/${KNOWLEDGE_DIR}/)`);
    removed++;
  }
  if (removeFile(localCtx)) {
    log(`${c.green}  [OK]${c.reset} Removed local context (.claude/${CONTEXT_FILE})`);
    removed++;
  }

  log("");
  if (removed === 0) {
    log(`${c.dim}  Nothing to remove — QA Forge is not installed.${c.reset}`);
  } else {
    log(`${c.green}${c.bold}  Uninstall complete.${c.reset} Removed ${removed} item(s).`);
  }
  log("");
}

// ── Verify installation ──────────────────────────────────────────────────

function verify() {
  banner();
  log(`${c.cyan}  Verifying QA Forge installation...${c.reset}`);
  log("");

  let issues = 0;

  // Check global
  const globalCmds = path.join(CLAUDE_GLOBAL, COMMANDS_DIR);
  const globalKb = path.join(CLAUDE_GLOBAL, KNOWLEDGE_DIR);

  log(`${c.bold}  Global (~/.claude/)${c.reset}`);
  if (fs.existsSync(globalCmds)) {
    const count = countFiles(globalCmds, ".md");
    const expected = COMMANDS.length;
    if (count === expected) {
      log(`${c.green}    [OK]${c.reset} Commands: ${count}/${expected}`);
    } else {
      log(`${c.yellow}    [!!]${c.reset} Commands: ${count}/${expected} (missing ${expected - count})`);
      issues++;
    }
  } else {
    log(`${c.dim}    [--]${c.reset} Commands: not installed`);
  }

  if (fs.existsSync(globalKb)) {
    const count = countFiles(globalKb, ".md");
    log(`${c.green}    [OK]${c.reset} Knowledge files: ${count}`);
  } else {
    log(`${c.dim}    [--]${c.reset} Knowledge: not installed`);
  }

  // Check local
  const localCmds = path.join(CLAUDE_LOCAL, COMMANDS_DIR);
  const localKb = path.join(CLAUDE_LOCAL, KNOWLEDGE_DIR);
  const localCtx = path.join(CLAUDE_LOCAL, CONTEXT_FILE);

  log("");
  log(`${c.bold}  Local (.claude/)${c.reset}`);
  if (fs.existsSync(localCmds)) {
    const count = countFiles(localCmds, ".md");
    log(`${c.green}    [OK]${c.reset} Commands: ${count}`);
  } else {
    log(`${c.dim}    [--]${c.reset} Commands: not installed`);
  }
  if (fs.existsSync(localKb)) {
    const count = countFiles(localKb, ".md");
    log(`${c.green}    [OK]${c.reset} Knowledge files: ${count}`);
  } else {
    log(`${c.dim}    [--]${c.reset} Knowledge: not installed`);
  }
  if (fs.existsSync(localCtx)) {
    log(`${c.green}    [OK]${c.reset} Project context: found`);
  } else {
    log(`${c.dim}    [--]${c.reset} Project context: not generated (run --scan)`);
  }

  // Verify individual command files
  log("");
  log(`${c.bold}  Command files:${c.reset}`);
  const searchDir = fs.existsSync(globalCmds) ? globalCmds : localCmds;
  if (fs.existsSync(searchDir)) {
    for (const cmd of COMMANDS) {
      const filePath = path.join(searchDir, `${cmd.name}.md`);
      if (fs.existsSync(filePath)) {
        log(`${c.green}    [OK]${c.reset} /qa:${cmd.name}`);
      } else {
        log(`${c.red}    [!!]${c.reset} /qa:${cmd.name} — MISSING`);
        issues++;
      }
    }
  } else {
    log(`${c.dim}    No commands directory found.${c.reset}`);
  }

  log("");
  if (issues === 0) {
    log(`${c.green}${c.bold}  Verification passed.${c.reset}`);
  } else {
    log(`${c.yellow}${c.bold}  Found ${issues} issue(s).${c.reset} Run ${c.bold}npx qaforge --global${c.reset} to reinstall.`);
  }
  log("");
}

// ── List installed files ─────────────────────────────────────────────────

function listInstalled() {
  banner();

  const globalCmds = path.join(CLAUDE_GLOBAL, COMMANDS_DIR);
  const globalKb = path.join(CLAUDE_GLOBAL, KNOWLEDGE_DIR);
  const localCmds = path.join(CLAUDE_LOCAL, COMMANDS_DIR);
  const localKb = path.join(CLAUDE_LOCAL, KNOWLEDGE_DIR);
  const localCtx = path.join(CLAUDE_LOCAL, CONTEXT_FILE);

  // Determine where commands are installed
  const cmdDir = fs.existsSync(globalCmds)
    ? globalCmds
    : fs.existsSync(localCmds)
    ? localCmds
    : null;
  const kbDir = fs.existsSync(globalKb)
    ? globalKb
    : fs.existsSync(localKb)
    ? localKb
    : null;

  if (!cmdDir && !kbDir) {
    log(
      `${c.yellow}  QA Forge is not installed.${c.reset} Run ${c.bold}npx qaforge${c.reset} to install.`
    );
    log("");
    return;
  }

  log(`${c.bold}  Installed Commands:${c.reset}`);
  log(`${c.dim}  ──────────────────────────────────────────────────────────────${c.reset}`);
  if (cmdDir) {
    for (const cmd of COMMANDS) {
      const filePath = path.join(cmdDir, `${cmd.name}.md`);
      const status = fs.existsSync(filePath) ? c.green + "●" : c.red + "○";
      log(`  ${status}${c.reset} /qa:${cmd.name.padEnd(18)} ${c.dim}${cmd.desc}${c.reset}`);
    }
  } else {
    log(`${c.dim}  No commands installed.${c.reset}`);
  }

  log("");
  log(`${c.bold}  Knowledge Base:${c.reset}`);
  log(`${c.dim}  ──────────────────────────────────────────────────────────────${c.reset}`);
  if (kbDir) {
    const kbFiles = listFiles(kbDir, ".md");
    for (const f of kbFiles) {
      const rel = path.relative(kbDir, f);
      log(`  ${c.green}●${c.reset} ${rel}`);
    }
  } else {
    log(`${c.dim}  No knowledge files installed.${c.reset}`);
  }

  log("");
  log(`${c.bold}  Project Context:${c.reset}`);
  log(`${c.dim}  ──────────────────────────────────────────────────────────────${c.reset}`);
  if (fs.existsSync(localCtx)) {
    log(`  ${c.green}●${c.reset} .claude/${CONTEXT_FILE}`);
  } else {
    log(`  ${c.dim}○ Not generated — run ${c.bold}npx qaforge --scan${c.reset}`);
  }

  log("");
}

// ── Scan project and generate context ────────────────────────────────────

function scanAndGenerateContext() {
  const cwd = process.cwd();
  const context = [];

  context.push(`# QA Forge - Project Context`);
  context.push(`# Auto-generated by qaforge scan`);
  context.push(`# Generated: ${new Date().toISOString()}`);
  context.push(`# Project: ${path.basename(cwd)}`);
  context.push("");

  // Detect framework
  const hasPom = fs.existsSync(path.join(cwd, "pom.xml"));
  const hasGradle = fs.existsSync(path.join(cwd, "build.gradle"));
  const hasRequirements = fs.existsSync(path.join(cwd, "requirements.txt"));
  const hasPyproject = fs.existsSync(path.join(cwd, "pyproject.toml"));
  const hasPytest = fs.existsSync(path.join(cwd, "pytest.ini"));
  const hasSetupPy = fs.existsSync(path.join(cwd, "setup.py"));
  const hasPackageJson = fs.existsSync(path.join(cwd, "package.json"));

  if (hasPom) {
    context.push("## Framework: Java/Maven");
    debug("Detected pom.xml");
    try {
      const pom = fs.readFileSync(path.join(cwd, "pom.xml"), "utf8");
      if (pom.includes("testng")) context.push("- Test Runner: TestNG");
      if (pom.includes("rest-assured"))
        context.push("- HTTP Client: RestAssured");
      if (pom.includes("appium")) context.push("- Mobile: Appium");
      if (pom.includes("selenide")) context.push("- UI Helper: Selenide");
      if (pom.includes("allure")) context.push("- Reporting: Allure");
      if (pom.includes("junit")) context.push("- Test Runner: JUnit");

      // Extract profiles — only <id> tags inside <profile> blocks
      const profileBlockRegex = /<profile>\s*<id>([^<]+)<\/id>/g;
      const profiles = [];
      let match;
      while ((match = profileBlockRegex.exec(pom)) !== null) {
        profiles.push(match[1]);
      }
      if (profiles.length > 0) {
        context.push(`\n### Maven Profiles (${profiles.length})`);
        profiles.forEach((p) => context.push(`- ${p}`));
      }
    } catch (e) {
      debug(`Failed to parse pom.xml: ${e.message}`);
    }
  }

  if (hasGradle) {
    context.push("## Framework: Java/Gradle");
    debug("Detected build.gradle");
    try {
      const gradle = fs.readFileSync(path.join(cwd, "build.gradle"), "utf8");
      if (gradle.includes("testng")) context.push("- Test Runner: TestNG");
      if (gradle.includes("rest-assured"))
        context.push("- HTTP Client: RestAssured");
      if (gradle.includes("junit")) context.push("- Test Runner: JUnit");
      if (gradle.includes("allure")) context.push("- Reporting: Allure");
    } catch (e) {
      debug(`Failed to parse build.gradle: ${e.message}`);
    }
  }

  if (hasRequirements || hasPytest || hasPyproject || hasSetupPy) {
    context.push("## Framework: Python");
    debug("Detected Python project");
    try {
      const reqs = hasRequirements
        ? fs.readFileSync(path.join(cwd, "requirements.txt"), "utf8")
        : "";
      const pyproject = hasPyproject
        ? fs.readFileSync(path.join(cwd, "pyproject.toml"), "utf8")
        : "";
      const combined = reqs + "\n" + pyproject;

      if (combined.includes("pytest") || hasPytest)
        context.push("- Test Runner: pytest");
      if (combined.includes("allure")) context.push("- Reporting: Allure");
      if (combined.includes("google-cloud"))
        context.push("- Cloud: Google Cloud");
      if (combined.includes("redis")) context.push("- Cache: Redis");
      if (combined.includes("requests")) context.push("- HTTP Client: requests");
      if (combined.includes("httpx")) context.push("- HTTP Client: httpx");
    } catch (e) {
      debug(`Failed to parse Python config: ${e.message}`);
    }
  }

  if (hasPackageJson) {
    context.push("## Framework: Node.js");
    debug("Detected package.json");
    try {
      const pkg = JSON.parse(
        fs.readFileSync(path.join(cwd, "package.json"), "utf8")
      );
      const deps = {
        ...pkg.dependencies,
        ...pkg.devDependencies,
      };
      if (deps.mocha) context.push("- Test Runner: Mocha");
      if (deps.jest) context.push("- Test Runner: Jest");
      if (deps["@playwright/test"] || deps.playwright)
        context.push("- Browser: Playwright");
      if (deps.cypress) context.push("- Browser: Cypress");
      if (deps.supertest) context.push("- HTTP Testing: Supertest");
      if (deps.vitest) context.push("- Test Runner: Vitest");
    } catch (e) {
      debug(`Failed to parse package.json: ${e.message}`);
    }
  }

  // Count test files
  context.push("\n## Test Inventory");
  const testDirs = ["src/test", "tests", "test", "spec", "__tests__"];
  for (const dir of testDirs) {
    const fullDir = path.join(cwd, dir);
    if (fs.existsSync(fullDir)) {
      const javaCount = countFiles(fullDir, ".java");
      const pyCount = countFiles(fullDir, ".py");
      const jsCount = countFiles(fullDir, ".js");
      const tsCount = countFiles(fullDir, ".ts");
      if (javaCount) context.push(`- Java test files: ${javaCount}`);
      if (pyCount) context.push(`- Python test files: ${pyCount}`);
      if (jsCount) context.push(`- JavaScript test files: ${jsCount}`);
      if (tsCount) context.push(`- TypeScript test files: ${tsCount}`);
    }
  }

  // Check for CLAUDE.md
  const claudeMd = path.join(cwd, "CLAUDE.md");
  if (fs.existsSync(claudeMd)) {
    context.push("\n## Existing CLAUDE.md: Yes");
    context.push(
      "The project has a CLAUDE.md with framework-specific guidance."
    );
  }

  // Check for CI
  const ciFiles = [
    ".github/workflows",
    ".gitlab-ci.yml",
    "Jenkinsfile",
    ".circleci",
  ];
  for (const ci of ciFiles) {
    if (fs.existsSync(path.join(cwd, ci))) {
      context.push(`\n## CI/CD: ${ci}`);
    }
  }

  return context.join("\n");
}

// ── Print command summary ────────────────────────────────────────────────

function printCommandSummary() {
  log("");
  log(`${c.green}${c.bold}  Installation complete!${c.reset}`);
  log("");
  log(`${c.bold}  Available commands in Claude Code:${c.reset}`);
  log(
    `${c.dim}  ──────────────────────────────────────${c.reset}`
  );
  for (const cmd of COMMANDS) {
    const pad = ".".repeat(Math.max(1, 22 - cmd.name.length));
    log(`  /qa:${cmd.name} ${c.dim}${pad}${c.reset} ${cmd.short}`);
  }
  log(
    `${c.dim}  ──────────────────────────────────────${c.reset}`
  );
  log("");
  log(
    `${c.dim}  Tip: Run 'npx qaforge --scan' inside any project to generate context.${c.reset}`
  );
  log("");
}

// ── Main ─────────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);
  verbose = args.includes("--verbose");

  const isLocal = args.includes("--local");
  const isGlobal = args.includes("--global");
  const isScan = args.includes("--scan");
  const isHelp = args.includes("--help") || args.includes("-h");
  const isVersion = args.includes("--version") || args.includes("-v");
  const isUninstall = args.includes("--uninstall");
  const isVerify = args.includes("--verify");
  const isList = args.includes("--list");

  if (isVersion) {
    log(`qaforge v${VERSION}`);
    process.exit(0);
  }

  if (isHelp) {
    banner();
    log(`${c.bold}  Usage:${c.reset}`);
    log(`    npx qaforge              Install globally + scan current project`);
    log(`    npx qaforge --global     Install to ~/.claude/ (all projects)`);
    log(`    npx qaforge --local      Install to ./.claude/ (this project only)`);
    log(
      `    npx qaforge --scan       Scan project and generate context file`
    );
    log(`    npx qaforge --list       Show installed commands and knowledge`);
    log(`    npx qaforge --verify     Check installation integrity`);
    log(`    npx qaforge --uninstall  Remove QA Forge from ~/.claude/ and ./.claude/`);
    log(`    npx qaforge --verbose    Show detailed debug output`);
    log(`    npx qaforge --help       Show this help`);
    log(`    npx qaforge --version    Show version`);
    log("");
    log(`${c.bold}  Commands:${c.reset}`);
    for (const cmd of COMMANDS) {
      log(`    /qa:${cmd.name.padEnd(18)} ${c.dim}${cmd.desc}${c.reset}`);
    }
    log("");
    process.exit(0);
  }

  if (isUninstall) {
    uninstall();
    process.exit(0);
  }

  if (isVerify) {
    verify();
    process.exit(0);
  }

  if (isList) {
    listInstalled();
    process.exit(0);
  }

  banner();

  // Scan mode
  if (isScan) {
    log(`${c.cyan}  Scanning project...${c.reset}`);
    const context = scanAndGenerateContext();
    const outPath = path.join(process.cwd(), CLAUDE_DIR, CONTEXT_FILE);
    if (safeWriteFile(outPath, context)) {
      log(
        `${c.green}  [OK]${c.reset} Project context written to ${c.bold}.claude/${CONTEXT_FILE}${c.reset}`
      );
      log(
        `${c.dim}  This file helps QA Forge commands understand your project.${c.reset}`
      );
    }
    log("");
    process.exit(0);
  }

  // Install mode
  if (isGlobal) {
    installTo(CLAUDE_GLOBAL, "~/.claude/");
    printCommandSummary();
  } else if (isLocal) {
    installTo(CLAUDE_LOCAL, ".claude/", { withScan: true });
    printCommandSummary();
  } else {
    // Default: install globally + scan current project
    installTo(CLAUDE_GLOBAL, "~/.claude/");
    log("");
    log(`${c.cyan}  Scanning current project...${c.reset}`);
    const context = scanAndGenerateContext();
    const outPath = path.join(CLAUDE_LOCAL, CONTEXT_FILE);
    if (safeWriteFile(outPath, context)) {
      log(
        `${c.green}  [OK]${c.reset} Project context saved to .claude/${CONTEXT_FILE}`
      );
    }
    printCommandSummary();
  }
}

main();
