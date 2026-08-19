import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders the Arcwatch command center", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>Arcwatch/);
  assert.match(html, /Command center/);
  assert.match(html, /Checkout error rate above SLO/);
  assert.match(html, /Run incident replay/);
});

test("ships incident evidence, evaluation, and safe remediation surfaces", async () => {
  const [page, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(page, /Evidence timeline/);
  assert.match(page, /approval-gated action/);
  assert.match(page, /unsafe action rate 0%/);
  assert.match(layout, /Arcwatch — AI Incident Command/);
});
