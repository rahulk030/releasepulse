export interface DemoDeployment {
  id: string;
  service: string;
  version: string;
  environment: string;
  status: string;
  commitSha: string;
  requestedBy: string;
  createdAt: string;
}

const seed: DemoDeployment[] = [
  { id: 'dep-201', service: 'catalog-api', version: '2.8.1', environment: 'production', status: 'succeeded', commitSha: '9ac11ef', requestedBy: 'Rahul', createdAt: '2026-08-20T18:42:00Z' },
  { id: 'dep-202', service: 'checkout-web', version: '4.3.0', environment: 'staging', status: 'succeeded', commitSha: '17bd221', requestedBy: 'Maya', createdAt: '2026-08-20T19:15:00Z' },
  { id: 'dep-203', service: 'payments-api', version: '3.1.7', environment: 'production', status: 'awaiting_approval', commitSha: 'a10ff84', requestedBy: 'Rahul', createdAt: '2026-08-20T20:04:00Z' },
  { id: 'dep-204', service: 'identity-service', version: '1.9.2', environment: 'production', status: 'failed', commitSha: '0ce489a', requestedBy: 'Jordan', createdAt: '2026-08-20T20:32:00Z' },
  { id: 'dep-205', service: 'support-portal', version: '5.0.4', environment: 'development', status: 'running', commitSha: 'd031c0e', requestedBy: 'Leah', createdAt: '2026-08-20T21:01:00Z' },
  { id: 'dep-206', service: 'reporting-worker', version: '2.4.5', environment: 'staging', status: 'succeeded', commitSha: '6f2ae99', requestedBy: 'Rahul', createdAt: '2026-08-20T21:30:00Z' }
];

export function createReleaseDemo() {
  let items = seed.map((item) => ({ ...item }));

  return {
    list: async () => items.map((item) => ({ ...item })),
    approve: async (id: string) => {
      const index = items.findIndex((item) => item.id === id);
      if (index < 0) throw new Error('Deployment not found');
      items[index] = { ...items[index], status: 'succeeded' };
      return { ...items[index] };
    },
    connect: (onConnection: (connected: boolean) => void) => {
      onConnection(true);
      return () => onConnection(false);
    }
  };
}
