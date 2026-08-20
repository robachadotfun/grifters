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
/// Mint runs in three phases (all immutable — nobody can move the
/// goalposts after deploy), same price throughout, 50 per wallet total:
///   1. PRIMARY   — partner-collection holders (merkle: primaryRoot)
///   2. COMMUNITY — the whitelist (merkle: communityRoot)
///   3. PUBLIC    — everyone
/// Each phase opens at its timestamp and stays open; later phases add
/// eligibility, never remove it.
///
/// Reveal integration (DERP conductor, shape C): `tokenURI` serves
/// `sealedURI` until GriftersReveal reports its mined word landed, then
/// serves `baseURI + identityIndexOf(tokenId)`. The identity assignment
/// is a pure on-chain function of the mined word, verifiable by anyone
/// against the pre-committed sealed manifest. Metadata URIs are
/// owner-set (the conventional hop, same as BFMC) — the assignment is
/// the trustless part and we say so publicly.
contract GriftersMint is ERC721, Ownable {
    error MintNotOpen();
    error NotEligible();
    error SoldOut();
    error WalletLimit();
    error WrongPayment();
    error WithdrawFailed();

    uint256 public constant SUPPLY = 2222;
    uint256 public constant MAX_PER_WALLET = 50;

    uint256 public immutable priceWei;
    uint256 public immutable primaryOpensAt;
    uint256 public immutable communityOpensAt;
    uint256 public immutable publicOpensAt;
    bytes32 public immutable primaryRoot;
    bytes32 public immutable communityRoot;
    IGriftersReveal public immutable reveal;

    uint256 public totalSupply;
    mapping(address => uint256) public mintedBy;

    string public sealedURI;
    string public baseURI;

    constructor(
        uint256 priceWei_,
        uint256 primaryOpensAt_,
        uint256 communityOpensAt_,
        uint256 publicOpensAt_,
        bytes32 primaryRoot_,
        bytes32 communityRoot_,
        address reveal_,
        string memory sealedURI_
    ) ERC721("GRIFTERS", "GRIFT") Ownable(msg.sender) {
        priceWei = priceWei_;
        primaryOpensAt = primaryOpensAt_;
        communityOpensAt = communityOpensAt_;
        publicOpensAt = publicOpensAt_;
        primaryRoot = primaryRoot_;
        communityRoot = communityRoot_;
        reveal = IGriftersReveal(reveal_);
        sealedURI = sealedURI_;
    }

    // ——— minting ————————————————————————————————————————————————————

    /// Partner-collection holders. Open from primaryOpensAt onward.
    function mintPrimary(uint256 qty, bytes32[] calldata proof) external payable {
        if (block.timestamp < primaryOpensAt) revert MintNotOpen();
        if (!_proven(proof, primaryRoot)) revert NotEligible();
        _mintQty(qty);
    }

    /// Whitelist. Open from communityOpensAt onward.
    function mintCommunity(uint256 qty, bytes32[] calldata proof) external payable {
        if (block.timestamp < communityOpensAt) revert MintNotOpen();
        if (!_proven(proof, communityRoot)) revert NotEligible();
        _mintQty(qty);
    }

    /// Everyone. Open from publicOpensAt onward.
    function mintPublic(uint256 qty) external payable {
        if (block.timestamp < publicOpensAt) revert MintNotOpen();
        _mintQty(qty);
    }

    function _proven(bytes32[] calldata proof, bytes32 root) private view returns (bool) {
        return MerkleProof.verifyCalldata(proof, root, keccak256(abi.encodePacked(msg.sender)));
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
