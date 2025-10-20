import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";
import routes from "../routes";

const pathToRegex = (path) => {
  const pattern = "^" + path.replace(/:[^/]+/g, "[^/]+") + "$";
  try {
    return new RegExp(pattern);
  } catch {
    return null;
  }
};

const findRoute = (pathname) => {
  let r = routes.find((rt) => rt.path === pathname);
  if (r) return r;
  r = routes.find(
    (rt) => rt.path.includes(":") && pathToRegex(rt.path)?.test(pathname)
  );
  return r || null;
};

const dynamicLabelIfNeeded = (route, pathname) => {
  if (!route) return null;
  if (route.path.includes(":")) {
    const last = pathname.split("/").filter(Boolean).pop();
    if (route.name && /detalle/i.test(route.name)) {
      return `${route.name} ${last}`;
    }
    return route.name || last;
  }
  return route.name;
};

const AppBreadcrumb = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const breadcrumbs = useMemo(() => {
    if (currentPath === "/" || currentPath === "") return [];
    const segments = currentPath.split("/").filter(Boolean);
    let acc = "";
    return segments.map((seg, idx) => {
      acc += `/${seg}`;
      const route = findRoute(acc);
      const label = dynamicLabelIfNeeded(route, acc) || seg;
      return {
        name: label,
        pathname: acc,
        active: idx === segments.length - 1,
      };
    });
  }, [currentPath]);

  return (
    <CBreadcrumb className="my-0">
      <CBreadcrumbItem component={Link} to="/dashboard">
        Home
      </CBreadcrumbItem>
      {breadcrumbs.map((b, i) => (
        <CBreadcrumbItem
          key={i}
          {...(b.active
            ? { active: true }
            : { component: Link, to: b.pathname })}
        >
          {b.name}
        </CBreadcrumbItem>
      ))}
    </CBreadcrumb>
  );
};

export default React.memo(AppBreadcrumb);
