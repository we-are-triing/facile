const statics = [`static`, `api`, 'proxy'];
export const isStaticPath = pathname => statics.reduce((a, n) => a || pathname.startsWith(`/${n}/`), false);
