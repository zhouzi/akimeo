import { describe, expect, it } from "vitest";

import { computeAnnualLoanInterests } from "~/compute-annual-loan-interests";

describe("computeAnnualLoanInterests", () => {
  it.each([
    {
      principalAmount: 100000,
      annualInterestRate: 0.34,
      durationInYears: 5,
      expected: [
        32658.069460670973, 29007.42061828565, 23902.64069270861,
        16764.518344148913, 6783.130036356637,
      ],
    },
    {
      principalAmount: 200000,
      annualInterestRate: 0.04,
      durationInYears: 25,
      expected: [
        7913.46038092176, 7719.749671867832, 7518.146889646962,
        7308.330499021492, 7089.96586491208, 6862.70471868993,
        6626.184602724973, 6380.028292304032, 6123.843193997103,
        5857.220719512092, 5579.735634039469, 5290.9453780474605,
        4990.389361446136, 4677.58822899465, 4352.043095780033,
        4013.2347515482224, 3660.6228326183104, 3293.6449600592864,
        2911.715842754786, 2514.226343925305, 2100.542509619098,
        1670.0045576222808, 1221.9258251755878, 755.591673819472,
        270.2583496209178,
      ],
    },
    {
      principalAmount: 10000,
      annualInterestRate: 0.05,
      durationInYears: 1,
      expected: [272.8978146160528],
    },
    {
      principalAmount: 50000,
      annualInterestRate: 0,
      durationInYears: 3,
      expected: [0, 0, 0],
    },
    {
      principalAmount: 150000,
      annualInterestRate: 0.035,
      durationInYears: 15,
      expected: [
        5126.6004924363515, 4851.266564146353, 4566.139846984434,
        4270.872041289578, 3965.1024594431146, 3648.4575852668086,
        3320.5506177500897, 2980.9809985490488, 2629.3339226800035,
        2265.179831809935, 1888.0738895248087, 1497.5554379347807,
        1093.1474349525174, 674.3558715572102, 240.66916833245278,
      ],
    },
  ])(
    "should compute annual loan interests for principal $principalAmount at $annualInterestRate% over $durationInYears years",
    ({ principalAmount, annualInterestRate, durationInYears, expected }) => {
      expect(
        computeAnnualLoanInterests(
          principalAmount,
          annualInterestRate,
          durationInYears,
        ),
      ).toEqual(expected);
    },
  );
});
