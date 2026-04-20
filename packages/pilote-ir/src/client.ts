import type { ContractRouterClient } from "@orpc/contract";
import type { JsonifiedClient } from "@orpc/openapi-client";
import { createORPCClient } from "@orpc/client";
import { OpenAPILink } from "@orpc/openapi-client/fetch";

import { contract } from "~/contract";

export type PiloteIRClient = JsonifiedClient<
  ContractRouterClient<typeof contract>
>;

const BASE_URL = "https://pilote-ir.akimeo.xyz/api/rpc";

export interface CreateClientOptions {
  apiKey: string;
}

export function createClient({ apiKey }: CreateClientOptions): PiloteIRClient {
  const link = new OpenAPILink(contract, {
    url: BASE_URL,
    headers: {
      "x-api-key": apiKey,
    },
  });

  return createORPCClient(link);
}
