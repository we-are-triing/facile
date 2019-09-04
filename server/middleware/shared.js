const statics = [`static`, `api`];
export const isStaticPath = pathname => statics.reduce((a, n) => a || pathname.startsWith(`/${n}/`), false);
