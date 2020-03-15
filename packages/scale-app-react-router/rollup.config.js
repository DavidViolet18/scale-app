import pkg from './package.json';
import ts from "@wessberg/rollup-plugin-ts";

const name = pkg.name
const extensions = [
    '.js', '.jsx', '.ts', '.tsx',
];

export default [
    {
        input: './src/index.ts',
        external: ["@dadoudidou/scale-app", "@dadoudidou/scale-app-react", "@dadoudidou/scale-app-router", "react"],
        plugins: [
            ts({
                transpiler: "babel",
            })
        ],
        output: [ { file: pkg.main, format: "cjs" } ]
    }
]
