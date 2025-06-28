# tintd-bundler

This is a script to bundle/package [tintd](https://marketplace.visualstudio.com/items?itemName=gfx-tintd.tintd) and [publish it](https://marketplace.visualstudio.com/items?itemName=gfx-tintd.tintd)

[tintd](https://marketplace.visualstudio.com/items?itemName=gfx-tintd.tintd) is a [language protocol server](https://microsoft.github.io/language-server-protocol/)
for [WGSL](https://gpuweb.github.io/gpuweb/wgsl/), the WebGPU Shading Language.

# Installation

You can install it from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=gfx-tintd.tintd)

# Updating

This updates to the latest dawn and depot_tools

```sh
npm ci
npm run update
```

# Publishing

To publish

1. Bump the package version and tag.

   The easiest way is `npm version patch`

2. Push the patch 

   ```sh
   git push --tag origin main
   ```

3. Wait for github actions to successfully build all the versions

4. Run `npm run publish`

   This will download the files from the latest release to the `dist` folder
   and then publish them.

   Step 4 assumes you've gone through steps [here](https://code.visualstudio.com/api/working-with-extensions/publishing-extension), setup an Azure account, created an organization, created a personal access token, and logged in from the command line. You can log in with

   ```sh
   npm run login <your-publisher-id>
   ```

   Then run `npm run publish`

# Building on all supported platforms

Push a new version. Check the github actions. You should see build artifacts
added to the bottom of the latest action run. You can manually install an
extension by downloading the `.vsix` file for your platform and then
running

```sh
code --install-extensions path-to-file.vsix
```

# Building

This builds for the local OS (win64,macOS-arm,linux)

```sh
npm ci
npm run build
```

## Prerequisites

### Windows

Before running the build script above you must have
Visual Studio C++ installed and have run the `vcvars64.bat` file.
I've tested with Visual Studio Community Edition 2022

Further you must have [cmake installed](https://cmake.org/download/)
and either in your path or at its standard place of `C:\Program Files\CMake`

And you must have `node.js` installed, at least version 18. 
I recommend using [nvm-windows](https://github.com/coreybutler/nvm-windows) to install it
as it makes it easy to switch version

### MacOS

Before running the build script above you must have
XCode installed and its command line tools

Further you must have [cmake installed](https://cmake.org/download/)
and either in your path or at its standard place of `/Applications/CMake.app`

And you must have `node.js` installed, at least version 18. 
I recommend using [nvm](https://github.com/nvm-sh/nvm) to install it
as it makes it easy to switch versions.

### Linux (Ubuntu)

Before running the build script above you need to install
the following dependencies

```sh
sudo apt-get install cmake libxi-dev libxrandr-dev libxinerama-dev libxcursor-dev mesa-common-dev libx11-xcb-dev pkg-config
```

And you must have `node.js` installed, at least version 18. 
I recommend using [nvm](https://github.com/nvm-sh/nvm) to install it
as it makes it easy to switch versions.
