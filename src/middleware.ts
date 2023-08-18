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


  return scope ? `${scope}/${name}` : name;
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const pathGroups = pathname.split("/").filter(Boolean);

  // logo
  if (['/cnpm.png', '/favicon.ico'].includes(pathname)) {
    return NextResponse.next();
  }

  let pkgName = getPkgName(pathGroups);
  if (pkgName) {
    return NextResponse.redirect(
      new URL(`/package/${pkgName}`, req.nextUrl)
    );
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
