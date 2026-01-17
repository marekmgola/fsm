export const isBinaryInput = (input: string): boolean => /^[01]+$/.test(input);

export const toDecimal = (binary: string): string => {
  if (!binary || !isBinaryInput(binary)) return '';
  try {
    return BigInt('0b' + binary).toString();
  } catch {
    return '';
  }
};
