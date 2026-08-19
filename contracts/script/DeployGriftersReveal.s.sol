// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {GriftersReveal} from "../GriftersReveal.sol";

/// Foundry deployment for GriftersReveal on Robinhood Chain (4663).
///
/// The private key is read from the PRIVATE_KEY environment variable —
/// set it in your own shell only; never write it into files or chats.
///
/// Required environment:
///   PRIVATE_KEY        deployer key (funded on Robinhood Chain)
///   MANIFEST_HASH      bytes32 rolling-hash commitment from build-manifest.ts
///   REVEAL_NOT_BEFORE  unix timestamp — earliest beginReveal() moment
///
/// Run:
///   forge script contracts/script/DeployGriftersReveal.s.sol:DeployGriftersReveal \
///     --rpc-url https://rpc.mainnet.chain.robinhood.com \
///     --broadcast
///
/// (One-time setup if this repo has no Foundry yet: `forge init --force`
///  or just `forge install foundry-rs/forge-std`, and point foundry.toml's
///  `src` at `contracts`.)
contract DeployGriftersReveal is Script {
    address constant CONDUCTOR = 0x003e29260EF2f762e7f2d95C3d2b7A7f6234BcDE;

    function run() external returns (GriftersReveal deployed) {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        bytes32 manifestHash = vm.envBytes32("MANIFEST_HASH");
        uint256 revealNotBefore = vm.envUint("REVEAL_NOT_BEFORE");

        require(manifestHash != bytes32(0), "MANIFEST_HASH not set");
        require(revealNotBefore > block.timestamp, "REVEAL_NOT_BEFORE is in the past");

        vm.startBroadcast(deployerKey);
        deployed = new GriftersReveal(CONDUCTOR, manifestHash, revealNotBefore);
        vm.stopBroadcast();

        console.log("GriftersReveal deployed at:", address(deployed));
        console.log("conductor:", CONDUCTOR);
        console.log("manifestHash:");
        console.logBytes32(manifestHash);
        console.log("revealNotBefore:", revealNotBefore);
    }
}
