import { BigNumber, ethers } from 'ethers';

import { DutchLimitQuote, DutchLimitQuoteDataJSON, DutchLimitQuoteJSON } from '../../../../lib/entities';
import { RfqQuoter } from '../../../../lib/providers/quoters';
import axios from '../../../../lib/providers/quoters/helpers';
import { AMOUNT_IN, OFFERER, TOKEN_IN, TOKEN_OUT } from '../../../constants';
import { QUOTE_REQUEST_DL, QUOTE_REQUEST_DL_EXACT_OUT } from '../../../utils/fixtures';

const UUID = 'c67c2882-24aa-4a68-a90b-53250ef81517';

describe('RfqQuoter test', () => {
  const getSpy = (nonce?: string) => {
    return jest.spyOn(axios, 'get').mockResolvedValue({ data: { nonce: nonce } });
  };
  const postSpy = (responseData: DutchLimitQuoteJSON) =>
    jest.spyOn(axios, 'post').mockResolvedValue({ data: responseData });
  const quoter = new RfqQuoter('https://api.uniswap.org/', 'https://api.uniswap.org/', 'test-api-key');

  describe('quote test', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      postSpy({
        chainId: 1,
        requestId: UUID,
        quoteId: UUID,
        tokenIn: TOKEN_IN,
        amountIn: AMOUNT_IN,
        tokenOut: TOKEN_OUT,
        amountOut: AMOUNT_IN,
        offerer: OFFERER,
        filler: OFFERER,
      });
    });

    it('returns null if quote response is invalid', async () => {
      jest.spyOn(axios, 'post').mockResolvedValueOnce({
        data: {
          chainId: 1,
          requestId: UUID,
          quoteId: UUID,
          tokenIn: TOKEN_IN,
          amountIn: AMOUNT_IN,
          tokenOut: TOKEN_OUT,
          amountOut: AMOUNT_IN,
          offerer: OFFERER,
        },
      });
      const quote = await quoter.quote(QUOTE_REQUEST_DL);
      expect(quote).toBeNull();
    });

    it('returns EXACT_INPUT quote', async () => {
      const quote = await quoter.quote(QUOTE_REQUEST_DL);
      expect(quote).toMatchObject({
        chainId: 1,
        tokenIn: TOKEN_IN,
        tokenOut: TOKEN_OUT,
        amountInStart: BigNumber.from(AMOUNT_IN),
        amountOutStart: BigNumber.from(AMOUNT_IN),
      });
    });

    it('returns EXACT_OUTPUT quote', async () => {
      const quote = await quoter.quote(QUOTE_REQUEST_DL_EXACT_OUT);
      expect(quote).toMatchObject({
        chainId: 1,
        tokenIn: TOKEN_IN,
        tokenOut: TOKEN_OUT,
        amountInStart: BigNumber.from(AMOUNT_IN),
        amountOutStart: BigNumber.from(AMOUNT_IN),
      });
    });

    it('returns null if rfq POST times out', async () => {
      jest.spyOn(axios, 'post').mockRejectedValue(new Error('RfqQuoterErr'));
      const quote = (await quoter.quote(QUOTE_REQUEST_DL)) as DutchLimitQuote;
      expect(quote).toBeNull();
    });

    it('gracefully handles GET nonce error', async () => {
      jest.spyOn(axios, 'get').mockRejectedValue(new Error('GET nonce error'));
      const quote = (await quoter.quote(QUOTE_REQUEST_DL)) as DutchLimitQuote;
      const nonce = BigNumber.from(quote?.toOrder().toJSON().nonce);
      expect(nonce.gt(0) && nonce.lt(ethers.constants.MaxUint256)).toBeTruthy();
    });

    it('uses nonce returned by UniX service and increment by 1', async () => {
      getSpy('123');
      const quote = await quoter.quote(QUOTE_REQUEST_DL);
      expect((quote?.toJSON() as DutchLimitQuoteDataJSON).orderInfo).toMatchObject({
        nonce: '124',
      });
    });

    it('get nonce by address and chainId', async () => {
      const spy = getSpy('123');
      await quoter.quote(QUOTE_REQUEST_DL);
      expect(spy).toBeCalledWith(
        'https://api.uniswap.org/dutch-auction/nonce?address=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&chainId=1'
      );
    });
  });
});
