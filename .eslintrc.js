module.exports = {
    "ignorePatterns": ["node_modules/*", ".next/*", ".out/*", ".prettierrc", ".eslintrc.js", "postcss.config.js", "components/ui/*"],
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": [
        "standard-with-typescript",
        "plugin:react/recommended",
        "plugin:import/typescript",
        "plugin:prettier/recommended",
        'plugin:@next/next/recommended',
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "plugins": [
        "react"
    ],
    "rules": {
    }
}
