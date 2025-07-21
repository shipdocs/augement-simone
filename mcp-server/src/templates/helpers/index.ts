/**
 * @module TemplateHelpers
 * @description Exports all custom Handlebars helpers for the templating system
 */

import Handlebars from 'handlebars';

/**
 * Register all custom Handlebars helpers
 */
export function registerHelpers(): void {
  // Register equality helper for comparisons
  Handlebars.registerHelper('eq', function(a: any, b: any) {
    return a === b;
  });
  
  // Register comparison helpers
  Handlebars.registerHelper('lt', function(a: any, b: any) {
    return a < b;
  });
  
  Handlebars.registerHelper('lte', function(a: any, b: any) {
    return a <= b;
  });
  
  Handlebars.registerHelper('gt', function(a: any, b: any) {
    return a > b;
  });
  
  Handlebars.registerHelper('gte', function(a: any, b: any) {
    return a >= b;
  });
}