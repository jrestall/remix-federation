const { withNativeFederation } = require("@softarc/native-federation/build");

module.exports = withNativeFederation({
  name: "host",
  shared: {
    "react": {
      singleton: true,
      strictVersion: true,
      requiredVersion: "auto",
      includeSecondaries: false,
    },
    "react-dom": {
      singleton: true,
      strictVersion: true,
      requiredVersion: "auto",
      includeSecondaries: false,
    },
    "react-dom/client": {
      singleton: true,
      strictVersion: true,
      requiredVersion: "auto",
      includeSecondaries: false,
    },
    // "@remix-run/react": {
    //   singleton: true,
    //   strictVersion: true,
    //   requiredVersion: "auto",
    //   includeSecondaries: false,
    // },
    // "@remix-run/router": {
    //   singleton: true,
    //   strictVersion: true,
    //   requiredVersion: "auto",
    //   includeSecondaries: false,
    // },
    // "react-router-dom": {
    //   singleton: true,
    //   strictVersion: true,
    //   requiredVersion: "auto",
    //   includeSecondaries: false,
    // },
  },
});
