/* eslint-disable no-cond-assign */
/* eslint-disable no-unused-vars */
module.exports = function () {
    const Decoder = {};

    Decoder.decode = function decode(type, targetName, code) {
        code = this.replaceConstant(targetName, code);
        switch (type) {
            case 0:
                return Decoder.decodeType0(targetName, code);
            case 1:
                return Decoder.decodeType1(targetName, code);
            case 2:
                return Decoder.decodeType2(targetName, code);
            case 3:
                return Decoder.decodeExperimentType(targetName, code);
        }
    }

    Decoder.replaceFormat = function (code) {
        /* 
            Replace format
            aaa["bbb"] or aaa['bbb'] to aaa.bbb
        */
        while (code.match(/(\w+)\[("|')(\w+)("|')\]/)) {
            // replace get["blabla"] to get blabla and set too
            code = code.replace(/(get|set)\[("|')(\w+)("|')\]/g, "$1 $3");

            // normal replace aaa["bbb"] => aaa.bbb
            code = code.replace(/(\w+)\[("|')(\w+)("|')\]/g, "$1.$3");
        }
        return code;
    }

    Decoder.replaceConstant = function (targetName, code) {
        // replace const to var if target func is constant
        return code.replace(new RegExp(`const ${targetName}\\s*=`), `var ${targetName}=`);
    }

    Decoder.greatEscape = function (code) {
        // avoid error when code includes a part like "export default class..."
        // maybe split by "export" can be better...? I need to test
        return code.split("export default")[0];
    }

    Decoder.decodeType0 = function (targetName, code) { // array like _0xf13b[274] not func
        eval(`var ${targetName} = null`);
        try {
            // eval(code.replace(new RegExp(`var ${targetName}=`), `${targetName}=`));
            eval(this.greatEscape(code))
        } catch (e) {
            console.log("Eval err but continue");
        }

        const stringArray = eval(targetName);
        const regArg = `${targetName}\\[([0-9]+)\\]`;
        const defaultRegex = new RegExp(regArg);

        let regex = new RegExp(regArg);
        let m;

        while (m = code.match(regex)) {
            const val = stringArray[m[1]].replace(/'/g, "\\x27").replace(/\$/g, "\\x24");
            regex = new RegExp(`${targetName}\\[${m[1]}\\]`, 'g');
            code = code.replace(regex, `'${val}'`);
            regex = defaultRegex;
        }

        return this.replaceFormat(code);
    }

    Decoder.decodeType1 = function (targetName, code) { // 1 args like _0xabc('0x00') 
        eval(`var ${targetName} = null`);
        try {
            eval(this.greatEscape(code));
        } catch (e) {
            console.log("Eval err but continue");
        }

        const decode = eval(targetName);
        const regArg = `${targetName}\\(.([a-zA-Z0-9]+).\\)`;
        const defaultRegex = new RegExp(regArg);

        let regex = new RegExp(regArg);
        let m;

        while (m = code.match(regex)) {
            // let val = eval(`${targetName}('${m[1]}')`).replace(/'/g, "\\x27");
            const val = decode(m[1]).replace(/'/g, "\\x27").replace(/\$/g, "\\x24");
            regex = new RegExp(`${targetName}\\(.${m[1]}.\\)`, 'g');
            code = code.replace(regex, `'${val}'`);
            regex = defaultRegex;
        }

        return this.replaceFormat(code);
    }

    Decoder.decodeType2 = function (targetName, code, decoderFunc) { // 2 args like _0xabc('asd', 'asd') RC4
        let targetNameRegex = new RegExp(`var ${targetName}=`);
        eval(`var ${targetName} = null`);
        try {
            if (decoderFunc) eval(decoderFunc);
            else eval(this.greatEscape(code));
        } catch (e) {
            console.log("Eval err but continue");
        }

        const decode = eval(targetName);
        const quoType = code.match(new RegExp(`${targetName}\\((.)[a-zA-Z0-9]+.,\\s*.[^']+.\\)`))[1];
        // there are 2 types like _0x4763("0x120b","EEc$") or _0x4763('0x120b','EEc$')
        // so quotation type check is needed
        const regArg = `${targetName}\\(.([a-zA-Z0-9]+).,\\s*.([^${quoType}]+).\\)`;

        // quotation type check is disabled
        // (enabled again, this regex is something wrong maybe ^("|'))
        // const regArg = `${targetName}\\(.([^("|')]+).,\\s*.([^("|')]+).\\)`;
        const defaultRegex = new RegExp(regArg);
        const amount = code.match(new RegExp(regArg, "g")).length;
        console.log(amount);

        let regex = new RegExp(regArg);
        let m;

        while ((m = code.match(regex))) {
            m[2] = m[2].replace(/"/, "");
            // console.log(m[1], m[2])
            const val = decode(m[1], m[2]).replace(
                /'/g,
                "\\x27"
            ).replace(/\$/g, "\\x24");
            console.log(val)

            m[2] = m[2]
                .replace(/\(/g, "\\(")
                .replace(/\)/g, "\\)")
                .replace(/\$/g, "\\$")
                .replace(/\[/g, "\\[")
                .replace(/\]/g, "\\]")
                .replace(/\^/g, "\\^")
                .replace(/\*/g, "\\*");
            regex = new RegExp(`${targetName}\\(.${m[1]}.,\\s*.${m[2]}.\\)`, "g");
            code = code.replace(regex, `'${val}'`);
            regex = defaultRegex;
        }

        return this.replaceFormat(code);
    }

    /**
     * This is under experimental
     * @param {string} code - beautified code
     */
    Decoder.decodeExperimentType = function (targetName, code) {
        // get decoder func
        let importantPart = code.split(`var ${targetName} = function`);
        importantPart = 
            importantPart[0] + 
            `var ${targetName} = function` +
            importantPart[1].split("\n};")[0] +
            "};";

        // avoid self defending
        importantPart =
            importantPart
            .replace(/[ ]{4}/g, "")
            .replace(/\r/g, "")
            .replace(/\n/g, "");

        return this.decodeType2(targetName, code, importantPart);
    }

    return Decoder;
}