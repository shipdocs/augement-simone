import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { promises as fs } from 'fs';
import path from 'path';

export async function installLegacy(dryRun = false) {
  console.log(chalk.yellow.bold('⚠️  LEGACY VERSION NOTICE ⚠️\n'));
  console.log(chalk.white(
    'The legacy version of Simone is being phased out.\n' +
    'We recommend using the new MCP version instead.\n'
  ));

  const { confirmLegacy } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmLegacy',
      message: 'Do you want to continue with legacy installation?',
      default: false
    }
  ]);

  if (!confirmLegacy) {
    console.log(chalk.cyan('\nTo install the MCP version, run:'));
    console.log(chalk.white('  npx hello-simone --mcp\n'));
    process.exit(0);
  }

  const spinner = ora();

  try {
    // Create directory structure
    spinner.start('Creating .simone directory structure...');
    
    const directories = [
      '.simone',
      '.simone/01_PROJECT_DOCS',
      '.simone/02_REQUIREMENTS',
      '.simone/03_SPRINTS',
      '.simone/04_TASKS',
      '.simone/04_TASKS/GENERAL'
    ];

    if (!dryRun) {
      for (const dir of directories) {
        await fs.mkdir(dir, { recursive: true });
      }
    }
    
    spinner.succeed('Created directory structure');

    // Create project manifest
    spinner.start('Creating project manifest...');
    
    const manifestContent = `# PROJECT MANIFEST

## Project Name
[Your Project Name]

## Project Description
[Brief description of your project]

## Project Status
- Created: ${new Date().toISOString().split('T')[0]}
- Status: Active
- Version: 0.0.1

## Team
- AI Assistant: Claude
- Human: [Your Name]

---
*Managed by Simone Legacy System*
`;

    if (!dryRun) {
      await fs.writeFile('.simone/00_PROJECT_MANIFEST.md', manifestContent);
    }
    
    spinner.succeed('Created project manifest');

    console.log(chalk.green.bold('\n✅ Legacy Simone installation complete!\n'));
    console.log(chalk.yellow('Note: The legacy system has limited functionality.'));
    console.log(chalk.cyan('For full features, consider migrating to MCP version:'));
    console.log(chalk.white('  npx hello-simone --mcp\n'));

  } catch (error) {
    spinner.fail('Installation failed');
    throw error;
  }
}