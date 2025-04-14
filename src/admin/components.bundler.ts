import { ComponentLoader } from 'adminjs';
import path from 'path';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export const componentLoader = new ComponentLoader();

export const add = (urlPath: string, componentName: string) =>
  componentLoader.add(componentName, path.join(__dirname, urlPath));

export const override = (urlPath: string, componentName: string) =>
  componentLoader.override(componentName, path.join(__dirname, urlPath));

/**
 * Overridable components
 */
override('components/dashboard', 'DashboardRoute');
add('components/upload-photo', 'UploadPhoto');
add('components/image-preview', 'ImagePreview');
add('components/upload-multiple-photos', 'UploadMultiplePhotos');
add('components/images-preview', 'ImagesPreview');
