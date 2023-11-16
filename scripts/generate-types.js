var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var fs = require("fs-extra");
var path = require("path");
var _a = require("@ethersproject/abi"), Interface = _a.Interface, ParamType = _a.ParamType;
var ActivePool = require("../contracts/ActivePool.sol/ActivePool.json");
var BorrowerOperations = require("../contracts/BorrowerOperations.sol/BorrowerOperations.json");
var CollSurplusPool = require("../contracts/CollSurplusPool.sol/CollSurplusPool.json");
var CommunityIssuance = require("../contracts/LQTY/CommunityIssuance.sol/CommunityIssuance.json");
var DefaultPool = require("../contracts/DefaultPool.sol/DefaultPool.json");
var ERC20Mock = require("../contracts/LPRewards/TestContracts/ERC20Mock.sol/ERC20Mock.json");
var GasPool = require("../contracts/GasPool.sol/GasPool.json");
var HintHelpers = require("../contracts/HintHelpers.sol/HintHelpers.json");
var IERC20 = require("@openzeppelin/contracts/build/contracts//IERC20.json");
var LockupContractFactory = require("../contracts/LQTY/LockupContractFactory.sol/LockupContractFactory.json");
var LUSDToken = require("../contracts/LUSDToken.sol/LUSDToken.json");
var LQTYStaking = require("../contracts/LQTY/LQTYStaking.sol/LQTYStaking.json");
var LQTYToken = require("../contracts/LQTY/LQTYToken.sol/LQTYToken.json");
var MultiTroveGetter = require("../contracts/MultiTroveGetter.sol/MultiTroveGetter.json");
var PriceFeed = require("../contracts/PriceFeed.sol/PriceFeed.json");
var PriceFeedTestnet = require("../contracts/TestContracts/PriceFeedTestnet.sol/PriceFeedTestnet.json");
var SortedTroves = require("../contracts/SortedTroves.sol/SortedTroves.json");
var StabilityPool = require("../contracts/StabilityPool.sol/StabilityPool.json");
var TroveManager = require("../contracts/TroveManager.sol/TroveManager.json");
var Unipool = require("../contracts/LPRewards/Unipool.sol/Unipool.json");
var getTupleType = function (components, flexible) {
    if (components.every(function (component) { return component.name; })) {
        return ("{ " +
            components.map(function (component) { return "".concat(component.name, ": ").concat(getType(component, flexible)); }).join("; ") +
            " }");
    }
    else {
        return "[".concat(components.map(function (component) { return getType(component, flexible); }).join(", "), "]");
    }
};
var getType = function (_a, flexible) {
    var baseType = _a.baseType, components = _a.components, arrayChildren = _a.arrayChildren;
    switch (baseType) {
        case "address":
        case "string":
            return "string";
        case "bool":
            return "boolean";
        case "array":
            return "".concat(getType(arrayChildren, flexible), "[]");
        case "tuple":
            return getTupleType(components, flexible);
    }
    if (baseType.startsWith("bytes")) {
        return flexible ? "BytesLike" : "string";
    }
    var match = baseType.match(/^(u?int)([0-9]+)$/);
    if (match) {
        return flexible ? "BigNumberish" : parseInt(match[2]) >= 53 ? "BigNumber" : "number";
    }
    throw new Error("unimplemented type ".concat(baseType));
};
var declareInterface = function (_a) {
    var contractName = _a.contractName, _b = _a.interface, events = _b.events, functions = _b.functions;
    return __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([
        "interface ".concat(contractName, "Calls {")
    ], Object.values(functions)
        .filter(function (_a) {
        var constant = _a.constant;
        return constant;
    })
        .map(function (_a) {
        var name = _a.name, inputs = _a.inputs, outputs = _a.outputs;
        var params = __spreadArray(__spreadArray([], inputs.map(function (input, i) { return "".concat(input.name || "arg" + i, ": ").concat(getType(input, true)); }), true), [
            "_overrides?: CallOverrides"
        ], false);
        var returnType;
        if (!outputs || outputs.length == 0) {
            returnType = "void";
        }
        else if (outputs.length === 1) {
            returnType = getType(outputs[0], false);
        }
        else {
            returnType = getTupleType(outputs, false);
        }
        return "  ".concat(name, "(").concat(params.join(", "), "): Promise<").concat(returnType, ">;");
    }), true), [
        "}\n",
        "interface ".concat(contractName, "Transactions {")
    ], false), Object.values(functions)
        .filter(function (_a) {
        var constant = _a.constant;
        return !constant;
    })
        .map(function (_a) {
        var name = _a.name, payable = _a.payable, inputs = _a.inputs, outputs = _a.outputs;
        var overridesType = payable ? "PayableOverrides" : "Overrides";
        var params = __spreadArray(__spreadArray([], inputs.map(function (input, i) { return "".concat(input.name || "arg" + i, ": ").concat(getType(input, true)); }), true), [
            "_overrides?: ".concat(overridesType)
        ], false);
        var returnType;
        if (!outputs || outputs.length == 0) {
            returnType = "void";
        }
        else if (outputs.length === 1) {
            returnType = getType(outputs[0], false);
        }
        else {
            returnType = getTupleType(outputs, false);
        }
        return "  ".concat(name, "(").concat(params.join(", "), "): Promise<").concat(returnType, ">;");
    }), true), [
        "}\n",
        "export interface ".concat(contractName),
        "  extends _TypedLiquityContract<".concat(contractName, "Calls, ").concat(contractName, "Transactions> {"),
        "  readonly filters: {"
    ], false), Object.values(events).map(function (_a) {
        var name = _a.name, inputs = _a.inputs;
        var params = inputs.map(function (input) { return "".concat(input.name, "?: ").concat(input.indexed ? "".concat(getType(input, true), " | null") : "null"); });
        return "    ".concat(name, "(").concat(params.join(", "), "): EventFilter;");
    }), true), [
        "  };"
    ], false), Object.values(events).map(function (_a) {
        var name = _a.name, inputs = _a.inputs;
        return "  extractEvents(logs: Log[], name: \"".concat(name, "\"): _TypedLogDescription<").concat(getTupleType(inputs, false), ">[];");
    }), true), [
        "}"
    ], false).join("\n");
};
var contractArtifacts = [
    ActivePool,
    BorrowerOperations,
    CollSurplusPool,
    CommunityIssuance,
    DefaultPool,
    ERC20Mock,
    GasPool,
    HintHelpers,
    IERC20,
    LockupContractFactory,
    LUSDToken,
    LQTYStaking,
    LQTYToken,
    MultiTroveGetter,
    PriceFeed,
    PriceFeedTestnet,
    SortedTroves,
    StabilityPool,
    TroveManager,
    Unipool
];
var contracts = contractArtifacts.map(function (_a) {
    var contractName = _a.contractName, abi = _a.abi;
    return ({
        contractName: contractName,
        interface: new Interface(abi)
    });
});
var output = "\nimport { BigNumber, BigNumberish } from \"@ethersproject/bignumber\";\nimport { Log } from \"@ethersproject/abstract-provider\";\nimport { BytesLike } from \"@ethersproject/bytes\";\nimport {\n  Overrides,\n  CallOverrides,\n  PayableOverrides,\n  EventFilter\n} from \"@ethersproject/contracts\";\n\nimport { _TypedLiquityContract, _TypedLogDescription } from \"../src/contracts\";\n\n".concat(contracts.map(declareInterface).join("\n\n"), "\n");
fs.mkdirSync("types", { recursive: true });
fs.writeFileSync(path.join("types", "index.ts"), output);
fs.removeSync("abi");
fs.mkdirSync("abi", { recursive: true });
contractArtifacts.forEach(function (_a) {
    var contractName = _a.contractName, abi = _a.abi;
    return fs.writeFileSync(path.join("abi", "".concat(contractName, ".json")), JSON.stringify(abi, undefined, 2));
});
