import "webpack-dev-server";
import { resolve } from "node:path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";

const config: webpack.Configuration = {
  mode: "development",

  entry: "./src/index.tsx",

  output: {
    filename: "[name].bundle.js",
    path: resolve(__dirname, "dist"),
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            // Remove this line to enable type checking in webpack builds
            transpileOnly: true,
            compilerOptions: {
              module: "esnext",
            },
          },
        },
      },
    ],
  },

  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
  ],

  devServer: {
    port: 3000,
    compress: true,
    hot: true,
  },
};

export default config;
