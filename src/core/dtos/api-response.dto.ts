import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDTO<T> {
  @ApiProperty({
    description: 'Status of the response',
    type: String,
    required: true,
  })
  status: string;

  @ApiProperty({
    description: 'Data of the response',
    type: String,
    required: true,
    isArray: true,
  })
  data: T | T[];

  @ApiProperty({
    description: 'Message of the response',
    type: String,
    required: true,
  })
  message: string;
}
