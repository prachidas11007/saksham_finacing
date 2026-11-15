const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const candidateSrc = [
  path.join(process.cwd(), 'src'),
  path.join(process.cwd(), 'saksham-finance/src'),
  path.join(__dirname, '../src'),
];

const srcDir = candidateSrc.find((d) => fs.existsSync(d) && fs.statSync(d).isDirectory());

if (!srcDir) {
  console.error('FAIL [scan-hardcoded]: src directory not found.');
  process.exit(1);
}

function walk(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.expo') {
        files = files.concat(walk(fullPath));
      }
    } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

const allFiles = walk(srcDir);
let hasError = false;

const hexRegex = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/;
const fontSizeRegex = /fontSize\s*:\s*\d+/;

for (const filePath of allFiles) {
  const normalized = filePath.replace(/\\/g, '/');

  // Skip rules
  if (normalized.includes('/src/i18n/') || normalized.includes('/i18n/')) {
    continue;
  }
  if (normalized.endsWith('/constants/theme.ts') || normalized.endsWith('/src/constants/theme.ts')) {
    continue;
  }
  if (normalized.includes('/__tests__/') || /\.(test|spec)\.[jt]sx?$/.test(normalized)) {
    continue;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('// TEMP-DEMO') || normalized.toLowerCase().includes('temp-demo')) {
    continue;
  }

  const lines = content.split('\n');
  const isRupeeAllowed = normalized.endsWith('utils/currency.ts') || normalized.endsWith('utils/amount.ts');
  const isOfficialLinks = normalized.endsWith('data/officialLinks.ts');

  // Line-by-line checks
  lines.forEach((line, idx) => {
    const lineNum = idx + 1;

    // Hex colours
    if (hexRegex.test(line)) {
      console.error(`FAIL [scan-hardcoded]: Hex colour found at ${normalized}:${lineNum}: "${line.trim()}"`);
      hasError = true;
    }

    // fontSize numbers
    if (fontSizeRegex.test(line)) {
      console.error(`FAIL [scan-hardcoded]: Numeric fontSize found at ${normalized}:${lineNum}: "${line.trim()}"`);
      hasError = true;
    }

    // the ₹ sign
    if (!isRupeeAllowed && line.includes('₹')) {
      console.error(`FAIL [scan-hardcoded]: Hand-made ₹ sign found at ${normalized}:${lineNum}: "${line.trim()}"`);
      hasError = true;
    }

    // 'http' or 'tel:' outside src/data/officialLinks.ts
    if (!isOfficialLinks && (line.includes('http:') || line.includes('https:') || line.includes('tel:'))) {
      console.error(`FAIL [scan-hardcoded]: URL or phone protocol found outside officialLinks.ts at ${normalized}:${lineNum}: "${line.trim()}"`);
      hasError = true;
    }

    // toISOString(
    if (line.includes('toISOString(')) {
      console.error(`FAIL [scan-hardcoded]: toISOString( found at ${normalized}:${lineNum}: "${line.trim()}"`);
      hasError = true;
    }
  });

  // AST checks
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true
  );

  function visit(node) {
    // 1. Text directly inside JSX
    if (ts.isJsxText(node) && node.text.trim().length > 0) {
      const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
      console.error(`FAIL [scan-hardcoded]: Text directly inside JSX at ${normalized}:${line + 1}: "${node.text.trim()}"`);
      hasError = true;
    }

    // 2. placeholder/title/label/accessibilityLabel holding a plain string
    if (ts.isJsxAttribute(node)) {
      const propName = node.name.text;
      if (['placeholder', 'title', 'label', 'accessibilityLabel'].includes(propName)) {
        if (node.initializer && ts.isStringLiteral(node.initializer)) {
          const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
          console.error(`FAIL [scan-hardcoded]: JSX prop "${propName}" holds a plain string at ${normalized}:${line + 1}: "${node.initializer.text}"`);
          hasError = true;
        }
      }
    }

    if (ts.isPropertyAssignment(node)) {
      const propName = node.name.getText(sourceFile);
      if (['placeholder', 'title', 'label', 'accessibilityLabel'].includes(propName)) {
        if (node.initializer && ts.isStringLiteral(node.initializer)) {
          const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
          console.error(`FAIL [scan-hardcoded]: Object property "${propName}" holds a plain string at ${normalized}:${line + 1}: "${node.initializer.text}"`);
          hasError = true;
        }
      }
    }

    // 7. empty catch
    if (ts.isCatchClause(node)) {
      if (node.block.statements.length === 0) {
        const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
        console.error(`FAIL [scan-hardcoded]: Empty catch block found at ${normalized}:${line + 1}`);
        hasError = true;
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
}

if (hasError) {
  console.error('FAIL: scan-hardcoded found violations.');
  process.exit(1);
} else {
  console.log('PASS: scan-hardcoded passed.');
  process.exit(0);
}

