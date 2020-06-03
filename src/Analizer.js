export default function () {
    const Analizer = {};

    Analizer.checkType = function(targetName, code) {
        let type = null;
        
        if (typeof targetName != "string" || typeof code != "string") return type;

        switch (true) {
            case !!code.match(new RegExp(`${targetName}\\[[0-9]+\\]`)):
                type = 0;
                break;

            case !!code.match(new RegExp(`${targetName}\\(.[a-zA-Z0-9]+.\\)`)):
                type = 1;
                break;

            case !!code.match(new RegExp(`${targetName}\\(.[a-zA-Z0-9]+.,.[^']+.\\)`)):
                type = 2;
                break;
        }

        console.log("[Analizer] Obfuscation type:", type);
        return type;
    }

    return Analizer;
}
