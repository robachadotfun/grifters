// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {GriftersMint} from "../GriftersMint.sol";

contract MockReveal {
    function isRevealed() external pure returns (bool) { return false; }
    function identityIndexOf(uint256) external pure returns (uint256) { return 0; }
}

contract GriftersMintTest is Test {
    address payable constant TREASURY = payable(0xB8D5600F77328E18C3E4220657DB709E482AD338);
    uint256 constant PRICE = 8373630000000000;
    GriftersMint mint;

    function setUp() public {
        mint = new GriftersMint(PRICE, 1787331600, 1787335200, 1787338800, bytes32(uint256(1)), bytes32(uint256(2)), address(new MockReveal()), TREASURY, 50, "ipfs://sealed");
    }

    function test_ProceedsForwardDirectlyToTreasury() public {
        vm.warp(1787338800); // public phase open
        address buyer = address(0xBEEF);
        vm.deal(buyer, 1 ether);
        uint256 before = TREASURY.balance;

        vm.prank(buyer);
        mint.mintPublic{value: PRICE * 3}(3);

        assertEq(TREASURY.balance - before, PRICE * 3, "treasury did not receive full payment");
        assertEq(address(mint).balance, 0, "contract should hold nothing");
        assertEq(mint.balanceOf(buyer), 3);
        assertEq(mint.treasury(), TREASURY);
    }

    function test_PhasesGateCorrectly() public {
        vm.warp(1787331599);
        vm.deal(address(this), 1 ether);
        vm.expectRevert(GriftersMint.MintNotOpen.selector);
        mint.mintPublic{value: PRICE}(1);
    }

    function test_WrongPaymentReverts() public {
        vm.warp(1787338800);
        vm.deal(address(this), 1 ether);
        vm.expectRevert(GriftersMint.WrongPayment.selector);
        mint.mintPublic{value: PRICE - 1}(1);
    }
}

contract GriftersFreeMintTest is Test {
    address payable constant TREASURY = payable(0xB8D5600F77328E18C3E4220657DB709E482AD338);
    GriftersMint mint;
    function setUp() public {
        mint = new GriftersMint(0, 1, 1, 1, bytes32(uint256(1)), bytes32(uint256(2)), address(new MockReveal()), TREASURY, 5, "ipfs://sealed");
    }
    function test_FreeMintWorksAndCapIs5() public {
        vm.warp(100);
        address a = address(0xA11CE);
        vm.prank(a); mint.mintPublic(5);
        assertEq(mint.balanceOf(a), 5);
        vm.prank(a); vm.expectRevert(GriftersMint.WalletLimit.selector); mint.mintPublic(1);
    }
    function test_PayingOnFreeMintReverts() public {
        vm.warp(100); vm.deal(address(this), 1 ether);
        vm.expectRevert(GriftersMint.WrongPayment.selector);
        mint.mintPublic{value: 1}(1);
    }
    function test_AirdropHonorsPreviousHolders() public {
        address[] memory to = new address[](2); to[0] = address(0x1); to[1] = address(0x2);
        uint256[] memory q = new uint256[](2); q[0] = 3; q[1] = 7;
        mint.airdrop(to, q);
        assertEq(mint.balanceOf(address(0x1)), 3);
        assertEq(mint.balanceOf(address(0x2)), 7);
        assertEq(mint.totalSupply(), 10);
        vm.prank(address(0xBAD)); vm.expectRevert(); mint.airdrop(to, q);
    }
}
