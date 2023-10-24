export function FederationScripts() {
  return (
    <>
      <script
        type="esms-options"
        dangerouslySetInnerHTML={{
          __html: `{ "shimMode": true, "mapOverrides": true }`,
        }}
      />
      <script async src="https://ga.jspm.io/npm:es-module-shims@1.5.17/dist/es-module-shims.js" />
      <script
        type="importmap-shim"
        dangerouslySetInnerHTML={{
          __html: `{
              "imports":{
                "react": "https://esm.sh/react@18.2.0?dev",
                "react-dom": "https://esm.sh/react-dom@18.2.0?dev",
                "react/jsx-dev-runtime": "https://esm.sh/react@18.2.0/jsx-dev-runtime?dev",
                "@remix-run/router": "/_remix_run_router-1_10_0-dev.js",
                "@remix-run/react": "/_remix_run_react-0_0_0_nightly_63a5c6c_20231017-dev.js",
                "react-router": "/react_router-6_17_0-dev.js",
                "react-router-dom": "/react_router_dom-6_17_0-dev.js"
              }
            }`,
        }}
      />
    </>
  );
}
