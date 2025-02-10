import { APP_MODULE } from "./types/global";

export const generateResolvePath = (name: string, options = {}) => ({
  resolve: `./src/modules/${name}`,
  options,
});

export const moduleResolves = [
  generateResolvePath(APP_MODULE.PORTAL),
  generateResolvePath(APP_MODULE.ACADEMY),
  generateResolvePath(APP_MODULE.ADMIN_USER),
];
