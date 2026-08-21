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
        mint = new GriftersMint(PRICE, 1787331600, 1787335200, 1787338800, bytes32(uint256(1)), bytes32(uint256(2)), address(new MockReveal()), TREASURY, "ipfs://sealed");
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
