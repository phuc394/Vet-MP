export interface RefreshToken {
  token_id: number;
  user_id: number;
  refresh_token: string;
  expires_at: Date;
  created_at?: Date;
}