import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { createReleaseDemo } from '../demo/releaseDemo';

export interface Deployment {
  id: string;
  service: string;
  version: string;
  environment: string;
  status: string;
  commitSha: string;
  requestedBy: string;
  createdAt: string;
}

const demoMode = import.meta.env.VITE_DEMO_MODE === 'true';
const demo = createReleaseDemo();

export const useDeploymentsStore = defineStore('deployments', () => {
  const items = ref<Deployment[]>([]);
  const connected = ref(false);
  const error = ref<string | null>(null);

  const successRate = computed(() => {
    const done = items.value.filter((item) => ['succeeded', 'failed'].includes(item.status));
    return done.length ? Math.round((done.filter((item) => item.status === 'succeeded').length / done.length) * 100) : 100;
  });

  async function load() {
    try {
      if (demoMode) {
        items.value = await demo.list();
      } else {
        const response = await fetch('/api/deployments');
        if (!response.ok) throw new Error('Unable to load deployments');
        items.value = await response.json();
      }
      error.value = null;
    } catch (caught) {
      error.value = caught instanceof Error ? caught.message : 'Request failed';
    }
  }

  function connect() {
    if (demoMode) return demo.connect((value) => { connected.value = value; });

    const source = new EventSource('/api/events');
    source.onopen = () => { connected.value = true; };
    source.onmessage = () => { void load(); };
    source.onerror = () => { connected.value = false; };
    return () => source.close();
  }

  async function approve(id: string) {
    if (demoMode) {
      await demo.approve(id);
      await load();
      return;
    }

    const response = await fetch(`/api/deployments/${id}/approve`, { method: 'POST' });
    if (!response.ok) throw new Error('Approval failed');
    await load();
  }

  return { items, connected, error, successRate, load, connect, approve };
});
