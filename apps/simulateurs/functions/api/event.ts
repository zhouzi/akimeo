/// <reference types="@cloudflare/workers-types" />

export const onRequestPost: PagesFunction = async (context) => {
  const request = new Request(context.request);
  request.headers.delete("cookie");
  return await fetch(`https://stats.gabin.app/api/event`, request);
};
