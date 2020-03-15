import pkg from './package.json';
import ts from "@wessberg/rollup-plugin-ts";

const name = pkg.name
const extensions = [
    '.js', '.jsx', '.ts', '.tsx',
];

export default [
    {
        input: './src/index.ts',
        external: ["redux", "@dadoudidou/scale-app"],
        plugins: [
            ts({
                transpiler: "babel",
            })
        ],
        output: [ { file: pkg.main, format: "cjs" } ]
    }
]
