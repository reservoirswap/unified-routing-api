# echo "Patching permit2" && \
# rm -r node_modules/@uniswap/permit2-sdk/dist && \
# cp -r ~/protofire/abstract/sdks/sdks/permit2-sdk/dist ./node_modules/@uniswap/permit2-sdk/dist && \
# yarn patch-package @uniswap/permit2-sdk && \

echo "Patching sdk-core" && \
rm -r node_modules/@uniswap/sdk-core/dist && \
cp -r ~/protofire/abstract/sdks/sdks/sdk-core/dist ./node_modules/@uniswap/sdk-core/dist && \
yarn patch-package @uniswap/sdk-core && \

# echo "Patching universal-router" && \
# rm -r node_modules/@uniswap/universal-router-sdk/dist && \
# cp -r ~/protofire/abstract/sdks/sdks/universal-router-sdk/dist ./node_modules/@uniswap/universal-router-sdk/dist && \
# yarn patch-package @uniswap/universal-router-sdk

echo "Patching sor" && \
rm -r node_modules/@uniswap/smart-order-router/build && \
cp -r ~/protofire/abstract/smart-order-router/build ./node_modules/@uniswap/smart-order-router/build && \
yarn patch-package @uniswap/smart-order-router && \

# echo "Patching sor/v3-sdk" && \
# rm -r node_modules/@uniswap/smart-order-router/node_modules/@uniswap/v3-sdk/dist && \
# cp -r ~/protofire/abstract/sdks/sdks/v3-sdk/dist ./node_modules/@uniswap/smart-order-router/node_modules/@uniswap/v3-sdk/dist && \
# yarn patch-package @uniswap/smart-order-router/@uniswap/v3-sdk && \

echo "Patching sor/sdk-core" && \
rm -r node_modules/@uniswap/smart-order-router/node_modules/@uniswap/sdk-core/dist && \
cp -r ~/protofire/abstract/sdks/sdks/sdk-core/dist ./node_modules/@uniswap/smart-order-router/node_modules/@uniswap/sdk-core/dist && \
yarn patch-package @uniswap/smart-order-router/@uniswap/sdk-core && \

echo "Patching sor/universal-router" && \
rm -r node_modules/@uniswap/smart-order-router/node_modules/@uniswap/universal-router-sdk/dist && \
cp -r ~/protofire/abstract/sdks/sdks/universal-router-sdk/dist ./node_modules/@uniswap/smart-order-router/node_modules/@uniswap/universal-router-sdk/dist && \
yarn patch-package @uniswap/smart-order-router/@uniswap/universal-router-sdk

