<template>
  <v-app>
    <!-- Menu Lateral com nova paleta -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      location="left"
      class="drawer-custom"
      @click="rail = false"
    >
      <v-list-item
        prepend-avatar="@/assets/icons/logo.png"
        :title="rail ? '' : 'Pão de Queijo Master'"
        :subtitle="rail ? '' : userStore.currentUser?.name"
        class="py-2"
      >
        <template v-slot:append>
          <v-btn
            variant="text"
            icon="mdi-chevron-left"
            @click.stop="rail = !rail"
            color="#1A1A1A"
          />
        </template>
      </v-list-item>

      <v-divider />

      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          value="dashboard"
          to="/"
          color="#E8A23B"
        />
        <v-list-item
          prepend-icon="mdi-food"
          title="Pedidos Ativos"
          value="pedidos"
          to="/pedidos"
          color="#E8A23B"
        />
        <v-list-item
          prepend-icon="mdi-plus-circle"
          title="Novo Pedido"
          value="novo-pedido"
          to="/novo-pedido"
          color="#E8A23B"
        />
        <v-list-item
          prepend-icon="mdi-history"
          title="Histórico"
          value="historico"
          to="/historico"
          color="#E8A23B"
        />
        <v-list-item
          v-if="userStore.isAdmin"
          prepend-icon="mdi-cog"
          title="Configurações"
          value="config"
          to="/configuracoes"
          color="#E8A23B"
        />
      </v-list>
    </v-navigation-drawer>

    <!-- Barra Superior com nova paleta -->
    <v-app-bar elevation="1" class="app-bar-custom" color="white">
      <v-app-bar-title class="text-color-primary">Dashboard</v-app-bar-title>
      <template v-slot:append>
        <v-btn icon="mdi-bell" class="mr-2" color="#4A4A4A">
          <v-badge
            color="#E53935"
            :content="notificationsCount"
            :model-value="notificationsCount > 0"
          />
        </v-btn>
        <v-btn
          icon="mdi-logout"
          @click="handleLogout"
          color="#4A4A4A"
        />
      </template>
    </v-app-bar>

    <!-- Conteúdo Principal com nova paleta -->
    <v-main class="main-background">
      <v-container fluid>
        <v-row>
          <!-- Cards de Resumo -->
          <v-col cols="12" sm="6" lg="3">
            <v-card class="dashboard-card">
              <v-card-item>
                <v-card-title class="text-color-primary">Pedidos Aguardando</v-card-title>
                <div class="text-h4 mt-2 text-color-primary">{{ orderStats.waiting }}</div>
              </v-card-item>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" lg="3">
            <v-card class="dashboard-card">
              <v-card-item>
                <v-card-title class="text-color-primary">Em Preparo</v-card-title>
                <div class="text-h4 mt-2 text-color-primary">{{ orderStats.inProgress }}</div>
              </v-card-item>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" lg="3">
            <v-card class="dashboard-card">
              <v-card-item>
                <v-card-title class="text-color-primary">Prontos para Entrega</v-card-title>
                <div class="text-h4 mt-2 text-color-primary">{{ orderStats.ready }}</div>
              </v-card-item>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" lg="3">
            <v-card class="dashboard-card">
              <v-card-item>
                <v-card-title class="text-color-primary">Total Hoje</v-card-title>
                <div class="text-h4 mt-2 text-success">
                  R$ {{ orderStats.totalToday.toFixed(2) }}
                </div>
              </v-card-item>
            </v-card>
          </v-col>

          <!-- Lista de Pedidos Ativos -->
          <v-col cols="12" :class="rowClass">
            <v-card class="orders-card">
              <v-card-title class="d-flex align-center px-4 py-3 text-color-primary">
                Pedidos Ativos
                <v-spacer></v-spacer>
                <v-btn
                  color="#4CAF50"
                  prepend-icon="mdi-plus"
                  to="/novo-pedido"
                  class="white--text"
                >
                  Novo Pedido
                </v-btn>
              </v-card-title>

              <v-table>
                <thead>
                  <tr>
                    <th class="text-color-primary">Nº Pedido</th>
                    <th class="text-color-primary">Mesa</th>
                    <th class="text-color-primary">Status</th>
                    <th class="text-color-primary">Tempo</th>
                    <th class="text-color-primary">Total</th>
                    <th class="text-color-primary">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="order in activeOrders" :key="order.id">
                    <td class="text-color-secondary">#{{ order.id }}</td>
                    <td class="text-color-secondary">{{ order.table }}</td>
                    <td>
                      <v-chip
                        :color="getStatusColor(order.status)"
                        size="small"
                        class="status-chip"
                      >
                        {{ order.status }}
                      </v-chip>
                    </td>
                    <td class="text-color-secondary">{{ order.time }}</td>
                    <td class="text-color-secondary">R$ {{ order.total.toFixed(2) }}</td>
                    <td>
                      <v-btn
                        icon="mdi-eye"
                        variant="text"
                        size="small"
                        @click="viewOrder(order.id)"
                        color="#E8A23B"
                      />
                      <v-btn
                        icon="mdi-pencil"
                        variant="text"
                        size="small"
                        @click="editOrder(order.id)"
                        color="#E8A23B"
                      />
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useOrderStore } from "@/stores/orders";

const router = useRouter();
const userStore = useUserStore();
const orderStore = useOrderStore();

const drawer = ref(true);
const rail = ref(false);
const notificationsCount = ref(3);
const orderStats = ref({
  waiting: 5,
  inProgress: 3,
  ready: 2,
  totalToday: 1250.75,
});

const activeOrders = ref([
  {
    id: 1,
    table: "Mesa 1",
    status: "Aguardando",
    time: "5min",
    total: 45.9,
  },
  {
    id: 2,
    table: "Mesa 3",
    status: "Em Preparo",
    time: "15min",
    total: 87.5,
  },
  {
    id: 3,
    table: "Mesa 5",
    status: "Pronto",
    time: "25min",
    total: 124.3,
  },
]);

const getStatusColor = (status) => {
  const colors = {
    Aguardando: "#FFA726",
    "Em Preparo": "#1E88E5",
    Pronto: "#43A047",
  };
  return colors[status] || "grey";
};

const viewOrder = (orderId) => {
  router.push(`/pedidos/${orderId}`);
};

const editOrder = (orderId) => {
  router.push(`/pedidos/${orderId}/editar`);
};

const handleLogout = async () => {
  await userStore.logout();
  router.push("/");
};

const rowClass = computed(() => {
  return !rail.value && window.innerWidth < 400
    ? 'd-none'
    : '';
});

onMounted(async () => {
  try {
    await orderStore.fetchActiveOrders();
    await orderStore.fetchOrderStats();
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }
});
</script>

<style lang="scss" scoped>
.drawer-custom {
  color: #1A1A1A;
  background-color: #FFFFFF;
  border-right: 1px solid rgba(0, 0, 0, 0.05);
}

.app-bar-custom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.main-background {
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

.dashboard-card {
  border-radius: 12px;
  background-color: #FFFFFF;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.dashboard-card:hover {
  transform: translateY(-2px);
}

.orders-card {
  border-radius: 12px;
  background-color: #FFFFFF;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.text-color-primary {
  color: #1A1A1A;
}

.text-color-secondary {
  color: #4A4A4A;
}

.text-success {
  color: #43A047;
}

.status-chip {
  font-weight: 500;
}

/* Estilos para a tabela */
.v-table {
  border-radius: 8px;
  overflow: hidden;
}

.v-table th {
  background-color: #FAFAFA;
  font-weight: 600;
}

.v-table td {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.v-btn {
  transition: transform 0.2s ease;
}

.v-btn:hover {
  transform: scale(1.05);
}
</style>
