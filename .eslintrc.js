module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "globals": {
        "DedicatedWorkerGlobalScope": "readonly",
    },
    "rules": {
        "no-unused-vars": ["error", { "vars": "all", "args": "none" }],
    }
}
