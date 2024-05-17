# tintd-bundler

This is a script to bundle/package tintd and hopefully publish it

tintd is a [language protocol server](https://microsoft.github.io/language-server-protocol/)
for [WGSL](https://gpuweb.github.io/gpuweb/wgsl/), the WebGPU Shading Language.

# Updating

This updates to the latest dawn and depot_tools

```
npm ci
npm run update
```

# Building

This builds for the local OS (win64,macOS-arm,linux)

```
npm ci
npm run build
```

## Prerequisites

### Windows

Before running the build script above you must have
Visual Studio C++ installed and have run the `vcvars64.bat` file.
I've tested with Visual Studio Community Edition 2022

Further you must have [cmake installed](https://cmake.org/download/)
and either in your path or at it's standard place of `C:\Program Files\CMake`

And you must have `node.js` installed, at least version 18. 
I recommend using [nvm-windows](https://github.com/coreybutler/nvm-windows) to install it
as it makes it easy to switch version

### MacOS

Before running the build script above you must have
XCode installed and its command line tools

Further you must have [cmake installed](https://cmake.org/download/)
and either in your path or at it's standard place of `/Applications/CMake.app`

And you must have `node.js` installed, at least version 18. 
I recommend using [nvm](https://github.com/nvm-sh/nvm) to install it
as it makes it easy to switch versions.

### Linux (Ubuntu)

Before running the build script above you need to install
the following dependencies

```
sudo apt-get install cmake libxi-dev libxrandr-dev libxinerama-dev libxcursor-dev mesa-common-dev libx11-xcb-dev pkg-config
```

And you must have `node.js` installed, at least version 18. 
I recommend using [nvm](https://github.com/nvm-sh/nvm) to install it
as it makes it easy to switch versions.
