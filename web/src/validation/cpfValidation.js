function CpfValidation(cpf) {
  cpf = cpf.replace(/\D/g, '');
  
  if (cpf.trim() === '') return false;

  if (cpf.length !== 11) return false;

  const numerosCPF = cpf.split('').map(Number);

  let diferente = false;
  for (let i = 0; i < 9; i++) {
    if (numerosCPF[i] !== numerosCPF[i + 1]) {
      diferente = true;
      break;
    }
  }
  if (!diferente) return false;

  const calcularDigito = (indice) => {
    let soma = 0;
    for (let peso = 9; indice >= 0; peso--, indice--) {
      soma += numerosCPF[indice] * peso;
    }
    let digito = soma % 11;
    if (digito === 10) digito = 0;
    return digito;
  };

  const verificarPrimeiroDigito = () => calcularDigito(8) === numerosCPF[9];
  const verificarSegundoDigito = () => calcularDigito(9) === numerosCPF[10];

  return verificarPrimeiroDigito() && verificarSegundoDigito();
}

export default CpfValidation;

