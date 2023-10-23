import { BuildHelperParams, withNativeFederation } from "@softarc/native-federation/build";
import { FederationConfig } from "@softarc/native-federation/src/lib/config/federation-config";
import * as fs from "fs";
import * as path from "path";

// Writes the federation config file to disk for the @softarc/native-federation lib to consume.
// Hides implementation details from developer and allows all config to be done in vite.config.ts.
export function writeFederationConfig(
  config: FederationConfig,
  options: BuildHelperParams["options"],
) {
  const normalizedConfig = withNativeFederation(config);

  const configPath = path.join(options.workspaceRoot!, options.federationConfig!);
  const configDir = path.dirname(configPath);

  fs.mkdirSync(configDir, { recursive: true });
  fs.writeFileSync(configPath, `module.exports = ${JSON.stringify(normalizedConfig, null, 2)}`);
}
