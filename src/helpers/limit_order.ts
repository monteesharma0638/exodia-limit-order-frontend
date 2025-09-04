import { AbiCoder, ethers, keccak256, solidityPacked } from "ethers";
import type { IOrder } from "../interface/ILimitOrder";
import crypto from "crypto";

function trim0x(bigNumber: string | bigint) {
    const s = bigNumber.toString();
    if (s.startsWith('0x')) {
        return s.substring(2);
    }
    return s;
}

const constants = {
    ZERO_ADDRESS: "0x0000000000000000000000000000000000000000",
    EEE_ADDRESS: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    ZERO_BYTES32: "0x0000000000000000000000000000000000000000000000000000000000000000",
};

export const Order = [
    { name: 'salt', type: 'uint256' },
    { name: 'maker', type: 'address' },
    { name: 'receiver', type: 'address' },
    { name: 'makerAsset', type: 'address' },
    { name: 'takerAsset', type: 'address' },
    { name: 'makingAmount', type: 'uint256' },
    { name: 'takingAmount', type: 'uint256' },
    { name: 'makerTraits', type: 'uint256' },
];

const ABIOrder = {
    type: 'tuple',
    name: 'order',
    components: Order,
};

const name = '1inch Limit Order Protocol';
const version = '4';

const _NO_PARTIAL_FILLS_FLAG = 255n;
const _ALLOW_MULTIPLE_FILLS_FLAG = 254n;
const _NEED_PREINTERACTION_FLAG = 252n;
const _NEED_POSTINTERACTION_FLAG = 251n;
const _NEED_EPOCH_CHECK_FLAG = 250n;
const _HAS_EXTENSION_FLAG = 249n;
const _USE_PERMIT2_FLAG = 248n;
const _UNWRAP_WETH_FLAG = 247n;

const TakerTraitsConstants = {
    _MAKER_AMOUNT_FLAG: 1n << 255n,
    _UNWRAP_WETH_FLAG: 1n << 254n,
    _SKIP_ORDER_PERMIT_FLAG: 1n << 253n,
    _USE_PERMIT2_FLAG: 1n << 252n,
    _ARGS_HAS_TARGET: 1n << 251n,

    _ARGS_EXTENSION_LENGTH_OFFSET: 224n,
    _ARGS_EXTENSION_LENGTH_MASK: 0xffffff,
    _ARGS_INTERACTION_LENGTH_OFFSET: 200n,
    _ARGS_INTERACTION_LENGTH_MASK: 0xffffff,
};


function setn (num: any, bit: any, value: any) {
    if (value) {
        return BigInt(num) | (1n << BigInt(bit));
    } else {
        return BigInt(num) & (~(1n << BigInt(bit)));
    }
}


export function buildTakerTraits ({
    makingAmount = false,
    unwrapWeth = false,
    skipMakerPermit = false,
    usePermit2 = false,
    target = '0x',
    extension = '0x',
    interaction = '0x',
    threshold = 0n,
} = {}) {
    return {
        traits: BigInt(threshold) | (
            (makingAmount ? TakerTraitsConstants._MAKER_AMOUNT_FLAG : 0n) |
            (unwrapWeth ? TakerTraitsConstants._UNWRAP_WETH_FLAG : 0n) |
            (skipMakerPermit ? TakerTraitsConstants._SKIP_ORDER_PERMIT_FLAG : 0n) |
            (usePermit2 ? TakerTraitsConstants._USE_PERMIT2_FLAG : 0n) |
            (trim0x(target).length > 0 ? TakerTraitsConstants._ARGS_HAS_TARGET : 0n) |
            (BigInt(trim0x(extension).length / 2) << TakerTraitsConstants._ARGS_EXTENSION_LENGTH_OFFSET) |
            (BigInt(trim0x(interaction).length / 2) << TakerTraitsConstants._ARGS_INTERACTION_LENGTH_OFFSET)
        ),
        args: solidityPacked(
            ['bytes', 'bytes', 'bytes'],
            [target, extension, interaction],
        ) as `0x${string}`,
    };
}

export function fillWithMakingAmount (amount: string) {
    return BigInt(amount) | BigInt(buildTakerTraits({ makingAmount: true }).traits);
}

export function buildMakerTraits ({
    allowedSender = constants.ZERO_ADDRESS,
    shouldCheckEpoch = false,
    allowPartialFill = true,
    allowMultipleFills = true,
    usePermit2 = false,
    unwrapWeth = false,
    expiry = 0,
    nonce = 0,
    series = 0,
} = {}) {
    if(!(BigInt(expiry) >= 0n && BigInt(expiry) < (1n << 40n))) throw new Error('Expiry should be less than 40 bits');
    if(!(BigInt(nonce) >= 0 && BigInt(nonce) < (1n << 40n))) throw new Error('Nonce should be less than 40 bits');
    if(!(BigInt(series) >= 0 && BigInt(series) < (1n << 40n))) throw new Error('Series should be less than 40 bits');

    return '0x' + (
        (BigInt(series) << 160n) |
        (BigInt(nonce) << 120n) |
        (BigInt(expiry) << 80n) |
        (BigInt(allowedSender) & ((1n << 80n) - 1n)) |
        setn(0n, _UNWRAP_WETH_FLAG, unwrapWeth) |
        setn(0n, _ALLOW_MULTIPLE_FILLS_FLAG, allowMultipleFills) |
        setn(0n, _NO_PARTIAL_FILLS_FLAG, !allowPartialFill) |
        setn(0n, _NEED_EPOCH_CHECK_FLAG, shouldCheckEpoch) |
        setn(0n, _USE_PERMIT2_FLAG, usePermit2)
    ).toString(16).padStart(64, '0');
}

interface IBuildOrder {
    maker: `0x${string}`,
    receiver?: string,
    makerAsset: any,
    takerAsset: any,
    makingAmount: any,
    takingAmount: any,
    makerTraits?: string
}


/**
 * Generates a cryptographically secure 256-bit salt
 * for use in limit orders.
 *
 * @returns bigint salt
 */
export function generateSalt(): bigint {
  // 32 bytes = 256 bits
  const buf = crypto.randomBytes(32);
  // Convert to bigint
  return BigInt("0x" + buf.toString("hex"));
}

export function buildOrder (
    {
        maker,
        receiver = constants.ZERO_ADDRESS,
        makerAsset,
        takerAsset,
        makingAmount,
        takingAmount,
        makerTraits = buildMakerTraits(),
    }: IBuildOrder,
    {
        makerAssetSuffix = '0x',
        takerAssetSuffix = '0x',
        makingAmountData = '0x',
        takingAmountData = '0x',
        predicate = '0x',
        permit = '0x',
        preInteraction = '0x',
        postInteraction = '0x',
        customData = '0x',
    } = {}
) {
    const allInteractions = [
        makerAssetSuffix,
        takerAssetSuffix,
        makingAmountData,
        takingAmountData,
        predicate,
        permit,
        preInteraction,
        postInteraction,
    ];

    const allInteractionsConcat = allInteractions.map(trim0x).join('') + trim0x(customData);

    // https://stackoverflow.com/a/55261098/440168
    const cumulativeSum = (sum => (value: any) => { sum += value; return sum; })(0);
    const offsets = allInteractions
        .map(a => a.length / 2 - 1)
        .map(cumulativeSum)
        .reduce((acc, a, i) => acc + (BigInt(a) << BigInt(32 * i)), 0n);

    let extension = '0x';
    if (allInteractionsConcat.length > 0) {
        extension += offsets.toString(16).padStart(64, '0') + allInteractionsConcat;
    }

    let salt = generateSalt();
    let makerTraitsResolved;
    if (trim0x(extension).length > 0) {
        salt = BigInt(keccak256(extension)) & ((1n << 160n) - 1n); // Use 160 bit of extension hash
        makerTraitsResolved = BigInt(makerTraits) | (1n << _HAS_EXTENSION_FLAG);
    }

    if (trim0x(preInteraction).length > 0) {
        makerTraitsResolved = BigInt(makerTraits) | (1n << _NEED_PREINTERACTION_FLAG);
    }

    if (trim0x(postInteraction).length > 0) {
        makerTraitsResolved = BigInt(makerTraits) | (1n << _NEED_POSTINTERACTION_FLAG);
    }

    return {
        salt,
        maker,
        receiver,
        makerAsset,
        takerAsset,
        makingAmount,
        takingAmount,
        makerTraits: makerTraitsResolved ?? makerTraits,
        extension,
    };
}

export function buildOrderData (chainId: number, verifyingContract: string, order: IOrder) {
    return {
        domain: { name, version, chainId, verifyingContract },
        types: { Order },
        message: order,
        primaryType: "Order"
    };
}

export function signOrder(order: IOrder, chainId: number, target: string, signTypedData: Function) {
    const orderData = buildOrderData(chainId, target, order);
    return signTypedData(orderData);
}