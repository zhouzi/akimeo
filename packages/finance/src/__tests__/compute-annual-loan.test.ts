import { describe, expect, it } from "vitest";

import { computeAnnualLoan } from "~/compute-annual-loan";

describe("computeAnnualLoan", () => {
  it.each([
    {
      principalAmount: 100000,
      annualInterestRate: 0.34,
      durationInYears: 5,
      expected: [
        { interest: 32658.069460670973, principalRepayment: 9165.086369763201 },
        { interest: 29007.42061828565, principalRepayment: 12815.735212148526 },
        { interest: 23902.64069270861, principalRepayment: 17920.51513772556 },
        {
          interest: 16764.518344148913,
          principalRepayment: 25058.637486285257,
        },
        { interest: 6783.130036356637, principalRepayment: 35040.02579407754 },
      ],
    },
    {
      principalAmount: 200000,
      annualInterestRate: 0.04,
      durationInYears: 25,
      expected: [
        { interest: 7913.46038092176, principalRepayment: 4754.623786224724 },
        { interest: 7719.749671867832, principalRepayment: 4948.334495278652 },
        { interest: 7518.146889646962, principalRepayment: 5149.937277499523 },
        { interest: 7308.330499021492, principalRepayment: 5359.753668124994 },
        { interest: 7089.96586491208, principalRepayment: 5578.118302234407 },
        { interest: 6862.70471868993, principalRepayment: 5805.379448456555 },
        { interest: 6626.184602724973, principalRepayment: 6041.899564421514 },
        { interest: 6380.028292304032, principalRepayment: 6288.05587484245 },
        { interest: 6123.843193997103, principalRepayment: 6544.240973149381 },
        { interest: 5857.220719512092, principalRepayment: 6810.863447634392 },
        { interest: 5579.735634039469, principalRepayment: 7088.348533107017 },
        { interest: 5290.9453780474605, principalRepayment: 7377.138789099024 },
        { interest: 4990.389361446136, principalRepayment: 7677.694805700349 },
        { interest: 4677.58822899465, principalRepayment: 7990.495938151834 },
        { interest: 4352.043095780033, principalRepayment: 8316.041071366451 },
        { interest: 4013.2347515482224, principalRepayment: 8654.84941559826 },
        { interest: 3660.6228326183104, principalRepayment: 9007.461334528174 },
        { interest: 3293.6449600592864, principalRepayment: 9374.439207087198 },
        { interest: 2911.715842754786, principalRepayment: 9756.368324391698 },
        { interest: 2514.226343925305, principalRepayment: 10153.85782322118 },
        { interest: 2100.542509619098, principalRepayment: 10567.541657527387 },
        {
          interest: 1670.0045576222808,
          principalRepayment: 10998.079609524202,
        },
        {
          interest: 1221.9258251755878,
          principalRepayment: 11446.158341970897,
        },
        { interest: 755.591673819472, principalRepayment: 11912.492493327012 },
        { interest: 270.2583496209178, principalRepayment: 12397.825817525569 },
      ],
    },
    {
      principalAmount: 10000,
      annualInterestRate: 0.05,
      durationInYears: 1,
      expected: [
        { interest: 272.8978146160528, principalRepayment: 10000.000000000042 },
      ],
    },
    {
      principalAmount: 50000,
      annualInterestRate: 0,
      durationInYears: 3,
      expected: [
        { interest: 0, principalRepayment: 16666.666666666668 },
        { interest: 0, principalRepayment: 16666.666666666668 },
        { interest: 0, principalRepayment: 16666.666666666668 },
      ],
    },
    {
      principalAmount: 150000,
      annualInterestRate: 0.035,
      durationInYears: 15,
      expected: [
        { interest: 5126.6004924363515, principalRepayment: 7741.285251740762 },
        { interest: 4851.266564146353, principalRepayment: 8016.61918003076 },
        { interest: 4566.139846984434, principalRepayment: 8301.745897192679 },
        { interest: 4270.872041289578, principalRepayment: 8597.013702887534 },
        { interest: 3965.1024594431146, principalRepayment: 8902.783284733998 },
        { interest: 3648.4575852668086, principalRepayment: 9219.428158910303 },
        { interest: 3320.5506177500897, principalRepayment: 9547.335126427022 },
        { interest: 2980.9809985490488, principalRepayment: 9886.904745628064 },
        { interest: 2629.3339226800035, principalRepayment: 10238.55182149711 },
        { interest: 2265.179831809935, principalRepayment: 10602.705912367177 },
        {
          interest: 1888.0738895248087,
          principalRepayment: 10979.811854652304,
        },
        {
          interest: 1497.5554379347807,
          principalRepayment: 11370.330306242333,
        },
        {
          interest: 1093.1474349525174,
          principalRepayment: 11774.738309224595,
        },
        { interest: 674.3558715572102, principalRepayment: 12193.529872619903 },
        { interest: 240.66916833245278, principalRepayment: 12627.21657584466 },
      ],
    },
  ])(
    "should compute annual loan for principal $principalAmount at $annualInterestRate% over $durationInYears years",
    ({ principalAmount, annualInterestRate, durationInYears, expected }) => {
      expect(
        computeAnnualLoan(principalAmount, annualInterestRate, durationInYears),
      ).toEqual(expected);
    },
  );
});
