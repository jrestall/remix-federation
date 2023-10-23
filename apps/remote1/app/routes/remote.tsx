import { Link, Outlet } from "@remix-run/react";

export default function Component() {
  return (
    <>
      <div>REMOTE (Parent Route)</div>
      <Outlet />
      <ul>
        <li>
          <Link to="/remote/blog">REMOTE BLOG</Link>
        </li>
      </ul>
    </>
  );
}
