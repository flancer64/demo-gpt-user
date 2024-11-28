#!/usr/bin/env node
'use strict';
/**
 * Bootstrap script for initializing and running a Tequila Framework (TeqFW) application as a Node.js program.
 */
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import teq from '@teqfw/core';

const currentFileUrl = new URL(import.meta.url);
const currentFilePath = fileURLToPath(currentFileUrl);
const binDirectoryPath = dirname(currentFilePath);
const applicationRootPath = join(binDirectoryPath, '..');

teq({path: applicationRootPath}).catch(console.error);