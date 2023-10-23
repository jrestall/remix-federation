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
                "react": "https://ga.jspm.io/npm:react@18.2.0/dev.index.js",
                "react-dom": "https://ga.jspm.io/npm:react-dom@18.2.0/dev.index.js",
                "@remix-run/react":"/build/_remix_run_react-0_0_0_nightly_63a5c6c_20231017-dev.js",
                "@remix-run/router":"/build/_remix_run_router-1_10_0-dev.js",
                "react-router": "/build/react_router-6_17_0-dev.js",
                "react-router-dom":"/build/react_router_dom-6_17_0-dev.js"
              },
              "scopes": {
                "https://ga.jspm.io/": {
                  "scheduler": "https://ga.jspm.io/npm:scheduler@0.23.0/dev.index.js"
                }
              }
            }`,
        }}
      />
    </>
  );
}
