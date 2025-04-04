import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

// Extend Express Request to include user property
declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: string;
    }
  }
}

@ApiTags('messages')
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all messages' })
  findAll() {
    return this.messageService.findAll();
  }

  @Get('sent')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get messages sent by the current user' })
  findSent(@Req() req: Request) {
    const userId = req.user?.id || '';
    return this.messageService.findBySender(userId);
  }

  @Get('received')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get messages received by the current user' })
  findReceived(@Req() req: Request) {
    const userId = req.user?.id || '';
    return this.messageService.findByRecipient(userId);
  }

  @Get('apartment/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get messages for an apartment' })
  findByApartment(@Param('id') id: string) {
    return this.messageService.findByApartment(id);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get message by ID' })
  findOne(@Param('id') id: string) {
    return this.messageService.findById(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new message' })
  @ApiResponse({ status: 201, description: 'Message successfully created.' })
  create(@Body() createMessageDto: any, @Req() req: Request) {
    const senderId = req.user?.id || '';
    return this.messageService.create({
      ...createMessageDto,
      sender: { id: senderId },
    });
  }

  @Patch(':id/read')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mark a message as read' })
  markAsRead(@Param('id') id: string) {
    return this.messageService.markAsRead(id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a message' })
  remove(@Param('id') id: string) {
    return this.messageService.remove(id);
  }
} 