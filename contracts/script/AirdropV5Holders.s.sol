// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {GriftersMint} from "../GriftersMint.sol";

/// Re-issues tokens on the new (free) GriftersMint to everyone who paid
/// on the previous contract. Reads PRIVATE_KEY (owner) from your shell,
/// NEW_MINT (address) and the holder snapshot baked in below.
contract AirdropV5Holders is Script {
    function run() external {
        uint256 key = vm.envUint("PRIVATE_KEY");
        GriftersMint mint = GriftersMint(vm.envAddress("NEW_MINT"));

        address[] memory to = new address[](20);
        uint256[] memory qty = new uint256[](20);
        to[0] = 0x68a333921e94C31F2b7E1cC5abDf6409A0Cdd6c0; qty[0] = 2;
        to[1] = 0x6602Df602701d671Ae624F7d900fC870222E7e45; qty[1] = 4;
        to[2] = 0x811454E410a6474058a70de265FA766A6363f928; qty[2] = 1;
        to[3] = 0x468D906C2388405A8BC813A98c575ddB8475A8CB; qty[3] = 4;
        to[4] = 0x1f27762C393FB11736BA576641615a9784efE86a; qty[4] = 1;
        to[5] = 0xb117404c6c97FBc448F200e7298F9B4f7bb01432; qty[5] = 2;
        to[6] = 0xba78f2daB8B475383f18243C40CbA03ddDd4fDeC; qty[6] = 2;
        to[7] = 0x1C0AFF3a75512455Ff1d148E55deD32dEDaCD04C; qty[7] = 5;
        to[8] = 0x5bC87b26f4B0879b320cA89f2103d2708c46EB45; qty[8] = 4;
        to[9] = 0x1CC907b04A489fd38EeCc4956A792252a2c71CEe; qty[9] = 3;
        to[10] = 0xCA1D4Cc015E95d0B46c61d0149F41FBC5728D5E3; qty[10] = 1;
        to[11] = 0x4Cd4b22bff9AF9E1BbCf5894AFcc800AA2F74af9; qty[11] = 1;
        to[12] = 0x4957a49E0cD79aF07AeE79039E0aF653A7f7d71f; qty[12] = 1;
        to[13] = 0x7AaB78b960b4b3F0444eD229A30Dea60581CeC58; qty[13] = 1;
        to[14] = 0x045e9f4fb3E111e14156A2003eD4e7d1bdd2b669; qty[14] = 1;
        to[15] = 0xedC84BaF9173A6f2aef32ce724d2568Dd1Ac794f; qty[15] = 1;
        to[16] = 0x0C19BE8f3C896585a2eb884119482e18Eb3bcC5A; qty[16] = 1;
        to[17] = 0x8c6b3Fab02294da9d87d960d5eD515D6C06c5971; qty[17] = 2;
        to[18] = 0xfb6D990385916af72eC2702B0f6a568AC919510B; qty[18] = 1;
        to[19] = 0xF95a1DC49bF446633384974df5e14904054D21BA; qty[19] = 1;

        vm.startBroadcast(key);
        mint.airdrop(to, qty);
        vm.stopBroadcast();
        console.log("airdropped 39 tokens to 20 holders; totalSupply:", mint.totalSupply());
    }
}
