import { IMatchesService } from '../service/matchesService';
import { Request, Response } from 'express';

/**
 * Manages Server-Sent Events connections and broadcasts live match data.
 * Maintains a list of connected clients and pushes updates every 15 seconds.
 */
export class LiveMatchesBroadcaster {
  private clients: Response[] = [];
  private broadcastTimer: NodeJS.Timeout | null = null;
  private keepaliveTimer: NodeJS.Timeout | null = null;

  constructor(private readonly matchesService: IMatchesService) {}

  /**
   * Registers a new SSE client and sends an immediate broadcast.
   * Automatically removes the client when the connection is closed or fails:
   * without an 'error' listener, a failed write would crash the process.
   * The loop runs on demand: it starts with the first client and stops when
   * the last one leaves, so the external API is never polled for nobody.
   * @param req - The incoming Express request
   * @param res - The Express response used to stream data to the client
   */
  addClient(req: Request, res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    this.clients.push(res);
    if (this.clients.length === 1) this.start();
    this.broadcast();

    req.on('close', () => this.removeClient(res));
    res.on('error', () => this.removeClient(res));
  }

  /**
   * Removes a client and stops the loop if it was the last one.
   * Safe to call twice for the same client (e.g. 'error' then 'close').
   * @param res - The response of the client to remove
   */
  private removeClient(res: Response) {
    this.clients = this.clients.filter((client) => client !== res);
    if (this.clients.length === 0) this.stop();
  }

  /**
   * Writes a message to one client. A client whose connection is already
   * closed, or whose write throws, is removed without affecting the others.
   * @param client - The response of the client to write to
   * @param message - The SSE message to send
   */
  private send(client: Response, message: string) {
    if (client.writableEnded || client.destroyed) {
      this.removeClient(client);
      return;
    }

    try {
      client.write(message);
    } catch {
      this.removeClient(client);
    }
  }

  /**
   * Fetches live matches and pushes the data to all connected clients
   * in the SSE format (data: {...}\n\n).
   */
  async broadcast() {
    const result = await this.matchesService.getLiveMatches();

    if (result.success === false) return;

    const data = JSON.stringify(result.matches);
    const message = `data: ${data}\n\n`;

    for (const client of this.clients) {
      this.send(client, message);
    }
  }

  /**
   * Starts the broadcast loop, pushing live match data every 15 seconds,
   * and a keepalive comment every 20 seconds so that proxies do not close
   * an idle connection (e.g. while the external API is down).
   * Does nothing if the loop is already running, so that no timer is lost.
   */
  start() {
    if (this.broadcastTimer) return;

    this.broadcastTimer = setInterval(() => this.broadcast(), 15000);
    this.keepaliveTimer = setInterval(() => {
      for (const client of this.clients) {
        this.send(client, ': keepalive\n\n');
      }
    }, 20000);
  }

  /**
   * Stops the broadcast loop by clearing both timers.
   * Safe to call when the loop is not running.
   */
  stop() {
    if (this.broadcastTimer) clearInterval(this.broadcastTimer);
    if (this.keepaliveTimer) clearInterval(this.keepaliveTimer);
    this.broadcastTimer = null;
    this.keepaliveTimer = null;
  }
}
