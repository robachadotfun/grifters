// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {GriftersMint} from "../GriftersMint.sol";

/// Mint deployment (GriftersReveal already deployed).
/// PRIVATE_KEY comes from your own shell; never write it anywhere.
///
/// Required environment:
///   PRIVATE_KEY, PRICE_WEI,
///   PRIMARY_OPENS_AT, COMMUNITY_OPENS_AT, PUBLIC_OPENS_AT,
///   PRIMARY_ROOT, COMMUNITY_ROOT, REVEAL_ADDRESS, SEALED_URI
contract DeployGriftersMint is Script {
    function run() external returns (GriftersMint mint) {
        uint256 key = vm.envUint("PRIVATE_KEY");
        uint256 priceWei = vm.envUint("PRICE_WEI");
        uint256 primaryOpensAt = vm.envUint("PRIMARY_OPENS_AT");
        uint256 communityOpensAt = vm.envUint("COMMUNITY_OPENS_AT");
        uint256 publicOpensAt = vm.envUint("PUBLIC_OPENS_AT");
        bytes32 primaryRoot = vm.envBytes32("PRIMARY_ROOT");
        bytes32 communityRoot = vm.envBytes32("COMMUNITY_ROOT");
        address revealAddr = vm.envAddress("REVEAL_ADDRESS");
        string memory sealedURI = vm.envString("SEALED_URI");

        require(priceWei > 0, "PRICE_WEI not set");
        require(primaryRoot != bytes32(0), "PRIMARY_ROOT not set");
        require(communityRoot != bytes32(0), "COMMUNITY_ROOT not set");
        require(revealAddr != address(0), "REVEAL_ADDRESS not set");
        require(communityOpensAt >= primaryOpensAt && publicOpensAt >= communityOpensAt, "phase order wrong");

        vm.startBroadcast(key);
        mint = new GriftersMint(
            priceWei,
            primaryOpensAt,
            communityOpensAt,
            publicOpensAt,
            primaryRoot,
            communityRoot,
            revealAddr,
            sealedURI
        );
        vm.stopBroadcast();

        console.log("GriftersMint:", address(mint));
    }
}
