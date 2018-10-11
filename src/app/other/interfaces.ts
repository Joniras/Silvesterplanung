import {DocumentReference} from '@angular/fire/firestore';

export interface UserProfile {
  zusageUpdate: Date;
    displayName: string;
    uid: string;
    ref: DocumentReference;
    photoUrl: string;
    admin: boolean;
  zusage: number;
}

