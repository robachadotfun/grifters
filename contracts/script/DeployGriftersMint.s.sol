// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {GriftersMint} from "../GriftersMint.sol";

/// Mint-only deployment — use when GriftersReveal is already deployed.
/// PRIVATE_KEY comes from your own shell; never write it anywhere.
///
/// Required environment:
///   PRIVATE_KEY, PRICE_WEI, ALLOWLIST_OPENS_AT, PUBLIC_OPENS_AT,
///   ALLOWLIST_ROOT, REVEAL_ADDRESS, SEALED_URI
contract DeployGriftersMint is Script {
    function run() external returns (GriftersMint mint) {
        uint256 key = vm.envUint("PRIVATE_KEY");
        uint256 priceWei = vm.envUint("PRICE_WEI");
        uint256 allowlistOpensAt = vm.envUint("ALLOWLIST_OPENS_AT");
        uint256 publicOpensAt = vm.envUint("PUBLIC_OPENS_AT");
        bytes32 allowlistRoot = vm.envBytes32("ALLOWLIST_ROOT");
        address revealAddr = vm.envAddress("REVEAL_ADDRESS");
        string memory sealedURI = vm.envString("SEALED_URI");

        require(priceWei > 0, "PRICE_WEI not set");
        require(allowlistRoot != bytes32(0), "ALLOWLIST_ROOT not set");
        require(revealAddr != address(0), "REVEAL_ADDRESS not set");
        require(publicOpensAt >= allowlistOpensAt, "public before allowlist");

        vm.startBroadcast(key);
        mint = new GriftersMint(priceWei, allowlistOpensAt, publicOpensAt, allowlistRoot, revealAddr, sealedURI);
        vm.stopBroadcast();

        console.log("GriftersMint:", address(mint));
    }
}
