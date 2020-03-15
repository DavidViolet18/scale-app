import pkg from './package.json';
import ts from "@wessberg/rollup-plugin-ts";

const name = pkg.name
const extensions = [
    '.js', '.jsx', '.ts', '.tsx',
];

export default [
    {
        input: './src/index.tsx',
        external: ["react", "react-redux", "@dadoudidou/scale-app-store", "@dadoudidou/scale-app", "@dadoudidou/scale-app-react"],
        plugins: [
            ts({
                transpiler: "babel",
            })
        ],
        output: [ { file: pkg.main, format: "cjs" } ]
    }
]
