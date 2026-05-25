import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Redirect unprefixed public routes through the configured default locale.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
