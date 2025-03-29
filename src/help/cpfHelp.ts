export const formatCpf = (cpf: string) => {
  cpf = cpf.replace(/\D/g, '');

  if (cpf.length <= 3) {
    return cpf;
  } else if (cpf.length <= 6) {
    return cpf.replace(/(\d{3})(\d{1})/, '$1.$2');
  } else if (cpf.length <= 9) {
    return cpf.replace(/(\d{3})(\d{3})(\d{1})/, '$1.$2.$3');
  } else {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
  }
};

export const validateCpf = (cpf: string): boolean => {
  cpf = cpf.replace(/\D/g, '');

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let firstVerifier = 11 - (sum % 11);
  if (firstVerifier === 10 || firstVerifier === 11) {
    firstVerifier = 0;
  }
  if (parseInt(cpf.charAt(9)) !== firstVerifier) {
    return false;
  }

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  let secondVerifier = 11 - (sum % 11);
  if (secondVerifier === 10 || secondVerifier === 11) {
    secondVerifier = 0;
  }
  if (parseInt(cpf.charAt(10)) !== secondVerifier) {
    return false;
  }

  return true;
};
