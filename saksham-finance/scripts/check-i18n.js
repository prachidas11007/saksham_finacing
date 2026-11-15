const fs = require('fs');
const path = require('path');

const candidateDirs = [
  path.join(process.cwd(), 'src/i18n/locales'),
  path.join(process.cwd(), 'saksham-finance/src/i18n/locales'),
  path.join(__dirname, '../src/i18n/locales'),
];

const localesDir = candidateDirs.find((dir) => fs.existsSync(dir));

if (!localesDir) {
  console.error('FAIL [check-i18n]: Locales directory not found in candidate paths.');
  process.exit(1);
}

const enPath = path.join(localesDir, 'en.json');
const hiPath = path.join(localesDir, 'hi.json');
const mrPath = path.join(localesDir, 'mr.json');

if (!fs.existsSync(enPath) || !fs.existsSync(hiPath) || !fs.existsSync(mrPath)) {
  console.error('FAIL [check-i18n]: Missing one or more locale JSON files (en.json, hi.json, mr.json).');
  process.exit(1);
}

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const hi = JSON.parse(fs.readFileSync(hiPath, 'utf8'));
const mr = JSON.parse(fs.readFileSync(mrPath, 'utf8'));

function flatten(obj, prefix = '') {
  const result = {};
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const val = obj[key];
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      Object.assign(result, flatten(val, fullKey));
    } else {
      result[fullKey] = val;
    }
  }
  return result;
}

const enFlat = flatten(en);
const hiFlat = flatten(hi);
const mrFlat = flatten(mr);

let hasError = false;

// 1. Key mismatch
const enKeys = new Set(Object.keys(enFlat));
const hiKeys = new Set(Object.keys(hiFlat));
const mrKeys = new Set(Object.keys(mrFlat));

function compareKeys(langCode, langKeys) {
  const missingInLang = [...enKeys].filter((k) => !langKeys.has(k));
  const extraInLang = [...langKeys].filter((k) => !enKeys.has(k));

  if (missingInLang.length > 0) {
    console.error(`FAIL [check-i18n]: ${langCode}.json is missing keys:`);
    for (const key of missingInLang) {
      console.error(`  - ${key}`);
    }
    hasError = true;
  }

  if (extraInLang.length > 0) {
    console.error(`FAIL [check-i18n]: ${langCode}.json contains unexpected extra keys:`);
    for (const key of extraInLang) {
      console.error(`  - ${key}`);
    }
    hasError = true;
  }
}

compareKeys('hi', hiKeys);
compareKeys('mr', mrKeys);

// 2. Array length mismatch and empty values
function validateValues(langCode, flatObj) {
  for (const [key, val] of Object.entries(flatObj)) {
    if (Array.isArray(val)) {
      const enVal = enFlat[key];
      if (Array.isArray(enVal) && enVal.length !== val.length) {
        console.error(
          `FAIL [check-i18n]: Array length mismatch at "${key}" in ${langCode}.json (expected ${enVal.length}, got ${val.length})`
        );
        hasError = true;
      }
      val.forEach((item, index) => {
        if (typeof item === 'string' && item.trim() === '') {
          console.error(
            `FAIL [check-i18n]: Empty value in array at "${key}[${index}]" in ${langCode}.json`
          );
          hasError = true;
        }
      });
    } else if (typeof val === 'string') {
      if (val.trim() === '') {
        console.error(`FAIL [check-i18n]: Empty string value at key "${key}" in ${langCode}.json`);
        hasError = true;
      }
    } else {
      console.error(`FAIL [check-i18n]: Unsupported value type at "${key}" in ${langCode}.json: ${typeof val}`);
      hasError = true;
    }
  }
}

validateValues('en', enFlat);
validateValues('hi', hiFlat);
validateValues('mr', mrFlat);

// 3. WARN (not fail) if a hi/mr string over 20 chars equals the English
function warnUntranslated(langCode, flatObj) {
  for (const [key, val] of Object.entries(flatObj)) {
    const enVal = enFlat[key];
    if (typeof val === 'string' && typeof enVal === 'string') {
      if (val.length > 20 && val === enVal) {
        console.warn(
          `WARN [check-i18n]: String in ${langCode}.json at "${key}" is over 20 chars and matches English: "${val}"`
        );
      }
    }
  }
}

warnUntranslated('hi', hiFlat);
warnUntranslated('mr', mrFlat);

if (hasError) {
  console.error('FAIL: check-i18n failed.');
  process.exit(1);
} else {
  console.log('PASS: check-i18n passed.');
  process.exit(0);
}

