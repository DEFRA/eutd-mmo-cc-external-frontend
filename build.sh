#/bin/bash
curl -O https://nodejs.org/dist/v12.18.4/node-v12.18.4-linux-x64.tar.xz
tar -xf node-v12.18.4-linux-x64.tar.xz --directory /tmp
export PATH="/tmp/node-v12.18.4-linux-x64/bin:$PATH"
rm node-v12.18.4-linux-x64.tar.xz
npm ci
npm run test-vstack
rm -rf /tmp/node-v12.18.4-linux-x64