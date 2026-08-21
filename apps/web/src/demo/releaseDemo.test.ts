import { describe, expect, it } from 'vitest';
import { createReleaseDemo } from './releaseDemo';

describe('ReleasePulse portfolio demo', () => {
  it('loads realistic deployment history and supports production approval', async () => {
    const demo = createReleaseDemo();
    const deployments = await demo.list();
    const pending = deployments.find((item) => item.status === 'awaiting_approval');

    expect(deployments.length).toBeGreaterThanOrEqual(5);
    expect(pending?.environment).toBe('production');

    const approved = await demo.approve(pending!.id);
    expect(approved.status).toBe('succeeded');
  });

  it('exposes a live connection facade without requiring a backend', () => {
    const demo = createReleaseDemo();
    let connected = false;
    const disconnect = demo.connect((value) => { connected = value; });

    expect(connected).toBe(true);
    disconnect();
  });
});
