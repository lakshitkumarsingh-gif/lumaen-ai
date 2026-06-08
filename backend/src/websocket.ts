import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import MemoryModel from './models/Memory';
import MessageModel from './models/Message';

export function initializeWebSocket(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    },
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication failed'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
      (socket as any).user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = (socket as any).user.id;
    socket.join(`user:${userId}`);

    console.log(`User ${userId} connected`);

    // Real-time memory updates
    socket.on('memory:create', async (data: any) => {
      try {
        const memory = await MemoryModel.createMemory(
          userId,
          data.content,
          data.importanceScore || 5
        );
        
        // Broadcast to user's room
        io.to(`user:${userId}`).emit('memory:created', memory);
      } catch (error) {
        socket.emit('error', { message: 'Failed to create memory' });
      }
    });

    // Real-time chat
    socket.on('message:send', async (data: any) => {
      try {
        const message = await MessageModel.createMessage(
          userId,
          data.content,
          data.role || 'user',
          data.model || 'gpt',
          data.tokensUsed || 0
        );
        
        io.to(`user:${userId}`).emit('message:received', message);
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Get real-time memory graph
    socket.on('memory:graph:request', async () => {
      try {
        const memories = await MemoryModel.getUserMemories(userId);
        socket.emit('memory:graph:data', memories);
      } catch (error) {
        socket.emit('error', { message: 'Failed to fetch memory graph' });
      }
    });

    // Link memories
    socket.on('memory:link', async (data: any) => {
      try {
        await MemoryModel.linkMemories(data.memoryId1, data.memoryId2);
        io.to(`user:${userId}`).emit('memory:linked', data);
      } catch (error) {
        socket.emit('error', { message: 'Failed to link memories' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected`);
    });
  });

  return io;
}
