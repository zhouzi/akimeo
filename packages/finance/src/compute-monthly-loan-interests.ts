export function computeMonthlyLoanInterests(
  principalAmount: number,
  monthlyInterestRate: number,
  durationInMonths: number,
) {
  const compoundFactor = Math.pow(1 + monthlyInterestRate, durationInMonths);
  const monthlyPayment =
    monthlyInterestRate === 0
      ? principalAmount / durationInMonths
      : (principalAmount * monthlyInterestRate * compoundFactor) /
        (compoundFactor - 1);

  const monthlyInterests: number[] = [];
  let remainingBalance = principalAmount;

  for (let month = 0; month < durationInMonths; month++) {
    const monthlyInterest = remainingBalance * monthlyInterestRate;
    monthlyInterests.push(monthlyInterest);

    const principalPaid = monthlyPayment - monthlyInterest;
    remainingBalance -= principalPaid;
  }

  return monthlyInterests;
}
