import { computeMonthlyLoan } from "./compute-monthly-loan";

export function computeAnnualLoan(
  principalAmount: number,
  annualInterestRate: number,
  durationInYears: number,
) {
  const monthly = computeMonthlyLoan(
    principalAmount,
    annualInterestRate / 12,
    durationInYears * 12,
  );

  const result: { interest: number; principalRepayment: number }[] = [];

  for (let year = 0; year < durationInYears; year++) {
    const yearMonths = monthly.slice(year * 12, (year + 1) * 12);

    result.push(
      yearMonths.reduce(
        (acc, m) => ({
          interest: acc.interest + m.interest,
          principalRepayment: acc.principalRepayment + m.principalRepayment,
        }),
        { interest: 0, principalRepayment: 0 },
      ),
    );
  }

  return result;
}
