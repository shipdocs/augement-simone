/**
 * @module FeatureHelper
 * @description Custom Handlebars helper for conditional partial inclusion based on project configuration.
 * Enables clean templates without if/else blocks.
 */

import Handlebars from 'handlebars';
import { ConfigLoader } from '../../config/index.js';
import { ResolvedContext } from '../../config/types.js';
import { logError } from '../../utils/logger.js';

interface FeatureResult {
  context: ResolvedContext;
  feature: any;
}

interface FeatureHelperContext {
  results: FeatureResult[];
}

/**
 * Register the 'feature' helper for conditional partial inclusion
 * Usage: {{feature "tooling.lint"}}
 */
export function registerFeatureHelper(handlebars: typeof Handlebars, configLoader: ConfigLoader) {
  handlebars.registerHelper('feature', function(this: any, featurePath: string, options: Handlebars.HelperOptions) {
    if (!featurePath || typeof featurePath !== 'string') {
      // Invalid argument - silently return empty
      return '';
    }

    // Get all contexts with resolved configuration
    const contexts = configLoader.getResolvedContexts();
    const results: FeatureResult[] = [];

    // Collect enabled features from all contexts
    for (const context of contexts) {
      const feature = getFeatureFromContext(context, featurePath);
      if (feature?.enabled === true) {
        results.push({ context, feature });
      }
    }

    // If no enabled features found, return empty
    if (results.length === 0) {
      return '';
    }

    // Determine partial name from feature path
    // e.g., "tooling.lint" -> "tooling-lint"
    const partialName = featurePath.replace(/\./g, '-');
    
    // Check if partial exists
    const partial = handlebars.partials[partialName];
    if (!partial) {
      // Partial not found - silently return empty
      return '';
    }

    // Prepare context for the partial
    const partialContext: FeatureHelperContext = { results };
    
    // Render the partial with the results
    try {
      // Ensure partial is compiled if it's a string
      const compiledPartial = typeof partial === 'string' 
        ? handlebars.compile(partial) 
        : partial;
      
      return new handlebars.SafeString(compiledPartial(partialContext));
    } catch (error) {
      logError(new Error(`Error rendering partial '${partialName}' for feature '${featurePath}': ${error}`));
      return '';
    }
  });
}

/**
 * Extract feature configuration from a context using dot notation path
 */
function getFeatureFromContext(context: ResolvedContext, path: string): any {
  const parts = path.split('.');
  let current: any = context;
  
  // Use resolved values when available
  if (parts[0] === 'tooling' && context.resolvedTooling) {
    current = { tooling: context.resolvedTooling };
  } else if (parts[0] === 'methodology' && context.resolvedMethodology) {
    current = { methodology: context.resolvedMethodology };
  }
  
  // Navigate through the path
  for (const part of parts) {
    if (current && typeof current === 'object') {
      current = current[part];
    } else {
      return null;
    }
  }
  
  return current;
}