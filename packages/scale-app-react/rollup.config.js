import pkg from './package.json';
import ts from "@wessberg/rollup-plugin-ts";

const name = pkg.name
const extensions = [
    '.js', '.jsx', '.ts', '.tsx',
];

export default [
    {
        input: './src/index.tsx',
        external: ["react", "react-dom", "@dadoudidou/scale-app"],
        plugins: [
            ts({
                transpiler: "babel",
            })
        ],
        output: [ { file: pkg.main, format: "cjs" } ]
    }
]

// export default [
//     {
//         input: './src/index.ts',
//         external: [],
//         plugins: [
//             resolve({ extensions }),
//             commonjs(),
//             babel({ 
//                 extensions, include: ["src/**/*"],
//                 runtimeHelpers: true
//             }),
//         ],
//         output: [
//             { file: pkg.main, format: "cjs" },
//             //{ file: pkg.module, format: "es" },
//             //{ file: pkg.browser, format: "iife", name, globals: {} }
//         ]
//     }, 
//     {
//         input: './src/index.ts',
//         output: [ { file: pkg.types, format: "es" }, ],
//         plugins: [dts()],
//     }
// ]