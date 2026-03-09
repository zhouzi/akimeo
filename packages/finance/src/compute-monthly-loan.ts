export function computeMonthlyLoan(
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

  const result: { interest: number; principalRepayment: number }[] = [];
  let remainingBalance = principalAmount;

  for (let month = 0; month < durationInMonths; month++) {
    const interest = remainingBalance * monthlyInterestRate;
    const principalRepayment = monthlyPayment - interest;

    result.push({ interest, principalRepayment });

    remainingBalance -= principalRepayment;
  }

  return result;
}
