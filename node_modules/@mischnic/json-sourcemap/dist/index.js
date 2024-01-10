var $dpHg0$lezercommon = require("@lezer/common");
var $dpHg0$json5 = require("json5");
var $dpHg0$lezerlr = require("@lezer/lr");

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "parse", () => $e9bfae1610a637d5$export$98e6a39c04603d36);


const $1adaef8fb7bb1497$export$8f49e4af10703ce3 = $dpHg0$lezerlr.LRParser.deserialize({
    version: 13,
    states: "%QO]QPOOOOQO'#Cd'#CdOtQQO'#CgO!PQPO'#ClOOQO'#Cs'#CsQOQPOOOOQO'#Ci'#CiO!WQPO'#ChO!]QPO'#CuOOQO,59R,59RO!eQPO,59ROOQO'#Cm'#CmO!jQPO'#CyOOQO,59W,59WO!rQPO,59WO]QPO,59SO!wQQO,59aO#SQPO,59aOOQO1G.m1G.mO#[QPO,59eO#cQPO,59eOOQO1G.r1G.rOOQO1G.n1G.nOOQO,59Y,59YO#kQQO1G.{OOQO-E6l-E6lOOQO,59Z,59ZO#vQPO1G/POOQO-E6m-E6mPwQQO'#CnP]QPO'#Co",
    stateData: "$R~OfOSPOSQOS~OSSOTSOUSOVSOYQO_ROhPO~OXXOhUOjUO~O^]O~P]Ok_O~Ol`OXiX~OXbO~OlcO^mX~O^eO~OhUOjUOXia~OlhOXia~O^ma~P]OlkO^ma~OhUOjUOXii~O^mi~P]OPQj~",
    goto: "!}nPPPPPPPPoPPow!PPPo!V!_!ePPP!kP!wPPP!z]SOR_cknQWQVg`hmXVQ`hmQ[RVjcknQaWRiaQd[RldQTOWZRcknRf_RYQR^R",
    nodeNames: "⚠ LineComment BlockComment JsonText True False Null Number String } { Object Property PropertyName ] [ Array ArrayValue",
    maxTerm: 29,
    nodeProps: [
        [
            $dpHg0$lezercommon.NodeProp.group,
            -7,
            4,
            5,
            6,
            7,
            8,
            11,
            16,
            "Value"
        ],
        [
            $dpHg0$lezercommon.NodeProp.openedBy,
            9,
            "{",
            14,
            "["
        ],
        [
            $dpHg0$lezercommon.NodeProp.closedBy,
            10,
            "}",
            15,
            "]"
        ]
    ],
    skippedNodes: [
        0,
        1,
        2
    ],
    repeatNodeCount: 2,
    tokenData: "NU~R!OXY$RYZ$RZ[$R[]$R]^$Rpq$Rrs$Wtu,ywx/S{|0n|}5U}!O0n!O!P1Q!P!Q5Z!Q!R2Q!R![3f![!]6j!c!k,y!k!l6o!l!p,y!p!q>s!q!},y!}#O@r#O#P-t#P#Q@w#R#S,y#T#Y,y#Y#Z@|#Z#b,y#b#cEz#c#h,y#h#iIz#i#o,y#o#pMz#q#rNP$f$g$R$g$IV,y$IV$IW$R$IW$I|,y$I|$I}$R$I}$JO$R$JU;'S,y;'S;=`.|<%l?HT,y?HT?HU$R?HU~,y~$WOf~~$ZVOp$ppq$Wqr$Wrs%Ss#O$W#O#P&a#P~$W~$sTOr$prs%Ss#O$p#O#P%X#P~$p~%XOh~~%[aYZ$p]^$prs$pwx$p!Q!R$p#O#P$p#T#U$p#U#V$p#Y#Z$p#b#c$p#f#g$p#h#i$p#i#j$p#j#k$p#l#m$p$I|$I}$p$I}$JO$p~&dbYZ$p]^$prs$Wwx$p!P!Q'l!Q!R$p#O#P$W#T#U$p#U#V$W#Y#Z$W#b#c$W#f#g$W#h#i$W#i#j)s#j#k$p#l#m$p$I|$I}$p$I}$JO$p~'oUpq'lqr'lrs%Ss#O'l#O#P(R#P~'l~(UXrs'l!P!Q'l#O#P'l#U#V'l#Y#Z'l#b#c'l#f#g'l#h#i'l#i#j(q~(tR!Q![(}!c!i(}#T#Z(}~)QR!Q![)Z!c!i)Z#T#Z)Z~)^R!Q![)g!c!i)g#T#Z)g~)jR!Q!['l!c!i'l#T#Z'l~)vZOr$prs%Ss!Q$p!Q![*i![!c$p!c!i*i!i#O$p#O#P%X#P#T$p#T#Z*i#Z~$p~*lZOr$prs%Ss!Q$p!Q![+_![!c$p!c!i+_!i#O$p#O#P%X#P#T$p#T#Z+_#Z~$p~+bZOr$prs%Ss!Q$p!Q![,T![!c$p!c!i,T!i#O$p#O#P%X#P#T$p#T#Z,T#Z~$p~,WZOr$prs%Ss!Q$p!Q![$W![!c$p!c!i$W!i#O$p#O#P%X#P#T$p#T#Z$W#Z~$pQ-O[jQtu,y!Q![,y!c!},y#O#P-t#R#S,y#T#o,y$g$IV,y$IW$I|,y$JU;'S,y;'S;=`.|<%l?HT,y?HU~,yQ-wP#i#j-zQ-}R!Q![.W!c!i.W#T#Z.WQ.ZR!Q![.d!c!i.d#T#Z.dQ.gR!Q![.p!c!i.p#T#Z.pQ.sR!Q![,y!c!i,y#T#Z,yQ/PP;=`<%l,y~/VTOw/Swx%Sx#O/S#O#P/f#P~/S~/iaYZ/S]^/Srs/Swx/S!Q!R/S#O#P/S#T#U/S#U#V/S#Y#Z/S#b#c/S#f#g/S#h#i/S#i#j/S#j#k/S#l#m/S$I|$I}/S$I}$JO/SP0qT!O!P1Q!Q!R2Q!R![3f!k!l3w!p!q4xP1TP!Q![1WP1]RVP!Q![1W!g!h1f#X#Y1fP1iR{|1r}!O1r!Q![1xP1uP!Q![1xP1}PVP!Q![1xP2VTVP!O!P1W!Q![2f!g!h1f#X#Y1f#l#m2zP2iQ!O!P2o!Q![2fP2tQVP!g!h1f#X#Y1fP2}R!Q![3W!c!i3W#T#Z3WP3]RVP!Q![3W!c!i3W#T#Z3WP3kSVP!O!P1W!Q![3f!g!h1f#X#Y1fP3zP#b#c3}P4QP#Y#Z4TP4WP#]#^4ZP4^P#b#c4aP4dP#]#^4gP4jP#h#i4mP4pP#m#n4sP4xOVPP4{P#T#U5OP5RP!p!q4s~5ZOl~~5^Qz{5d!P!Q6X~5gROz5dz{5p{~5d~5sTOz5dz{5p{!P5d!P!Q6S!Q~5d~6XOQ~~6^SP~OY6XZ]6X^$I|6X$JO~6X~6oOk~R6t^jQtu,y!Q![,y!c!},y#O#P-t#R#S,y#T#b,y#b#c7p#c#o,y$g$IV,y$IW$I|,y$JU;'S,y;'S;=`.|<%l?HT,y?HU~,yR7u^jQtu,y!Q![,y!c!},y#O#P-t#R#S,y#T#Y,y#Y#Z8q#Z#o,y$g$IV,y$IW$I|,y$JU;'S,y;'S;=`.|<%l?HT,y?HU~,yR8v^jQtu,y!Q![,y!c!},y#O#P-t#R#S,y#T#],y#]#^9r#^#o,y$g$IV,y$IW$I|,y$JU;'S,y;'S;=`.|<%l?HT,y?HU~,yR9w^jQtu,y!Q![,y!c!},y#O#P-t#R#S,y#T#b,y#b#c:s#c#o,y$g$IV,y$IW$I|,y$JU;'S,y;'S;=`.|<%l?HT,y?HU~,yR:x^jQtu,y!Q![,y!c!},y#O#P-t#R#S,y#T#],y#]#^;t#^#o,y$g$IV,y$IW$I|,y$JU;'S,y;'S;=`.|<%l?HT,y?HU~,yR;y^jQtu,y!Q![,y!c!},y#O#P-t#R#S,y#T#h,y#h#i<u#i#o,y$g$IV,y$IW$I|,y$JU;'S,y;'S;=`.|<%l?HT,y?HU~,yR<z^jQtu,y!Q![,y!c!},y#O#P-t#R#S,y#T#m,y#m#n=v#n#o,y$g$IV,y$IW$I|,y$JU;'S,y;'S;=`.|<%l?HT,y?HU~,yR=}[VPjQtu,y!Q![,y!c!},y#O#P-t#R#S,y#T#o,y$g$IV,y$IW$I|,y$JU;'S,y;'S;=`.|<%l?HT,y?HU~,yR>x]jQtu,y!Q![,y!c!},y#O#P-t#R#S,y#T#U?q#U#o,y$g$IV,y$IW$I|,y$JU;'S,y;'S;=`.|<%l?HT,y?HU~,yR?v^jQtu,y!Q![,y!c!p,y!p!q=v!q!},y#O#P-t#R#S,y#T#o,y$g$IV,y$IW$I|,y$JU;'S,y;'S;=`.|<%l?HT,y?HU~,y~@wO_~~@|O^~RAR]jQtu,y!Q![,y!c!},y#O#P-t#R#S,y#T#UAz#U#o,y$g$IV,y$IW$I|,y$JU;'S,y;'S;=`.|<%l?HT,y?HU~,yRBP^jQtu,y!Q![,y!c!},y#O#P-t#R#S,y#T#`,y#`#aB{#a#o,y$g$IV,y$IW$I|,y$JU;'S,y;'S;=`.|<%l?HT,y?HU~,yRCQ^jQtu,y!Q![,y!c!},y#O#P-t#R#S,y#T#g,y#g#hC|#h#o,y$g$IV,y$IW$I|,y$JU;'S,y;'S;=`.|<%l?HT,y?HU~,yRDR^jQtu,y!Q![,y!c!},y#O#P-t#R#S,y#T#X,y#X#YD}#Y#o,y$g$IV,y$IW$I|,y$JU;'S,y;'S;=`.|<%l?HT,y?HU~,yREU[TPjQtu,y!Q![,y!c!},y#O#P-t#R#S,y#T#o,y$g$IV,y$IW$I|,y$JU;'S,y;'S;=`.|<%l?HT,y?HU~,yRFP^jQtu,y!Q![,y!c!},y#O#P-t#R#S,y#T#i,y#i#jF{#j#o,y$g$IV,y$IW$I|,y$JU;'S,y;'S;=`.|<%l?HT,y?HU~,yRGQ^jQtu,y!Q![,y!c!},y#O#P-t#R#S,y#T#`,y#`#aG|#a#o,y$g$IV,y$IW$I|,y$JU;'S,y;'S;=`.|<%l?HT,y?HU~,yRHR^jQtu,y!Q![,y!c!},y#O#P-t#R#S,y#T#`,y#`#aH}#a#o,y$g$IV,y$IW$I|,y$JU;'S,y;'S;=`.|<%l?HT,y?HU~,yRIU[UPjQtu,y!Q![,y!c!},y#O#P-t#R#S,y#T#o,y$g$IV,y$IW$I|,y$JU;'S,y;'S;=`.|<%l?HT,y?HU~,yRJP^jQtu,y!Q![,y!c!},y#O#P-t#R#S,y#T#f,y#f#gJ{#g#o,y$g$IV,y$IW$I|,y$JU;'S,y;'S;=`.|<%l?HT,y?HU~,yRKQ^jQtu,y!Q![,y!c!},y#O#P-t#R#S,y#T#i,y#i#jK|#j#o,y$g$IV,y$IW$I|,y$JU;'S,y;'S;=`.|<%l?HT,y?HU~,yRLR^jQtu,y!Q![,y!c!},y#O#P-t#R#S,y#T#X,y#X#YL}#Y#o,y$g$IV,y$IW$I|,y$JU;'S,y;'S;=`.|<%l?HT,y?HU~,yRMU[SPjQtu,y!Q![,y!c!},y#O#P-t#R#S,y#T#o,y$g$IV,y$IW$I|,y$JU;'S,y;'S;=`.|<%l?HT,y?HU~,y~NPOY~~NUOX~",
    tokenizers: [
        0,
        1
    ],
    topRules: {
        "JsonText": [
            0,
            3
        ]
    },
    dialects: {
        json5: 137
    },
    tokenPrec: 0
});


const $121152950f502dea$export$e6476262d0d4122e = 1, $121152950f502dea$export$33c356ab5b93be35 = 2, $121152950f502dea$export$8bc1c2b4dd1e923b = 3, $121152950f502dea$export$4bc0976997a4d94e = 4, $121152950f502dea$export$5d3e9aafef2fffbe = 5, $121152950f502dea$export$26c9c3a80cd996ae = 6, $121152950f502dea$export$fffa67e515d04022 = 7, $121152950f502dea$export$89b8e0fa65f6a914 = 8, $121152950f502dea$export$164a3ab98abb171d = 11, $121152950f502dea$export$41b04b3a73e7216d = 12, $121152950f502dea$export$e546d8cfcc0684e2 = 13, $121152950f502dea$export$c4be6576ca6fe4aa = 16, $121152950f502dea$export$f06b0ce79fd44095 = 17, $121152950f502dea$export$386a487b17ea4d92 = 0;






function $e9bfae1610a637d5$export$98e6a39c04603d36(input, reviver, { dialect: dialect = "json" , tabWidth: tabWidth = 4  } = {}) {
    // Let these parsers throw any errors about invalid input
    let data = dialect === "JSON5" ? ($parcel$interopDefault($dpHg0$json5)).parse(input, reviver) : JSON.parse(input, reviver);
    let tree = $1adaef8fb7bb1497$export$8f49e4af10703ce3.configure({
        strict: true,
        dialect: dialect === "JSON5" ? "json5" : "json"
    }).parse(input);
    let pointers = new Map();
    let currentPath = [
        ""
    ];
    tree.iterate({
        enter (type, from, to, get) {
            // if (type.isError) {
            // 	let fromPos = posToLineColumn(input, from, tabWidth);
            // 	let error = new SyntaxError(
            // 		`Failed to parse (${fromPos.line}:${fromPos.column})`
            // 	);
            // 	error.lineNumber = fromPos.line;
            // 	error.columnNumber = fromPos.column;
            // 	throw error;
            // }
            let group = type.prop($dpHg0$lezercommon.NodeProp.group);
            if (group === null || group === void 0 ? void 0 : group.includes("Value")) $e9bfae1610a637d5$var$mapMerge(pointers, $e9bfae1610a637d5$var$toJsonPointer(currentPath), {
                value: $e9bfae1610a637d5$var$posToLineColumn(input, from, tabWidth),
                valueEnd: $e9bfae1610a637d5$var$posToLineColumn(input, to, tabWidth)
            });
            if (type.name === "PropertyName") {
                let nameNode = get();
                let name = input.slice(nameNode.from, nameNode.to);
                let quoted = name[0] === `'` || name[0] == `"`;
                currentPath.push(quoted ? name.slice(1, -1) : name);
                $e9bfae1610a637d5$var$mapMerge(pointers, $e9bfae1610a637d5$var$toJsonPointer(currentPath), {
                    key: $e9bfae1610a637d5$var$posToLineColumn(input, from, tabWidth),
                    keyEnd: $e9bfae1610a637d5$var$posToLineColumn(input, to, tabWidth)
                });
            } else if (type.name === "Array") currentPath.push(0);
        },
        leave (type, from, to, get) {
            if (type.name === "Property" || type.name === "Array") currentPath.pop();
            else if (type.name === "ArrayValue") currentPath[currentPath.length - 1]++;
        }
    });
    return {
        data: data,
        pointers: Object.fromEntries(pointers)
    };
}
function $e9bfae1610a637d5$var$mapMerge(map, key, data) {
    let value = map.get(key);
    value = {
        ...value,
        ...data
    };
    map.set(key, value);
}
function $e9bfae1610a637d5$var$posToLineColumn(input, pos, tabWidth) {
    let line = $e9bfae1610a637d5$var$countNewLines(input, pos);
    let lineStart = input.lastIndexOf("\n", pos - 1) + 1;
    let column = $e9bfae1610a637d5$var$countColumn(input, lineStart, pos, tabWidth);
    return {
        line: line,
        column: column,
        pos: pos
    };
}
function $e9bfae1610a637d5$var$countNewLines(str, end) {
    let count = 0;
    for(let i = 0; i < end; i++)if (str[i] === "\n") count++;
    return count;
}
function $e9bfae1610a637d5$var$countColumn(str, start, end, tabWidth) {
    let count = 0;
    for(let i = start; i < end; i++)count += str[i] === "\t" ? tabWidth : 1;
    return count;
}
const $e9bfae1610a637d5$var$ESCAPE_REGEX = /[~/]/g;
function $e9bfae1610a637d5$var$toJsonPointer(path) {
    let str = "";
    for (let e of path)if (typeof e === "string") str += e.replace($e9bfae1610a637d5$var$ESCAPE_REGEX, (v)=>v === "~" ? "~0" : "~1"
    ) + "/";
    else str += String(e) + "/";
    return str.slice(0, -1);
}


