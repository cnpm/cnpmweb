import { NextRequest, NextResponse } from "next/server";

// [@ant-design, icons] => @ant-design/icons
// [antd] => antd
function getPkgName(pathGroups: string[]) {
  let [scope, name] = pathGroups;
  if (!name) {
    name = scope;
    scope = '';
  }

  if (!name || name.startsWith('@')) {
    return undefined;
  }

  if (scope && !scope.startsWith('@')) {
    return undefined;
  }

  name = name.includes('@') ? name.split('@')[0] : name;

  return scope ? `${scope}/${name}` : name;
}

// antd@^4 => ^4
function getSpec(pathname: string, pkgName: string) {
  const spec = pathname.replace(`/${pkgName}`, '');
  if (spec.startsWith('@')) {
    return decodeURIComponent(spec.substring(1));
  }
  return undefined;
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const pathGroups = pathname.split("/").filter(Boolean);

  // logo
  if (['/cnpm.png', '/favicon.ico', '/packages'].includes(pathname)) {
    return NextResponse.next();
  }

  let pkgName = getPkgName(pathGroups);
  if (pkgName) {
    const spec = getSpec(pathname, pkgName);
    const target = new URL(`/package/${pkgName}`, req.nextUrl);
    if (spec) {
      target.searchParams.set('version', spec);
    }
    return NextResponse.redirect(target);
  }

  // /sync/antd/versions => package/antd/versions
  const [action, ...rest] = pathGroups;
  if (action === "sync") {
    pkgName = getPkgName(rest);
    if (pkgName) {
      return NextResponse.redirect(
        new URL(`/package/${pkgName}/versions`, req.nextUrl)
      );
    }
  }

  return NextResponse.next();
}
