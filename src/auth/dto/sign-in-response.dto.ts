export class SignInResponseDto {
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  accessToken: string;
}
