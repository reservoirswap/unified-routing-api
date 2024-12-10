import { permit2Address, PermitDetails } from '@uniswap/permit2-sdk';
import { ChainId } from '@uniswap/sdk-core';
import { Unit } from 'aws-embedded-metrics';
import { Contract, ethers, providers } from 'ethers';
import PERMIT2_CONTRACT from '../abis/Permit2.json';
import { log } from '../util/log';
import { metrics } from '../util/metrics';

export class Permit2Fetcher {
  public readonly permit2Abi: ethers.ContractInterface;
  private readonly chainIdPermit2Map: Map<ChainId, Contract>;
  private readonly chainIdRpcMap: Map<ChainId, providers.StaticJsonRpcProvider>;

  constructor(chainIdRpcMap: Map<ChainId, providers.StaticJsonRpcProvider>) {
    this.chainIdRpcMap = chainIdRpcMap;
    this.permit2Abi = PERMIT2_CONTRACT.abi;
    const permit2 = new ethers.Contract(permit2Address(), this.permit2Abi);
    const permit2ZkSync = new ethers.Contract(permit2Address(ChainId.ZKSYNC), this.permit2Abi);
    const permit2Abstract = new ethers.Contract(permit2Address(ChainId.ABSTRACT_TESTNET), this.permit2Abi);
    const permit2Zero = new ethers.Contract(permit2Address(ChainId.ZERO), this.permit2Abi);
    const permit2Bob = new ethers.Contract(permit2Address(ChainId.BOB), this.permit2Abi);
    const permit2Cyber = new ethers.Contract(permit2Address(ChainId.CYBER), this.permit2Abi);
    const permit2Shape = new ethers.Contract(permit2Address(ChainId.SHAPE), this.permit2Abi);
    this.chainIdPermit2Map = new Map<ChainId, ethers.Contract>();
    this.chainIdRpcMap.forEach((_, chainId) => {
      if (chainId === ChainId.ZKSYNC) {
        this.chainIdPermit2Map.set(chainId, permit2ZkSync);
      } else if (chainId === ChainId.ABSTRACT_TESTNET) {
        this.chainIdPermit2Map.set(chainId, permit2Abstract);
      } else if (chainId === ChainId.ZERO) {
        this.chainIdPermit2Map.set(chainId, permit2Zero);
      } else if (chainId === ChainId.BOB) {
        this.chainIdPermit2Map.set(chainId, permit2Bob);
      } else if (chainId === ChainId.CYBER) {
        this.chainIdPermit2Map.set(chainId, permit2Cyber);
      } else if (chainId === ChainId.SHAPE) {
        this.chainIdPermit2Map.set(chainId, permit2Shape);
      } else {
        this.chainIdPermit2Map.set(chainId, permit2);
      }
    });
  }

  public permit2Address(chainId: ChainId): string {
    return permit2Address(chainId);
  }

  public async fetchAllowance(
    chainId: ChainId,
    ownerAddress: string,
    tokenAddress: string,
    spenderAddress: string
  ): Promise<PermitDetails | undefined> {
    let allowance = undefined;
    metrics.putMetric(`Permit2FetcherRequest`, 1);
    try {
      const beforePermitCheck = Date.now();
      const rpcProvider = this.chainIdRpcMap.get(chainId);
      if (!rpcProvider) throw new Error(`No rpc provider found for chain: ${chainId}`);
      const permit2 = this.chainIdPermit2Map.get(chainId);
      if (!permit2) throw new Error(`No permit2 contract found for chain: ${chainId}`);
      allowance = await permit2.connect(rpcProvider).allowance(ownerAddress, tokenAddress, spenderAddress);
      metrics.putMetric(`Permit2FetcherSuccess`, 1);
      metrics.putMetric(`Latency-Permit2Fetcher-ChainId${chainId}`, Date.now() - beforePermitCheck, Unit.Milliseconds);
    } catch (e) {
      log.error(e, 'Permit2FetcherErr');
      metrics.putMetric(`Permit2FetcherErr`, 1);
    }

    return allowance;
  }
}
