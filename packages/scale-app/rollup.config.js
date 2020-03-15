import pkg from './package.json';
import ts from "@wessberg/rollup-plugin-ts";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs"

const name = pkg.name
const extensions = [
    '.js', '.jsx', '.ts', '.tsx',
];

export default [
    {
        input: './src/index.ts',
        external: [],
        plugins: [
            nodeResolve(),
            commonjs(),
            ts({
                transpiler: "babel",
            })
        ],
        output: [ { file: pkg.main, format: "cjs" } ]
    }
]
