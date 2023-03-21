import { DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('WALLET AS A SERVICE')
  .setDescription('Wallet as a service API description')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
export default config;
