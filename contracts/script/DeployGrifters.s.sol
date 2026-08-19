// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {GriftersReveal} from "../GriftersReveal.sol";
import {GriftersMint} from "../GriftersMint.sol";

/// Full GRIFTERS deployment on Robinhood Chain (4663): reveal + mint.
///
/// PRIVATE_KEY is read from your own shell environment. Never write it
/// into files, commits, or chats.
///
/// Required environment:
///   PRIVATE_KEY          funded deployer key
///   MANIFEST_HASH        bytes32 from build-manifest.ts
///   REVEAL_NOT_BEFORE    unix ts — earliest beginReveal()
///   PRICE_WEI            mint price per token in wei (e.g. ~$20 of ETH)
///   ALLOWLIST_OPENS_AT   unix ts — allowlist mint start (Aug 21 18:00 UTC = 1787335200)
///   PUBLIC_OPENS_AT      unix ts — public mint start
///   ALLOWLIST_ROOT       bytes32 from build-allowlist.ts
///   SEALED_URI           pre-reveal metadata URI (e.g. https://www.grifters.market/api/sealed.json)
///
/// Run:
///   forge script contracts/script/DeployGrifters.s.sol:DeployGrifters \
///     --rpc-url robinhood --broadcast
contract DeployGrifters is Script {
    address constant CONDUCTOR = 0x003e29260EF2f762e7f2d95C3d2b7A7f6234BcDE;

    function run() external {
        uint256 key = vm.envUint("PRIVATE_KEY");
        bytes32 manifestHash = vm.envBytes32("MANIFEST_HASH");
        uint256 revealNotBefore = vm.envUint("REVEAL_NOT_BEFORE");
        uint256 priceWei = vm.envUint("PRICE_WEI");
        uint256 allowlistOpensAt = vm.envUint("ALLOWLIST_OPENS_AT");
        uint256 publicOpensAt = vm.envUint("PUBLIC_OPENS_AT");
        bytes32 allowlistRoot = vm.envBytes32("ALLOWLIST_ROOT");
        string memory sealedURI = vm.envString("SEALED_URI");

        require(manifestHash != bytes32(0), "MANIFEST_HASH not set");
        require(allowlistRoot != bytes32(0), "ALLOWLIST_ROOT not set");
        require(revealNotBefore > block.timestamp, "REVEAL_NOT_BEFORE in past");
        require(publicOpensAt >= allowlistOpensAt, "public before allowlist");
        require(priceWei > 0, "PRICE_WEI not set");

        vm.startBroadcast(key);
        GriftersReveal reveal = new GriftersReveal(CONDUCTOR, manifestHash, revealNotBefore);
        GriftersMint mint = new GriftersMint(
            priceWei,
            allowlistOpensAt,
            publicOpensAt,
            allowlistRoot,
            address(reveal),
            sealedURI
        );
        vm.stopBroadcast();

        console.log("GriftersReveal:", address(reveal));
        console.log("GriftersMint:  ", address(mint));
    }
}
