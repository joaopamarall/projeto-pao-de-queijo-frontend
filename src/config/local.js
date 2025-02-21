import { setStorage, getStorage } from "@/utils/functions";

// DOC: Configure localmente o JWT Token e User Data para rodar o ambiente local.
// Essas credenciais podem ser obtidas no Storage do ambiente de homologação.
const JWT_TOKEN = "";
const USER_DATA = "";
export const setCredentialsLocal = () => {
  if (!JWT_TOKEN || !USER_DATA) {
    alert(
      "Credenciais de acesso inválidas. Por favor, atualize o arquivo `local.js` com o JWT_TOKEN e USER_DATA que podem ser encontrados no ambiente de HML."
    );
    return;
  }

  // Armazena o JWT e User Data no storage local
  setStorage("plataforma", JWT_TOKEN);
  setStorage("userData", USER_DATA);
};

export const isExistValidCredentials = () => {
  // Verifica se as credenciais existem no storage local
  const storedUserData = getStorage("userData");
  const storedToken = getStorage("plataforma");

  return storedUserData && storedToken;
};

export const isEnvironmentLocal = () => {
  return window.location.href.includes("localhost");
};
