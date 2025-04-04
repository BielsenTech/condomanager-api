import { 
  WebSocketGateway, 
  WebSocketServer, 
  SubscribeMessage, 
  OnGatewayConnection, 
  OnGatewayDisconnect,
  ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { UserService } from '../modules/user/user.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers: Map<string, Socket> = new Map();

  constructor(private readonly userService: UserService) {}

  async handleConnection(client: Socket) {
    try {
      // Extract token from handshake query
      const token = client.handshake.query.token as string;
      
      if (!token) {
        client.disconnect();
        return;
      }

      // Could validate token here
      const userId = client.handshake.query.userId as string;
      
      if (userId) {
        this.connectedUsers.set(userId, client);
        console.log(`User ${userId} connected`);
      }
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // Find and remove disconnected user
    for (const [userId, socket] of this.connectedUsers.entries()) {
      if (socket.id === client.id) {
        this.connectedUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  }

  @SubscribeMessage('sendMessage')
  handleMessage(client: Socket, payload: any) {
    const { recipientId, message } = payload;
    const recipientSocket = this.connectedUsers.get(recipientId);
    
    if (recipientSocket) {
      recipientSocket.emit('newMessage', message);
    }
  }

  @SubscribeMessage('callUser')
  handleCall(client: Socket, payload: any) {
    const { recipientId, callData } = payload;
    const recipientSocket = this.connectedUsers.get(recipientId);
    
    if (recipientSocket) {
      recipientSocket.emit('incomingCall', {
        ...callData,
        from: client.id,
      });
    }
  }

  @SubscribeMessage('answerCall')
  handleAnswerCall(client: Socket, payload: any) {
    const { to, signal } = payload;
    const targetSocket = this.getSocketById(to);
    
    if (targetSocket) {
      targetSocket.emit('callAccepted', signal);
    }
  }

  private getSocketById(socketId: string): Socket | undefined {
    for (const socket of this.connectedUsers.values()) {
      if (socket.id === socketId) {
        return socket;
      }
    }
    return undefined;
  }

  // Method to send notification to a specific user
  sendNotificationToUser(userId: string, notification: any) {
    const userSocket = this.connectedUsers.get(userId);
    if (userSocket) {
      userSocket.emit('notification', notification);
    }
  }

  // Method to broadcast to all users
  broadcastToAll(event: string, data: any) {
    this.server.emit(event, data);
  }
} 