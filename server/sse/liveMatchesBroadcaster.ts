import { IMatchesService } from "../service/matchesService";
import { Request, Response } from "express";

/**
 * Manages Server-Sent Events connections and broadcasts live match data.
 * Maintains a list of connected clients and pushes updates every 30 seconds.
 */
export class LiveMatchesBroadcaster {
    private clients: Response[] = []

    constructor(
        private readonly matchesService: IMatchesService,
    ){}

    /**
     * Registers a new SSE client and sends an immediate broadcast.
     * Automatically removes the client when the connection is closed.
     * @param req - The incoming Express request
     * @param res - The Express response used to stream data to the client
     */
    addClient(req: Request, res: Response){
        res.setHeader('Content-Type', 'text/event-stream')
        res.setHeader('Cache-Control', 'no-cache')
        res.setHeader('Connection', 'keep-alive')

        this.clients.push(res)
        this.broadcast()

        req.on('close', () => {
            this.clients = this.clients.filter(client => client !== res)
        })
    }

    /**
     * Fetches live matches and pushes the data to all connected clients
     * in the SSE format (data: {...}\n\n).
     */
    async broadcast(){
        const result = await this.matchesService.getLiveMatches()

        if(result.success === false)return

        const data = JSON.stringify(result.matches)
        const message = `data: ${data}\n\n`

        for(const client of this.clients){
            client.write(message)
        }
    }

    /**
     * Starts the broadcast loop, pushing live match data every 30 seconds.
     * Should be called once at server startup.
     */
    start(){
        setInterval(() => this.broadcast(),  30000)
    }
}