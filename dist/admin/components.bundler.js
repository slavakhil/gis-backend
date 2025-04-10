import { ComponentLoader } from 'adminjs';
import path from 'path';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
export const componentLoader = new ComponentLoader();
export const add = (urlPath, componentName) => componentLoader.add(componentName, path.join(__dirname, urlPath));
export const override = (urlPath, componentName) => componentLoader.override(componentName, path.join(__dirname, urlPath));
override('components/dashboard', 'DashboardRoute');
