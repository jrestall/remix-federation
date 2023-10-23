import { Link, Outlet, useLoaderData } from "@remix-run/react";

export function loader() {
  return { title: "Layout loader data" };
}

export default function Component() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <div>REMOTE (Parent Route)</div>
      {data.title}
      <Outlet />
      <ul>
        <li>
          <Link to="/remote/blog">REMOTE BLOG</Link>
        </li>
      </ul>
    </>
  );
}
