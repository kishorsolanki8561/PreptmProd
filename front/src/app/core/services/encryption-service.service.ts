import { Injectable } from '@angular/core';
import * as aesjs from 'aes-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncryptionServiceService {
  constructor() { }

  encrypt(data: string): string {
    const keyBytes = aesjs.utils.utf8.toBytes(environment.encryptDecryptKey);
    const padded = aesjs.padding.pkcs7.pad(aesjs.utils.utf8.toBytes(data));
    const aesEcb = new aesjs.ModeOfOperation.ecb(keyBytes);
    const encrypted = aesEcb.encrypt(padded);
    let binary = '';
    for (let i = 0; i < encrypted.length; i++) binary += String.fromCharCode(encrypted[i]);
    return btoa(binary);
  }

  decrypt(data: string): string {
    const keyBytes = aesjs.utils.utf8.toBytes(environment.encryptDecryptKey);
    const binary = atob(data.toString());
    const cipherBytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) cipherBytes[i] = binary.charCodeAt(i);
    const aesEcb = new aesjs.ModeOfOperation.ecb(keyBytes);
    const decrypted = aesEcb.decrypt(cipherBytes);
    const unpadded = aesjs.padding.pkcs7.strip(decrypted);
    return aesjs.utils.utf8.fromBytes(unpadded);
  }
}
