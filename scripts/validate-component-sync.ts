#!/usr/bin/env tsx
/**
 * Validation script to ensure component registry and dynamic renderer are in sync.
 * This prevents "X is not defined" runtime errors by checking that all components
 * listed in COMPONENT_SCOPE are actually imported in the dynamic renderer.
 * 
 * Run with: npx tsx scripts/validate-component-sync.ts
 */

import fs from 'fs';
import path from 'path';

const REGISTRY_PATH = path.join(process.cwd(), 'lib', 'component-registry.ts');
const RENDERER_PATH = path.join(process.cwd(), 'lib', 'dynamic-renderer.tsx');

interface ValidationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
}

function extractComponentsFromRegistry(): string[] {
  const registryContent = fs.readFileSync(REGISTRY_PATH, 'utf-8');
  
  // Extract COMPONENT_SCOPE object
  const scopeMatch = registryContent.match(/export const COMPONENT_SCOPE = \{([\s\S]*?)\};/);
  if (!scopeMatch) {
    throw new Error('Could not find COMPONENT_SCOPE in component-registry.ts');
  }
  
  const scopeContent = scopeMatch[1];
  
  // Extract all component names from arrays
  const components: string[] = [];
  const arrayPattern = /\[([\s\S]*?)\]/g;
  let match;
  
  while ((match = arrayPattern.exec(scopeContent)) !== null) {
    const arrayContent = match[1];
    // Extract quoted strings
    const componentMatches = arrayContent.matchAll(/['"]([^'"]+)['"]/g);
    for (const compMatch of componentMatches) {
      components.push(compMatch[1]);
    }
  }
  
  return components;
}

function extractComponentsFromRenderer(): {
  imports: string[];
  scopeObject: string[];
} {
  const rendererContent = fs.readFileSync(RENDERER_PATH, 'utf-8');
  
  // Extract imported components
  const imports: string[] = [];
  const importPattern = /import\s+(?:\{([^}]+)\}|(\w+))\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  
  while ((match = importPattern.exec(rendererContent)) !== null) {
    const namedImports = match[1];
    const defaultImport = match[2];
    const source = match[3];
    
    // Only track component imports (shadcn UI, recharts, etc.)
    if (source.includes('@/components/ui') || source.includes('recharts')) {
      if (namedImports) {
        const components = namedImports.split(',').map(c => c.trim());
        imports.push(...components);
      }
      if (defaultImport) {
        imports.push(defaultImport);
      }
    }
    
    // Track react imports differently
    if (source === 'react') {
      if (namedImports) {
        const reactImports = namedImports.split(',').map(c => c.trim());
        imports.push(...reactImports);
      }
      if (defaultImport) {
        imports.push(defaultImport);
      }
    }
    
    // Track other imports we care about
    if (source === 'lucide-react' || source === 'framer-motion' || source === '@number-flow/react') {
      if (namedImports) {
        imports.push(...namedImports.split(',').map(c => c.trim()));
      }
      if (defaultImport) {
        imports.push(defaultImport);
      }
    }
  }
  
  // Extract components from scope object - more robust parsing
  const scopeMatch = rendererContent.match(/const scope = \{([\s\S]*?)\n\s*\};/);
  if (!scopeMatch) {
    throw new Error('Could not find scope object in dynamic-renderer.tsx');
  }
  
  const scopeContent = scopeMatch[1];
  const scopeComponents: string[] = [];
  
  // Remove comments first
  const cleanedContent = scopeContent.replace(/\/\/.*$/gm, '');
  
  // Split by lines and extract property names
  const lines = cleanedContent.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//')) continue;
    
    // Match: propertyName: value or propertyName,
    const propertyMatch = trimmed.match(/^([a-zA-Z][a-zA-Z0-9]*)\s*[,:]/);
    if (propertyMatch) {
      scopeComponents.push(propertyMatch[1]);
    } else {
      // Match: standalone names (e.g., "React," or "Badge," or "motion,")
      const standaloneMatch = trimmed.match(/^([a-zA-Z][a-zA-Z0-9]*),?\s*$/);
      if (standaloneMatch) {
        scopeComponents.push(standaloneMatch[1]);
      }
    }
  }
  
  // Also catch components on same line separated by commas (both uppercase and lowercase)
  const sameLinePattern = /\b([a-zA-Z][a-zA-Z0-9]*)\s*,/g;
  while ((match = sameLinePattern.exec(cleanedContent)) !== null) {
    if (!scopeComponents.includes(match[1])) {
      scopeComponents.push(match[1]);
    }
  }
  
  // Catch last items on lines (without trailing comma)
  const lastItemPattern = /,\s*([a-zA-Z][a-zA-Z0-9]*)\s*$/gm;
  while ((match = lastItemPattern.exec(cleanedContent)) !== null) {
    if (!scopeComponents.includes(match[1])) {
      scopeComponents.push(match[1]);
    }
  }
  
  return { imports, scopeObject: scopeComponents };
}

function validateSync(): ValidationResult {
  const result: ValidationResult = {
    success: true,
    errors: [],
    warnings: []
  };
  
  console.log('🔍 Validating component sync...\n');
  
  const registryComponents = extractComponentsFromRegistry();
  const { imports: rendererImports, scopeObject: rendererScope } = extractComponentsFromRenderer();
  
  console.log(`📋 Found ${registryComponents.length} components in registry`);
  console.log(`📦 Found ${rendererImports.length} imports in renderer`);
  console.log(`🎯 Found ${rendererScope.length} components in scope object\n`);
  
  // Check 1: All registry components should be in renderer scope
  const missingInScope: string[] = [];
  for (const component of registryComponents) {
    if (!rendererScope.includes(component)) {
      missingInScope.push(component);
    }
  }
  
  if (missingInScope.length > 0) {
    result.success = false;
    result.errors.push(
      `❌ Components in COMPONENT_SCOPE but missing from dynamic-renderer scope object:\n   ${missingInScope.join(', ')}\n   Add them to the scope object in dynamic-renderer.tsx`
    );
  }
  
  // Check 2: All scope components should be imported (except React hooks)
  const notImported: string[] = [];
  const reactHooks = ['useState', 'useMemo', 'useCallback', 'useRef', 'useEffect'];
  const utilityNames = ['Icons', 'motion', 'cn', 'NumberFlow', 'React'];
  
  for (const component of rendererScope) {
    if (reactHooks.includes(component)) continue;
    if (utilityNames.includes(component)) continue;
    
    // Check if it's available via imports or React namespace
    const availableViaReact = component.startsWith('use') || component === 'React';
    if (!availableViaReact && !rendererImports.some(imp => imp.includes(component))) {
      notImported.push(component);
    }
  }
  
  if (notImported.length > 0) {
    result.warnings.push(
      `⚠️  Components in scope but not clearly imported:\n   ${notImported.join(', ')}\n   (This might be OK if they're destructured differently)`
    );
  }
  
  // Check 3: Renderer scope should include all registry components
  const extraInScope: string[] = [];
  for (const component of rendererScope) {
    if (!registryComponents.includes(component)) {
      extraInScope.push(component);
    }
  }
  
  if (extraInScope.length > 0) {
    result.warnings.push(
      `ℹ️  Components in renderer scope but not in COMPONENT_SCOPE:\n   ${extraInScope.join(', ')}\n   Consider adding them to component-registry.ts if they're meant to be used by the AI`
    );
  }
  
  return result;
}

function main() {
  try {
    const result = validateSync();
    
    // Print errors
    if (result.errors.length > 0) {
      console.log('\n❌ ERRORS:\n');
      result.errors.forEach(error => console.log(error + '\n'));
    }
    
    // Print warnings
    if (result.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:\n');
      result.warnings.forEach(warning => console.log(warning + '\n'));
    }
    
    // Print success
    if (result.success && result.warnings.length === 0) {
      console.log('✅ All components are in sync!\n');
    } else if (result.success) {
      console.log('✅ No critical errors, but review warnings above.\n');
    }
    
    process.exit(result.success ? 0 : 1);
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
}

main();

