import { ethers } from 'ethers';
import { CF_PATH } from '@connext/types';
import { HDNode, fromExtendedKey, fromMnemonic } from 'ethers/utils/hdnode';

export class ChannelWallet {
  public mnemonic: string;
  public hdNode: HDNode;
  public xpub: string;

  constructor() {
    this.mnemonic = ethers.Wallet.createRandom().mnemonic;
    this.hdNode = fromExtendedKey(
      fromMnemonic(this.mnemonic).extendedKey,
    ).derivePath(CF_PATH);
    this.xpub = this.hdNode.neuter().extendedKey;
  }

  public keyGen(index: string) {
    const res = this.hdNode.derivePath(index);
    return Promise.resolve(res.privateKey);
  }
}
