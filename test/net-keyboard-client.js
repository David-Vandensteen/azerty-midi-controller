import { NetKeyboardClient } from 'net-keyboard';

new NetKeyboardClient('127.0.0.1', 8080)
  .connect();
