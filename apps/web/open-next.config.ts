// OpenNext Cloudflare config
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // No R2 incremental cache for the demo; OpenNext falls back to default.
});
