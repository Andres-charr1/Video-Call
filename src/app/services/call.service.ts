import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class CallService {

  constructor() {}

  generateCallPayload(userFrom: string, userTo: string, name: string) {
    return {
      userId: userTo,
      userFrom: userFrom,
      name: name,
      type: 'incoming_call',
      meetingId: uuidv4()
    };
  }
}
