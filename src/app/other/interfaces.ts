import {DocumentReference} from '@angular/fire/firestore';

export interface UserProfile {
    displayName: string;
    uid: string;
    ref: DocumentReference;
    photoUrl: string;
    admin: boolean;
}

