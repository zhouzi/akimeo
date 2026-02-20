import { computeMonthlyLoanInterests } from "./compute-monthly-loan-interests";

export function computeAnnualLoanInterests(
  principalAmount: number,
  annualInterestRate: number,
  durationInYears: number,
) {
  const monthlyInterests = computeMonthlyLoanInterests(
    principalAmount,
    annualInterestRate / 12,
    durationInYears * 12,
  );

  const annualInterests: number[] = [];
  for (let year = 0; year < durationInYears; year++) {
    const yearMonths = monthlyInterests.slice(year * 12, (year + 1) * 12);
    const sum = yearMonths.reduce((total, interest) => total + interest, 0);
    annualInterests.push(sum);
  }

  return annualInterests;
}
