interface UserProfile {
    googleUserId: string;
    emails: string | null;
    emailVerified?: boolean | null;
    familyName: string | null;
    givenName: string | null;
    name: string | null;
    gSuiteDomain: string | null;
    language: string | null;
    avatarUrl: string | null;
}