#!/bin/sh
set -e
set -v

git submodule update --init

export "PATH=$PWD/depot_tools:$PATH"

# MacOS default CMake app location
if [ -d "/Applications/CMake.app/Contents/bin" ] ; then
  export "PATH=$PATH:/Applications/CMake.app/Contents/bin"
fi

TARGET=darwin-arm64

cd third_party/dawn
cp scripts/standalone-with-node.gclient .gclient
gclient metrics --opt-out
gclient sync
./tools/setup-build cmake release
ninja -C out/active tintd
cd ../..
node build/fixup-package-json.js third_party/dawn/out/cmake-release/gen/vscode/package.json
cp third_party/dawn/LICENSE third_party/dawn/out/cmake-release/gen/vscode/LICENSE
(cd third_party/dawn/out/cmake-release/gen/vscode && npm i && "../../../../../../node_modules/.bin/vsce" package --allow-star-activation --target $TARGET)
node build/copy-visx.js third_party/dawn/out/cmake-release/gen/vscode $TARGET
