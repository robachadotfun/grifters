// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;
import {Test} from "forge-std/Test.sol";
interface IMint {
  function mintPrimary(uint256,bytes32[] calldata) external payable;
  function mintCommunity(uint256,bytes32[] calldata) external payable;
  function mintPublic(uint256) external payable;
  function priceWei() external view returns (uint256);
  function totalSupply() external view returns (uint256);
  function balanceOf(address) external view returns (uint256);
  function tokenURI(uint256) external view returns (string memory);
  function treasury() external view returns (address);
}
contract LiveFork is Test {
  IMint m = IMint(0xfCa4f704c4A999d1344a820F68DBbE7287c28345);
  address primaryW = 0x15431e4997F9638D643736bd9043Ce5564F0338e;
  address communityW = 0x2aD5BBa6DD4Ed3A8D03C48d7e3313C3B3a1Ac095;
  function _p(string memory s) internal pure returns (bytes32[] memory out) {
    bytes memory b = bytes(s); uint n = 1; for (uint i; i<b.length; i++) if (b[i]==",") n++;
    out = new bytes32[](n); uint idx; uint start;
    for (uint i; i<=b.length; i++) { if (i==b.length || b[i]==",") { bytes memory h = new bytes(i-start); for (uint j; j<h.length; j++) h[j]=b[start+j]; out[idx++] = vm.parseBytes32(string(h)); start=i+1; } }
  }
  function test_PrimaryMintsAt1700_AndTreasuryPaid() public {
    vm.warp(1787331600 + 60);
    uint price = m.priceWei(); uint t0 = m.treasury().balance; uint s0 = m.totalSupply();
    vm.deal(primaryW, 1 ether); vm.prank(primaryW);
    m.mintPrimary{value: price * 2}(2, _p("0xa98a3364b2bd2b6aa4f0d7101d24123a58f0a2181746c23d4f4a42938cb5b1f5,0xfb12cdbf31ea27d5db33b9e96d71648152575be10c6812a1ca70e9f8f31893de,0xd5517ada95c649ca2866fa3a35f93465761bc8dedf403d5261ab0b5828fc63fe,0x3879d51b798ae7779999d8d618e3dd6c6ea6873365c5c9bcfe73ce9f297faf68,0x164d1387b3215a0ebbb736cf2b28363cfed76c35a614d60bba5163b4ab57671b,0xc4380330bb85ef612819499f7d30976de00bd2a38c5b9ec49de2fb6e31721f52,0x91798285eb4d3e2b9256ca2608b04d86346664be5c973e7541d0160f27d10c40,0x5f608e796b0d567c4edc80e650d9ad72a2c576381e977c89e646c69786a106ff,0x753de884f30de2fe405c24613b7e651b5d0766b1fea59c9e7eec1579872c628d,0xf38a077893e185024f001612b4a9aab8e15020f2cd144ec50a5f119216a7ca4b,0x8cc04cd26d38658a3db3a9d307d35717103e2bec4497973e24a09658b4e85eff,0xb50a1c750a2ea8c58853ed7c50614382549e6a848ca0e628f5a270cefa95f412,0x3ce665cddcfe807496265000190eb1b176dd6cd011faaa5519fe59f2d78b384c,0xaa43adfd6e2d8240ecf812a7a1b4b927294b9fce5ea5b0f8be6bbb075ee4a560,0x78a64dace8127dcee11968bc68601a0aeeaa3d64d3ad7bcd7d0449da1ad5a075"));
    assertEq(m.balanceOf(primaryW) >= 2, true);
    assertEq(m.totalSupply(), s0 + 2);
    assertEq(m.treasury().balance - t0, price * 2, "treasury not paid");
    assertEq(keccak256(bytes(m.tokenURI(s0))), keccak256(bytes("https://www.grifters.market/sealed.json")));
  }
  function test_CommunityBlockedAt1700_OpensAt1800() public {
    uint price = m.priceWei(); vm.deal(communityW, 1 ether);
    vm.warp(1787331600 + 60); vm.prank(communityW);
    vm.expectRevert(); m.mintCommunity{value: price}(1, _p("0x46ef563c9ce4365ced73561e35d752b305033b4ce06bac66e0409675be68b975,0xc97bad93101d0ac915a3ee9a7bd1e40e7fae2f58fa369316df69b890b525cca6,0x7c7af19b1c426e766cc8350f4862023f140beff4910028768d546ed76b7efb94,0x018ddaef24939dcd430ef1f0f8bfd562c140db651529f72b57cefeb0201d84cd,0x68ed235007e481fae7ac3c6c2977c2c0e2a192d0c9e04da68284849d241cd6fd,0xe01f29f9460bb8b56955df81f740b34a97ac7b8f2295f3f9d59674baa29b4764,0x70b8da9987bbea950726d4e1f622f05d1bf35c5f8ffc8bea9d49e300156b7778,0x11c30583f71e4d6b54e0d758e6bde3866d68a65a6490650cffaf543215d1e771,0x21e460491cedabc87cf5e9e46169b7b1d7b79fcbb42b420f3bf22ee34cf6a6da,0xc885837355cc0297fba0f5b79ccadaf19a23e9460cef3f2ec085410324eaac05,0x8aa99e78ea70bdf8b6c9ae25834d6f6804ad299deaf43c8f7d49d54881847993,0x459191c003e40919b78e3ec165ac2e78e45d9703b0c5928ce747325d3667e437,0x33814377f77c5e89eabb64e122c1187bc0c654ed531b7451889ca58c053e0c50"));
    vm.warp(1787335200 + 60); vm.prank(communityW);
    m.mintCommunity{value: price}(1, _p("0x46ef563c9ce4365ced73561e35d752b305033b4ce06bac66e0409675be68b975,0xc97bad93101d0ac915a3ee9a7bd1e40e7fae2f58fa369316df69b890b525cca6,0x7c7af19b1c426e766cc8350f4862023f140beff4910028768d546ed76b7efb94,0x018ddaef24939dcd430ef1f0f8bfd562c140db651529f72b57cefeb0201d84cd,0x68ed235007e481fae7ac3c6c2977c2c0e2a192d0c9e04da68284849d241cd6fd,0xe01f29f9460bb8b56955df81f740b34a97ac7b8f2295f3f9d59674baa29b4764,0x70b8da9987bbea950726d4e1f622f05d1bf35c5f8ffc8bea9d49e300156b7778,0x11c30583f71e4d6b54e0d758e6bde3866d68a65a6490650cffaf543215d1e771,0x21e460491cedabc87cf5e9e46169b7b1d7b79fcbb42b420f3bf22ee34cf6a6da,0xc885837355cc0297fba0f5b79ccadaf19a23e9460cef3f2ec085410324eaac05,0x8aa99e78ea70bdf8b6c9ae25834d6f6804ad299deaf43c8f7d49d54881847993,0x459191c003e40919b78e3ec165ac2e78e45d9703b0c5928ce747325d3667e437,0x33814377f77c5e89eabb64e122c1187bc0c654ed531b7451889ca58c053e0c50"));
    assertEq(m.balanceOf(communityW) >= 1, true);
  }
  function test_PublicBlockedBefore1900_ThenOpen() public {
    address rando = address(0xCAFE); uint price = m.priceWei(); vm.deal(rando, 1 ether);
    vm.warp(1787338800 - 1); vm.prank(rando); vm.expectRevert(); m.mintPublic{value: price}(1);
    vm.warp(1787338800); vm.prank(rando); m.mintPublic{value: price}(1);
    assertEq(m.balanceOf(rando), 1);
  }
  function test_WrongProofRejected() public {
    vm.warp(1787331600 + 60); address rando = address(0xBAD); vm.deal(rando, 1 ether);
    uint price = m.priceWei();
    bytes32[] memory stolen = _p("0xa98a3364b2bd2b6aa4f0d7101d24123a58f0a2181746c23d4f4a42938cb5b1f5,0xfb12cdbf31ea27d5db33b9e96d71648152575be10c6812a1ca70e9f8f31893de,0xd5517ada95c649ca2866fa3a35f93465761bc8dedf403d5261ab0b5828fc63fe,0x3879d51b798ae7779999d8d618e3dd6c6ea6873365c5c9bcfe73ce9f297faf68,0x164d1387b3215a0ebbb736cf2b28363cfed76c35a614d60bba5163b4ab57671b,0xc4380330bb85ef612819499f7d30976de00bd2a38c5b9ec49de2fb6e31721f52,0x91798285eb4d3e2b9256ca2608b04d86346664be5c973e7541d0160f27d10c40,0x5f608e796b0d567c4edc80e650d9ad72a2c576381e977c89e646c69786a106ff,0x753de884f30de2fe405c24613b7e651b5d0766b1fea59c9e7eec1579872c628d,0xf38a077893e185024f001612b4a9aab8e15020f2cd144ec50a5f119216a7ca4b,0x8cc04cd26d38658a3db3a9d307d35717103e2bec4497973e24a09658b4e85eff,0xb50a1c750a2ea8c58853ed7c50614382549e6a848ca0e628f5a270cefa95f412,0x3ce665cddcfe807496265000190eb1b176dd6cd011faaa5519fe59f2d78b384c,0xaa43adfd6e2d8240ecf812a7a1b4b927294b9fce5ea5b0f8be6bbb075ee4a560,0x78a64dace8127dcee11968bc68601a0aeeaa3d64d3ad7bcd7d0449da1ad5a075");
    vm.prank(rando); vm.expectRevert(); m.mintPrimary{value: price}(1, stolen);
  }
}
