import { jest } from '@jest/globals';
import { EventEmitter } from 'node:events';
import type { Request, Response } from 'express';
import { LiveMatchesBroadcaster } from '../../sse/liveMatchesBroadcaster';
import type { IMatchesService } from '../../service/matchesService';

type LiveMatchesResult = Awaited<ReturnType<IMatchesService['getLiveMatches']>>;

const MATCHES = [{ id: 1, name: 'PSG vs OM' }];
const DATA_MESSAGE = `data: ${JSON.stringify(MATCHES)}\n\n`;

/** SSE response stub: records writes and can emit 'error' like a real one. */
const makeClient = () => {
  const res = Object.assign(new EventEmitter(), {
    setHeader: jest.fn(),
    flushHeaders: jest.fn(),
    write: jest.fn(),
    end: jest.fn(),
    writableEnded: false,
    destroyed: false,
  });
  const req = new EventEmitter();
  return {
    req: req as unknown as Request,
    res: res as unknown as Response,
    write: res.write,
    end: res.end,
    disconnect: () => req.emit('close'),
    failWithError: () => res.emit('error', new Error('socket closed')),
    markDestroyed: () => {
      res.destroyed = true;
    },
  };
};

/** Lets the pending promises (the async broadcast) settle. */
const flush = () => jest.advanceTimersByTimeAsync(0);

describe('LiveMatchesBroadcaster', () => {
  let getLiveMatches: jest.Mock<() => Promise<LiveMatchesResult>>;
  let broadcaster: LiveMatchesBroadcaster;

  beforeEach(() => {
    jest.useFakeTimers();
    getLiveMatches = jest.fn<() => Promise<LiveMatchesResult>>();
    getLiveMatches.mockResolvedValue({
      success: true,
      matches: MATCHES,
    } as LiveMatchesResult);
    broadcaster = new LiveMatchesBroadcaster({
      getLiveMatches,
    } as unknown as IMatchesService);
  });

  afterEach(() => {
    broadcaster.closeAll();
    expect(jest.getTimerCount()).toBe(0);
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("n'appelle pas l'API et ne lance aucun minuteur sans client", async () => {
    await jest.advanceTimersByTimeAsync(60000);

    expect(getLiveMatches).not.toHaveBeenCalled();
    expect(jest.getTimerCount()).toBe(0);
  });

  it('démarre la boucle au premier client et lui envoie les données', async () => {
    const client = makeClient();

    broadcaster.addClient(client.req, client.res);
    await flush();

    expect(jest.getTimerCount()).toBe(2);
    expect(client.write).toHaveBeenCalledWith(DATA_MESSAGE);
  });

  it('envoie les données initiales au seul nouveau client', async () => {
    const firstClient = makeClient();
    const secondClient = makeClient();
    broadcaster.addClient(firstClient.req, firstClient.res);
    await flush();
    firstClient.write.mockClear();

    broadcaster.addClient(secondClient.req, secondClient.res);
    await flush();

    expect(secondClient.write).toHaveBeenCalledWith(DATA_MESSAGE);
    expect(firstClient.write).not.toHaveBeenCalled();
  });

  it('rafraîchit les données de tous les clients toutes les 15 s', async () => {
    const firstClient = makeClient();
    const secondClient = makeClient();
    broadcaster.addClient(firstClient.req, firstClient.res);
    broadcaster.addClient(secondClient.req, secondClient.res);
    await flush();
    getLiveMatches.mockClear();
    firstClient.write.mockClear();
    secondClient.write.mockClear();

    await jest.advanceTimersByTimeAsync(15000);

    expect(getLiveMatches).toHaveBeenCalledTimes(1);
    expect(firstClient.write).toHaveBeenCalledWith(DATA_MESSAGE);
    expect(secondClient.write).toHaveBeenCalledWith(DATA_MESSAGE);
  });

  it('envoie un keepalive toutes les 20 s', async () => {
    const client = makeClient();
    broadcaster.addClient(client.req, client.res);
    await flush();

    await jest.advanceTimersByTimeAsync(20000);

    expect(client.write).toHaveBeenCalledWith(': keepalive\n\n');
  });

  it('arrête la boucle quand le dernier client part', async () => {
    const firstClient = makeClient();
    const secondClient = makeClient();
    broadcaster.addClient(firstClient.req, firstClient.res);
    broadcaster.addClient(secondClient.req, secondClient.res);
    await flush();

    firstClient.disconnect();
    expect(jest.getTimerCount()).toBe(2);

    secondClient.disconnect();
    expect(jest.getTimerCount()).toBe(0);
    getLiveMatches.mockClear();
    await jest.advanceTimersByTimeAsync(60000);
    expect(getLiveMatches).not.toHaveBeenCalled();
  });

  it("retire un client dont l'écriture échoue sans interrompre les autres", async () => {
    const failingClient = makeClient();
    const healthyClient = makeClient();
    broadcaster.addClient(failingClient.req, failingClient.res);
    broadcaster.addClient(healthyClient.req, healthyClient.res);
    await flush();
    failingClient.write.mockImplementation(() => {
      throw new Error('write after end');
    });
    healthyClient.write.mockClear();

    await jest.advanceTimersByTimeAsync(15000);

    expect(healthyClient.write).toHaveBeenCalledWith(DATA_MESSAGE);
    failingClient.write.mockClear();
    await jest.advanceTimersByTimeAsync(15000);
    expect(failingClient.write).not.toHaveBeenCalled();
  });

  it("n'écrit pas vers un client dont la connexion est déjà fermée", async () => {
    const client = makeClient();
    broadcaster.addClient(client.req, client.res);
    await flush();
    client.markDestroyed();
    client.write.mockClear();

    await jest.advanceTimersByTimeAsync(15000);

    expect(client.write).not.toHaveBeenCalled();
    expect(jest.getTimerCount()).toBe(0);
  });

  it("retire le client sur un événement 'error' au lieu de planter", async () => {
    const client = makeClient();
    broadcaster.addClient(client.req, client.res);
    await flush();

    client.failWithError();

    expect(jest.getTimerCount()).toBe(0);
  });

  it('journalise un échec de récupération sans rien envoyer', async () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    getLiveMatches.mockResolvedValue({
      success: false,
      message: 'API indisponible',
    } as LiveMatchesResult);
    const client = makeClient();

    broadcaster.addClient(client.req, client.res);
    await flush();

    expect(consoleError).toHaveBeenCalledWith(
      '[SSE] Diffusion annulée :',
      'API indisponible'
    );
    expect(client.write).not.toHaveBeenCalled();
  });

  it('closeAll termine les connexions et ne laisse aucun minuteur actif', async () => {
    const firstClient = makeClient();
    const secondClient = makeClient();
    broadcaster.addClient(firstClient.req, firstClient.res);
    broadcaster.addClient(secondClient.req, secondClient.res);
    await flush();

    broadcaster.closeAll();

    expect(firstClient.end).toHaveBeenCalled();
    expect(secondClient.end).toHaveBeenCalled();
    expect(jest.getTimerCount()).toBe(0);
  });
});
