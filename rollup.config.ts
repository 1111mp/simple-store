import clear from "rollup-plugin-clear";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

import type { RollupOptions } from "rollup";

const config: RollupOptions[] = [
  /******************************** es ************************************/
  {
    input: ["src/index.ts"],
    external: ["react", "react-dom", "/node_modules/"],
    output: {
      dir: "es",
      format: "es",
      preserveModules: true,
    },
    plugins: [
      clear({
        targets: ["es"],
      }),
      typescript({
        jsx: "react",
        outDir: "es",
        declaration: true,
        declarationDir: "es",
        exclude: ["**/__tests__/*", "rollup.config.ts", "jest.setup.ts"],
      }),
    ],
  },

  /******************************** lib ************************************/
  {
    input: ["src/index.ts"],
    external: ["react", "react-dom", "/node_modules/"],
    output: {
      dir: "lib",
      format: "cjs",
      preserveModules: true,
    },
    plugins: [
      clear({
        targets: ["lib"],
      }),
      typescript({
        jsx: "react",
        outDir: "lib",
        declaration: true,
        declarationDir: "lib",
        exclude: ["**/__tests__/*", "rollup.config.ts", "jest.setup.ts"],
      }),
    ],
  },

  /******************************** dist ************************************/
  {
    input: ["src/index.ts"],
    external: ["react", "react-dom"],
    output: [
      {
        dir: "dist",
        name: "test",
        entryFileNames: "[name].js",
        chunkFileNames: "[name]-[hash].js",
        format: "umd",
        sourcemap: true,
        globals: {
          react: "React",
        },
      },
      {
        dir: "dist",
        name: "test",
        entryFileNames: "[name].min.js",
        chunkFileNames: "[name]-[hash].min.js",
        format: "umd",
        sourcemap: true,
        plugins: [terser()],
        globals: {
          react: "React",
        },
      },
    ],
    plugins: [
      clear({
        targets: ["dist"],
      }),
      typescript({
        jsx: "react",
        exclude: ["**/__tests__/*", "rollup.config.ts", "jest.setup.ts"],
      }),
    ],
  },
];

export default config;
