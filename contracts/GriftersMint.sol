// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ERC721} from "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {MerkleProof} from "openzeppelin-contracts/contracts/utils/cryptography/MerkleProof.sol";
import {Strings} from "openzeppelin-contracts/contracts/utils/Strings.sol";

interface IGriftersReveal {
    function isRevealed() external view returns (bool);
    function identityIndexOf(uint256 tokenId) external view returns (uint256);
}

/// GRIFTERS — 2,222 sealed celebrity collectibles on Robinhood Chain.
///
/// Mint mechanics:
///  - Allowlist window opens at `allowlistOpensAt` (merkle-gated: the
///    frozen whitelist + partner-collection holders), public mint opens
///    at `publicOpensAt`. Same price for both.
///  - `priceWei` and both timestamps are immutable — set at deploy,
///    nobody can move the goalposts afterward.
///  - Max 50 mints per wallet across both phases.
///
/// Reveal integration (DERP conductor, shape C):
///  - `tokenURI` serves `sealedURI` until the GriftersReveal contract
///    reports its mined word has landed; afterwards it serves
///    `baseURI + identityIndexOf(tokenId)`. The identity assignment is
///    a pure on-chain function of the mined word and is verifiable by
///    anyone against the pre-committed sealed manifest.
///  - The metadata URIs are owner-set (standard practice; same hop as
///    BigFatMagicCats) — the *assignment* is trustless, the file
///    hosting is not, and we say so publicly.
contract GriftersMint is ERC721, Ownable {
    error MintNotOpen();
    error AllowlistOnly();
    error NotOnAllowlist();
    error SoldOut();
    error WalletLimit();
    error WrongPayment();
    error WithdrawFailed();

    uint256 public constant SUPPLY = 2222;
    uint256 public constant MAX_PER_WALLET = 50;

    uint256 public immutable priceWei;
    uint256 public immutable allowlistOpensAt;
    uint256 public immutable publicOpensAt;
    bytes32 public immutable allowlistRoot;
    IGriftersReveal public immutable reveal;

    uint256 public totalSupply;
    mapping(address => uint256) public mintedBy;

    string public sealedURI;
    string public baseURI;

    constructor(
        uint256 priceWei_,
        uint256 allowlistOpensAt_,
        uint256 publicOpensAt_,
        bytes32 allowlistRoot_,
        address reveal_,
        string memory sealedURI_
    ) ERC721("GRIFTERS", "GRIFT") Ownable(msg.sender) {
        priceWei = priceWei_;
        allowlistOpensAt = allowlistOpensAt_;
        publicOpensAt = publicOpensAt_;
        allowlistRoot = allowlistRoot_;
        reveal = IGriftersReveal(reveal_);
        sealedURI = sealedURI_;
    }

    // ——— minting ————————————————————————————————————————————————————

    function mintAllowlist(uint256 qty, bytes32[] calldata proof) external payable {
        if (block.timestamp < allowlistOpensAt) revert MintNotOpen();
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        if (!MerkleProof.verifyCalldata(proof, allowlistRoot, leaf)) revert NotOnAllowlist();
        _mintQty(qty);
    }

    function mintPublic(uint256 qty) external payable {
        if (block.timestamp < publicOpensAt) revert AllowlistOnly();
        _mintQty(qty);
    }

    function _mintQty(uint256 qty) private {
        if (qty == 0 || totalSupply + qty > SUPPLY) revert SoldOut();
        if (mintedBy[msg.sender] + qty > MAX_PER_WALLET) revert WalletLimit();
        if (msg.value != priceWei * qty) revert WrongPayment();
        mintedBy[msg.sender] += qty;
        uint256 start = totalSupply;
        totalSupply = start + qty;
        for (uint256 i = 0; i < qty; i++) {
            _mint(msg.sender, start + i);
        }
    }

    // ——— metadata ———————————————————————————————————————————————————

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        if (address(reveal) != address(0) && reveal.isRevealed() && bytes(baseURI).length != 0) {
            return string.concat(baseURI, Strings.toString(reveal.identityIndexOf(tokenId)), ".json");
        }
        return sealedURI;
    }

    function setSealedURI(string calldata uri) external onlyOwner {
        sealedURI = uri;
    }

    function setBaseURI(string calldata uri) external onlyOwner {
        baseURI = uri;
    }

    // ——— proceeds ———————————————————————————————————————————————————

    function withdraw(address to) external onlyOwner {
        (bool ok, ) = to.call{value: address(this).balance}("");
        if (!ok) revert WithdrawFailed();
    }
}
