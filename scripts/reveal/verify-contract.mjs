/**
 * Blockscout source verification for GriftersReveal — keyless; safe for
 * anyone to run after deploy.
 *
 * Usage: node scripts/reveal/verify-contract.mjs --address 0x…
 */
import fs from "node:fs";

const args = process.argv.slice(2);
const i = args.indexOf("--address");
const address = i >= 0 ? args[i + 1] : null;
if (!address || !/^0x[0-9a-fA-F]{40}$/.test(address)) {
  console.error("--address 0x… required");
  process.exit(1);
}

const BS = "https://robinhoodchain.blockscout.com";
const { standardInput } = JSON.parse(fs.readFileSync("contracts/GriftersReveal.build.json", "utf8"));

const form = new FormData();
form.append("compiler_version", "v0.8.24+commit.e11b9ed9");
form.append("contract_name", "GriftersReveal.sol:GriftersReveal");
form.append("autodetect_constructor_args", "true");
form.append("files[0]", new Blob([JSON.stringify(standardInput)], { type: "application/json" }), "standard-input.json");

const res = await fetch(`${BS}/api/v2/smart-contracts/${address}/verification/via/standard-input`, {
  method: "POST",
  body: form,
});
console.log("submit:", res.status, (await res.text()).slice(0, 200));

// poll for verification result
for (let n = 0; n < 20; n++) {
  await new Promise((r) => setTimeout(r, 6000));
  const j = await (await fetch(`${BS}/api/v2/smart-contracts/${address}`)).json();
  if (j.is_verified) {
    console.log(`VERIFIED ✓ ${BS}/address/${address}?tab=contract`);
    process.exit(0);
  }
  console.log(`waiting… (${n + 1})`);
}
console.log("not verified yet — check the explorer manually or re-run.");
