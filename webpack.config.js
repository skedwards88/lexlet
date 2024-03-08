const path = require("path");
const WorkboxPlugin = require("workbox-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const packageJson = require("./package.json");

module.exports = (env, argv) => {
  if (argv.mode === "development") {
    console.log("RUNNING IN DEV MODE. Service worker will not generate.");
  } else {
    console.log("RUNNING IN NON-DEV MODE. Service worker will generate.");
  }

  const htmlPlugin = new HtmlWebpackPlugin({
    // Need to use template because need 'root' div for react injection. templateContent doesn't play nice with title, so just use a template file instead.
    template: "./src/index.html",
  });

  const copyPlugin = new CopyPlugin({
    patterns: [
      {from: "./src/images/favicon.svg", to: "./assets/favicon.svg"},
      {from: "./src/images/favicon.ico", to: "./assets/favicon.ico"},
      {from: "./src/images/icon_192.png", to: "./assets/icon_192.png"},
      {from: "./src/images/icon_512.png", to: "./assets/icon_512.png"},
      {
        from: "./src/images/maskable_icon.png",
        to: "./assets/maskable_icon.png",
      },
      {from: "./src/manifest.json", to: "./assets/manifest.json"},
      {from: "./src/assetlinks.json", to: "./.well-known/assetlinks.json"},
      {
        from: "./src/images/screenshot_full_720_1280.png",
        to: "./assets/screenshot_full_720_1280.png",
      },
      {
        from: "./src/images/screenshot_full_1080_1080.png",
        to: "./assets/screenshot_full_1080_1080.png",
      },
      {
        from: "./src/images/screenshot_hint_720_1280.png",
        to: "./assets/screenshot_hint_720_1280.png",
      },
      {
        from: "./src/images/screenshot_hint_1080_1080.png",
        to: "./assets/screenshot_hint_1080_1080.png",
      },
      {
        from: "./src/images/screenshot_new_720_1280.png",
        to: "./assets/screenshot_new_720_1280.png",
      },
      {
        from: "./src/images/screenshot_new_1080_1080.png",
        to: "./assets/screenshot_new_1080_1080.png",
      },
      {
        from: "./src/images/screenshot_partial_720_1280.png",
        to: "./assets/screenshot_partial_720_1280.png",
      },
      {
        from: "./src/images/screenshot_partial_1080_1080.png",
        to: "./assets/screenshot_partial_1080_1080.png",
      },
      {from: "./src/privacy.html", to: "./privacy.html"},
    ],
    options: {
      concurrency: 100,
    },
  });

  const serviceWorkerPlugin = new WorkboxPlugin.GenerateSW({
    // This helps ensure that all pages will be controlled by a service worker immediately after that service worker activates
    clientsClaim: true,
    // This skips the service worker waiting phase, meaning the service worker activates as soon as it's finished installing
    skipWaiting: true,
    cacheId: `lexlet-${packageJson.version}`,
    // special case to cache word list for offline play
    maximumFileSizeToCacheInBytes: 4200000,
  });

  const plugins =
    argv.mode === "development"
      ? [htmlPlugin, copyPlugin]
      : [htmlPlugin, copyPlugin, serviceWorkerPlugin];

  return {
    entry: "./src/index.js",
    mode: "production",
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          loader: "babel-loader",
          options: {presets: ["@babel/env"]},
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
          type: "asset/resource",
        },
      ],
    },
    resolve: {extensions: ["*", ".js", ".jsx"]},
    output: {
      publicPath: "",
      filename: "bundle.[fullhash].js",
      path: path.resolve(__dirname, "dist"),
      clean: true, // removes unused files from output dir
    },
    performance: {
      maxEntrypointSize: 2700000, // special case to cache word list for offline play
      maxAssetSize: 2700000, // special case to cache word list for offline play
    },
    devServer: {
      static: "./dist",
    },
    plugins: plugins,
  };
};
