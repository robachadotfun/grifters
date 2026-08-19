// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/// GRIFTERS reveal — DERP conductor, shape C: one mined word assigns all
/// 2,222 sealed identities.
///
/// Trust model (the honest line, per StonkPit standards): the word is
/// sealed by real mining work and economically secured — not VRF-grade.
/// The manifest commitment below is what makes resampling blind: the
/// ordered identity list is hashed on-chain BEFORE any entropy exists,
/// kept secret until the word lands, then published so anyone can check
/// (a) the list matches the pre-committed hash and (b) every token's
/// identity is exactly `identityIndexOf(tokenId)`.
///
/// Ownerless by construction: no admin functions, no levers. The only
/// timing control is the immutable `revealNotBefore` gate; after it,
/// anyone may crank `beginReveal` and anyone may settle or rescue.
///
/// Conductor (verified on robinhoodchain.blockscout.com):
///   MultiConductor 0x003e29260EF2f762e7f2d95C3d2b7A7f6234BcDE
/// Signatures below match the verified source (checked 2026-08-19):
///   requestFee() / maxRequestFee() / requestWithMinTapes(uint256,bytes32,uint256)
///   isReady(uint256) / previewWord(uint256) / wordOf(uint256) / cancel(uint256)
/// Consumer callback surface matches PitBonesTable (production reference):
///   rawFulfillEntropy(uint256,bytes32)
interface IConductor {
    function requestFee() external view returns (uint256);
    function maxRequestFee() external view returns (uint256);
    function requestWithMinTapes(uint256 nPrints, bytes32 seed, uint256 minTapes)
        external
        payable
        returns (uint256);
    function isReady(uint256 requestId) external view returns (bool);
    function previewWord(uint256 requestId) external view returns (bool ready, bytes32 word);
    function wordOf(uint256 requestId) external view returns (bytes32);
    function cancel(uint256 requestId) external;
}

contract GriftersReveal {
    error AlreadyRequested();
    error AlreadyRevealed();
    error NotConductor();
    error NotRequested();
    error NotReady();
    error TooEarly();
    error BadToken();

    uint256 public constant SUPPLY = 2222;
    /// One word carries the whole collection: buy the delay (doc §4).
    uint256 public constant N_PRINTS = 16;
    uint256 public constant MIN_TAPES = 2;
    /// Wall-clock settle floor — cheap insurance for a one-time event.
    uint256 public constant MIN_SETTLE_DELAY = 300;

    IConductor public immutable conductor;
    /// Rolling hash h[n+1] = keccak256(abi.encodePacked(h[n], item[n]))
    /// over the ordered, sealed metadata list (h[0] = 0). Committed at
    /// deploy — strictly before any entropy exists.
    bytes32 public immutable manifestHash;
    /// Earliest moment anyone may open the reveal request.
    uint256 public immutable revealNotBefore;

    uint256 public requestId;
    uint40 public requestedAt;
    bytes32 public revealWord; // zero until revealed

    event RevealRequested(uint256 indexed requestId, address indexed caller, uint256 feePaid);
    event Revealed(bytes32 word);
    event RevealRescued(uint256 indexed requestId);

    constructor(address conductor_, bytes32 manifestHash_, uint256 revealNotBefore_) {
        conductor = IConductor(conductor_);
        manifestHash = manifestHash_;
        revealNotBefore = revealNotBefore_;
    }

    /// One request, ever. Permissionless after the time gate. Callable
    /// with the fee in msg.value, or fund the contract beforehand at
    /// maxRequestFee() and call with zero — the live quote is read and
    /// paid atomically either way; any surplus stays for a re-arm.
    function beginReveal() external payable {
        if (block.timestamp < revealNotBefore) revert TooEarly();
        if (requestId != 0) revert AlreadyRequested();
        if (revealWord != bytes32(0)) revert AlreadyRevealed();

        uint256 fee = conductor.requestFee();
        bytes32 seed = keccak256(
            abi.encodePacked(address(this), manifestHash, blockhash(block.number - 1), block.timestamp)
        );
        requestId = conductor.requestWithMinTapes{value: fee}(N_PRINTS, seed, MIN_TAPES);
        requestedAt = uint40(block.timestamp);
        emit RevealRequested(requestId, msg.sender, fee);
    }

    /// Conductor callback — guarded, best-effort. The pull backstop
    /// below makes delivery a convenience, never a dependency.
    function rawFulfillEntropy(uint256 id, bytes32 word) external {
        if (msg.sender != address(conductor)) revert NotConductor();
        if (id != requestId || requestId == 0) return;
        _reveal(word);
    }

    /// Permissionless pull backstop — settles even if the callback
    /// never lands.
    function settleReveal() external {
        if (requestId == 0) revert NotRequested();
        bytes32 word = conductor.wordOf(requestId);
        if (word == bytes32(0)) {
            (bool ready, bytes32 preview) = conductor.previewWord(requestId);
            if (!ready) revert NotReady();
            word = preview;
        }
        _reveal(word);
    }

    function _reveal(bytes32 word) private {
        if (revealWord != bytes32(0)) revert AlreadyRevealed();
        if (block.timestamp < uint256(requestedAt) + MIN_SETTLE_DELAY) revert TooEarly();
        revealWord = word;
        emit Revealed(word);
    }

    /// Quiet-floor escape: after the conductor's cancel timeout on an
    /// undetermined request, recover the fee and re-arm. Permissionless;
    /// `cancel` itself reverts unless genuinely timed out.
    function rescueReveal() external {
        if (requestId == 0) revert NotRequested();
        if (revealWord != bytes32(0)) revert AlreadyRevealed();
        uint256 id = requestId;
        conductor.cancel(id);
        requestId = 0;
        requestedAt = 0;
        emit RevealRescued(id);
    }

    /// The entire assignment: tokenId -> manifest index, pure function
    /// of the word. Offset rotation composes with the sealed manifest
    /// order (which nobody could choose against) — the classic
    /// provenance-hash reveal, recomputable by anyone forever.
    function identityIndexOf(uint256 tokenId) external view returns (uint256) {
        if (revealWord == bytes32(0)) revert NotReady();
        if (tokenId >= SUPPLY) revert BadToken();
        return (tokenId + (uint256(revealWord) % SUPPLY)) % SUPPLY;
    }

    function isRevealed() external view returns (bool) {
        return revealWord != bytes32(0);
    }

    /// Fee funding + conductor cancel refunds.
    receive() external payable {}
}
