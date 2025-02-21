<template>
  <v-container fluid class="login-container">
    <div class="background-pattern">
      <v-row justify="center" align="center" class="fill-height">
        <v-card class="login-card" elevation="8">
          <div class="brand-header">
            <v-img
              src="@/assets/icons/logo.png"
              alt="Pão de Queijo Master Logo"
              class="logo-image"
              width="140"
            />
            <h1 v-if="isLargeScreen" class="text-h4 brand-title">Pão de Queijo Master</h1>
          </div>

          <v-form
            v-model="isFormValid"
            class="login-form"
            @submit.prevent="handleLogin"
          >
            <v-card-text class="text-black pb-0 px-4">
              <v-text-field
                v-model="username"
                label="Nome de usuário"
                type="text"
                required
                :rules="usernameRules"
                variant="outlined"
                prepend-inner-icon="mdi-account"
                class="input-field"
                :density="isLargeScreen ? 'default' : 'compact'"
              />

              <v-text-field
                v-model="password"
                label="Senha"
                :type="showPassword ? 'text' : 'password'"
                required
                :rules="passwordRules"
                variant="outlined"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                class="input-field"
                :density="isLargeScreen ? 'default' : 'compact'"
                @click:append-inner="showPassword = !showPassword"
              />

              <v-checkbox
                v-model="rememberMe"
                label="Lembrar-me"
                color="green"
                hide-details
                class="mb-4"
                density="compact"
              />
            </v-card-text>

            <v-card-actions class="action-buttons px-4 pt-0">
              <v-btn
                block
                color="primary"
                size="large"
                type="submit"
                :disabled="!isFormValid"
                :loading="loading"
                class="login-button"
              >
                Entrar
              </v-btn>

              <v-btn
                variant="text"
                color="primary"
                class="forgot-password"
                @click="forgotPassword"
              >
                Esqueceu a senha?
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";

const router = useRouter();
const username = ref("");
const password = ref("");
const showPassword = ref(false);
const rememberMe = ref(false);
const loading = ref(false);
const isFormValid = ref(false);
const isLargeScreen = ref(false);

const usernameRules = [
  (v) => !!v || "Nome de usuário é obrigatório",
  (v) => /^[a-z]+\.[a-z]+$/i.test(v) || "Nome de usuário deve estar no formato nome.sobrenome",
];

const passwordRules = [
  (v) => !!v || "Senha é obrigatória",
  (v) => v.length >= 6 || "Senha deve ter no mínimo 6 caracteres",
];

const handleLogin = async () => {
  loading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Login:", {
      username: username.value,
      password: password.value,
      rememberMe: rememberMe.value,
    });
    router.push('/home');
  } catch (error) {
    console.error("Login error:", error);
  } finally {
    loading.value = false;
  }
};

const forgotPassword = () => {
  console.log("Forgot password clicked");
};

onMounted(() => {
  isLargeScreen.value = window.innerWidth > 1500;
  window.addEventListener('resize', () => {
    isLargeScreen.value = window.innerWidth > 1500;
  });
});
</script>

<style lang="scss" scoped>
.background-pattern {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fdd888; /* Cor base de pão de queijo */
  background-image:
    radial-gradient(circle at 4% 9%, #ffeb99 7px, transparent 3px),
    radial-gradient(circle at 15% 17%, #f8c471 5px, transparent 3px),
    radial-gradient(circle at 27% 35%, #e8a23b 6px, transparent 4px),
    radial-gradient(circle at 45% 22%, #f5b041 4px, transparent 3px),
    radial-gradient(circle at 60% 48%, #ffd27f 8px, transparent 4px),
    radial-gradient(circle at 75% 66%, #f4a83d 4px, transparent 3px),
    radial-gradient(circle at 85% 79%, #ffcf70 7px, transparent 4px),
    radial-gradient(circle at 92% 88%, #ffdb8a 5px, transparent 3px),
    radial-gradient(circle at 10% 77%, #ffc85c 6px, transparent 4px),
    radial-gradient(circle at 20% 90%, #ffb347 4px, transparent 3px),
    radial-gradient(circle at 35% 8%, #ffeb99 6px, transparent 4px),
    radial-gradient(circle at 50% 12%, #f8c471 5px, transparent 3px),
    radial-gradient(circle at 64% 30%, #e8a23b 7px, transparent 4px),
    radial-gradient(circle at 79% 41%, #f5b041 4px, transparent 3px),
    radial-gradient(circle at 90% 53%, #ffd27f 6px, transparent 4px),
    radial-gradient(circle at 5% 44%, #f4a83d 5px, transparent 3px),
    radial-gradient(circle at 15% 60%, #ffcf70 7px, transparent 4px),
    radial-gradient(circle at 25% 75%, #ffdb8a 4px, transparent 3px),
    radial-gradient(circle at 40% 85%, #ffc85c 6px, transparent 4px),
    radial-gradient(circle at 55% 95%, #ffb347 4px, transparent 3px),
    radial-gradient(circle at 65% 10%, #ffeb99 5px, transparent 4px),
    radial-gradient(circle at 72% 25%, #f8c471 7px, transparent 3px),
    radial-gradient(circle at 80% 40%, #e8a23b 6px, transparent 4px),
    radial-gradient(circle at 88% 55%, #f5b041 5px, transparent 3px),
    radial-gradient(circle at 95% 68%, #ffd27f 7px, transparent 4px),
    radial-gradient(circle at 3% 57%, #f4a83d 5px, transparent 3px),
    radial-gradient(circle at 13% 70%, #ffcf70 6px, transparent 4px),
    radial-gradient(circle at 28% 80%, #ffdb8a 5px, transparent 3px),
    radial-gradient(circle at 38% 92%, #ffc85c 7px, transparent 4px),
    radial-gradient(circle at 50% 97%, #ffb347 5px, transparent 3px),
    radial-gradient(circle at 65% 15%, #ffeb99 6px, transparent 4px),
    radial-gradient(circle at 75% 35%, #f8c471 5px, transparent 3px),
    radial-gradient(circle at 85% 50%, #e8a23b 7px, transparent 4px),
    radial-gradient(circle at 92% 65%, #f5b041 5px, transparent 3px),
    radial-gradient(circle at 98% 80%, #ffd27f 6px, transparent 4px);
  background-size: 100%;
  background-blend-mode: multiply;
  opacity: 0.98;
  z-index: 0;
}

div {
  color: #000000;
}


.login-container {
  position: relative;
  min-height: 100vh;
  padding: 16px;
  z-index: 1;
}

.login-card {
  width: 300px !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.98);
  border-radius: 24px;
  padding: 1rem 0;
  overflow: hidden;

  @media (width > 800px) {
    width: 500px !important;
    height: auto;
  }

  @media (width > 1500px) {
    display: flex;
    justify-content: space-evenly;
    align-items: stretch;
    flex-direction: column;
    width: 800px !important;
    height: 600px;
  }
}

.brand-header {
  text-align: center;
  margin-bottom: 1rem;

  .logo-image {
    margin: 0 auto;
    border-radius: 50%;
    background-image: linear-gradient(45deg, #ffff00, #ffff00);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    @media (width > 1500px) {
    width: 200px !important;
    height: 140px;
  }
  }
}

.brand-title {
    color: #032f00;
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0.5rem 0;
  }

.login-form {
  .input-field {
    margin-bottom: 0.75rem;

    :deep(.v-field) {
      border-radius: 12px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-1px);
      }
    }
  }
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .login-button {
    font-weight: 600;
    letter-spacing: 0.5px;
    border-radius: 12px;
    height: 40px;
    background-color: #4caf50;
    color: #00420f !important;

    &:hover {
      transform: scale(1.01);
    }

    &:disabled {
      opacity: 0.7;
      transform: none;
    }
  }

  .forgot-password {
    font-weight: 500;
    text-decoration: none;
    opacity: 0.8;
    transition: all 0.3s ease;
    color: #000000 !important;

    &:hover {
      opacity: 1;
      text-decoration: underline;
    }
  }
}
</style>
